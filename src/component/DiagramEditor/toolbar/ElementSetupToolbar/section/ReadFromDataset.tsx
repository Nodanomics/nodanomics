import React, {useEffect} from 'react';
import {Grid} from "@mui/material";
import {IDatasetReader, IDiagramNodeBaseData} from "../../../../../interface";
import {useToggle} from "../../../../../hooks";
import {BaseSection} from "./BaseSection";
import {FieldToSetDatasetReadCoordinates, SelectDatasetToRead} from "../parameter/datasetReader";

export const ReadFromDataset: React.FC<{
    nodeData: IDiagramNodeBaseData & IDatasetReader
}> = ({nodeData}) => {

    const accordionController = useToggle()

    useEffect(() => {
        accordionController.open()
    }, [nodeData])

    return (
        <BaseSection
            isOpen={accordionController.isOpened}
            toggle={accordionController.toggle}
            title="Read From dataset">
            <Grid container columns={9} gap={1}>
                <SelectDatasetToRead nodeData={nodeData}/>
                <FieldToSetDatasetReadCoordinates nodeData={nodeData}/>
            </Grid>
        </BaseSection>
    );
};
