import React, {useEffect, useState} from 'react';
// eslint-disable-next-line import/named
import {NodeProps, Position} from "reactflow";
import {EConnectionMode, IMicroLoopNodeData, INodeData, IReactFlowNode} from "../../../../interface";
import {BaseNodeContainer} from "../container/BaseNodeContainer";
import {Box, Input} from "@mui/material";
import {NodeText} from "../styledComponent";
import {EColor, EFontColor} from "../../../../constant";
import {useGetChildrenNodes, useToggle, useUpdateNode} from "../../../../hooks";
import {EventHandle} from "../../CustomHandle/EventHandle";
import {LogicHandle} from "../../CustomHandle";
import {MButton} from "../../../base";
import {diagramEditorActions, useAppDispatch} from "../../../../redux";

export const MicroLoopNode: React.FC<NodeProps<IMicroLoopNodeData>> = (props) => {
    const {data} = props;

    const [loopCount, setLoopCount] = useState<number | undefined>(data.loopCount)
    const {updateNodeData} = useUpdateNode<IMicroLoopNodeData>({
        nodeId: data.id,
    })

    const onLoopCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLoopCount(Number(event.target.value))
    }

    useEffect(() => {
        if (loopCount) {
            updateNodeData({loopCount})
        }
    }, [loopCount])

    const collapse = useToggle()

    const {updateNodeStyle} = useUpdateNode<IMicroLoopNodeData>({
        nodeId: data.id,
    })

    const dispatch = useAppDispatch()
    const {bulkUpdateNodes} = diagramEditorActions

    const getChildrenNodes = useGetChildrenNodes()


    const change = () => {
        collapse.toggle()
        updateNodeStyle({
            // height: collapse.isOpened ? 50 : 200,
            // width: collapse.isOpened ? 100 : 200,
        })
        const children = getChildrenNodes({parentId: data.id})
        const updatedNodes: IReactFlowNode[] = children.map((child) => {
            return {
                ...child,
                hidden: collapse.isOpened
            }
        })
        dispatch(bulkUpdateNodes(updatedNodes))
    }


    return (
        <BaseNodeContainer node={props}>
            <Box
                sx={{
                    padding: 1,
                    boxSizing: 'border-box',
                    width: data.style.width,
                    height: data.style.height,
                    backgroundColor: EColor.darkPurple,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <Box sx={{
                        display: 'flex',
                        gap: 3,
                    }}>


                        <NodeText.Name type="header">
                            {data.name}
                        </NodeText.Name>
                        <Box sx={{
                            display: 'flex',
                            gap: 1,
                            alignItems: 'flex-end',
                        }}>
                            <NodeText.Name>
                                total:
                            </NodeText.Name>
                            <Input
                                onChange={onLoopCountChange}
                                value={loopCount}
                                sx={{
                                    color: EFontColor.white,
                                    width: 40,
                                    height: 20,
                                }}/>

                        </Box>
                        <Box sx={{
                            display: 'flex',
                            gap: 1,
                            alignItems: 'flex-end',
                        }}>
                            <NodeText.Name>
                                current: {data.currentLoopCount}
                            </NodeText.Name>
                        </Box>
                    </Box>
                    <MButton.Submit
                        onClick={change}
                    >
                        change
                    </MButton.Submit>
                </Box>
                <Box sx={{
                    position: 'relative',
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <Box sx={{
                        height: 20,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                    }}>
                        <Box sx={{
                            position: 'relative',
                        }}>
                            <EventHandle
                                type="source"
                                position={Position.Right}
                                mode={EConnectionMode.LoopInToChildren}
                            />
                        </Box>
                        <Box sx={{
                            position: 'relative',
                        }}>
                            <LogicHandle
                                type="source"
                                position={Position.Right}
                            />
                        </Box>
                    </Box>
                    <EventHandle
                        type="source"
                        position={Position.Right}
                        mode={EConnectionMode.LoopOut}
                    />
                </Box>
            </Box>
        </BaseNodeContainer>
    );
};
