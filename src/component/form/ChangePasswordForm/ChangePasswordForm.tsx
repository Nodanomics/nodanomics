import React, {useEffect} from 'react';
import {z} from "zod";
import {FormPassword} from "../../base/FormInput";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useChangePasswordMutation} from "../../../api";
import {useNavigate} from "react-router-dom";
import {ELinks} from "../../../service/router";

enum EFormFields {
    oldPassword = 'oldPassword',
    newPassword = 'newPassword',
    confirmNewPassword = 'confirmNewPassword',
}

const validationSchema = z.object({
    [EFormFields.oldPassword]: z.string().min(8),
    [EFormFields.newPassword]: z.string().min(8),
    [EFormFields.confirmNewPassword]: z.string().min(8),
}).refine((data) => data[EFormFields.newPassword] === data[EFormFields.confirmNewPassword], {
    path: [EFormFields.confirmNewPassword], // path of error
    message: "Password doesn't match",
});

type IValidationSchema = z.infer<typeof validationSchema>;
export const ChangePasswordForm = () => {
    const navigate = useNavigate();

    const form = useForm<IValidationSchema>({
        resolver: zodResolver(validationSchema),
    });
    const [changePassword, {isSuccess, data}] = useChangePasswordMutation()
    const onSubmit = (formData: IValidationSchema) => {
        changePassword({
            oldPassword: formData[EFormFields.oldPassword],
            newPassword: formData[EFormFields.newPassword],
        })
    }

    useEffect(()=>{
        if(isSuccess){
            navigate(ELinks.login)
        }
    },[isSuccess])

    return (
        <div>
            <form onSubmit={(e) => {
                e.preventDefault()
                form.handleSubmit(onSubmit)();
            }}>
                ChangePasswordForm
                <FormPassword placeholder={'the old password'}  form={form} name={EFormFields.oldPassword}/>
                <FormPassword placeholder={'the new password'} form={form} name={EFormFields.newPassword}/>
                <FormPassword placeholder={'confirm the new password'} form={form} name={EFormFields.confirmNewPassword}/>
                <button
                    type="submit"
                >change password
                </button>
            </form>
        </div>
    );
};
