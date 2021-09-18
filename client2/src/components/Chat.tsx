import React from 'react'
import Auth from '../auth/Auth'
import { History } from 'history'
import { apiEndpoint, socketMessages, getImageUrlForId } from '../config'
import { Grid, Header, Input, Form, Button } from 'semantic-ui-react'
import { UserItem } from '../types/UserItem'
import Axios from 'axios'

import './Chat.css'

import noProfile from './noProfile.png'


interface ChatProps {
    auth: Auth,
    history: History
}

interface ChatState {
    socket: WebSocket,
    nickName: string,
    imgUrl: string,
    newNickName: string,
    file: any,
    newMessage: string
}



export class Chat extends React.PureComponent<ChatProps, ChatState>{

    state: ChatState



    constructor(props: ChatProps) {
        super(props)
        this.state = {
            socket: this.configureSocket(),
            nickName: '[retrieving]',
            imgUrl: '[retrieving]',
            newNickName: 'Enter new nickname',
            file: undefined,
            newMessage: ''
        }

        this.onNickNameUpdate = this.onNickNameUpdate.bind(this)
        this.updateProfileDisplay = this.updateProfileDisplay.bind(this)
        this.requestProfileUpdate = this.requestProfileUpdate.bind(this)
        this.handleNickNameChange = this.handleNickNameChange.bind(this)
        this.handleMessageChange = this.handleMessageChange.bind(this)
        this.renderProfileImage = this.renderProfileImage.bind(this)
        this.getUploadUrl = this.getUploadUrl.bind(this)
        this.handleFileChange = this.handleFileChange.bind(this)
        this.getUploadUrl = this.getUploadUrl.bind(this)
        this.handleImageSubmit = this.handleImageSubmit.bind(this)
        this.onMessageSend = this.onMessageSend.bind(this)
    }

    onNickNameUpdate() {
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

    onMessageSend() {
        console.log(`sending the message ${this.state.newMessage}`)
        const request = {
            action: socketMessages.toServer.sendMessage,
            payload: {
                message: this.state.newMessage,
            }
        }
        this.state.socket.send(JSON.stringify(request))
        this.setState({ newMessage: '' })
    }

    handleNickNameChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ newNickName: event.target.value })
    }

    handleMessageChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ newMessage: event.target.value })
    }


    requestProfileUpdate() {
        console.log('requesting profile update')
        this.state.socket.send(JSON.stringify({
            action: socketMessages.toServer.getProfile
        }))
    }

    updateProfileDisplay(userInfo: UserItem) {
        console.log('updating profile')
        const { nickName, imgUrl } = userInfo
        this.setState({
            nickName: nickName,
            imgUrl: imgUrl
        })
    }

    /**
     * Sends the request for an upload url for the current user
     */
    getUploadUrl() {
        this.state.socket.send(JSON.stringify({
            action: socketMessages.toServer.getUploadUrl
        }))
    }

    async uploadFile(url: string, file: Buffer): Promise<void> {
        console.log(`uploading to the upload URL: ${url}`)
        await Axios.put(url, file)
    }

    async handleImageSubmit(event: React.SyntheticEvent) {
        event.preventDefault()
        try {
            if (!this.state.file) {
                alert('File should be selected')
                return
            }
            // trigger the request for the upload url
            this.getUploadUrl()
        } catch (e) {
            alert(`Could not upload the file ${e}`)
        }
    }

    handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const files = event.target.files
        if (!files) return

        this.setState({
            file: files[0]
        })
    }

    renderProfileImage() {
        var imageNotSet: Boolean = (this.state.imgUrl === '[retrieving]' || this.state.imgUrl === 'not provided')
        return (
            <div>
                <h3>Current profile image:</h3>
                {
                    <img src={imageNotSet ? noProfile : `${this.state.imgUrl}?${Date.now()}`} alt="profilePic" className="imgSetting" />
                }
                <Form onSubmit={this.handleImageSubmit}>
                    <Form.Field>
                        <label>Upload new profile image</label>
                        <input
                            type="file"
                            accept="image/*"
                            placeholder="Image to upload"
                            onChange={this.handleFileChange}
                        />
                    </Form.Field>

                    {this.renderUploadButton()}
                </Form>
            </div>
        )
    }

    renderUploadButton() {

        return (
            <div>
                <Button
                    type="submit"
                >
                    Upload
            </Button>
            </div>
        )
    }

    renderProfileInformation() {
        return (
            <div>
                <Grid.Row>
                    <Grid.Column width={1}>
                        <h3>Current Nickname: {this.state.nickName}</h3>
                    </Grid.Column>
                    <Grid.Column width={1}>
                        <Input
                            action={{
                                color: 'blue',
                                labelPosition: 'right',
                                icon: { undefined },
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

    renderMessages() {
        return (
            <div>
                <Grid.Row>
                    <hr />
                    <Grid.Column width={1}>
                        <img src={`${this.state.imgUrl}?${Date.now()}`} alt="profilePic" className="imgDialogue" />
                    </Grid.Column>
                    <Grid.Column width={1}>
                        <b>{`${this.state.nickName} at ${Date.now()}`}:</b>
                    </Grid.Column>
                    <Grid.Column width={1}>
                        <i>bla bla bla</i>
                    </Grid.Column>
                    <hr />
                </Grid.Row>
            </div>
        )
    }

    renderMessageSendButton() {
        return (
            <div>
                <Grid.Row>
                    <Grid.Column width={1}>
                        <h3>Send a new message:</h3>
                    </Grid.Column>
                    <Grid.Column width={1}>
                        <Input
                            action={{
                                color: 'blue',
                                labelPosition: 'right',
                                icon: { undefined },
                                content: 'Send',
                                onClick: this.onMessageSend,
                            }}
                            fluid
                            actionPosition={undefined}
                            value={this.state.newMessage}
                            onChange={this.handleMessageChange}
                            ref='messageSendButton'
                        ></Input>
                    </Grid.Column>
                </Grid.Row>
            </div>
        )
    }

    render() {

        return (
            <div>
                <Header as="h1">Chat Application</Header>
                <h2><b>Profile Information</b></h2>
                {this.renderProfileInformation()}
                {this.renderProfileImage()}
                <h2><b>Chat Messages</b></h2>
                {this.renderMessages()}                
                {this.renderMessageSendButton()}
            </div>

        )

    }

    componentDidMount() {
    }

    componentWillUnmount() {
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

    async reactToServerMessage(message: string) {
        const { action, body } = JSON.parse(message)
        if (action === socketMessages.fromServer.updateProfile) {
            this.updateProfileDisplay(body as UserItem)
        } else if (action === socketMessages.fromServer.uploadUrl) {
            const { uploadUrl, imgUrl } = body
            await this.uploadFile(uploadUrl as string, this.state.file)
            // update the img url in the users DB
            const request = {
                action: socketMessages.toServer.updateProfile,
                payload: {
                    nickName: this.state.nickName,
                    imgUrl: imgUrl
                }
            }
            this.state.socket.send(JSON.stringify(request))
            alert('File was uploaded!')
            this.forceUpdate()
        }

    }
}