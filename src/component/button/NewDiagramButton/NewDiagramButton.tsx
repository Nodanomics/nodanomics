import React, {useState} from 'react';
import {Button} from "@mui/material";
import {DiagramManagerPopUp} from "../../popUp/NewDiagramPopUp";
import {EDiagramManagerType} from "../../form";

export const NewDiagramButton = () => {
    const [isCreateDiagramPopUpShow, setIsCreateDiagramPopUpShow] = useState(false)

    const closeNewDiagramPopUp = () => {
        setIsCreateDiagramPopUpShow(false)
    }
    const openNewDiagramPopUp = () => {
        setIsCreateDiagramPopUpShow(true)
    }
    return (
        <>
            <DiagramManagerPopUp type={EDiagramManagerType.new} isShow={isCreateDiagramPopUpShow} onClose={closeNewDiagramPopUp}/>
            <Button onClick={openNewDiagramPopUp}>
                New diagram
            </Button>
        </>
    );
};
