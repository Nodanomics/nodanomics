import {IGetSpreadsheetResponse, IStructuredSpreadsheetData} from "../../interface";


// function to structure spreadsheet data
// if spreadsheet doesn't have x or y axis, markers will be 0
export const mapSpreadsheet = (spreadsheet: IGetSpreadsheetResponse): IStructuredSpreadsheetData => {
    // find y column index, where rows starts
    const yAxisIndexMarker = spreadsheet.rows.findIndex((cells) => cells.values.some((cell) => cell.content === 'Y Axis'))
    const yAxisIndexWhereStartValues = spreadsheet.rows.findIndex((cells) => cells.values.some((cell) => !isNaN(Number(cell.content))))
    const yAxisIndex = yAxisIndexMarker === -1 ? yAxisIndexWhereStartValues : yAxisIndexMarker + 1

    // here markers done
    // find x column index, where columns starts
    let xAxisIndex = 0
    spreadsheet.rows.find((cells, index) => {
        if (cells.values.some((cell) => cell.content === 'X Axis')) {
            xAxisIndex = index
            return true
        }
    })


    const columns = spreadsheet.rows[yAxisIndex]?.values
        .map((cell) => cell.content)
        .filter((content) => content !== 'Y Axis')

    const rows: (string | number)[][] = [];

    for (let i = yAxisIndex; i < spreadsheet.rows.length; i++) {
        const row = spreadsheet.rows[i];
        const newRow: (string | number)[] = [];

        for (let j = xAxisIndex; j < row.values.length; j++) {
            const cell = row.values[j];
            const numContent = Number(cell.content);

            if (!isNaN(numContent)) {
                newRow.push(numContent);
            } else {
                newRow.push(cell.content);
            }
        }

        rows.push(newRow);
    }

    return {
        name: spreadsheet.name,
        xAxisIndex,
        yAxisIndex,
        rows,
        columns,
    }
}
