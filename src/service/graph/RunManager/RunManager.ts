import {Graph} from "../Graph";
import {
    EConnectionMode,
    isIGetNodeExternalValue,
    isIResetBeforeStep,
    isITriggeredEvent,
    isIUpdateGraphNodeStatePerStep,
    isIUpdateStatePerNodeUpdate,
    isNodeAutomatic,
    isUpdateGraphNodeState
} from "../../../interface";
import {
    GraphDataNode,
    GraphEventListenerNode,
    GraphFormulaNode,
    GraphInvokableNode,
    GraphLoopNode,
    GraphStartNode
} from "../GraphNodes";
import {GraphHelper} from "../GraphHelper";
import {GraphMicroLoopNode} from "../GraphNodes/GraphMicroLoopNode";
import {GraphChainEdge} from "../GraphEdge";
import {IChainItem} from "./ChainItem";
import {NodeExecutionManager} from "./NodeExecutionManager";
import {GraphWhileLoopNode} from "../GraphNodes/GraphWhileLoopNode";


export class RunManager {
    private _graph: Graph
    private _countOfExecuted = 0
    // don't need to track diameter
    private _diameter?: number
    // don't need to track _diagramRunCount
    private _diagramRunCount = 0
    private _currentStep = 0
    // private invokedNodes: GraphNodeManager = new GraphNodeManager()
    private _executionOrder: IChainItem[] = []

    constructor(graph: Graph) {
        this._graph = graph
    }


    get executionOrder() {
        return this._executionOrder
    }

    get graph() {
        return this._graph
    }

    get currentStep() {
        return this._currentStep
    }

    // private resetCountOfExecuted() {
    //     this._countOfExecuted = 0
    // }
    //
    // addCountOfExecuted() {
    //     this._countOfExecuted++
    // }

    resetCurrentStep() {
        this.nodeToExecute = new NodeExecutionManager(this, [])
        this._diagramRunCount = 0
        this._currentStep = 0
    }

    updateState() {
        this.updateAllTags()
        const nodes = this._graph.nodes
        nodes.forEach(node => {
            if (isUpdateGraphNodeState(node)) {
                node.updateState()
            }
        })
    }

    updateNodePerStep() {
        const nodes = this._graph.nodes
        nodes.forEach(node => {
            if (isIUpdateGraphNodeStatePerStep(node)) {
                node.updateStatePerStep()
            }
        })
    }

    private setExecutionOrder(nodes: IChainItem[]) {
        this._executionOrder = nodes
    }

    private nodeToExecute = new NodeExecutionManager(this, [])

    async invokeStep() {
        // this.resetCountOfExecuted()
        this.resetBeforeStep()
        this.updateAllTags()
        console.log('graph: ', this._graph)

        const chain = this.getExecutionOrder()
        this.setExecutionOrder(chain)
        this._diameter = this.getDiameter()
        if (this._currentStep === 0 || this.isDiagramFinished) {
            const initiatorsNodes = this.getStartedInitiatorsChainItems()
            this.nodeToExecute.addNodesToExecute(initiatorsNodes)
        }
        await this.nodeToExecute.invokeNodesToExecute()
        this.updateNodePerStep()
        this.invokeAutomaticNodesPerStep()
        this.incrementStep()
        const updatedDiameter = this.getDiameter()
        if (updatedDiameter === this._diameter) {
            this.resetAfterDiagramRun()

        }
    }

    private updateAllTags() {
        this.graph.nodesManager.nodes.forEach((node) => {
            if (node.data.tag && isIGetNodeExternalValue(node)) {
                this.graph.graphTagManager.updateTagVariable({
                    value: node.nodeExternalValue,
                    tag: node.data.tag,
                })
            }
        })
    }

    // deprecated. Don't need to track diameter
    private getDiameter() {
        const chain = this.getExecutionOrder()
        const startChains = chain.filter(chainItem => {
            if (chainItem.target instanceof GraphEventListenerNode) {
                return chainItem.target.checkIsEventTriggered()
            }
            return true
        })
        const startNodesFromStart = startChains
            .find(chainItem => chainItem.target instanceof GraphStartNode)
            ?.outgoingConnected?.map(chainItem => chainItem.target) || []
        const eventListenerNodes = startChains
            .filter(chainItem => !(chainItem.target instanceof GraphStartNode))
            .map(chainItem => chainItem.target)

        const startNodes = [...startNodesFromStart, ...eventListenerNodes]
        return GraphHelper.findLongestBranch(startNodes)
    }

    async executeNode(chainItem: IChainItem, nodeToExecute: NodeExecutionManager, options: { invoke: boolean }) {
        const target = chainItem.target
        const edge = chainItem.edge

        //check if incoming edge is meet condition
        const isEdgeMeetCondition = edge === undefined
            ? true
            : edge.isMeetCondition

        // if not meet just abroad execution
        if (!isEdgeMeetCondition && !(target instanceof GraphDataNode)) {
            return
        }

        if (target instanceof GraphInvokableNode) {
            const isItLoop = target instanceof GraphLoopNode
            let isInvokeLoop = false
            if (target instanceof GraphLoopNode) {
                if (target instanceof GraphMicroLoopNode && target.data.isAccumulative) {
                    isInvokeLoop = true
                } else if (target instanceof GraphWhileLoopNode) {
                    isInvokeLoop = true
                } else if (target instanceof GraphLoopNode && target.isLoopActive) {
                    isInvokeLoop = true
                }
            }

            // algorithm has specific logic for accumulative loops
            const isInvoke = isItLoop
                ? isInvokeLoop && options.invoke
                : options.invoke


            if (isInvoke) {
                if (edge instanceof GraphChainEdge) {
                    chainItem.edge?.onExecute()
                }
                target.invokeStep()
                if (target.data.tag && isIGetNodeExternalValue(target) && target.nodeExternalValue !== undefined) {
                    this.graph.graphTagManager.updateTagVariable({
                        value: target.nodeExternalValue,
                        tag: target.data.tag,
                    })
                }

                if (target instanceof GraphLoopNode) {
                    // internal nodes are nodes that are the first nodes within the cycle
                    const innerNodes = this.getChainChildren(chainItem).inner


                    if (target instanceof GraphMicroLoopNode && target.data.isAccumulative || target instanceof GraphWhileLoopNode) {
                        target.children.forEach(child => {
                            if (child instanceof GraphMicroLoopNode) {
                                child.resetLoopStep()
                            }
                        })
                        // accumulative logic
                        // check if loop is has a parent loop
                        const hasParentLoop = target.data.parentId !== undefined

                        // if has parent loop, then reset loop step
                        if (target instanceof GraphMicroLoopNode) {
                            const loopNodeExecutionManager = new NodeExecutionManager(this, innerNodes)
                            await loopNodeExecutionManager.invokeNodesToExecute()
                        }
                    } else if (target.isLoopActive) {

                        target.children.forEach(child => {
                            if (child instanceof GraphMicroLoopNode) {
                                child.resetLoopStep()
                            }
                        })

                        //not accumulative logic
                        nodeToExecute.addNodesToCurrent(innerNodes)
                    }
                }


                // check event triggers
                if (isITriggeredEvent(target)) {
                    const triggeredEventName = target.getTriggeredEvent()
                    const listenerNodes = this.executionOrder
                        .filter(node => node.target instanceof GraphEventListenerNode
                            && node.target.eventName === triggeredEventName)

                    nodeToExecute.addNodesToExecute(listenerNodes)
                }

                // if (edge instanceof GraphChainEdge) {
                //     chainItem.edge?.onExecute()
                // }

            }


            if (target instanceof GraphDataNode && target.isExecutedChangesPerStep) {
                this.graph.nodes.forEach(node => {
                    if (isIUpdateStatePerNodeUpdate(node)) {
                        node.updateStatePerNodeUpdate()
                    }
                })
            }
            const children = this.getChainChildren(chainItem)
            const outgoingConnected = children.outgoingConnected

            if (target instanceof GraphStartNode) {
                nodeToExecute.addNodesToCurrent(outgoingConnected)
            } else {
                const isChildOfAccumLoop = this._graph.nodesManager.isChildOfAccumLoop(target)

                const noDataNodes = outgoingConnected
                    .filter(item => !(item.target instanceof GraphDataNode && item.edge instanceof GraphDataNode))
                const dataNodes = outgoingConnected.filter(item => item.target instanceof GraphDataNode && item.edge instanceof GraphDataNode)
                if (target instanceof GraphMicroLoopNode) {
                    if (!target.isLoopActive) {
                        nodeToExecute.addNodesToCurrent(noDataNodes)
                    }
                } else {
                    if (isChildOfAccumLoop) {
                        nodeToExecute.addNodesToCurrent(noDataNodes)
                    } else {
                        nodeToExecute.addNodesToExecute(noDataNodes)
                    }
                    nodeToExecute.addNodesToCurrent(dataNodes)
                }
                const endChainItem = children.endChainItem
                if (endChainItem && endChainItem.target instanceof GraphMicroLoopNode) {
                    if (!endChainItem.target.isAccumulative) {
                        if (target instanceof GraphMicroLoopNode && !target.isAccumulative) {
                            if (!target.isLoopActive) {
                                nodeToExecute.addNodesToCurrent([endChainItem])
                            }
                        } else {
                            nodeToExecute.addNodesToExecute([endChainItem])
                        }
                    } else if (endChainItem.target.isLoopActive && endChainItem.edge?.isMeetCondition) {
                        const innerNodeIds = endChainItem.target.children
                            .filter((childNode) => !(childNode instanceof GraphDataNode))
                            .map(node => node.data.id)
                        nodeToExecute.removeCurrentNodesById(innerNodeIds)
                        nodeToExecute.addNodesToCurrent([endChainItem])
                    }
                }
            }
        }
    }

    private incrementStep() {
        this._diagramRunCount++
        this._currentStep++
    }

    private getStartedNodes() {
        return this._graph.nodes.filter(node => {
            if (node instanceof GraphStartNode || node instanceof GraphEventListenerNode || node instanceof GraphFormulaNode && node.data.isAutomatic) {
                return node
            }
        })
    }

    private getStartedChainItems() {
        return this.getStartedNodes().map(node => new IChainItem(node as GraphInvokableNode))
    }

    private getStartedInitiatorsChainItems() {
        const startedNodes = this.getStartedChainItems()
        return startedNodes.filter(chainItem => {
            return !(chainItem.target instanceof GraphEventListenerNode);
        })
    }

    private getExecutionOrder(): IChainItem[] {
        const startedNodes = this.getStartedNodes()
        const childrenNodes = startedNodes.map(source => {
            if (source instanceof GraphInvokableNode) {
                return this.getChainChildrenRecursive(new IChainItem(source))
            }
        }).filter(Boolean) as IChainItem[][]

        return childrenNodes.sort((a, b) => {
            const aFirstNode = a[0].target
            const bFirstNode = b[0].target
            if (aFirstNode instanceof GraphStartNode && !(bFirstNode instanceof GraphEventListenerNode)) {
                return -1
            } else if (!(aFirstNode instanceof GraphStartNode) && bFirstNode instanceof GraphEventListenerNode) {
                return 1
            }
            return 0
        }).flat()
    }


    // maybe deprecated or need to refactor
    private getChainChildrenRecursive(startedChainItem: IChainItem, children: IChainItem[] = [startedChainItem], visited = new Set<string>()) {
        if (!visited.has(startedChainItem.target.data.id)) {
            visited.add(startedChainItem.target.data.id)
            const childChainItem = this.getChainChildren(startedChainItem)

            startedChainItem.outgoingConnected = childChainItem.outgoingConnected
            startedChainItem.inner = childChainItem.inner
            startedChainItem.end = childChainItem.endChainItem
            const nextChildren = [...childChainItem.outgoingConnected, ...childChainItem.inner]

            nextChildren.forEach(child => {
                if (!(child.edge?.targetMode === EConnectionMode.LoopChildrenToExternal)) {

                    const outgoingEdges = child.target.outgoingEdges
                    if (outgoingEdges.length > 0 && !visited.has(child.target.data.id)) {
                        this.getChainChildrenRecursive(child, children, visited)
                    }

                }
            })
            startedChainItem.inner.sort((a, b) => {
                if (!a.end && b.end) {
                    return -1;
                } else if (a.end && !b.end) {
                    return 1;
                }
                return 0;
            });


            return children
        }
        return []
    }

    private getChainChildren(chainItem: IChainItem): {
        outgoingConnected: IChainItem[]
        inner: IChainItem[]
        endChainItem: IChainItem | undefined
    } {
        const outgoingConnected: IChainItem[] = []
        const inner: IChainItem[] = []
        let endChainItem: IChainItem | undefined

        chainItem.target.outgoingEdges.forEach(edge => {
            const target = edge.target
            if ((edge instanceof GraphChainEdge || target instanceof GraphDataNode) && target instanceof GraphInvokableNode) {
                const newChainItem = new IChainItem(target, edge as GraphChainEdge)
                if (edge.sourceMode === EConnectionMode.LoopInnerToChildren) {
                    inner.push(newChainItem)
                } else if (edge.targetMode === EConnectionMode.LoopChildrenToExternal) {
                    endChainItem = newChainItem
                } else {
                    outgoingConnected.push(newChainItem)
                }
            }
        })

        return {
            outgoingConnected,
            inner,
            endChainItem,
        }
    }

    private resetBeforeStep() {
        this.resetIsTransferredResources()
    }

    private resetIsTransferredResources() {
        this._graph.edges.forEach(edge => {
            if (isIResetBeforeStep(edge)) {
                edge.resetBeforeStep()
            }
        })
        this._graph.nodes.forEach(node => {
            if (isIResetBeforeStep(node)) {
                node.resetBeforeStep()
            }
        })
    }

    private invokeAutomaticNodesPerStep() {
        this._graph.nodes.forEach(node => {
            if (isNodeAutomatic(node.data) && node.data.isAutomatic && node instanceof GraphInvokableNode) {
                node.invokeStep()
            }
        })
    }


    get isDiagramFinished() {
        return this.nodeToExecute.next.length === 0
    }

    resetAfterDiagramRun() {
        if (this.isDiagramFinished) {
            this.nodeToExecute = new NodeExecutionManager(this, [])
            const initiatorsNodes = this.getStartedInitiatorsChainItems()
            this.nodeToExecute.addNodesToExecute(initiatorsNodes)
            this._diagramRunCount = 0
            this._graph.nodesManager.resetAfterDiagramRun();
        }
    }

}
