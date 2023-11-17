import React, {useMemo} from 'react';
import {ElementParameter} from "../ElementParameter";
import {MSelect} from "../../../../../base";
import type {SelectChangeEvent} from "@mui/material/Select/SelectInput";
import {useUpdateNode} from "../../../../../../hooks";
import {EDiagramNode, IDatasetReader, IDatasetRecorder, IDiagramNodeBaseData} from "../../../../../../interface";
import {useDiagramEditorState} from "../../../../../../redux";

export const SelectDatasetToRead: React.FC<{
    nodeData: IDiagramNodeBaseData & IDatasetReader
}> = ({nodeData}) => {
    const {diagramNodes} = useDiagramEditorState()

    const {updateNodeData} = useUpdateNode<IDiagramNodeBaseData & IDatasetRecorder>({
        nodeId: nodeData.id,
    })

    const mappedProjectDatasets = useMemo(() => {
        const options: {
            value: string,
            label: string
        }[] = []
        diagramNodes.forEach((node) => {
            if (node.type === EDiagramNode.DatasetDatafield && node.data.tag) {
                options.push({
                    value: node.id,
                    label: node.data.tag,
                })
            }
        })
        return options
    }, [diagramNodes])


    const changeDataset = (event: SelectChangeEvent) => {
        const datasetNode = diagramNodes.find((node) => node.id === event.target.value)
        if(datasetNode && datasetNode.data.tag){
            updateNodeData({
                datasetToReadId: event.target.value,
                datasetToReadTag: datasetNode.data.tag,
            })
        }
    }

    return (
        <ElementParameter label="Dataset">
            <MSelect.Parameters
                currentValue={nodeData.datasetToReadId || ''}
                onChange={changeDataset}
                values={mappedProjectDatasets}
            />
        </ElementParameter>
    );
};

