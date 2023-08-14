import React, {useEffect} from 'react';
import {BaseSection} from "./BaseSection";
import {useToggle} from "../../../../../hooks";
import {Grid} from "@mui/material";
import {EConnection, EDiagramNode, EElementType, IDiagramConnectionData, INodeData} from "../../../../../interface";
import {ConnectionFormulaParameter} from "../parameter/ConnectionFormulaParameter";
import {NodeTriggerModeParameter} from "../parameter/NodeTriggerModeParameter";
import {NodeActionParameter} from "../parameter/NodeActionParameter";
import {ConnectionTypeParameter} from "../parameter/ConnectionTypeParameter";
import {NodeTagParameter} from "../parameter/NodeTagParameter";
import {ElementNameParameter} from "../parameter/ElementNameParameter";
import {ConnectionVariableParameter} from "../parameter/ConnectionVariableParameter";
import {DataFieldParameter, DatasetParameter, DatasetReadOnly} from "../parameter";
import {NodeDataCapacityParameters} from "../parameter/NodeDataCapacityParameters";


export const PropertiesSection: React.FC<{
    selectedElementData: INodeData | IDiagramConnectionData
}> = ({selectedElementData}) => {
    const accordionController = useToggle()

    useEffect(() => {
        accordionController.open()
    }, [selectedElementData])

    return (
        <BaseSection
            isOpen={accordionController.isOpened}
            toggle={accordionController.toggle}
            title="Properties"
        >
            <Grid container columns={9} gap={1} sx={{
                maxWidth: '100%',
            }}>

                <ElementNameParameter elementData={selectedElementData}/>
                {selectedElementData.elementType === EElementType.Node &&
                    <NodeTagParameter nodeData={selectedElementData}/>}

                {selectedElementData.elementType === EElementType.Node &&
                selectedElementData.type === EDiagramNode.Data &&
                <NodeDataCapacityParameters nodeData={selectedElementData}/>}

                {'trigger' in selectedElementData && <NodeTriggerModeParameter nodeData={selectedElementData}/>}
                {'actionMode' in selectedElementData && <NodeActionParameter node={selectedElementData}/>}
                {selectedElementData.elementType === EElementType.Node
                    && selectedElementData.type === EDiagramNode.DatasetDatafield
                    && <DatasetParameter nodeData={selectedElementData}/>}
                {selectedElementData.elementType === EElementType.Node
                    && selectedElementData.type === EDiagramNode.DatasetDatafield
                    && <DataFieldParameter nodeData={selectedElementData}/>}
                {selectedElementData.elementType === EElementType.Node
                    && selectedElementData.type === EDiagramNode.DatasetDatafield
                    && <DatasetReadOnly nodeData={selectedElementData}/>}
                {selectedElementData?.type === EConnection.DataConnection &&
                    <ConnectionFormulaParameter connection={selectedElementData}/>}
                {selectedElementData.elementType === EElementType.Connection
                    &&
                    <ConnectionTypeParameter selectedElementData={selectedElementData as IDiagramConnectionData}/>}
                {selectedElementData?.type === EConnection.LogicConnection &&
                    <ConnectionVariableParameter selectedElementData={selectedElementData}/>}
            </Grid>
        </BaseSection>
    );
};
