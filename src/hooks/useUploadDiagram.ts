import {ChangeEvent} from "react";
import {readFileAsText} from "../utils";
import {IImportAndExport} from "../interface";
import {diagramEditorActions, useAppDispatch} from "../redux";

export const useUploadDiagram = () => {
    const dispatch = useAppDispatch()
    const {addManyNodes, addManyEdges} = diagramEditorActions
    return async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
       if(file){
           const data = await readFileAsText(file)
           const parsedData: IImportAndExport = JSON.parse(data)
           dispatch(addManyNodes(parsedData.nodes))
           dispatch(addManyEdges(parsedData.edges))
       }
    }
}