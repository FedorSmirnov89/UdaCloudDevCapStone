import { socketInfo } from '../configs'
import { enterNewMessage } from '../businessLogic/messages'
import { UpdateMessageBlResult } from '../models/UpdateMessagesResponse'

const socketMethods = require('../libs/ApiGateway')

export const handler = async (event, context) => {
    // Logging
    console.log(JSON.stringify(event))
    console.log(JSON.stringify(context))
    // Retrieve the necessary inputs
    const princId: string = event.requestContext.authorizer.principalId
    const body = JSON.parse(event.body)
    const { content, postDay, postDate } = body.payload
    // add the new message to the DB and get back the message set
    const result: UpdateMessageBlResult = await enterNewMessage(content, postDay, postDate, princId)
    console.log('message saved to db')
    // send the current messages to all connected clients
    for (const cId of result.connectionIds) {
        await socketMethods.sendMessage(cId, result.responseToClient, socketInfo.address)
    }
    return socketInfo.responseSuccess
}
