
import {socketInfo} from '../configs'
import {getUserInfo} from '../businessLogic/users'

import {UserItem} from '../models/UserItem'


const socketMethods = require('../libs/ApiGateway')



export const handler = async (event, context) => {
    console.log(JSON.stringify(event))
    console.log(JSON.stringify(context))

    const princId : string = event.requestContext.authorizer.principalId
    const connectionId : string = event.requestContext.connectionId

    const userInfo : UserItem = await getUserInfo(princId)
    await socketMethods.sendMessage(connectionId, userInfo, socketInfo.address)
    return socketInfo.responseSuccess
}