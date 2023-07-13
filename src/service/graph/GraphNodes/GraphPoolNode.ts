import {GraphBaseNode} from "./GraphBaseNode";
import {IPoolNodeData, IResource} from "../../../interface";
import {GraphBaseEdge, GraphDataEdge} from "../GraphEdge";

export class GraphPoolNode extends GraphBaseNode<IPoolNodeData> {


    constructor(data: IPoolNodeData) {
        super(data);
    }

    onParentUpdate() {
        //
    }

    onEdgeInvoke(edge: GraphBaseEdge) {
        console.log('onEdgeInvoke: ', edge);
        if (edge instanceof GraphDataEdge) {
            this.addResource(edge.resources);
        }
    }

    get resources() {
        return this.data.resources;
    }

    takeCountResources(count: number) {
        const deletedResources = this.resources.slice(0, count);
        this._data = {
            ...this.data,
            resources: this.resources.slice(count)
        }
        return deletedResources
    }

    addResource(resource: IResource[]) {
        console.log('addResource: ', resource)
        this._data = {
            ...this.data,
            resources: [...this.data.resources, ...resource]
        }
    }
}
