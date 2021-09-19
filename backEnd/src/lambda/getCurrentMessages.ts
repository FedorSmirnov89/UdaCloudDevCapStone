import { socketInfo } from '../configs'
import { getSortedTodayMessages } from '../businessLogic/messages'
import {UpdateMessagesResponse} from '../models/UpdateMessagesResponse'

const socketMethods = require('../libs/ApiGateway')

export const handler = async (event, context) => {
    // Logging
    console.log(JSON.stringify(event))
    console.log(JSON.stringify(context))
    // Retrieve the necessary inputs    
    const connectionId : string = event.requestContext.connectionId
    const body = JSON.parse(event.body)
    const postDay = body.payload
    console.log(`getting the messages for the day ${postDay}`)
    // retrieve the messages and send them to the client
    const response : UpdateMessagesResponse = await getSortedTodayMessages(postDay)
    console.log(`Sending response ${JSON.stringify(response)}`)
    await socketMethods.sendMessage(connectionId, response, socketInfo.address)
    return socketInfo.responseSuccess
}
