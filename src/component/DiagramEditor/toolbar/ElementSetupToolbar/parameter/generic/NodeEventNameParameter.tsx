import React from 'react';
import {IEventListenerNodeData, IEventTriggerNodeData} from "../../../../../../interface";
import {ElementParameter} from "../ElementParameter";
import {Parameter} from "../../styledComponents";
import {useUpdateNode} from "../../../../../../hooks";

export const NodeEventNameParameter: React.FC<{
    nodeData: IEventTriggerNodeData | IEventListenerNodeData
}> = ({nodeData}) => {

    const {updateNodeData} = useUpdateNode<IEventTriggerNodeData>({
        nodeId: nodeData.id,
    })

    const onChangeEventName = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateNodeData({
            eventName: event.target.value,
        })
    }


    return (
        <ElementParameter label="Event Name">
            <Parameter.Input
                value={nodeData.eventName || ''}
                onChange={onChangeEventName}
            />

        </ElementParameter>
    )
}
