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
    AccountPage, AccountSettingsPage, TeamPage, ProjectDiagramsPage
} from "../../pages";
import {ELinks} from "./links";
import {ProjectPage} from "../../pages/ProjectPage";
import {ProtectedRoute} from "./ProtectedRoute";


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
            path: ELinks.project,
            element: <ProjectPage/>,
        },{
            path: `${ELinks.project}/:projectId`,
            element: <ProjectDiagramsPage/>,
        },{
            path: ELinks.team,
            element: <TeamPage/>
        }]
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
        path: ELinks.diagram,
        element: <DiagramEditorPage/>
    },{
        path: `${ELinks.diagram}/:diagramId`,
        element: (
            <ProtectedRoute>
                <DiagramEditorPage/>
            </ProtectedRoute>
        )
    }
]);
