// eslint-disable-next-line import/named
import {Connection, Edge} from "reactflow";
import {EElementType, IDiagramBaseInteractiveElementData} from "./diagramElement";

export enum EConnection {
    DataConnection = 'DataConnection',
    LogicConnection = 'LogicConnection',
    thirdType = 'thirdType',
}

export interface IDiagramConnectionBaseData extends IDiagramBaseInteractiveElementData {
    elementType: EElementType.Connection;
    type: EConnection;
}


export interface IDataConnectionData extends IDiagramConnectionBaseData {
    type: EConnection.DataConnection;
    interval?: number;
    formula?: string
}

export interface ILogicConnectionData extends IDiagramConnectionBaseData {
    type: EConnection.LogicConnection;
}

export type IDiagramConnectionData = IDataConnectionData | ILogicConnectionData;

export type IReactFlowEdge = Edge<IDiagramConnectionData>;

export type IReactFlowEdgeConnection = Connection & {
    data: IDiagramConnectionData
}
