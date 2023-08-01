// eslint-disable-next-line import/named
import {ReactFlowInstance} from "reactflow";
import {DragEvent} from "react";
import {initialNodeDiagramElement} from "../../../constant";
import {
    EDiagramNode,
    EElementType,
    ENodeAction,
    ENodeTrigger,
    IDiagramNodeBaseData,
    IReactFlowNode
} from "../../../interface";

import {nanoid} from 'nanoid'

const getId = () => `nodeId_${nanoid()}`;


export const createNode = ({type, flowInstance, wrapperNode, event}: {
    type: EDiagramNode,
    flowInstance: ReactFlowInstance
    wrapperNode: HTMLDivElement
    event: DragEvent<HTMLDivElement>
}): IReactFlowNode | undefined => {
    const reactFlowBounds = wrapperNode?.getBoundingClientRect();
    const position = flowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
    });
    const nodeId = getId();
    const baseParams = {
        id: nodeId,
        type,
        position,
    }
    const baseData: IDiagramNodeBaseData = {
        elementType: EElementType.Node,
        type,
        label: '',
        id: nodeId,
        style: initialNodeDiagramElement,
        name: `node name ${nodeId}`,
    }
    switch (type) {
        case EDiagramNode.StaticVariable: {
            return {
                ...baseParams,
                data: {
                    ...baseData,
                    type,
                },
            };
        }
        case EDiagramNode.Formula: {
            return {
                ...baseParams,
                data: {
                    ...baseData,
                    type,
                },
            }
        }
        case EDiagramNode.Source: {
            return {
                ...baseParams,
                data: {
                    ...baseData,
                    type,
                    trigger: {
                        mode: ENodeTrigger.automatic,
                    },
                    actionMode: ENodeAction.pushAny,
                }
            }
        }
        case EDiagramNode.Variable: {
            return {
                ...baseParams,
                data: {
                    ...baseData,
                    type,
                    resources: [],
                    actionMode: ENodeAction.pullAny,
                    trigger: {
                        mode: ENodeTrigger.passive,
                    },
                }
            }
        }
        case EDiagramNode.EventTrigger: {
            return {
                ...baseParams,
                data: {
                    ...baseData,
                    type,
                    eventName: '',
                }
            }
        }
        case EDiagramNode.EventListener: {
            return {
                ...baseParams,
                data: {
                    ...baseData,
                    type,
                }
            }
        }
        case EDiagramNode.MicroLoop: {
            return {
                ...baseParams,
                data: {
                    ...baseData,
                    type,
                    style: {
                        ...baseData.style,
                        width: 200,
                        height: 200,
                    }
                },

            }
        }
        default :
            console.error(`wrong node type: ${type}`)
            break;
    }
}
