import React from 'react';
import {MSelect} from "../../../../../base";
import {ElementParameter} from "../ElementParameter";
// eslint-disable-next-line import/named
import {SelectChangeEvent} from "@mui/material/Select/SelectInput";
import {IDatasetDatafield} from "../../../../../../interface";
import {useUpdateNode} from "../../../../../../hooks";
import {useDiagramEditorState} from "../../../../../../redux";

export const DatasetParameter: React.FC<{
    nodeData: IDatasetDatafield
}> = ({nodeData}) => {
    const {currentDiagramId, spreadsheets} = useDiagramEditorState()
    // const projectDatasets = useProjectDatasets({
    //     diagramId: currentDiagramId,
    // })
    const {updateNodeData} = useUpdateNode<IDatasetDatafield>({
        nodeId: nodeData.id,
    })

    const mappedProjectDatasets = spreadsheets ? Object.entries(spreadsheets).map(([key, value]) => ({
        value: key,
        label: value.name,
    })) : []


    // const mappedProjectDatasets = projectDatasets?.data.map((projectDataset) => ({
    //     value: projectDataset.id,
    //     label: projectDataset.name,
    // })) || []


    const changeDataset = (event: SelectChangeEvent) => {
        updateNodeData({
            datasetId: event.target.value,
        })
    }

    return (
        <ElementParameter label="Dataset">
            <MSelect.Parameters
                currentValue={nodeData.datasetId || ''}
                onChange={changeDataset}
                values={mappedProjectDatasets}
            />
        </ElementParameter>
    );
};
