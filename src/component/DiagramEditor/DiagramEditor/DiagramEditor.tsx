import React, {useEffect, useState} from 'react';
import {DiagramCanvas} from "../DiagramCanvas";
import style from './DiagramEditor.module.scss'
import {ElementSetupToolbar, LeftToolbar, ElementToolbar} from "../toolbar";
import {useSetAllSpreadSheetsToState, useGetEditDiagramFromServer, useWidthAndHeight} from "../../../hooks";
import {Box} from "@mui/material";
import {DiagramEditorHeader} from "../DiagramEditorHeader";
import {CONFIG} from "../../../utils";


export const DiagramEditor = () => {

    const {isRequestLoaded} = useGetEditDiagramFromServer()
    const [isCanvasShow, setIsCanvasShow] = useState(false)

    // TODO after downloading the diagram from the server,
    //  it takes some time to display new elements instead of the old ones.
    //  Therefore, setTimeout is used
    useEffect(() => {
        if (!CONFIG.IS_OFFLINE) {
            let timeout: NodeJS.Timeout
            if (isRequestLoaded && !isCanvasShow) {
                setTimeout(() => {
                    setIsCanvasShow(true)
                }, 150)
            } else {
                setIsCanvasShow(false)
            }
            return () => {
                clearTimeout(timeout)
            }
        } else {
            setIsCanvasShow(true)
        }
    }, [isRequestLoaded])

    const {elementSize: diagramCanvasContainerSize, elementRef: diagramCanvasContainerRef} = useWidthAndHeight()

    useSetAllSpreadSheetsToState()

    return (
        <Box
            className={style.diagramEditorContainer}
        >
            <DiagramEditorHeader/>
            <Box
                ref={diagramCanvasContainerRef}
                className={style.canvasContainer}>
                {isCanvasShow && <DiagramCanvas/>}
                <Box sx={{
                    position: 'absolute',
                    width: diagramCanvasContainerSize.width,
                    height: diagramCanvasContainerSize.height,
                    pointerEvents: 'none',
                }}>
                    <Box
                        sx={{
                            display: 'flex',
                            width: '100%',
                            height: '100%',
                        }}
                    >
                        <LeftToolbar/>
                        <Box
                            sx={{
                                position: 'relative',
                                flex: 1,
                            }}
                        >
                            <Box
                                sx={{
                                    position: 'absolute',
                                    bottom: 15,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                }}
                            >
                                <ElementToolbar/>
                            </Box>
                        </Box>
                        <ElementSetupToolbar/>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};
