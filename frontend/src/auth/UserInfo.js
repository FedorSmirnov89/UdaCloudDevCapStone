import { useAuth0 } from "@auth0/auth0-react";
import {ChatRouter} from '../routing/ChatRouter'


export function UserInfo () {

    //const { isAuthenticated } = useAuth0()

    return true ? (
        <h1>Yes</h1>
    ) : (
        <h1>No</h1>
    )

    /* const { user, isAuthenticated, context } = useAuth0()

    const authInfo = {
        user: user,
        isAuthenticated: isAuthenticated,
        context: context
    }

    return <ChatRouter authInfo={authInfo} ></ChatRouter> */

}