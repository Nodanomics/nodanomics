import {
    EModeAddResourcesToDataNode,
    ENodeAction,
    IDataNodeData,
    IDiagramNodeBaseData,
    IGetNodeExternalValue,
    IIsEventConditionMet,
    IResetNodeNoStoreProperties,
    IResource,
    ITriggeredEvent,
    IUpdateGraphNodeState,
    IUpdateGraphNodeStatePerStep
} from "../../../interface";
import {GraphDataEdge} from "../GraphEdge";
import {GraphBaseNode, GraphInteractiveNode} from "./abstracts";
import {GraphOriginNode} from "./GraphOriginNode";
import {RunManager} from "../RunManager";
import {GraphNodeManager} from "../NodeManager";
import {GraphHistoryManager} from "../GraphHistoryManager";

export class GraphDataNode extends GraphInteractiveNode<IDataNodeData>
    implements IUpdateGraphNodeState, IGetNodeExternalValue,
        IUpdateGraphNodeStatePerStep, ITriggeredEvent, IIsEventConditionMet,
        IResetNodeNoStoreProperties {

    // private _resourcesToProvide: IResource[]
    private previousStepResourcesCount?: number
    private currentStepResourcesCount?: number
    private historyManager: GraphHistoryManager = new GraphHistoryManager(this);

    constructor(data: IDataNodeData, runManager: RunManager, nodeManager: GraphNodeManager) {
        super(data, runManager, nodeManager);

    }

    private get _resourcesToProvide(): IResource[] {
        return this.data.resourcesToProvide
    }

    get maxCapacity() {
        const maxCapacity = Number(this.data.maxCapacity);
        if (!isNaN(maxCapacity)) {
            return maxCapacity;
        }
    }

    get minCapacity() {
        const minCapacity = Number(this.data.minCapacity);
        if (!isNaN(minCapacity)) {
            return minCapacity;
        }
    }

    get resourcesToProvide() {
        return this._resourcesToProvide;
    }

    get resourcesToProvideCount() {
        return this._resourcesToProvide.length;
    }

    get maxResources() {
        return this.historyManager.max
    }


    get minResources() {
        return this.historyManager.min
    }

    get currentResourcesCount() {
        return this.data.resources.length;
    }

    get resources() {
        return this.data.resources;
    }

    get nodeExternalValue() {
        return this.currentResourcesCount
    }


    get edgesFromSources(): GraphDataEdge[] {
        return this.incomingEdges
            .filter(edge => edge.source instanceof GraphOriginNode)
            .filter(edge => GraphDataEdge.baseEdgeIsData(edge)) as GraphDataEdge[];
    }

    resetNodeNoStoreProperties() {
        this.currentStepResourcesCount = undefined
        this.previousStepResourcesCount = undefined
    }


    updateStatePerStep() {
        this.updateResourcesCountHistory()
        this.updatePreviousResourcesCount()
    }

    addResource(resources?: IResource[], mode?: EModeAddResourcesToDataNode, params?: {
        onSuccess?: () => void,
    }) {
        const updatedResources = this.addResourceWithCapacity(resources, mode)
        const isAdded = updatedResources !== undefined;
        if (isAdded && params?.onSuccess) {
            params.onSuccess()
        }
    }

    isPossibleToAddResource(resources: IResource[], mode: EModeAddResourcesToDataNode) {
        if (!this.maxCapacity) {
            return true;
        }
        if (mode === EModeAddResourcesToDataNode.onlyAll) {
            return this.currentResourcesCount + resources.length <= this.maxCapacity
        } else if (mode === EModeAddResourcesToDataNode.asPossible) {
            return this.currentResourcesCount + resources.length <= this.maxCapacity
        }
    }

    get eventName() {
        return `${this.data.tag}.OnValueChanged`
    }

    get isEventConditionMet() {
        return this.isValueChanged
    }

    getTriggeredEvent() {
        if (this.isValueChanged) {
            return this.eventName
        }
    }

    private get isValueChanged() {
        return this.previousStepResourcesCount !== this.currentStepResourcesCount
    }

    private addResourceWithCapacity(resources?: IResource[], mode?: EModeAddResourcesToDataNode): IDataNodeData | undefined {
        if (resources && resources.length > 0) {
            if (!this.maxCapacity) {
                return this.addResourcesToNode(resources)
            } else if (mode === EModeAddResourcesToDataNode.onlyAll && this.currentResourcesCount + resources?.length <= this.maxCapacity) {
                return this.addResourcesToNode(resources)
            } else if (mode === EModeAddResourcesToDataNode.asPossible) {
                const countOfResourcesToAdd = this.maxCapacity - this.currentResourcesCount;
                const resourcesToAdd = resources.slice(0, countOfResourcesToAdd);
                return this.addResourcesToNode(resourcesToAdd)
            }
        }

    }

    private updateResourcesToProvide() {
        this.updateNode({
            resourcesToProvide: [...this.data.resources]
        })
    }

    private addResourcesToNode(resources: IResource[]) {
        this.updateResourcesToProvide()
        this._data = {
            ...this.data,
            resources: [...this.data.resources, ...resources]
        }
        this.updatePreviousResourcesCount()
        return this.data
    }

    private updateResourcesCountHistory() {
        const numToWrite = this.currentResourcesCount
        this.historyManager.updateHistory(numToWrite)
    }

    invokeStep() {
        super.invokeStep();
    }


    protected runAction() {
        this.pullAllOrAnyResourcesFromSource()
        this.pushAllResources()
        this.pushAnyResources()
        this.pullAnyResourcesFromData()
        this.pullAllResourcesFromData()
    }


    private updatePreviousResourcesCount() {
        if (this.currentResourcesCount > 0) {
            this.previousStepResourcesCount = this.currentStepResourcesCount
            this.currentStepResourcesCount = this.currentResourcesCount
        }
    }


    private pullAnyResourcesFromData() {
        if (this.actionMode === ENodeAction.pullAny) {
            this.incomingEdges.forEach(edge => {
                const source = edge.source;
                if (edge instanceof GraphDataEdge && source instanceof GraphDataNode) {
                    const isPossibleToAddResources = this.isPossibleToAddResource(source.resources, source.addingResourcesMode)
                    if (isPossibleToAddResources) {
                        const resources = source.takeCountResources(edge.countOfResource)
                        const onSuccess = () => this.writeToEdgeIsResourcesWereTransferred(edge, true)
                        this.addResource(resources, source.addingResourcesMode, {onSuccess})
                    }
                }
            })
        }
    }

    private pullAllResourcesFromData() {
        if (this.actionMode === ENodeAction.pullAll) {
            this.incomingEdges.forEach(edge => {
                const source = edge.source;
                if (edge instanceof GraphDataEdge && source instanceof GraphDataNode) {
                    const isPossibleToAddResources = this.isPossibleToAddResource(source.resources, source.addingResourcesMode)
                    if (source.resourcesToProvideCount >= edge.countOfResource && isPossibleToAddResources) {
                        const resources = source.takeCountResources(edge.countOfResource)
                        const onSuccess = () => this.writeToEdgeIsResourcesWereTransferred(edge, true)
                        this.addResource(resources, source.addingResourcesMode, {onSuccess})
                        this.writeToEdgeIsResourcesWereTransferred(edge, true)
                    }
                    this.writeToEdgeIsResourcesWereTransferred(edge, false)
                }
            })
        }
    }

    private get countOfRequiredOutgoingResources() {
        return this.outgoingEdges.reduce((acc, edge) => {
            if (edge instanceof GraphDataEdge) {
                return acc + edge.countOfResource
            }
            return acc;
        }, 0)
    }

    takeCountResources(count: number): IResource[] | undefined {
        if (!this.minCapacity || this.currentResourcesCount - count >= this.minCapacity) {
            const deletedResourcesToProvide = this.resourcesToProvide.slice(0, count);
            const leftResources = this.resources.filter(resource => {
                return !deletedResourcesToProvide.some(deletedResource => deletedResource.id === resource.id)
            })
            this.updatePreviousResourcesCount()
            this._data = {
                ...this.data,
                resources: leftResources,
                resourcesToProvide: leftResources
            }
            return deletedResourcesToProvide
        }
    }


    private pushAnyResources() {
        if (this.actionMode === ENodeAction.pushAny) {
            this.outgoingEdges.forEach(edge => {
                const source = edge.source;
                if (edge instanceof GraphDataEdge && source instanceof GraphDataNode) {
                    const isPossibleToAddResources = source.isPossibleToAddResource(this.resources, source.addingResourcesMode)
                    if (isPossibleToAddResources) {
                        const resources = this.takeCountResources(edge.countOfResource)
                        const onSuccess = () => edge.changeIsTransferredResources(true)
                        source.addResource(resources, source.addingResourcesMode, {onSuccess})
                    }
                }
            })
        }
    }

    private pushAllResources() {
        if (this.actionMode === ENodeAction.pushAll) {
            if (this.resourcesToProvideCount >= this.countOfRequiredOutgoingResources) {
                this.outgoingEdges.forEach(edge => {
                    const source = edge.source;
                    if (edge instanceof GraphDataEdge && source instanceof GraphDataNode) {
                        const isPossibleToAddResources = source.isPossibleToAddResource(this.resources, source.addingResourcesMode)
                        if (isPossibleToAddResources) {
                            const resources = this.takeCountResources(edge.countOfResource)
                            const onSuccess = () => edge.changeIsTransferredResources(true)
                            source.addResource(resources, source.addingResourcesMode, {onSuccess})
                        }
                    }
                })
            }
        }

    }

    private pullAllOrAnyResourcesFromSource() {
        if (this.actionMode === ENodeAction.pullAll || this.actionMode === ENodeAction.pullAny) {
            this.edgesFromSources.forEach(edge => {
                const countOfResourceToGenerate = edge.countOfResource
                const source = edge.source;
                if (source instanceof GraphOriginNode) {
                    const generatedResources = source.generateResourceFromSource(countOfResourceToGenerate)
                    const onSuccess = () => this.writeToEdgeIsResourcesWereTransferred(edge, true)
                    this.addResource(generatedResources, source.addingResourcesMode, {onSuccess})
                }
                this.writeToEdgeIsResourcesWereTransferred(edge, false)
            })
        }
    }

    private writeToEdgeIsResourcesWereTransferred(edge: GraphDataEdge, isTransferred: boolean) {
        edge.changeIsTransferredResources(isTransferred)
    }

    static baseNodeIsData(baseNode: GraphBaseNode<IDiagramNodeBaseData>): baseNode is GraphDataNode {
        return baseNode instanceof GraphDataNode;
    }
}