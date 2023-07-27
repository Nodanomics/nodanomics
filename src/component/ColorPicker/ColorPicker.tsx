import React from 'react';
import {Box, Button, Popover} from "@mui/material";
import {HexColorPicker} from "react-colorful";
import {EColor} from "../../constant";

export const ColorPicker: React.FC<{
    onChange?: (newColor: string) => void
    value?: string
}> = ({
          onChange,
          value,
      }) => {

    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'ColorPicker' : undefined;
    return (
        <Box>
            <Box
                sx={{
                    width: '100%',
                    height: '100%',
                    minHeight: 30,
                    flex: 1,
                    borderColor: EColor.grey2,
                    borderWidth: 3,
                    borderRadius: 0,
                    borderStyle: 'solid',
                    padding: 0,
                }}
                style={{
                    backgroundColor: value,
                }}
                onClick={handleClick}
                component={Button}
            >
                <Box
                    sx={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: value,
                    }}
                />
            </Box>

            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <HexColorPicker
                    color={value}
                    onChange={onChange}
                />
            </Popover>
        </Box>
    );
};
