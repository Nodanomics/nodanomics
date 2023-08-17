import {useGetManySpreadsheetQuery, useGetProjectInfoQuery, useGetSpreadSheetsBaseInfoQuery} from "../api";
import {diagramEditorActions, useAppDispatch, useDiagramEditorState} from "../redux";
import {useEffect} from "react";

export const useSetAllSpreadSheetsToState = () => {
    const dispatch = useAppDispatch()
    const {currentDiagramId} = useDiagramEditorState()
    const {data: resProjectInfo} = useGetProjectInfoQuery({
        diagramId: currentDiagramId,
    }, {
        skip: !currentDiagramId,
    })

    const {data: spreadsheetsBaseInfo} = useGetSpreadSheetsBaseInfoQuery({
        projectId: resProjectInfo?.id,
    }, {
        skip: !resProjectInfo?.id,
    })

    const spreadsheetIds = spreadsheetsBaseInfo?.data.map((spreadsheet) => spreadsheet.id)


    const {data: projectSpreadsheets} = useGetManySpreadsheetQuery({
        spreadsheetIds,
    }, {
        skip: !spreadsheetIds,
    })

    useEffect(() => {
        if (projectSpreadsheets) {
            const formatted = projectSpreadsheets.reduce((accSpreadsheet, spreadsheet) => {
                const xAxisIndex = spreadsheet.rows.findIndex((cells) => cells.values.some((cell) => cell.content === 'X Axis'))
                const yAxisIndex = spreadsheet.rows.findIndex((cells) => cells.values.some((cell) => cell.content === 'Y Axis'))
                const rows = spreadsheet.rows.reduce((acc, row, index) => {
                    return {
                        ...acc,
                        [index]: row.values.reduce((acc, value, valueIndex) => {
                            return {
                                ...acc,
                                [valueIndex]: {
                                    content: value.content,
                                },
                            }
                        }, {})
                    }
                }, {})
                return {
                    [spreadsheet.name]: {
                        xAxisIndex,
                        yAxisIndex,
                        rows,
                    },
                    ...accSpreadsheet
                }
            }, {})
            dispatch(
                diagramEditorActions.setSpreadsheets({
                    spreadsheets: formatted,
                })
            )
        }
    }, [projectSpreadsheets]);
}
