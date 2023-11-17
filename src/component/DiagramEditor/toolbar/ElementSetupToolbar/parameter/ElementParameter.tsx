import React from 'react';
import {Parameter} from "../../../../base";
import {Grid} from "@mui/material";
import {EFontColor} from "../../../../../constant";

export const ElementParameter: React.FC<{
    label: string,
    children: React.ReactNode
}> = ({label, children}) => {
    return (
        <>
            <Grid item xs={2.7}>
                <Parameter.Label sx={{
                    color: EFontColor.lightMarine4,
                    fontSize: 15,
                }}>
                    {label}
                </Parameter.Label>
            </Grid>
            <Grid item xs={5.8}>
                {children}
            </Grid>
        </>
    )
};
