export interface ISpreadsheetView {
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
            merge?: {
                s: {
                    c: number;
                    r: number;
                };
                e: {
                    c: number;
                    r: number;
                };
            }
            columnId: string | null;
            isChanged?: boolean;
        }[];
    }[]
}
