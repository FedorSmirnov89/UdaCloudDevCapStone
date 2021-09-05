// Component containing the whole chat application

import React from "react"

import {Profile} from './profile/Profile'
import {Messages} from './messages/Messages'
import {Input} from './input/Input'

import './Configs'
import { BACKEND } from "./Configs"



export class Chat extends React.Component{

    state = {
        socket: null,
        token: null
    }


    componentDidMount(){
        this.configureSocket()
    }


    render(){
        return (
            <React.Fragment>
                <div className="chat">
                    <Profile></Profile>
                    <hr></hr>
                    <Messages></Messages>
                    <hr></hr>
                    <Input></Input>
                </div>
            </React.Fragment>
        )
    }


    configureSocket = () => {
        const socket = new WebSocket(BACKEND)

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

        this.state.socket = socket
    }

}

