import {Graph} from "./Graph";
import {GraphBaseNode, GraphDataNode, GraphEventListenerNode, GraphInvokableNode, GraphStartNode} from "./GraphNodes";
import {isIUpdateGraphNodeStatePerStep, isUpdateGraphNodeState} from "../../interface";
import {GraphNodeManager} from "./NodeManager";
import {GraphChainEdge, GraphDataEdge} from "./GraphEdge";

export interface IChainItem {
    target: GraphBaseNode
    edge?: GraphChainEdge
}

export class RunManager {
    private graph: Graph
    private _currentStep = 0
    private invokedNodes: GraphNodeManager = new GraphNodeManager()

    constructor(graph: Graph) {
        this.graph = graph
    }

    get currentStep() {
        return this._currentStep
    }

    resetCurrentStep() {
        this._currentStep = 0
    }

    updateState() {
        const nodes = this.graph.nodes
        nodes.forEach(node => {
            if (isUpdateGraphNodeState(node)) {
                node.updateState()
            }
        })
    }

    updateNodePerStep() {
        const nodes = this.graph.nodes
        nodes.forEach(node => {
            if (isIUpdateGraphNodeStatePerStep(node)) {
                node.updateStatePerStep()
            }
        })
    }

    invokeStep() {
        this.incrementStep()
        this.resetIsTransferredResources()
        const nodes = this.sortedNodes()
        console.log('chain nodes: ', nodes)
        nodes.forEach(node => {
            const target = node.target
            const chainConnection = node.edge
            if (target instanceof GraphInvokableNode && chainConnection?.isMeetCondition) {
                target.invokeStep()
                this.invokedNodes.add(target)
            }
        })
        this.updateState()
        this.updateNodePerStep()
        this.graph.nodes.forEach(node => {
            if (node instanceof GraphDataNode) {
                node.updateRecoursesProvide()
            }
        })
        this.invokedNodes.clear()
    }


    private incrementStep() {
        this._currentStep++
    }

    private getStartedNodes() {
        const startNodes = this.graph.nodes.filter(node => {
            if (node instanceof GraphStartNode || node instanceof GraphEventListenerNode) {
                return node
            }
        })
        return startNodes
    }

    private sortedNodes(): IChainItem[] {
        const startedNodes = this.getStartedNodes()
        const childrenNodes = startedNodes.map(source => {
            return this.getNodesChildrenRecursive({
                target: source,
            })
        })
        // nodes queue that start from trigger listener invoke in last step
        return childrenNodes.sort((a, b) => {
            const aFirstNode = a[0].target
            const bFirstNode = b[0].target
            if (aFirstNode instanceof GraphEventListenerNode && !(bFirstNode instanceof GraphEventListenerNode)) {
                return -1
            } else if (!(aFirstNode instanceof GraphEventListenerNode) && bFirstNode instanceof GraphEventListenerNode) {
                return 1
            }
            return 0
        }).flat()
    }

    private getNodesChildrenRecursive(node: IChainItem, children: IChainItem[] = [node]) {
        const nodes = this.getNodesChildren(node)

        nodes.forEach(child => {
            if (!children.includes(child)) {
                children.push(child)
            }
        })

        nodes.forEach(child => {

            const toNextEdges = child.target.outgoingEdges.filter(edge => {
                return true
            })
            if (toNextEdges.length > 0) {
                this.getNodesChildrenRecursive(child, children)
            }
        })
        return children
    }

    private getNodesChildren(node: IChainItem): IChainItem[] {
        const children = node.target.outgoingEdges.map(edge => {
            const target = edge.target
            if (edge instanceof GraphChainEdge) {
                return {target, edge}
            }
        })
        return children.filter(item => item !== undefined) as IChainItem[]
    }

    private resetIsTransferredResources() {
        this.graph.edges.forEach(edge => {
            if (edge instanceof GraphDataEdge) {
                edge.changeIsTransferredResources(false)
            }
        })
    }
}
