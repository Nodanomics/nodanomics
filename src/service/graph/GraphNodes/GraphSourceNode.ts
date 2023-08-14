import {ENodeAction, ISourceNodeData} from "../../../interface";
import {GraphInteractiveNode} from "./abstracts";
import {GraphDataNode} from "./GraphDataNode";
import {GraphDataEdge} from "../GraphEdge";
import {RunManager} from "../RunManager";
import {nanoid} from "nanoid";

const genResourceId = () => `resource_${nanoid()}}`

export class GraphSourceNode extends GraphInteractiveNode<ISourceNodeData> {
    constructor(data: ISourceNodeData, runManager: RunManager) {
        super(data, runManager);
    }

    protected runAction() {
        this.pushAllOrAnyResources()
    }

    pushAllOrAnyResources() {
        this.edgesToVariables.forEach(edge => {
            const resources = this.generateResourceFromSource(edge.countOfResource);
            if (GraphDataNode.baseNodeIsData(edge.target)) {
                const onSuccess = () => {
                    edge.changeIsTransferredResources(true)
                }
                edge.target.addResource(resources, this.addingResourcesMode, {
                    onSuccess
                });
            }
        })
    }

    get edgesToVariables(): GraphDataEdge[] {
        return this.outgoingEdges
            .filter(edge => GraphDataNode.baseNodeIsData(edge.target))
            .filter(edge => GraphDataEdge.baseEdgeIsData(edge)) as GraphDataEdge[];
    }

    generateResourceFromSource(countOfResource: number) {
        return Array(countOfResource).fill(0).map(() => ({
            color: 'red',
            id: genResourceId(),
        }))
    }
}
