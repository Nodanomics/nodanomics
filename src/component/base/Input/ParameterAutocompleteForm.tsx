import React from 'react';
import type {InputProps} from "@mui/material/Input/Input";
import {FormBaseInput, IFormBaseInputProps} from "../FormInput";
import {IParameterAutocompleteProps, ParameterAutocomplete} from "./ParameterAutocomplete";
import {isFromInputValueEqual} from "../../../service";

const ParameterAutocompleteFormInner: React.FC<InputProps & IFormBaseInputProps & IParameterAutocompleteProps> = (
    {
        form,
        name,
        ...props
    }) => {
    return (
        <FormBaseInput
            form={form}
            name={name}
            Input={(formProps) => {
                return <ParameterAutocomplete onChange={formProps.onChange} value={formProps.value} {...props} />
            }}
        />
    );
};

export const ParameterAutocompleteForm = React.memo(ParameterAutocompleteFormInner, isFromInputValueEqual);
