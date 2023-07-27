// eslint-disable-next-line import/named
import {Node} from "reactflow";
import {IVariableNodeData} from "../variableNode";
import {IFormulaNodeData} from "../formulaNode";
import {ISourceNodeData} from "../sourceNode";
import {IEventTriggerNodeData} from "../eventTriggerNode";
import {IEventListenerNodeData} from "../eventListenerNode";
import {IStaticVariableNodeData} from "../staticVariableNode";


export type INodeData = IStaticVariableNodeData
    | IFormulaNodeData
    | ISourceNodeData
    | IVariableNodeData
    | IEventTriggerNodeData
    | IEventListenerNodeData

export type IReactFlowNode = Node<INodeData>


