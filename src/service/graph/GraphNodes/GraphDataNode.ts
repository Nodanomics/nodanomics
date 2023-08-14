import {
    ENodeAction,
    IDiagramNodeBaseData,
    IGetNodeExternalValue,
    IResource,
    IUpdateGraphNodeState,
    IDataNodeData
} from "../../../interface";
import {GraphDataEdge} from "../GraphEdge";
import {GraphBaseNode, GraphInteractiveNode} from "./abstracts";
import {GraphSourceNode} from "./GraphSourceNode";
import {RunManager} from "../RunManager";

export class GraphDataNode extends GraphInteractiveNode<IDataNodeData>
    implements IUpdateGraphNodeState, IGetNodeExternalValue {

    private _resourcesToProvide: IResource[] = [];


    constructor(data: IDataNodeData, runManager: RunManager) {
        super(data, runManager);
    }


    get resourcesToProvide() {
        return this._resourcesToProvide;
    }

    get resourcesToProvideCount() {
        return this._resourcesToProvide.length;
    }

    get maxResources() {
        return this.data.maxResources;
    }


    get minResources() {
        return this.data.minResources;
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
            .filter(edge => edge.source instanceof GraphSourceNode)
            .filter(edge => GraphDataEdge.baseEdgeIsData(edge)) as GraphDataEdge[];
    }

    get isSourceInIncomingEdges(): boolean {
        return this.incomingEdges.some(edge => edge.source instanceof GraphSourceNode);
    }

    resetResourcesToProvide() {
        this._resourcesToProvide = [];
    }

    updateState() {
        this.reCalculateMaxMinAvgValue()
    }

    addResource(resources?: IResource[]) {
        this._resourcesToProvide = [...this.data.resources];
        if (resources) {
            this._data = {
                ...this.data,
                resources: [...this.data.resources, ...resources]
            }
        }
    }

    private updateResourcesCountHistory() {
        this._data = {
            ...this.data,
            resourcesCountHistory: this.data.resourcesCountHistory
                ? [...this.data.resourcesCountHistory, this.currentResourcesCount]
                : [this.currentResourcesCount]
        }
    }

    invokeStep() {
        super.invokeStep();
        this.updateResourcesCountHistory()
    }


    protected runAction() {
        this.pullAllOrAnyResourcesFromSource()
        this.pushAllResources()
        this.pushAnyResources()
        this.pullAnyResourcesFromData()
        this.pullAllResourcesFromData()
    }

    updateRecoursesProvide() {
        this._resourcesToProvide = [...this.data.resources];
    }

    private reCalculateMaxMinAvgValue() {
        if (this.maxResources === undefined || this.maxResources <= this.currentResourcesCount) {
            this._data = {
                ...this.data,
                maxResources: this.currentResourcesCount
            }
        }
        if (this.minResources === undefined || this.minResources >= this.currentResourcesCount) {
            this._data = {
                ...this.data,
                minResources: this.currentResourcesCount
            }
        }
    }


    private pullAnyResourcesFromData() {
        if (this.actionMode === ENodeAction.pullAny) {
            this.incomingEdges.forEach(edge => {
                if (edge instanceof GraphDataEdge && edge.source instanceof GraphDataNode) {
                    const resources = edge.source.takeCountResources(edge.countOfResource)
                    this.addResource(resources)
                    this.writeToEdgeIsResourcesWereTransferred(edge, true)
                }
            })
        }
    }

    private pullAllResourcesFromData() {
        if (this.actionMode === ENodeAction.pullAll) {
            this.incomingEdges.forEach(edge => {
                if (edge instanceof GraphDataEdge && edge.source instanceof GraphDataNode) {
                    if (edge.source.resourcesToProvideCount >= edge.countOfResource) {
                        const resources = edge.source.takeCountResources(edge.countOfResource)
                        this.addResource(resources)
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

    private takeCountResources(count: number) {
        const deletedResourcesToProvide = this.resourcesToProvide.splice(0, count);
        this._data = {
            ...this.data,
            resources: this.resources.filter(resource => {
                return !deletedResourcesToProvide.some(deletedResource => deletedResource.id === resource.id)
            })
        }
        return deletedResourcesToProvide
    }


    private pushAnyResources() {
        if (this.actionMode === ENodeAction.pushAny) {
            this.outgoingEdges.forEach(edge => {
                if (edge instanceof GraphDataEdge) {
                    if (edge.target instanceof GraphDataNode) {
                        const resources = this.takeCountResources(edge.countOfResource)
                        edge.target.addResource(resources)
                        edge.changeIsTransferredResources(true)
                    }
                }
            })
        }
    }

    private pushAllResources() {
        if (this.actionMode === ENodeAction.pushAll) {
            if (this.resourcesToProvideCount >= this.countOfRequiredOutgoingResources) {
                this.outgoingEdges.forEach(edge => {
                    if (edge instanceof GraphDataEdge) {
                        if (edge.target instanceof GraphDataNode) {
                            const resources = this.takeCountResources(edge.countOfResource)
                            edge.target.addResource(resources)
                            edge.changeIsTransferredResources(true)
                        }
                    }
                })
            }
        }

    }

    private pullAllOrAnyResourcesFromSource() {
        if (this.actionMode === ENodeAction.pullAll || this.actionMode === ENodeAction.pullAny) {
            this.edgesFromSources.forEach(edge => {
                const resources = edge.countOfResource
                if (edge.source instanceof GraphSourceNode) {
                    const generatedResources = edge.source.generateResourceFromSource(resources)
                    this.addResource(generatedResources)
                    this.writeToEdgeIsResourcesWereTransferred(edge, true)
                }
                this.writeToEdgeIsResourcesWereTransferred(edge, false)
            })
        }
    }

    private writeToEdgeIsResourcesWereTransferred(edge: GraphDataEdge, isTransferred: boolean) {
        if (edge instanceof GraphDataEdge) {
            edge.changeIsTransferredResources(isTransferred)
        }
    }

    static baseNodeIsData(baseNode: GraphBaseNode<IDiagramNodeBaseData>): baseNode is GraphDataNode {
        return baseNode instanceof GraphDataNode;
    }
}
