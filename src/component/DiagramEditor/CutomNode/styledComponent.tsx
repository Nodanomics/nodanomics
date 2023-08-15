// eslint-disable-next-line import/named
import {Input, styled, SxProps, Theme, Typography, TypographyProps} from "@mui/material";
import {EFontColor} from "../../../constant";
import React from "react";
// eslint-disable-next-line import/named
import {InputProps} from "@mui/material/Input/Input";

type ITextType = 'text' | 'header' | 'small'

const baseSx: SxProps<Theme> = {
    wordBreak: 'break-all',
    color: EFontColor.grey2,
}

const typeTextStyle: {
    [key in ITextType]: SxProps<Theme>
} = {
    text: {
        fontSize: 10,
        fontWeight: 600,
    },
    header: {
        fontSize: 14,
        fontWeight: 600,
    },
    small: {
        fontSize: 8,
        fontWeight: 400,
        color: EFontColor.grey2,
    }
}

export const NodeTextName: React.FC<{
    children: React.ReactNode,
    type?: ITextType
} & TypographyProps> = (
    {
        children,
        sx,
        type = 'text',
        ...props
    }
) => {

    const typeSx = typeTextStyle[type]
    const outerSx = sx || {}
    const textSx: TypographyProps['sx'] = {
        ...baseSx,
        ...typeSx,
        ...outerSx,
        // color: EFontColor.grey2,
    } as TypographyProps['sx']

    return (<Typography
        sx={textSx}
        {...props}
    >
        {children}
    </Typography>)
}

const NodeTextValue = styled(Typography)(() => ({
    fontSize: 12,
    fontWeight: 600,
    color: EFontColor.white,
}))

const NodeInputTextValue: React.FC<InputProps> = ({sx, ...props}) => {
    return <Input
        sx={{
            // height:' 0.7em',
            '& input': {
                padding: 0,
            },
            padding: 0,
            color: EFontColor.white,
            ...sx,
        }}
        {...props}
    />
}

export const NodeStyle = {
    Name: NodeTextName,
    Value: NodeTextValue,
    Input: NodeInputTextValue,
}
