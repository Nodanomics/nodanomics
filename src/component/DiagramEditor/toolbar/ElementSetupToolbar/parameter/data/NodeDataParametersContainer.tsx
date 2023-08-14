import React from 'react';
import {IDataNodeData} from "../../../../../../interface";
import {NodeDataCapacityParameters} from "./NodeDataCapacityParameters";
import {NodeDataValueParameter} from "./NodeDataValueParameter";
import {NodeDataStepParameter} from "./NodeDataStepParameter";
import {NodeDataDecimalParameter} from "./NodeDataDecimalParameter";
import {NodeDataRoundingSetupParameter} from "./NodeDataRoundingSetupParameter";

export const NodeDataParametersContainer: React.FC<{
    nodeData: IDataNodeData
}> = ({nodeData}) => {
    return (
        <>
            <NodeDataCapacityParameters nodeData={nodeData}/>
            <NodeDataValueParameter nodeData={nodeData}/>
            <NodeDataStepParameter nodeData={nodeData}/>
            <NodeDataDecimalParameter nodeData={nodeData}/>
            <NodeDataRoundingSetupParameter nodeData={nodeData}/>
        </>
    );
};

