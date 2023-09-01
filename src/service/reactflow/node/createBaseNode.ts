import {
    EDiagramNode,
    EElementType,
    ENodeAction,
    ENodeTrigger,
    IDiagramNodeBaseData,
    IReactFlowNode
} from "../../../interface";
import {initialNodeDiagramElement, loopSize} from "../../../constant";
import {generateNodeId} from "./generateNodeId";



export const createBaseNode = ({type, position}: {
    type: EDiagramNode,
    position: { x: number, y: number },
}): IReactFlowNode => {
    const nodeId = generateNodeId();
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
        isCollapsed: true,
        connectedNodes: [],
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
                    isShowInExecutionGraphNode: false,
                    isAutomatic: false,
                    history: [],
                },
            }
        }
        case EDiagramNode.Origin: {
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
        case EDiagramNode.Data: {
            return {
                ...baseParams,
                data: {
                    ...baseData,
                    type,
                    resources: [],
                    isShowInExecutionGraphNode: false,
                    resourcesToProvide: [],
                    actionMode: ENodeAction.pullAny,
                    trigger: {
                        mode: ENodeTrigger.passive,
                    },
                    history: [],
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
                    isEventTriggered: false,
                }
            }
        }
        case EDiagramNode.MicroLoop: {
            return {
                ...baseParams,
                data: {
                    ...baseData,
                    type,
                    currentLoopCount: 0,
                    name: 'MicroLoop',
                    incomingVariables: [],
                    outgoingVariables: [],
                    style: {
                        ...baseData.style,
                        width: loopSize.minWidth,
                        height: loopSize.minHeight,
                    }
                },

            }
        }
        case EDiagramNode.WhileLoop: {
            return {
                ...baseParams,
                data: {
                    ...baseData,
                    type,
                    name: 'WhileLoop',
                    incomingVariables: [],
                    outgoingVariables: [],
                    style: {
                        ...baseData.style,
                        width: loopSize.minWidth,
                        height: loopSize.minHeight,
                    }
                }
            }
        }
        case EDiagramNode.DatasetDatafield: {
            return {
                ...baseParams,
                data: {
                    ...baseData,
                    type,
                }
            }
        }
        case EDiagramNode.Start: {
            return {
                ...baseParams,
                data: {
                    ...baseData,
                    name: 'Start node',
                    type,
                }
            }
        }
        case EDiagramNode.Sink: {
            return {
                ...baseParams,
                data: {
                    ...baseData,
                    type,
                    trigger: {
                        mode: ENodeTrigger.automatic,
                    },
                    actionMode: ENodeAction.pullAny,
                    history: [],
                }
            }
        }
        default :
            throw new Error(`Unknown node type: ${type}`);
    }
}
