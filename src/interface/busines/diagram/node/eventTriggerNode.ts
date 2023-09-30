import {EDiagramNode, IInvokableNode} from "./structures";
import {INodeNumberVariable} from "./additional";


export interface IEventTriggerNodeVariable {
    variableName: string
    value: number
}

export interface IEventTriggerNodeData extends IInvokableNode, INodeNumberVariable {
    type: EDiagramNode.EventTrigger;
    eventName: string;
    isEventTriggered?: boolean;
    // eventCondition?: string;
    // isEventConditionMet?: boolean;
}
