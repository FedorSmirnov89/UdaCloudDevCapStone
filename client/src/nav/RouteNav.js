import React from 'react' 

import {Link} from 'react-router-dom'


const RouteNav = () => {

    return (
        <ul>
            <li><Link to='/'>Home</Link></li>
            <li><Link to='/profile'>Profile</Link></li>
            <li><Link to='/chat'>Chat</Link></li>
        </ul>
    )

}

export default RouteNav