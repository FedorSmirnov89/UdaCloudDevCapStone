import React from 'react'

import { useAuth0 } from '@auth0/auth0-react'

import { Link } from 'react-router-dom'


const Home = () => {

    const { isAuthenticated } = useAuth0()

    return (
        <div>
            <h1>Home Screen</h1>
            {isAuthenticated ?
                <p>You are logged in. Feel free to continue to the <Link to='/chat'>Chat</Link> or to adjust your <Link to='/profile'>Profile Information</Link>.</p> :
                <p>You are not logged in. Please click the Login Button in the left upper corner.</p>
            }
        </div>


    )

}

export default Home