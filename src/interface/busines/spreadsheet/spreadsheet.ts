export interface ISpreadsheetInfo {
    id: string;
    name: string;
    projectId: string;
    createdAt: string;
}

export type ISpreadsheetRowsData = (string | number)[][]

export interface IStructuredSpreadsheetData {
    xAxisIndex: number
    yAxisIndex: number
    name: string
    rows: ISpreadsheetRowsData
}

export interface IStructuredSpreadsheetsData {
    [key: string]: IStructuredSpreadsheetData
}
