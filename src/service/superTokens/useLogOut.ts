import Session from "supertokens-web-js/recipe/session";
import {useNavigate} from "react-router-dom";
import {ELinks} from "../router";


export const useLogOut = (navigateTo: ELinks | string) => {
    const navigate = useNavigate();

    return async () => {
        await Session.signOut()
        navigate(navigateTo)
    }
}