import {
    EConnectionMode,
    EModeAddResourcesToDataNode,
    IDataNodeData,
    IDiagramNodeBaseData,
    IGetNodeExternalValue,
    IGraphDataNode,
    IIsEventConditionMet,
    IResetNodeNoStoreProperties,
    IResource,
    ITriggeredEvent,
    IUpdateGraphNodeState,
    IUpdateGraphNodeStatePerStep,
    IUpdateStatePerNodeUpdate
} from "../../../interface";
import {GraphChainEdge, GraphDataEdge} from "../GraphEdge";
import {GraphBaseNode, GraphInteractiveNode} from "./abstracts";
import {GraphOriginNode} from "./GraphOriginNode";
import {RunManager} from "../RunManager";
import {GraphNodeManager} from "../NodeManager";
import {GraphHistoryManager} from "../GraphHistoryManager";
import {GraphDatasetRecorder} from "./helper";
import {GraphMatchManager} from "../GraphMatchManager/GraphMatchManager";

export class GraphDataNode extends GraphInteractiveNode<IDataNodeData>
    implements IUpdateGraphNodeState, IGetNodeExternalValue,
        IUpdateGraphNodeStatePerStep, ITriggeredEvent, IIsEventConditionMet,
        IResetNodeNoStoreProperties, IUpdateStatePerNodeUpdate, IGraphDataNode {

    // private _resourcesToProvide: IResource[]
    private previousStepResourcesCount?: number
    private currentStepResourcesCount?: number
    private historyManager: GraphHistoryManager = new GraphHistoryManager(this, this.nodeManager);
    private graphDatasetRecorder: GraphDatasetRecorder = new GraphDatasetRecorder(this.runManager)
    private mathManager: GraphMatchManager = new GraphMatchManager(this.nodeManager, this.runManager.graph.graphTagManager)

    constructor(data: IDataNodeData, runManager: RunManager, nodeManager: GraphNodeManager) {
        super(data, runManager, nodeManager);

    }

    private get _resourcesToProvide(): IResource {
        return this.data.resourcesToProvide
    }

    get changeCount() {
        return this.data.changeCount || 0
    }

    get isAssigned(): boolean {
        return this.data.isAssigned || false
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
        return this._resourcesToProvide.value;
    }

    get maxResources() {
        return this.historyManager.max
    }


    get minResources() {
        return this.historyManager.min
    }

    get currentResourcesCount() {
        return this.data.resources.value;
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
        if (!this.nodeManager.assignedHistoryNode) {
            this.updateResourcesCountHistory()
        }
        this.updatePreviousResourcesCount()
        this.updateResourcesToProvide()
    }

    addResource(resources: IResource, params?: {
        onSuccess?: (resourcesCount: number) => void,
        mode?: EModeAddResourcesToDataNode,
    }) {
        const updatedResources = this.addResourceWithCapacity(resources, params?.mode)
        const isAdded = updatedResources !== undefined;
        if (isAdded && params?.onSuccess) {
            params.onSuccess(resources.value)
        }
    }

    isPossibleToAddResource(resources: IResource, mode: EModeAddResourcesToDataNode) {
        if (!this.maxCapacity) {
            return true;
        }
        if (mode === EModeAddResourcesToDataNode.onlyAll) {
            return this.currentResourcesCount + resources.value <= this.maxCapacity
        } else if (mode === EModeAddResourcesToDataNode.asPossible) {
            return this.currentResourcesCount + resources.value <= this.maxCapacity
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

    updateStatePerNodeUpdate() {
        if (this.nodeManager.assignedHistoryNode) {
            this.updateResourcesCountHistory()
        }
    }

    get isExecutedChangesPerStep() {
        const isAssignedNodeChanged = this.isAssigned && this.isValueChanged
        if (isAssignedNodeChanged) {
            const changeCount = this.data.changeCount || 0
            this.updateNode({changeCount: changeCount + 1})
        }
        return isAssignedNodeChanged
    }

    get isValueChanged() {
        return this.previousStepResourcesCount !== this.currentStepResourcesCount
    }

    private addResourceWithCapacity(resources?: IResource, mode?: EModeAddResourcesToDataNode): IDataNodeData | undefined {
        if (resources && resources.value > 0) {
            if (!this.maxCapacity) {
                return this.addResourcesToNode(resources)
            } else if (mode === EModeAddResourcesToDataNode.onlyAll && this.currentResourcesCount + resources?.value <= this.maxCapacity) {
                return this.addResourcesToNode(resources)
            } else {
                const countOfResourcesToAdd = this.maxCapacity - this.currentResourcesCount;
                const resourcesToAdd = {
                    value: resources.value - countOfResourcesToAdd
                }
                return this.addResourcesToNode(resourcesToAdd)
            }
        }

    }

    private updateResourcesToProvide() {
        this.updateNode({
            resourcesToProvide: {
                ...this.data.resources
            }
        })
    }

    private addResourcesToNode(resource: IResource) {

        this.updateNode({
            resources: {
                value: this.currentResourcesCount + resource.value
            }
        })
        this.updatePreviousResourcesCount()
        this.updateResourcesToProvide()
        // this.recordToDataset()
        return this.data
    }

    private updateResourcesCountHistory() {
        const numToWrite = this.currentResourcesCount
        this.historyManager.updateHistory(numToWrite)
    }

    invokeStep() {
        let isExecutedRecordToSpreadsheet = false
        let isExecutedReadFromDataset = false
        let isChainExecuted = false
        this.incomingEdges.forEach(edge => {
            if (edge instanceof GraphChainEdge && edge.data.isExecuted) {
                isChainExecuted = true
                const targetMode = edge.targetMode
                isExecutedRecordToSpreadsheet = targetMode === EConnectionMode.RecordToSpreadsheet
                isExecutedReadFromDataset = targetMode === EConnectionMode.ReadDataset

            }
        })
        if (isChainExecuted) {
            super.invokeStep();
        }
        if (isExecutedRecordToSpreadsheet) {
            this.recordToDataset()
        }
        if (isExecutedReadFromDataset) {
            this.readFromDataset()
        }
    }

    private recordToDataset() {

        if (this.data.datasetX !== undefined && this.data.datasetY !== undefined && this.data.datasetReceiverId) {
            console.log('record: ')
            this.graphDatasetRecorder.recordToDataset({
                value: this.currentResourcesCount,
                spreadsheetId: this.data.datasetReceiverId,
                x: this.data.datasetX,
                y: this.data.datasetY
            })
        }
    }

    private readFromDataset() {
        if (this.data.readDatasetX !== undefined && this.data.readDatasetY !== undefined && this.data.datasetToReadTag) {
            const formula = `${this.data.datasetToReadTag}[${this.data.readDatasetX}][${this.data.readDatasetY}]`
            const value = this.mathManager.calculateFormula({formula})
            if (value !== undefined && typeof value === 'number' && !isNaN(value)) {
                this.updateNode({
                    resources: {value},
                    resourcesToProvide: {value}
                })
            }
        }
    }


    protected runAction() {
/// not needed
    }


    private updatePreviousResourcesCount() {
        if (this.currentResourcesCount > 0) {
            this.previousStepResourcesCount = this.currentStepResourcesCount
            this.currentStepResourcesCount = this.currentResourcesCount
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

    takeCountResources(count: number): IResource | undefined {
        const afterTakeResources = this.resourcesToProvideCount - count

        if (afterTakeResources >= 0 && (!this.minCapacity || afterTakeResources >= this.minCapacity)) {
            const deletedResourcesToProvide = {
                ...this.resourcesToProvide,
                value: count
            }
            const leftResourcesToProvide = {
                ...this.resourcesToProvide,
                value: afterTakeResources
            }

            const leftResources = {
                ...this.resources,
                value: this.currentResourcesCount - count
            }

            this.updatePreviousResourcesCount()
            this._data = {
                ...this.data,
                resourcesToProvide: leftResourcesToProvide,
                resources: leftResources
            }
            // this.recordToDataset()
            return deletedResourcesToProvide
        }
    }


    static baseNodeIsData(baseNode: GraphBaseNode<IDiagramNodeBaseData>): baseNode is GraphDataNode {
        return baseNode instanceof GraphDataNode;
    }
}
