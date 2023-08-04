import React from 'react';
import {BaseNodeContainer} from "../container/BaseNodeContainer";
// eslint-disable-next-line import/named
import {NodeProps, Position} from "reactflow";
import {EConnectionMode, IWhileLoopNodeData} from "../../../../interface";
import {EColor} from "../../../../constant";
import {Box} from "@mui/material";
import {NodeText} from "../styledComponent";
import {EventHandle} from "../../CustomHandle/EventHandle";
import {useExpandOrCollapse} from "../../../../hooks";
import {MButton} from "../../../base";
import {LogicHandle} from "../../CustomHandle";

export const WhileLoopNode: React.FC<NodeProps<IWhileLoopNodeData>> = (props) => {
    const {data} = props;

    const isActiveText = data.isLoopActive ? 'active' : 'no active'
    const loopOutText = !data.isLoopWasActive ? 'was not active' : !data.isLoopActive ? 'finished' : 'running'

    const {isExpanded, expandOrCollapse} = useExpandOrCollapse({
        initialIsOpened: data.isCollapsed,
    })

    const changeExpandOrCollapse = () => {
        expandOrCollapse({parentId: data.id})
    }

    return (
        <BaseNodeContainer node={props}>
            <Box
                sx={{
                    padding: 1,
                    boxSizing: 'border-box',
                    width: isExpanded ? 'fit-content' : data.style.width,
                    height: isExpanded ? 'fit-content' : data.style.height,
                    backgroundColor: EColor.darkGreen,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                }}
            >
                <Box sx={{
                    display: 'flex',
                    gap: 3,
                    justifyContent: 'space-between',
                }}>

                    <NodeText.Name type="header">
                        {data.name}
                    </NodeText.Name>
                    <MButton.Submit
                        onClick={changeExpandOrCollapse}
                    >
                        collapse
                    </MButton.Submit>
                </Box>
                {/* external data handlers */}
                <Box sx={{
                    display: 'flex',
                    position: 'relative',
                }}>
                    <Box sx={{
                        position: 'absolute',
                        left: -14,
                        height: 'fit-content',
                        width: 20,
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: EColor.grey,
                        borderRadius: 4,
                        boxSizing: 'border-box'
                    }}>
                        <Box sx={{
                            my: 0.3,
                            marginRight: 0.5,
                            marginLeft:0.5,
                            display: 'flex',
                            flex: 1,
                            gap: 1,
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <Box sx={{
                                position: 'relative',
                                height: 10,
                            }}>
                                <LogicHandle
                                    type="target"
                                    position={Position.Left}
                                    mode={EConnectionMode.LoopOutConnector}
                                />
                            </Box>
                            <Box sx={{
                                position: 'relative',
                                height: 10,
                            }}>
                                <EventHandle
                                    type="target"
                                    position={Position.Left}
                                    mode={EConnectionMode.LoopOutConnector}
                                />
                            </Box>
                        </Box>

                    </Box>


                </Box>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    height: isExpanded ? 'fit-content' : 100,
                    alignItems: 'flex-end',
                }}>
                    <Box sx={{
                        position: 'relative',
                        backgroundColor: EColor.white,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        padding: 0.5,
                        borderRadius: 4,
                        width: 'fit-content',
                    }}>
                        <EventHandle type="target" position={Position.Left} mode={EConnectionMode.LoopIn}/>
                        <NodeText.Name>
                            {isActiveText}
                        </NodeText.Name>
                    </Box>
                    <Box sx={{
                        position: 'relative',
                        backgroundColor: EColor.white,
                        padding: 1,
                        borderRadius: 4,
                        width: 'fit-content',
                        display: 'flex',
                        alignItems: 'center',
                    }}>
                        <Box>
                            <NodeText.Name>
                                out state
                            </NodeText.Name>
                            <NodeText.Name>
                                {loopOutText}
                            </NodeText.Name>
                        </Box>

                        <EventHandle type="source" position={Position.Right} mode={EConnectionMode.LoopOut}/>
                    </Box>
                </Box>

                <Box sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    width: 'fit-content',
                }}>
                    {!isExpanded && <Box sx={{
                        backgroundColor: EColor.white,
                        paddingLeft: 0.7,
                        paddingRight: 1,
                        py: 0.5,
                        borderRadius: 2,
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                    }}>
                        <Box>
                            <NodeText.Name type="small">
                                Loop
                            </NodeText.Name>
                            <NodeText.Name type="small">
                                Trigger
                            </NodeText.Name>
                        </Box>
                        <EventHandle type="source" position={Position.Right} mode={EConnectionMode.LoopInToChildren}/>

                    </Box>}

                </Box>
            </Box>
        </BaseNodeContainer>
    );
};
