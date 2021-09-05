// React component to visualize the messages
// currently visible to the user

import React from "react";
import './Messages.css'

export class Messages extends React.Component{
    

    render(){
        return(
            <React.Fragment>
                <div className="messages">
                    <div className="their-message">Their name  Their message</div>
                    <div className="my-message">My message My name</div>
                </div>
            </React.Fragment>
        )
    }
}