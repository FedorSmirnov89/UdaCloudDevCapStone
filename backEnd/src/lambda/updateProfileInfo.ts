import {socketInfo} from '../configs'
import {updateUserEntry, getUserInfo} from '../businessLogic/users'
import {UserItem} from '../models/UserItem'
import {ResponseProfileInfo} from '../models/ResponseProfileInfo'


const socketMethods = require('../libs/ApiGateway')

export const handler = async (event, context) => {
    console.log(JSON.stringify(event))
    console.log(JSON.stringify(context))

    const princId : string = event.requestContext.authorizer.principalId
    const connectionId : string = event.requestContext.connectionId
    const body = JSON.parse(event.body)
    const {nickName, imgUrl} = body.payload
    const entry : UserItem = {
        princId: princId,
        nickName:nickName,
        imgUrl:imgUrl
    }
    console.log(`Update Entry: ${JSON.stringify(entry)}`)
    await updateUserEntry(entry)
    console.log('Entry updated')
    const response : ResponseProfileInfo = await getUserInfo(princId) 
    console.log('sending back the new value')
    await socketMethods.sendMessage(connectionId, response, socketInfo.address)
    return socketInfo.responseSuccess
}