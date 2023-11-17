import {
    EDiagramNode,
    EModeAddResourcesToDataNode,
    ENodeAction,
    ENodeTrigger,
    INodeDataWithInteractivity,
    isIIsEventTriggered
} from "../../../../interface";
import {GraphInvokableNode} from "./GraphInvokable";
import {GraphEventListenerNode} from "../GraphEventListenerNode";
import {GraphLoopNode} from "./GraphLoopNode";


export abstract class GraphInteractiveNode<IGenericNodeData extends INodeDataWithInteractivity = INodeDataWithInteractivity>
    extends GraphInvokableNode<IGenericNodeData> {

    invokeStep() {
        const canBeInvoked = this.canBeInvoked()
        if (canBeInvoked) {
            super.invokeStep()
            this.runAction();
            this.clearClick()
        }
    }

    private canBeInvoked() {
        if (this.data.type === EDiagramNode.Data) {
            return true
        }
        if (this.triggerMode === ENodeTrigger.automatic) {
            return true
        } else if (this.triggerMode === ENodeTrigger.enabling) {
            if (this.currentDiagramStep <= 1) {
                return true
            } else if (this.isTriggeredIncomingNodes) {
                return true
            }
        } else if (this.triggerMode === ENodeTrigger.interactive) {
            if (this.isClicked) {
                return true
            }
        } else if (this.triggerMode === ENodeTrigger.passive) {
            if (this.isTriggeredIncomingNodes) {
                return true
            }
        }

        return false
    }

    protected abstract runAction(): void;

    get addingResourcesMode() {
        if (this.actionMode === ENodeAction.pushAll || this.actionMode === ENodeAction.pullAll) {
            return EModeAddResourcesToDataNode.onlyAll
        } else {
            return EModeAddResourcesToDataNode.asPossible
        }
    }

    get isTriggeredIncomingNodes(): boolean {
        return this.incomingEdges.some(edge => {
            const source = edge.source;
            if (isIIsEventTriggered(source)) {
                return source.isEventTriggered(edge.data.sourceMode)
            }
            return false
        })
    }

    private clearClick() {
        if (this._data.trigger.mode === ENodeTrigger.interactive) {
            this.updateNode({
                ...this.data,
                trigger: {
                    mode: ENodeTrigger.interactive,
                    isClicked: false,
                },
            })
        }
    }


    get triggerMode(): ENodeTrigger {
        return this._data.trigger.mode;
    }

    get isClicked(): boolean {
        if (this._data.trigger.mode === ENodeTrigger.interactive) {
            return this._data.trigger.isClicked;
        }
        return false;
    }

    get actionMode() {
        return this._data.actionMode;
    }

    get hasEventListeners(): boolean {
        return this.outgoingEdges.some(edge => edge.source instanceof GraphEventListenerNode || edge.source instanceof GraphLoopNode)
    }
}
