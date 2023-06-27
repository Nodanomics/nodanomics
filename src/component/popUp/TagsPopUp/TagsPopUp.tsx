import React from 'react';
import {BasePopUp} from "../PopUp";
import {Dialog} from "@headlessui/react";
import {ITagsInputProps} from "../../input";
import {FormAddTags} from "../../form";

export const TagsPopUp: React.FC<{
    isShow: boolean;
    onClose: () => void;
    tagsInput: ITagsInputProps
}> = ({tagsInput, onClose, isShow}) => {
    console.log('TagsPopUp')
    return (
        <Dialog open={isShow} onClose={onClose}>
            <BasePopUp>
                <Dialog.Panel>
                    <div style={{
                        padding: '40px',
                        backgroundColor: 'white',
                        borderRadius: 8,
                    }}>
                        <FormAddTags {...tagsInput}/>
                    </div>
                </Dialog.Panel>
            </BasePopUp>
        </Dialog>
    );
};
