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

        socket.addEventListener('open', event => {
            console.log('socket open')
            console.log(event)
        })

        this.state.socket = socket
    }

}

