import {EDiagramNode, IDiagramNodeBaseData} from "../structures";
import {IDatasetRecorder} from "./nodeDatasetRecorder";

export interface IDatasetReader {
    datasetToReadId?: string
    datasetToReadTag?: string
    readDatasetX?: string
    readDatasetY?: string
}

export const  isINodeDatasetReader = <T extends  IDiagramNodeBaseData>(obj: T): obj is (T & IDatasetRecorder) => {
    return [EDiagramNode.Data].includes(obj.type)
}
