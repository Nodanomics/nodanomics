import {EElementType, IDiagramBaseInteractiveElementData} from "../../diagramElement";

export enum EConnection {
    DataConnection = 'DataConnection',
    LogicConnection = 'LogicConnection',
    ChainConnection = 'ChainConnection',
}

export enum EConnectionMode{
    LoopInnerToChildren = 'LoopInnerToChildren',
    LoopChildrenToExternal = 'LoopChildrenToExternal',
    NodeIncoming = 'NodeIncoming',
    NodeOutgoing = 'NodeOutgoing',
    RecordToSpreadsheet = 'RecordToSpreadsheet',
    ReadDataset = 'ReadDataset',
}

export enum EConnectionSide {
    Left = "left",
    Top = "top",
    Right = "right",
    Bottom = "bottom"
}

export interface IDiagramConnectionBaseData extends IDiagramBaseInteractiveElementData {
    sourceId: string;
    targetId: string;
    elementType: EElementType.Connection;
    sourceMode?: EConnectionMode
    targetMode?: EConnectionMode
    targetSide: EConnectionSide
    sourceSide: EConnectionSide
    type: EConnection;
}
