import React from 'react'
import Auth from '../auth/Auth'
import { History } from 'history'
import { apiEndpoint, socketMessages, getImageUrlForId } from '../config'
import { Grid, Header, Input, Form, Button } from 'semantic-ui-react'
import { UserItem } from '../types/UserItem'
import { Message } from '../types/Message'
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
    newMessage: string,
    shownMessages: Message[]
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
            newMessage: '',
            shownMessages: []
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
        const postDate = this.getPostDate()
        const postDay = this.getPostDay()
        // send the message and empty the message input
        console.log(`sending the message ${this.state.newMessage}; date: ${postDate}; day: ${postDay}`)
        const request = {
            action: socketMessages.toServer.sendMessage,
            payload: {
                content: this.state.newMessage,
                postDay: postDay,
                postDate: postDate
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

    requestMessagesUpdate() {
        console.log('requesting messages update')
        this.state.socket.send(JSON.stringify({
            action: socketMessages.toServer.getMessages,
            payload: this.getPostDay()
        }))
    }

    getPostDay(): string {
        const date = new Date()
        return date.toISOString().split('T')[0]
    }

    getPostDate(): string {
        return new Date().toISOString()
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
        if (this.state.shownMessages.length === 0) {
            return (
                <p>So far, no messages have been posted today.</p>
            )
        } else {
            console.log(`We have following messages: ${JSON.stringify(this.state.shownMessages)}`)
            return this.state.shownMessages.map((sMsg, key) => this.renderMessage(sMsg, key))
        }
    }

    renderMessage(message: Message, key: number) {
        console.log(`rendering message ${JSON.stringify(message)}`)
        const adjustedDate: Date = new Date(message.dateString)
        const adjustedDateString: string = `${adjustedDate.getHours()}:${adjustedDate.getMinutes()}:${adjustedDate.getSeconds()} - ${adjustedDate.toDateString()}`
        return (
            <Grid.Row key={key}>
                <Grid.Column width={1}>
                    <img src={`${message.imgUrl}?${Date.now()}`} alt="profilePic" className="imgDialogue" />
                </Grid.Column>
                <Grid.Column width={1}>
                    <b>{`${message.nickName} at ${adjustedDateString}`}:</b>
                </Grid.Column>
                <Grid.Column width={1}>
                    <i>{message.content}</i>
                </Grid.Column>
                <hr />
            </Grid.Row>
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
            this.requestMessagesUpdate()
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
        } else if (action === socketMessages.fromServer.updateMessages) {
            const shownMessages: Message[] = []
            for (const key in body.messages) {
                console.log(JSON.stringify(body.messages[key]))
                const { content, nickName, imgUrl, postDate } = body.messages[key]
                const sMsg: Message = {
                    content: content,
                    nickName: nickName,
                    imgUrl: imgUrl,
                    dateString: postDate
                }
                console.log(`Pushing ${JSON.stringify(sMsg)}`)
                shownMessages.push(sMsg)
            }

            this.setState({ shownMessages: shownMessages })
        } else {
            console.log(`Unknown action received from server: ${action}`)
        }
    }
}