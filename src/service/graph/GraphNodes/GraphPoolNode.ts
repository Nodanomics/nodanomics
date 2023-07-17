import {GraphBaseNode} from "./GraphBaseNode";
import {IPoolNodeData, IResource} from "../../../interface";
import {GraphDataEdge} from "../GraphEdge";

export class GraphPoolNode extends GraphBaseNode<IPoolNodeData> {


    constructor(data: IPoolNodeData) {
        super(data);
    }

    get resources() {
        return this.data.resources;
    }

    get resourcesCount() {
        return this.data.resources.length;
    }

    takeCountResources(count: number) {
        console.log('takeCountResources', count)
        // const requiredResources = this.countOfOutgoingRequiredResources();
        // if (this.resourcesCount >= requiredResources) {
        const deletedResources = this.resources.slice(0, count);
        this._data = {
            ...this.data,
            resources: this.resources.slice(count)
        }
        return deletedResources
        // }
    }

    addResource(resource?: IResource[]) {
        if (resource) {
            this._data = {
                ...this.data,
                resources: [...this.data.resources, ...resource]
            }
        }
    }

    private countOfOutgoingRequiredResources() {
        return this.outgoingEdges.reduce((acc, edge) => {
            if (edge instanceof GraphDataEdge) {
                return acc + edge.countOfResource
            }
            return acc;
        }, 0)
    }
}
