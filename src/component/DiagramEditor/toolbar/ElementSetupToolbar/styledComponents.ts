import {Box, styled, Typography} from "@mui/material";
import {EColor, EFontColor} from "../../../../constant";

export const ElementSetupToolbarSectionTitle = styled(Typography)({
    display: 'block',
    backgroundColor: EColor.grey1,
    paddingLeft: 1,
    padding: '4px',
    color: EFontColor.grey4,
    fontWeight: 'bold',
    borderColor: EColor.grey2,
    borderStyle: 'solid',
    borderWidth: '1px',
    marginBottom: 16,
})

export const ParameterLabel = styled(Typography)({
    color: EFontColor.grey4,
})

export const ParameterContainer = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    gap: 16,
})

export const ParameterText = styled(Typography)({
    color: EFontColor.grey4,
    fontWeight: 'bold',
})

export const Parameter = {
    Container: ParameterContainer,
    Label: ParameterLabel,
    Text: ParameterText,
}
