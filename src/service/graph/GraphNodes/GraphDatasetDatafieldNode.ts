import {GraphBaseNode} from "./abstracts";
import {IDatasetDatafield} from "../../../interface";
import {RunManager} from "../RunManager";
import {GraphNodeManager} from "../NodeManager";
import {GraphSpreadsheetManager} from "../GraphSpreadsheetManager";
import {findIndex2D} from "../../../utils";


export class GraphDatasetDatafieldNode extends GraphBaseNode<IDatasetDatafield> {

    private spreadsheetManager: GraphSpreadsheetManager

    constructor(
        value: IDatasetDatafield,
        runManager: RunManager,
        nodeManager: GraphNodeManager,
        spreadsheetManager: GraphSpreadsheetManager
    ) {
        super(value, runManager, nodeManager);
        this.spreadsheetManager = spreadsheetManager;
    }

    get spreadsheet() {
        if (this.data.datasetId) {
            return this.spreadsheetManager.getSpreadsheet({
                spreadsheetId: this.data.datasetId,
            });
        }
    }

    get lengthY() {
        return this.spreadsheet?.rows.length
    }

    get lengthX() {
        // max length of rows
        return this.spreadsheet?.rows.reduce((acc, row) => {
            return Math.max(acc, row.length)
        }, 0)
    }

    indexOf(value: string | number): undefined | [number, number] {
        if (this.spreadsheet?.rows) {
            return findIndex2D(this.spreadsheet?.rows, value)
        }
    }

    where(value: string | number): undefined | [number, number][] {
        if (this.spreadsheet?.rows) {
            return this.spreadsheet?.rows.reduce((acc: [number, number][], row, y) => {
                const x = row.indexOf(value)
                if (x >= 0) {
                    acc.push([x, y])
                }
                return acc
            }, [])
        }
    }


    get yOffset() {
        return (this.spreadsheet?.yAxisIndex || 0) + 1
    }

    get xOffset() {
        return (this.spreadsheet?.xAxisIndex || 0)
    }

    getValue(coordinates: {
        x: number,
        y: number,
    }) {
        try {
            const x = coordinates.x + this.xOffset
            const y = coordinates.y + this.yOffset
            return this.spreadsheet?.rows[y][x]
        } catch (e) {
            console.error(e)
        }
    }


    getDynamicVariables() {
        return this.spreadsheet?.rows.reduce((acc: {
            [key: string]: number | boolean
        }, row) => {
            const newRow = this.buildRow(row)
            return {
                ...acc,
                ...newRow,
            }
        }, {})
    }

    getColumns() {
        return this.spreadsheet?.columns
    }

    private buildRow(row: (string | number | boolean)[]) {
        const columns = this.getColumns()
        const object: {
            [key: string]: number | boolean
        } = {}
        // the texts value in row
        const anchors: string[] = []
        row.forEach((value) => {
            if (typeof value === 'string') {
                anchors.push(value)
            }
        })
        row.forEach((value, index) => {
            if (typeof value !== 'string') {
                anchors.forEach((anchor) => {
                    const columnName = columns?.[index]
                    const name = `${anchor}${columnName}`
                        .replace(/\s+(\w)/g, (_, match) => match.toUpperCase())
                        .replace(/^\w/, match => match.toLowerCase())
                        .trim()
                    object[name] = value
                })
            }
        })
        return object
    }
}
