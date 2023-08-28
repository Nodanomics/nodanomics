import {diagramEditorActions, useAppDispatch} from "../redux";
import {useGetDiagramByIdQuery, useGetExecutionGraphPropertiesQuery} from "../api";
import {useEffect, useRef, useState} from "react";
import {useParams} from "react-router-dom";


export const useGetEditDiagramFromServer = () => {


    const {diagramId: currentDiagramId} = useParams() as { diagramId: string }


    const dispatch = useAppDispatch()

    const [isRequestLoaded, setIsRequestLoaded] = useState(false)
    const prevDiagramId = useRef<string>()

    useEffect(() => {
        if (currentDiagramId !== prevDiagramId.current) {
            setIsRequestLoaded(false)
            prevDiagramId.current = currentDiagramId
        }
    }, [currentDiagramId])


    const {data: diagramRes} = useGetDiagramByIdQuery(currentDiagramId, {
        refetchOnMountOrArgChange: true,
    })
    const {setDiagram, renderState, setExecutionGridProperties} = diagramEditorActions



    useEffect(() => {
        const diagramData = diagramRes?.diagram
        if (diagramData && diagramData.elements !== null) {

            dispatch(setDiagram({
                name: diagramData.name,
                diagramId: diagramData.id,
                nodes: diagramData.elements.diagramNodes,
                edges: diagramData.elements.diagramEdges,
            }))

            dispatch(renderState())
        } else if (diagramData) {
            dispatch(setDiagram({
                name: diagramData.name,
                diagramId: diagramData.id,
            }))
        }
        if (diagramRes?.diagram?.id) {
            setIsRequestLoaded(true)
        }
    }, [diagramRes, currentDiagramId])
    return {
        isRequestLoaded: isRequestLoaded,
    }
}
