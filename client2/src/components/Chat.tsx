import React from 'react'
import Auth from '../auth/Auth'
import {History} from 'history'
import {apiEndpoint} from '../config'


interface ChatProps{
    auth: Auth,
    history: History
}

interface ChatState{
    socket: WebSocket
}

export class Chat extends React.PureComponent<ChatProps, ChatState>{

    render(){

        return(
            <div>
                <p>Hello, this is the home screen</p>
                <p>Your id token is {this.props.auth.idToken}</p>
                <p>Your access token is {this.props.auth.accessToken}</p>
            </div>
            
        )

    }

    componentDidMount(){
        this.configureSocket()
    }

    componentWillUnmount(){
        this.state.socket.close()
    }

    configureSocket = () => {
        const socketQuery = `${apiEndpoint}?Auth=${this.props.auth.idToken}`
        console.log(socketQuery)
        const socket = new WebSocket(socketQuery)

        // connection handler
        socket.addEventListener('open', event => {
            console.log('socket open')
            console.log(event)

            socket.send('hello there')
        })

        // message handler
        socket.addEventListener('message', event => {
            console.log('server message received')
            console.log(`the response was ${event.data}`)
        })

        socket.addEventListener('error', event => {
            console.log('error from server socket')
            console.log(event)
        })

        socket.addEventListener('close', event => {
            console.log('connection closed by server')
            console.log(event)
        })

        this.setState({socket: socket})
    }

}