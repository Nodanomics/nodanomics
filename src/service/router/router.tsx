import {createBrowserRouter} from "react-router-dom";
import React from "react";
import {
    AuthGoogle,
    LandingPage,
    ForgotPassword,
    LoginPage,
    RegistrationPage,
    VerificationLink,
    DiagramEditorPage,
    AccountPlanPage,
    AccountBillingPage,
    AccountNftPage,
    AccountPage, AccountSettingsPage
} from "../../pages";
import {ELinks} from "./links";
import {ProjectPage} from "../../pages/ProjectPage";


export const appRouter = createBrowserRouter([
    {
        path: ELinks.main,
        element: <LandingPage/>,
        children: [{
            path: ELinks.accountManageData,
            element: <AccountPage/>,
            children: [{
                path: ELinks.accountPlan,
                element: <AccountPlanPage/>
            }, {
                path: ELinks.accountBilling,
                element: <AccountBillingPage/>
            }, {
                path: ELinks.accountNFT,
                element: <AccountNftPage/>
            }, {
                path: ELinks.accountSettings,
                element: <AccountSettingsPage/>
            }]
        },  {
            path: ELinks.dashboard,
            element: <ProjectPage/>
        },]
    }, {
        path: ELinks.register,
        element: <RegistrationPage/>,
    }, {
        path: ELinks.verificationLink,
        element: <VerificationLink/>,
    }, {
        path: ELinks.login,
        element: <LoginPage/>,
    }, {
        path: ELinks.forgotPassword,
        element: <ForgotPassword/>,
    }, {
        path: ELinks.authGoogle,
        element: <AuthGoogle/>,
    }, {
        path: `${ELinks.diagram}/:diagramId`,
        element: <DiagramEditorPage/>
    }, {
        path: `${ELinks.diagram}`,
        element: <DiagramEditorPage/>
    }
]);
