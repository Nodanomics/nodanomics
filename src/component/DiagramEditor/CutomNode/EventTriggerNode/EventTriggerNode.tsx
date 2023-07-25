import React from 'react';
import {Box, Input, Typography} from "@mui/material";
import {EColor, EFontColor} from "../../../../constant";
// eslint-disable-next-line import/named
import {Handle, NodeProps, Position} from "reactflow";
import {EConnection, IEventTriggerNodeData} from "../../../../interface";
import {useUpdateNode} from "../../../../hooks";

export const EventTriggerNode: React.FC<NodeProps<IEventTriggerNodeData>> = ({isConnectable, data}) => {


    const {updateNodeData} = useUpdateNode({
        nodeId: data.id,
    })

    const onEventNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateNodeData({
            eventName: event.target.value,
        })
    }

    const onConditionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateNodeData({
            eventCondition: event.target.value,
        })
    }

    return (
        <Box
            sx={{
                width: 200,
                padding: 1,
                borderRadius: 2,
                backgroundColor: EColor.black,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
            }}
        >
            <Handle
                type="target"
                position={Position.Left}
                isConnectable={isConnectable}
                id={EConnection.LogicConnection}
                style={{
                    background: EColor.darkRed,
                }}
            />
            <Input
                onChange={onEventNameChange}
                placeholder="Insert event name"
                value={data.eventName || ''}
                size="small"
                sx={{
                    color: EFontColor.white,
                }}/>
            <Input
                onChange={onConditionChange}
                placeholder="Condition"
                value={data.eventCondition || ''}
                size="small"
                sx={{
                    color: EFontColor.white,
                }}/>
            <Box sx={{
                color: EFontColor.white,
                display: 'flex',
            }}>
                vars: {data.variables?.map((variable, index) => (
                <Typography
                    sx={{
                        color: EFontColor.white,
                    }}
                    key={index}>
                    {variable.variableName} = {variable.value}
                </Typography>
            ))}
            </Box>
        </Box>
    )
}
