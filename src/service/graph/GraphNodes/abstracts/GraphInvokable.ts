import {GraphBaseNode} from "./GraphBaseNode";
import {IInvokableNode, IResetBeforeStep} from "../../../../interface";

export abstract class GraphInvokableNode<IGenericNodeData extends IInvokableNode = IInvokableNode> extends GraphBaseNode<IGenericNodeData>
    implements IResetBeforeStep {

    private _toRoot?: number
    private _stepExecutionCompensation?: number

    get stepExecutionCompensation(): number  {
        return this._stepExecutionCompensation || 0
    }

    get toRoot(): number {
        return this._toRoot || 0
    }

     setToRoot(value: number) {
        this._toRoot = value
    }

    setStepExecutionCompensation(value: number) {
        this._stepExecutionCompensation = value
    }
    // abstract invokeStep(): void

    invokeStep() {
        this.onIsExecuted()
    }


    resetBeforeStep() {
        this._data = {
            ...this._data,
            isExecuted: false
        }
    }

    private onIsExecuted() {
        this._data = {
            ...this._data,
            isExecuted: true
        }
    }

}
