import React, {useCallback, useState} from 'react';
import {Menu, MenuItem} from "@mui/material";
import {useSimplePopUpManager} from "../../../hooks/useSimplePopUpManager";
import {DiagramManagerPopUp} from "../../popUp/NewDiagramPopUp";
import {EDiagramManagerType} from "../../form";
import {useNavigate} from "react-router-dom";
import {ELinks} from "../../../service/router";

export const DiagramEditorDropDownMenuContent: React.FC<{
    anchorEl: HTMLElement | null
    close: () => void
}> = ({
          anchorEl,
          close
      }) => {
    const navigate = useNavigate()

    const [diagramManagerType, setDiagramManagerType] = useState<EDiagramManagerType>(EDiagramManagerType.new)
    const {
        openPopUp: openManagerDiagramPopUp,
        closePopUp: closeManagerDiagramPopUp,
        isPopUpShow: isManagerDiagramPopUpShow
    } = useSimplePopUpManager()

    const onNewDiagram = () => {
        setDiagramManagerType(EDiagramManagerType.new)
        openManagerDiagramPopUp()
    }

    const onRenameDiagram = () => {
        setDiagramManagerType(EDiagramManagerType.rename)
        openManagerDiagramPopUp()
    }

    const onCloseManagerDiagramPopUp = useCallback(() => {
        closeManagerDiagramPopUp()
    }, [])

    const onCopyDiagram = () => {
        setDiagramManagerType(EDiagramManagerType.makeACopy)
        openManagerDiagramPopUp()
    }

    const onOpen = () => {
        navigate(ELinks.dashboard)
    }

    const buttons: {
        name: string
        onClick: () => void
    }[] = [{
        name: 'New',
        onClick: onNewDiagram
    }, {
        name: 'Open',
        onClick: onOpen
    }, {
        name: 'Save-',
        onClick: () => {
        }
    }, {
        name: 'Rename',
        onClick: onRenameDiagram
    }, {
        name: 'Make a copy',
        onClick: onCopyDiagram
    }]

    return (
        <Menu
            sx={{mt: '25px'}}
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={close}
        >
            <DiagramManagerPopUp type={diagramManagerType} isShow={isManagerDiagramPopUpShow}
                                 onClose={onCloseManagerDiagramPopUp}/>

            {buttons.map((button) => (<MenuItem
                onClick={button.onClick}
                key={button.name}
            >{button.name}</MenuItem>))}
        </Menu>
    );
};
