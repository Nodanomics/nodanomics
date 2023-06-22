// eslint-disable-next-line import/named
import {BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError} from '@reduxjs/toolkit/query/react'
import {
    emailPasswordSignIn,
    emailPasswordSignUp,
    sendPasswordResetEmail,
    submitNewPassword
} from "supertokens-web-js/recipe/thirdpartyemailpassword";
import {
    ILoginEmailPasswordRequest,
    ISendEmailToResetPasswordRequest,
    ISignUpRequest,
    ISubmitNewPasswordRequest
} from "../interface";

const baseQuery = fetchBaseQuery(({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers) => {
        const accessToken = localStorage.getItem("accessToken")
        if (accessToken) {
            headers.set('Authorization', `Bearer ${accessToken}`)
        }
        return headers
    },
}))

const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions)
    if (result.error && result.error.status === 401) {
        const refreshToken = localStorage.getItem('refreshToken')
        if (!refreshToken) {
            //   api.dispatch(logout())
        }
        const {data} = await baseQuery({
            url: '/auth/token/refresh',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${refreshToken}`,
            },
        }, api, extraOptions)
        // api.dispatch(saveTokens(data))
    }

    return result
}

export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        signUpEmailPassword: (builder.mutation({
            queryFn: async (params: ISignUpRequest) => {
                const formattedParams = Object.entries(params).map(([key, value]) => ({
                    id: key,
                    value
                }))
                try {
                    const response = await emailPasswordSignUp({
                        formFields: formattedParams
                    })
                    if (response.status === "FIELD_ERROR") {
                        console.log(response.formFields)
                        console.log(response)
                        return {
                            error: {
                                status: 400,
                                data: {
                                    formFields: response.formFields,
                                    status: response.status,
                                }
                            }
                        }
                    }
                    return {data: response.user};
                } catch (e) {
                    console.log(e)
                    return {
                        error: {
                            status: 400,
                            data: 'Unexpected error'
                        }
                    };
                }
            },
        })),
        loginEmailPassword: builder.mutation({
            queryFn: async (params: ILoginEmailPasswordRequest) => {
                const response = await emailPasswordSignIn({
                    formFields: [{
                        id: "email",
                        value: params.email
                    }, {
                        id: "password",
                        value: params.password
                    }]
                })
                if (response.status === "FIELD_ERROR") {
                    return {
                        error: {
                            status: 400,
                            data: {
                                formFields: response.formFields,
                                status: response.status,
                            }
                        }
                    }
                }
                if (response.status === "WRONG_CREDENTIALS_ERROR") {
                    return {
                        error: {
                            status: 400,
                            error: 'Wrong credentials',
                        }
                    }
                }

                return {data: response.status};
            }
        }),
        sendEmailToResetPassword: builder.mutation({
            queryFn: async (params: ISendEmailToResetPasswordRequest) => {
                const response = await sendPasswordResetEmail({
                    formFields: [{
                        id: "email",
                        value: params.email
                    }]
                });
                return {data: response.status}
            }
        }),
        submitNewPassword: builder.mutation({
            queryFn: async (params: ISubmitNewPasswordRequest) => {
                const response = await submitNewPassword({
                    formFields: [{
                        id: "password",
                        value: params.password
                    }]
                })
                if (response.status === "FIELD_ERROR") {
                    return {
                        error: {
                            status: 400,
                            data: {
                                formFields: response.formFields,
                                status: response.status,
                            }
                        }
                    }
                }
                return {data: response.status}
            }
        }),
    }),
})

export const {
    useSignUpEmailPasswordMutation,
    useLoginEmailPasswordMutation,
    useSendEmailToResetPasswordMutation,
    useSubmitNewPasswordMutation
} = baseApi;

