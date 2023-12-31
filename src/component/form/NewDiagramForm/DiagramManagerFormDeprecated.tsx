import React, {useEffect, useState} from 'react';
import {z} from "zod";
import {validation} from "../../../utils";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {FormText} from "../../base/FormInput";
import {Box, Button} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useAppDispatch, useDiagramEditorState} from "../../../redux";


export enum EDiagramManagerType {
    new = 'new',
    rename = 'rename',
    makeACopy = 'makeACopy',
}

enum EFormFields {
    diagramName = 'diagramName',
    diagramDescription = 'diagramDescription',
    diagramTags = 'diagramTags',
}

const validationSchema = z.object({
    [EFormFields.diagramName]: validation.diagramName,
    [EFormFields.diagramDescription]: validation.diagramDescription,
    [EFormFields.diagramTags]: validation.diagramTags,
})

type IValidationSchema = z.infer<typeof validationSchema>;

export const DiagramManagerFormDeprecated: React.FC<{
    onSave: () => void;
    type: EDiagramManagerType
}> = ({onSave, type}) => {
    const diagramState = useDiagramEditorState()


    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [isTagsPopUpShow, setTagsPopUpShow] = useState(false)

    const form = useForm<IValidationSchema>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            [EFormFields.diagramTags]: []
        }
    });

    useEffect(() => {
        if (type === EDiagramManagerType.rename) {
            form.reset({
                [EFormFields.diagramName]: diagramState.name,
                [EFormFields.diagramDescription]: diagramState.description,
                // [EFormFields.diagramTags]: diagramState.diagramTags,
            })
        } else if (type === EDiagramManagerType.makeACopy) {
            form.reset({
                [EFormFields.diagramName]: `Copy of ${diagramState.name}`,
                [EFormFields.diagramDescription]: diagramState.description,
                // [EFormFields.diagramTags]: diagramState.diagramTags,
            })
        }
    }, [diagramState])

    //
    // useEffect(() => {
    //     if (resCreateDiagram && resCreateDiagram !== null) {
    //         // dispatch(diagramEditorActions.setCurrentDiagram({
    //         //     diagramId: resCreateDiagram.id,
    //         //     name: resCreateDiagram.name,
    //         //     description: resCreateDiagram.description,
    //         // }))
    //         // navigate(`${ELinks.diagram}/${resCreateDiagram.id}`, {replace: true})
    //     }
    // }, [resCreateDiagram])
    //
    //
    // const onCreateNewDiagram = async (data: IValidationSchema) => {
    //     // await createDiagram({
    //     //     diagramName: data.diagramName,
    //     //     diagramDescription: data.diagramDescription,
    //     //     diagramTags: data.diagramTags,
    //     // })
    // }
    //
    // useEffect(() => {
    //     if (resUpdateDiagram) {
    //         dispatch(diagramEditorActions.setCurrentDiagram({
    //             diagramId: resUpdateDiagram.id,
    //             // name: resUpdateDiagram.name,
    //             // description: resUpdateDiagram.description,
    //         }))
    //     }
    // }, [resUpdateDiagram])
    //
    // const onRenameDiagram = async (data: IValidationSchema) => {
    //
    //     if (diagramState.currentDiagramId) {
    //         await updateDiagram({
    //             diagramId: diagramState.currentDiagramId,
    //             diagramName: data.diagramName,
    //             diagramDescription: data.diagramDescription,
    //             diagramTags: data.diagramTags,
    //             // diagramDescription: data.diagramDescription,
    //         })
    //     }
    // }

    const onSubmit = async (data: IValidationSchema) => {
        // if (type === EDiagramManagerType.new || type === EDiagramManagerType.makeACopy) {
        //     await onCreateNewDiagram(data)
        // } else if (type === EDiagramManagerType.rename) {
        //     await onRenameDiagram(data)
        // }
        // onSave()
    }

    const closeTagsPopUp = () => {
        setTagsPopUpShow(false)
    }


    return (
        <Box
            style={{
                width: '400px'

            }}
        >
            Deprecated
            <form onSubmit={(e) => {
                e.preventDefault()
                form.handleSubmit(onSubmit)();
            }}>
                <FormText label={'Name'} name={EFormFields.diagramName} form={form}/>
                {/*<FormTextArea label={'Description'} name={EFormFields.diagramDescription} form={form}/>*/}
                <Box>
                    {/*<Box sx={{*/}
                    {/*    display: "flex"*/}
                    {/*}}>*/}

                    {/*    <TagsPopUp*/}
                    {/*        isShow={isTagsPopUpShow}*/}
                    {/*        onClose={closeTagsPopUp}*/}
                    {/*        tagsForm={{*/}
                    {/*            form: form,*/}
                    {/*            name: EFormFields.diagramTags,*/}
                    {/*            onSave: closeTagsPopUp,*/}
                    {/*            allTags: [],*/}
                    {/*        }}*/}
                    {/*    />*/}


                        {/*<Button onClick={() => {*/}
                        {/*    setTagsPopUpShow(true)*/}
                        {/*}}>*/}
                        {/*    <Typography>*/}
                        {/*        Tags:*/}
                        {/*    </Typography>*/}
                        {/*    <AddIcon color='info'/>*/}
                        {/*</Button>*/}
                    {/*</Box>*/}
                </Box>
                <Button
                    variant="contained" type='submit'>
                    Save
                </Button>
            </form>
        </Box>
    );
};
