import React, {useEffect} from 'react';
import {Grid} from "@mui/material";
import {IDatasetRecorder, IDiagramNodeBaseData} from "../../../../../interface";
import {useToggle} from "../../../../../hooks";
import {BaseSection} from "./BaseSection";
import {NodeDatasetFieldToRecordCoordinates, NodeDatasetFieldToRecordSelectDataset} from "../parameter/datasetRecorder";

export const RecordToDataset: React.FC<{
    nodeData: IDiagramNodeBaseData & IDatasetRecorder
}> = ({nodeData}) => {

    const accordionController = useToggle()

    useEffect(() => {
        accordionController.open()
    }, [nodeData])

    return (
        <BaseSection
            isOpen={accordionController.isOpened}
            toggle={accordionController.toggle}
            title="Record to dataset">
            <Grid container columns={9} gap={1}>
                <NodeDatasetFieldToRecordSelectDataset nodeData={nodeData}/>
                <NodeDatasetFieldToRecordCoordinates nodeData={nodeData}/>
            </Grid>
        </BaseSection>
    );
};
