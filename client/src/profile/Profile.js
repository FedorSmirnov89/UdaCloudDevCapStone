import React from 'react' 
import {useAuth0} from '@auth0/auth0-react'

const Profile = () => {
    const {user} = useAuth0()
    const {name, email, picture} = user

    return (
        <div>
            <div>
                <img src={picture} alt='Profile'/>
            </div>
            <div>
                <h2>{name}</h2>
            </div>
            <div>
                <pre>
                    {JSON.stringify(user, null, 2)}
                </pre>
            </div>
        </div>
    )
}

export default Profile