import React, {useEffect, useState} from 'react';
// eslint-disable-next-line import/named
import {NodeProps, Position} from "reactflow";
import {Box, Typography} from "@mui/material";
import {EConnectionMode, IDataNodeData} from "../../../../interface";
import {NodeStyle} from "../styledComponent";
import {EColor, EFontColor, GAP_BETWEEN_EDITOR_CANVAS_DOTS} from "../../../../constant";
import {BaseNodeContainer} from "../container";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {useChangeNodeDataStep} from "../../../../hooks";
import {useDiagramEditorState} from "../../../../redux";
import {shortenLargeNumber} from "../../../../utils";
import {DataHandle} from "../../CustomHandle/DataHandle";
import {ChainHandle} from "../../CustomHandle/ChainHandle";


export const DataNode: React.FC<NodeProps<IDataNodeData>> = (props) => {
    const {isConnectable, data} = props
    const {isDiagramRunning, completedSteps, settings: {isResourceAnimationLatency}} = useDiagramEditorState()

    const isShowStep = data.isShowStep || false

    const {increaseNodeDataStep, decreaseNodeDataStep} = useChangeNodeDataStep({
        nodeData: props.data,
    })

    const [resources, setResources] = useState<number>(data.resources.value)
    const [minMaxResources, setMinMaxResources] = useState<{
        min: string | undefined,
        max: string | undefined,
    }>({
        min: undefined,
        max: undefined,
    })

    const updateMinMax = () => {
        if (data.history.length > 0) {
            setMinMaxResources({
                min: shortenLargeNumber(Math.min(...data.history), 1),
                max: shortenLargeNumber(Math.max(...data.history), 1),
            })
        } else {
            setMinMaxResources({
                min: undefined,
                max: undefined,
            })
        }
    }


    useEffect(() => {
        if (isResourceAnimationLatency) {
            setResources(data.resources.value)
            updateMinMax()
        }
    }, [completedSteps]);

    useEffect(() => {
        if (!isDiagramRunning || !isResourceAnimationLatency) {
            setResources(data.resources.value)
            updateMinMax()
        }
    }, [data.resources]);


    const currentResourcesValue = resources
        ? shortenLargeNumber(resources, data.decimalDigits || 1)
        : 0
    return (

        <>
            <Box sx={{
                position: 'absolute',
                width: 'calc(100% + 28px)',
                height: 'calc(100% + 28px)',
                left: -14,
                top: -14,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                pointerEvents: 'none',
            }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    padding: '2px',
                    gap: '6px',
                }}>
                    <DataHandle
                        type="target"
                        position={Position.Left}
                        isConnectable={isConnectable}

                    />
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                    }}>
                        <ChainHandle type={"target"} position={Position.Left} mode={EConnectionMode.RecordToSpreadsheet} isConnectable={isConnectable}/>
                        <Typography sx={{
                            fontSize: 9,
                            color: EFontColor.lightMarine4,
                        }}>
                            record
                        </Typography>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                    }}>
                        <ChainHandle type={"target"} position={Position.Left} mode={EConnectionMode.ReadDataset} isConnectable={isConnectable}/>
                        <Typography sx={{
                            fontSize: 9,
                            color: EFontColor.lightMarine4,
                        }}>
                            read
                        </Typography>
                    </Box>
                </Box>
                <DataHandle
                    type="source"
                    position={Position.Right}
                    isConnectable={isConnectable}
                />
            </Box>
            <BaseNodeContainer node={props}>
                {/*<Box sx={{*/}
                {/*    position: 'absolute',*/}
                {/*    top: -15,*/}
                {/*    color: EFontColor.lightMarine4,*/}
                {/*}}>*/}
                {/*   <Typography sx={{*/}
                {/*       fontSize: 9,*/}
                {/*   }}>*/}
                {/*       {data.name}*/}
                {/*   </Typography>*/}
                {/*</Box>*/}
                <Box sx={{
                    backgroundColor: EColor.darkMarine,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: GAP_BETWEEN_EDITOR_CANVAS_DOTS * 6,
                    height: GAP_BETWEEN_EDITOR_CANVAS_DOTS * 4,
                }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mx: 1,
                        justifyItems: 'center',
                        flex: 1,
                    }}>
                        {isShowStep && <KeyboardArrowUpIcon
                            onClick={increaseNodeDataStep}
                            sx={{
                                cursor: 'pointer',
                                pointerEvents: 'all',
                                width: 18,
                                height: 18,
                                color: EFontColor.white,
                            }}/>}
                        <NodeStyle.Name sx={{
                            maxWidth: '100%',
                            overflow: 'hidden',
                            textAlign: 'center',
                            overflowWrap: 'break-word',
                        }}>
                            {data.name}
                        </NodeStyle.Name>
                        <NodeStyle.Value>
                            {currentResourcesValue}
                        </NodeStyle.Value>
                        {isShowStep && <KeyboardArrowDownIcon
                            onClick={decreaseNodeDataStep}
                            sx={{
                                cursor: 'pointer',
                                pointerEvents: 'all',
                                width: 18,
                                height: 18,
                                color: EFontColor.white,
                            }}
                        />}
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '2px',
                        height: 1,
                    }}>
                        <Box>
                            <NodeStyle.Name>
                                Max
                            </NodeStyle.Name>
                            <NodeStyle.Value>
                                {minMaxResources ? minMaxResources.max : <br/>}
                            </NodeStyle.Value>
                        </Box>
                        <Box>
                            <NodeStyle.Name>
                                Min
                            </NodeStyle.Name>
                            <NodeStyle.Value>
                                {minMaxResources !== undefined ? minMaxResources.min : <br/>}
                            </NodeStyle.Value>
                        </Box>
                    </Box>
                </Box>
            </BaseNodeContainer>

        </>
    );
};
