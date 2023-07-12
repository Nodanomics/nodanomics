import React from 'react';
import {Box, Typography, Input} from "@mui/material";
import {EColor, EFontColor} from "../../../../constant";
import {EDiagramNode, EElementType} from "../../../../interface";
import {useCurrentEditElement, useUpdateElement} from "../../../../hooks";
import {ParameterContainer, ParameterLabel, SectionTitle} from "./styledComponents";
import {ElementSetupToolbarStyleSection} from "./ElementSetupToolbarStyleSection";


export const ElementSetupToolbar = () => {
    const selectedElementData = useCurrentEditElement()?.data
    const {updateNodeData, updateEdgeData} = useUpdateElement({
        elementType: selectedElementData?.elementType,
        elementId: selectedElementData?.id,
    })


    const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (selectedElementData?.elementType === EElementType.Node) {
            updateNodeData({
                type: EDiagramNode.Variable,
                name: event.target.value,
            })
        } else if (selectedElementData?.elementType === EElementType.Connection) {
            updateEdgeData({
                name: event.target.value,
            })
        }
    }


    return (
        <Box
            sx={{
                pointerEvents: 'auto',
                borderColor: EColor.grey2,
                borderStyle: 'solid',
                borderWidth: '1px',
                px: 2,
                py: 1,
                width: 250,
                backgroundColor: EColor.white,
            }}
        >
            <Typography sx={{
                color: EFontColor.grey4,
            }}>
                {selectedElementData?.type}
            </Typography>
            <SectionTitle>
                Function
            </SectionTitle>
            {selectedElementData && <ParameterContainer>
                <ParameterLabel>
                    Name
                </ParameterLabel>
                <Input
                    value={selectedElementData?.name || ''}
                    onChange={onNameChange}
                    type="text"
                    sx={{
                        color: EFontColor.grey4,
                        width: '100%',
                    }}/>
            </ParameterContainer>}
            {selectedElementData && <ElementSetupToolbarStyleSection element={selectedElementData}/>}
        </Box>
    );
};
