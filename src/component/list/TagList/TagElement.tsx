import React from 'react';
import {Chip} from "@mui/material";

export interface ITagElementProps {
    name: string
    id: string
}

export const TagElement: React.FC<ITagElementProps> = ({name}) => {
    return (
        <Chip

            label={name}
            variant="outlined"
            size="small"
        />
    );
};
