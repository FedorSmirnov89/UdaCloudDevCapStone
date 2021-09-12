import React from 'react' 


export class Chat extends React.Component{


    render(){
        return (
            <div>
                <h1>Hi {this.props.userName}</h1>
                <p>Your token is {this.props.token}</p>
            </div>
            
        )
    }
}