import {EDiagramNode, IDiagramNodeBaseData} from "./structures";
import {IResource} from "../resource";
import {INodeWithAction} from "../nodeAction";
import {INodeWithTrigger} from "../nodeTrigger";
import {IIsShowInExecutionGraphNode, IDatasetRecorder, INodeDecimal, INodeHistory, IDatasetReader} from "./additional";
import {IIsElementExecuted} from "../generic";


export interface IDataNodeData extends IDiagramNodeBaseData, INodeWithTrigger,
    INodeWithAction, INodeHistory,
    INodeDecimal, IIsShowInExecutionGraphNode, IIsElementExecuted, IDatasetRecorder, IDatasetReader {
    type: EDiagramNode.Data
    resources: IResource
    initialResources?: IResource
    resourcesToProvide: IResource
    isShowStep?: boolean
    step?: number
    roundingType?: string
    minCapacity?: number
    maxCapacity?: number
    isAssigned?: boolean
    changeCount?: number
}

export const isIDataNodeData = (data: IDiagramNodeBaseData): data is IDataNodeData => {
    return data.type === EDiagramNode.Data
}
