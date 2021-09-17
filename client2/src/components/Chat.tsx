import React from 'react'
import Auth from '../auth/Auth'
import {History} from 'history'
import {apiEndpoint, socketMessages} from '../config'
import { Grid, Header, Input } from 'semantic-ui-react'


interface ChatProps{
    auth: Auth,
    history: History
}

interface ChatState{
    socket: WebSocket
}

export class Chat extends React.PureComponent<ChatProps, ChatState>{

    state: ChatState

    constructor(props: ChatProps){
        super(props)
        this.state = {
            socket: this.configureSocket()
        }

        this.onNickNameUpdate=this.onNickNameUpdate.bind(this)
    }

    onNickNameUpdate(){
        console.log('get profile triggered')
        const getProfileMessage = {
            action: socketMessages.getProfile
        }

        this.state.socket.send(JSON.stringify(getProfileMessage))
    }

    handleNickNameChange(){
        console.log('nickname changing')
    }

    

    renderProfileInformation(){
        return (
            <div>
                <Grid.Row>
                    <Grid.Column width={8}>
                        Your current nickname is bla. You can update it by using the button below.
                    </Grid.Column>
                    <Grid.Column width={8}>
                        <Input
                            action={{
                                color: 'blue',
                                labelPosition: 'right',
                                icon: {undefined},
                                content: 'Update Nickname',
                                onClick: this.onNickNameUpdate
                            }}
                            fluid
                            actionPosition={undefined}
                            placeholder="replace by current nickname"
                            onChange={this.handleNickNameChange}
                        ></Input>
                    </Grid.Column>
                </Grid.Row>
            </div>
        )
    }

    render(){

        return(
            <div>
                <Header as="h1">Chat Application</Header>
                {this.renderProfileInformation()}                
            </div>
            
        )

    }

    componentDidMount(){
       
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

        return socket
    }

}