import {IDiagramBaseInteractiveElementData} from "../../diagramElement";

export enum EDiagramNode {
    StaticVariable = 'StaticVariable',
    Source = 'Source',
    Formula = 'Formula',
    Variable = 'Variable',
    EventTrigger = 'EventTrigger',
    EventListener = 'EventListener',
    MicroLoop = 'MicroLoop',
}


export interface IDiagramNodeBaseData extends IDiagramBaseInteractiveElementData {
    type: EDiagramNode;
    tag?: string;
}
