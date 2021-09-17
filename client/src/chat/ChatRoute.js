import React, {useEffect, useState} from 'react' 

import {useAuth0} from '@auth0/auth0-react'
import {Chat} from './Chat'
import {configs} from '../configs'

const ChatRoute = () => {

    const {user, getAccessTokenSilently} = useAuth0()

    const [socket, setSocket] = useState(configureSocket)
    const [accessToken, setAccessToken] = useState(null)
    
    useEffect(
        () => {


            const getAcToken = async() => {
                const domain = configs.auth0.domain

                try{
                const acToken = await getAccessTokenSilently({
                    audience: `https://${domain}/api/v2/`,
                    scope: "read:current_user"
                })

                console.log(`Access token ${acToken}`)
                }catch(e){
                    console.log(`Error message ${e.message}`)
                }
            }

            getAcToken()
        }
    )

    return (
        <Chat userName={user.name} />
    )

}





const configureSocket = () => {
        const socketQuery = `${configs.backend.address}?Auth=token`
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

        return socket
}


export default ChatRoute