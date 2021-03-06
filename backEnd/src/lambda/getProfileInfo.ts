
import {socketInfo} from '../configs'
import {getUserInfo} from '../businessLogic/users'

import {ResponseProfileInfo} from '../models/ResponseProfileInfo'


const socketMethods = require('../libs/ApiGateway')



export const handler = async (event, context) => {
    console.log(JSON.stringify(event))
    console.log(JSON.stringify(context))

    const princId : string = event.requestContext.authorizer.principalId
    const connectionId : string = event.requestContext.connectionId
    const response : ResponseProfileInfo = await getUserInfo(princId)
    await socketMethods.sendMessage(connectionId, response, socketInfo.address)
    return socketInfo.responseSuccess
}