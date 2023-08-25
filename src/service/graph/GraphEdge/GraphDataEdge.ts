import {GraphBaseEdge} from "./abstracts";
import {IDataConnectionData} from "../../../interface";
import {GraphBaseNode, GraphDataNode} from "../GraphNodes";
import {GraphNodeManager} from "../NodeManager";
import {GraphMatchManagerConnections} from "../GraphMatchManager";


export class GraphDataEdge extends GraphBaseEdge<IDataConnectionData> {

    private readonly matchManager: GraphMatchManagerConnections

    constructor(
        source: GraphBaseNode,
        target: GraphBaseNode,
        data: IDataConnectionData,
        nodesManager: GraphNodeManager,
    ) {
        super(source, target, data);
        this.matchManager = new GraphMatchManagerConnections(this, nodesManager);
    }

    get countOfResource() {
        return Math.round(this.calcFormula() || 0);
    }

    static baseEdgeIsData(edge: GraphBaseEdge): edge is GraphDataEdge {
        return edge instanceof GraphDataEdge;
    }

    private calcFormula() {
        if (this.data.formula) {
            if (this.data.formula === 'all' && this.source instanceof GraphDataNode) {
                return this.source.resourcesToProvideCount;
            }
            const res = this.matchManager.calculateFormula({formula: this.data.formula})
            if (typeof res === 'number') {
                return res;
            }
        }
    }

    changeIsTransferredResources(isTransferredResources: boolean, howManyWasTransferred: number) {
        console.log('changeIsTransferredResources', howManyWasTransferred)
        if (this._data) {
            this._data = {
                ...this._data,
                isTransferredResources: isTransferredResources,
                howManyWasTransferred: howManyWasTransferred
            }
        }

    }
}
