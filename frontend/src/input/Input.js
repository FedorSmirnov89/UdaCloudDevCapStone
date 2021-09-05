// React component for entering new messages

import React from "react";
import './Input.css'

export class Input extends React.Component{


    render(){
        return(   
            <React.Fragment>
                <div className="input">
                    <input className="input-text" type="text" value="Type your message"></input>
                    <button className="input-button">Send</button>
                </div>
            </React.Fragment>         
        )
    }
}