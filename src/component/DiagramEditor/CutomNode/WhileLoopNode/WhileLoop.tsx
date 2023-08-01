import React from 'react';
import {BaseNodeContainer} from "../container/BaseNodeContainer";
// eslint-disable-next-line import/named
import {NodeProps, Position} from "reactflow";
import {EConnectionMode, IWhileLoopNodeData} from "../../../../interface";
import {EColor} from "../../../../constant";
import {Box} from "@mui/material";
import {NodeText} from "../styledComponent";
import {EventHandle} from "../../CustomHandle/EventHandle";

export const WhileLoopNode: React.FC<NodeProps<IWhileLoopNodeData>> = (props) => {
    const {data} = props;

    const isActiveText = data.isLoopActive ? 'active' : 'no active'

    return (
        <BaseNodeContainer node={props}>
            <Box
                sx={{
                    padding: 1,
                    boxSizing: 'border-box',
                    width: data.style.width,
                    height: data.style.height,
                    backgroundColor: EColor.darkGreen,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                }}
            >
                <Box sx={{
                    display: 'flex',
                    gap: 3,
                    alignItems: 'flex-end',
                }}>

                    <NodeText.Name type="header">
                        {data.name}
                    </NodeText.Name>
                </Box>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}>
                    <Box sx={{
                        position: 'relative',
                        backgroundColor: EColor.white,
                        paddingLeft: 1,
                        paddingRight: 0.7,
                        py: 0.5,
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
                        paddingLeft: 0.7,
                        paddingRight: 1,
                        py: 0.5,
                        borderRadius: 4,
                        width: 'fit-content',
                    }}>
                        <NodeText.Name>
                            out
                        </NodeText.Name>
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
                    <Box sx={{
                        backgroundColor: EColor.white,
                        paddingLeft: 0.7,
                        paddingRight: 1,
                        py: 0.5,
                        borderRadius: 2,
                        position: 'relative',
                    }}>
                        <EventHandle type="source" position={Position.Right}/>
                        <NodeText.Name type="small">
                            Loop
                        </NodeText.Name>
                        <NodeText.Name type="small">
                            Trigger
                        </NodeText.Name>
                    </Box>

                </Box>
            </Box>
        </BaseNodeContainer>
    );
};
