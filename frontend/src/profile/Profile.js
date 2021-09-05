// React component used to render the profile information:
// profile name, profile picture, and a time stamp of the log in

import React from 'react'
import './Profile.css'

export class Profile extends React.Component{


    render(){
        return(
            <React.Fragment>
                <div className="profile">
                    <div className="profile-picture">Profile Picture</div>
                    <div className="profile-name">Profile Name</div>
                    <div className="profile-login">Login</div>                    
                </div>
            </React.Fragment>
        )
    }
}
