import React from 'react'
import ReactDom from 'react-dom'


import Auth0ProviderHistory from './auth/auth0-provider-with-history'
import AuthNav from './nav/AuthNav'
import RouteNav from './nav/RouteNav'

import Home from './home/Home'
import ChatRoute from './chat/ChatRoute'
import Profile from './profile/Profile'
import ProtectedRoute from './auth/ProtectedRoute'


import './index.css'

import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom'




const element = <div>
    <AuthNav />
    <RouteNav/>
    <Switch>
        <Route path='/' exact component={Home} />
        <ProtectedRoute path='/profile' component={Profile}/>
        <ProtectedRoute path='/chat' component={ChatRoute}/>
    </Switch>
</div>


ReactDom.render(
    <Router>
        <Auth0ProviderHistory>
            {element}
        </Auth0ProviderHistory>
    </Router>,
    document.getElementById('root')
)