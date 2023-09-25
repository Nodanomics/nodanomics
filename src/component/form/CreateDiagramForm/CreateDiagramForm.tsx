import React, {useEffect} from 'react';
import {Box} from "@mui/material";
import {Text} from "../../base/Text";
import {FormText} from "../../base/FormInput";
import {MButton} from "../../base";
import {z} from "zod";
import {validation} from "../../../utils";
import {useCreateDiagramMutation} from "../../../api";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useAddDiagramLayers} from "../../../hooks";

enum EFormFields {
    diagramName = 'diagramName',
}

const validationSchema = z.object({
    [EFormFields.diagramName]: validation.projectName,
})

type IValidationSchema = z.infer<typeof validationSchema>;

export const CreateDiagramForm: React.FC<{
    onSuccess: (createdDiagram: { id: string }) => void;
    projectId: string;
}> = ({
          onSuccess, projectId
      }) => {

    const {createNewLayer, createdLayer} = useAddDiagramLayers()
    const [createDiagram, {data: resCreateDiagram}] = useCreateDiagramMutation()
    const form = useForm<IValidationSchema>({
        resolver: zodResolver(validationSchema),
    });


    const onSubmit = (data: IValidationSchema) => {
        createDiagram({
            diagramName: data.diagramName,
            projectId,
        })
    }

    useEffect(() => {
        if (createdLayer.isSuccess && resCreateDiagram) {
            onSuccess({id: resCreateDiagram.id})
        }
    }, [createdLayer.isSuccess, resCreateDiagram]);

    useEffect(() => {
        if (resCreateDiagram && resCreateDiagram.id) {
            createNewLayer({
                layerName: 'default',
                diagramId: resCreateDiagram.id,
            })
        }
    }, [resCreateDiagram])
    return (
        <Box
            onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit(onSubmit)();
            }}
            component="form"
        >
            <Text.Label>
                Diagram Name
            </Text.Label>
            <FormText name={EFormFields.diagramName} form={form}/>
            <MButton.Submit type="submit">
                Create diagram
            </MButton.Submit>
        </Box>
    );
};
