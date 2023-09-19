import React from 'react';
import {Dialog} from "@headlessui/react";
import {BasePopUp} from "../PopUp";
import {Box} from "@mui/material";
import {EColor} from "../../../constant";
import {CreateDiagramForm} from "../../form";

export const CreateDiagramPopUp: React.FC<{
    isShow: boolean;
    projectId: string;
    onSuccess?: (createdDiagram: {id: string}) => void;
    onClose: () => void;
}> = ({isShow, onClose, projectId, onSuccess}) => {
    const onSuccessHandler = (createdDiagram: {id: string}) => {
        if (onSuccess) {
            onSuccess(createdDiagram)
        }
        onClose()
    }

    return (
        <Dialog open={isShow} onClose={onClose} >
            <BasePopUp>
                <Dialog.Panel>
                    <Box sx={{
                        padding: 3,
                        backgroundColor: EColor.white
                    }}>
                        <CreateDiagramForm
                            projectId={projectId}
                            onSuccess={onSuccessHandler}
                        />
                    </Box>
                </Dialog.Panel>
            </BasePopUp>
        </Dialog>
    );
};
