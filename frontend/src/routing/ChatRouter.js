
import React from 'react'


export class ChatRouter extends React.Component {




    render() {

        return (
            <div>
                <p>Hello, I am a router</p>
                <p>You are {this.props.authInfo.isAuthenticated ? 'Logged in' : 'Not logged in'}</p>
            </div>

        )

    }

}
