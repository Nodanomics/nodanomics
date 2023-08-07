import {GraphInvokableNode} from "./GraphInvokable";
import {ILoopNodeData} from "../../../../interface/busines/diagram/node/structures/loopNode";
import {EConnectionMode, IIsEventTriggered} from "../../../../interface";
import {GraphLogicManager} from "../helper/GraphLogicManager";

export abstract class GraphLoopNode<IGenericNodeData extends ILoopNodeData = ILoopNodeData> extends GraphInvokableNode<IGenericNodeData>
    implements IIsEventTriggered {

    private readonly logicManager: GraphLogicManager = new GraphLogicManager(this.incomingEdges);

    abstract isEventTriggered(mode?: EConnectionMode): boolean;

    protected abstract checkIsLoopActive(): void;

    get incomingVariables() {
        return this.data.incomingVariables
    }

    get outgoingVariables() {
        return this.data.outgoingVariables
    }

    invokeStep() {
        console.log('super invokeStep')
        this.updateState()
        this.checkWasLoopActiveOnce()
    }

    updateState() {
        this.checkIsLoopActive()
        this.updateVariables()
        this.updateVariablesToExternal()
    }

    get isLoopWasActive() {
        return this.data.isLoopWasActive || false
    }

    get isLoopActive() {
        return this.data.isLoopActive || false
    }

    protected updateVariablesToExternal() {
        const variablesToExternal = this.logicManager.getVariables({
            targetMode: EConnectionMode.LoopChildrenToExternal,
        })
        this._data = {
            ...this.data,
            outgoingVariables: variablesToExternal,
        }
    }

    protected updateVariables() {
        const variables = this.logicManager.getVariables({
            targetMode: EConnectionMode.NodeIncoming,
        })
        this._data = {
            ...this.data,
            incomingVariables: variables,
        }
    }

    protected setIsLoopActive(isLoopActive: boolean) {
        this.updateNode({
            ...this.data,
            isLoopActive,
        })
    }

    private checkWasLoopActiveOnce() {
        if (!this.isLoopWasActive && this.isLoopActive) {
            this.updateNode({
                ...this.data,
                isLoopWasActive: this.isLoopActive,
            })
        }
    }
}
