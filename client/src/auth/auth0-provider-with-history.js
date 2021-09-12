import React from 'react' 
import {useHistory} from 'react-router-dom'
import {Auth0Provider} from '@auth0/auth0-react'

import {configs} from '../configs'

const Auth0ProviderHistory = ({children}) => {

    const domain = configs.auth0.domain
    const clientId = configs.auth0.clientId
    const history = useHistory()

    const onRedirectCallBack = (appState) => {
        history.push(appState?.returnTo || window.location.pathname)
    }

    return (
        <Auth0Provider
            domain = {domain}
            clientId = {clientId}
            redirectUri={window.location.origin}
            onRedirectCallback={onRedirectCallBack}
        >
            {children}
        </Auth0Provider>
    )
}

export default Auth0ProviderHistory