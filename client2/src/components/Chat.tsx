import React from 'react'
import Auth from '../auth/Auth'
import {History} from 'history'
import {apiEndpoint, socketMessages} from '../config'
import { Grid, Header, Input } from 'semantic-ui-react'
import {UserItem} from '../types/UserItem'


interface ChatProps{
    auth: Auth,
    history: History
}

interface ChatState{
    socket: WebSocket,
    nickName: string,
    imgUrl: string,
    newNickName: string
}



export class Chat extends React.PureComponent<ChatProps, ChatState>{

    state: ChatState

   

    constructor(props: ChatProps){
        super(props)
        this.state = {
            socket: this.configureSocket(),
            nickName: '[retrieving]',
            imgUrl: '[retrieving]',
            newNickName: 'Enter new nickname'
        }

        this.onNickNameUpdate=this.onNickNameUpdate.bind(this)
        this.updateProfileDisplay=this.updateProfileDisplay.bind(this)
        this.requestProfileUpdate=this.requestProfileUpdate.bind(this)
        this.handleNickNameChange=this.handleNickNameChange.bind(this)
    }

    onNickNameUpdate(){
        console.log(`updating the nick name with new nick name: ${this.state.newNickName}`)        
        const request = {
            action: socketMessages.toServer.updateProfile,
            payload: {
                nickName: this.state.newNickName,
                imgUrl: this.state.imgUrl
            }
        }
        this.state.socket.send(JSON.stringify(request))
    }

    handleNickNameChange(event: React.ChangeEvent<HTMLInputElement>){
        this.setState({newNickName: event.target.value})
    }


    requestProfileUpdate(){
        console.log('requesting profile update')
        this.state.socket.send(JSON.stringify({
            action: socketMessages.toServer.getProfile
        }))
    }

    updateProfileDisplay(userInfo: UserItem){
        console.log('updating profile')
        const {nickName, imgUrl} = userInfo
        this.setState({
            nickName: nickName,
            imgUrl: imgUrl
        })
    }

    

    renderProfileInformation(){
        return (
            <div>
                <Grid.Row>
                    <Grid.Column width={8}>
                        Your current nickname is {this.state.nickName}. You can update it by using the button below.
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
                            placeholder={this.state.newNickName}
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
        const socket = new WebSocket(socketQuery)

        // connection handler
        socket.addEventListener('open', event => {
            console.log('socket open')            
            this.requestProfileUpdate()            
        })

        // message handler
        socket.addEventListener('message', event => {
            console.log(`server message received; body: ${event.data}`)            
            this.reactToServerMessage(event.data)
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

    reactToServerMessage(message: string){
        const {action, body} = JSON.parse(message)                
        if (action === socketMessages.fromServer.updateProfile){
            this.updateProfileDisplay(body as UserItem)
        }

    }

    
}