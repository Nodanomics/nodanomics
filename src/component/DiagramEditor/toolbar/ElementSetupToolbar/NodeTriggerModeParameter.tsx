import React from 'react';
// eslint-disable-next-line import/named
import {SelectChangeEvent} from "@mui/material/Select/SelectInput";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {ParameterContainer, ParameterLabel} from "./styledComponents";
import {EFontColor} from "../../../../constant";
import {ENodeTrigger} from "../../../../interface";
import {useCurrentEditElement, useUpdateElement} from "../../../../hooks";

const nodeTriggerModes = Object.keys(ENodeTrigger)

export const NodeTriggerModeParameter = () => {

    const selectedElementData = useCurrentEditElement()?.data

    if (selectedElementData && !('triggerMode' in selectedElementData)) {
        throw new Error(`no triggerMode in selectedElementData ${JSON.stringify(selectedElementData)}`)
    }
    const {updateNodeData} = useUpdateElement({
        elementType: selectedElementData?.elementType,
        elementId: selectedElementData?.id,
    })
    const changeNodeTriggerMode = (event: SelectChangeEvent) => {
        updateNodeData({
            triggerMode: event.target.value as ENodeTrigger,
        })
    }

    return (
        <>
            {
                selectedElementData &&
                <ParameterContainer>
                    <ParameterLabel>
                        Trigger
                    </ParameterLabel>
                    <FormControl
                        sx={{
                            color: EFontColor.grey4,
                        }}
                        fullWidth
                        size="small"
                    >
                        <InputLabel
                            sx={{
                                color: EFontColor.grey4,
                            }}
                        />
                        <Select
                            value={selectedElementData.triggerMode}
                            onChange={changeNodeTriggerMode}
                            sx={{
                                color: EFontColor.grey4,
                            }}
                        >
                            {nodeTriggerModes.map((mode) => (
                                <MenuItem
                                    key={mode}
                                    value={mode}
                                    sx={{
                                        color: EFontColor.grey4,
                                    }}
                                >
                                    {mode}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </ParameterContainer>
            }
        </>
    );
};
