import React from 'react';
import {ElementParameter} from "../ElementParameter";
import {IMicroLoopNodeData} from "../../../../../../interface";
import {Parameter} from "../../../../../base";
import {useGetVariables, useUpdateNode} from "../../../../../../hooks";

export const ForLoopLoopsParameter: React.FC<{
    nodeData: IMicroLoopNodeData
}> = ({nodeData}) => {

    const variables = useGetVariables()

    const {updateNodeData} = useUpdateNode<IMicroLoopNodeData>({
        nodeId: nodeData.id,
    })
    const onLoopCountChange = (loopFormula: string) => {
            updateNodeData({
                loopFormula: loopFormula,
            })
    }
    return (
        <ElementParameter label="Loops">
            <Parameter.IntellisenseInput
                value={nodeData.loopFormula || ''}
                onChange={onLoopCountChange}
                variables={variables}
            />
        </ElementParameter>
    );
};
