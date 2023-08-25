import React, {useEffect, useState} from 'react';
// eslint-disable-next-line import/named
import {BaseEdge, EdgeLabelRenderer, EdgeProps, getBezierPath} from 'reactflow';
import {EElementType, IDataConnectionData} from "../../../interface";
import {diagramEditorActions, useAppDispatch, useDiagramEditorState} from "../../../redux";
import {Box, Button} from "@mui/material";
import {DIAGRAM_RUN_DURATION, EColor, EDGE_Z_INDEX} from "../../../constant";
import {CircleResourcesAnimation} from "./CircleResourcesAnimation";


export const DataConnection: React.FC<EdgeProps<IDataConnectionData>> = (
    {
        id,
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition,
        targetPosition,
        style = {},
        markerEnd,
        data
    }
) => {
    const {isDiagramRunning, isDiagramRunningInterval} = useDiagramEditorState()
    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });
    const dispatch = useAppDispatch()
    const {setEditElement} = diagramEditorActions

    const onClick = () => {
        dispatch(setEditElement({
            id,
            elementType: EElementType.Connection,
        }))
    }
    const animationCircleId = `animation-circle-${id}`

    const [circleCount, setCircleCount] = useState<number>(data?.howManyWasTransferred ?Math.floor(data.howManyWasTransferred)  : 0)

    useEffect(() => {
        setCircleCount(data?.howManyWasTransferred ? Math.floor(data.howManyWasTransferred) : 0)
        console.log('howManyWasTransferred: ', data?.howManyWasTransferred)
    }, [data?.howManyWasTransferred]);


    const isPlay = isDiagramRunning && data?.isTransferredResources
    console.log('tt_1.1: ', data?.isTransferredResources)
    return (
        <>
            {Array.from({length: circleCount <= 30 ? circleCount : 30}).map((_, index) => {
                const delay = index * 50
                return (
                    <CircleResourcesAnimation
                        sourcePosition={sourcePosition}
                        targetPosition={targetPosition}
                        cx={sourceX}
                        cy={sourceY}
                        path={edgePath}
                        infinite={isDiagramRunningInterval}
                        play={isPlay}
                        duration={DIAGRAM_RUN_DURATION - delay}
                        begin={delay}
                        key={index} parentId={animationCircleId}
                        id={`${animationCircleId}-${index}`}
                    />
                )
            })}
            <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} id={animationCircleId}/>
            <EdgeLabelRenderer>
                <Box
                    sx={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        fontSize: 12,
                        pointerEvents: 'all',
                        zIndex: EDGE_Z_INDEX,
                    }}
                >
                    <Button
                        onClick={onClick}
                        sx={{
                            padding: 1,
                            minWidth: 20,
                            minHeight: 10,
                            fontSize: 12,
                            borderRadius: 1,
                            borderColor: EColor.blue,
                            borderStyle: 'solid',
                            borderWidth: 1,
                            backgroundColor: EColor.white,
                        }}
                    >
                        {data?.formula}
                    </Button>
                </Box>
            </EdgeLabelRenderer>
        </>
    );
};
