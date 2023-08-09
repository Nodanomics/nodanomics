export interface IGetSpreadsheetRequests {
    spreadsheetId?: string;
}

export interface IGetSpreadsheetResponse {
    createdAt: string;
    id: string;
    name: string;
    projectId: string;
    rows: {
        id: string;
        sheetId: string;
        values: {
            content: string;
            id: string;
            rowId: string;
            columnId: string | null;
        }[];
    }[]
}
