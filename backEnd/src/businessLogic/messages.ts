
import { DbAccessMessages } from '../dataLayer/DbAccessMessages'
import { DbAccessSession } from '../dataLayer/DbAccessSession'
import { DbAccessUser } from '../dataLayer/DbAccessUser'

import { MessageItem } from '../models/MessageItem'
import { SessionItem } from '../models/SessionItem'
import { UserItem } from '../models/UserItem'
import { UpdateMessagesResponse, UpdateMessageBlResult } from '../models/UpdateMessagesResponse'

const dbAccessMessages = new DbAccessMessages()
const dbAccessSession = new DbAccessSession()
const dbAccessUser = new DbAccessUser()

export async function getSortedTodayMessages(dateDay: string): Promise<UpdateMessagesResponse> {
    // get all messages for today
    var messages: MessageItem[] = await dbAccessMessages.getTodaysMessages(dateDay)
    // sort them
    messages.sort(function (a: MessageItem, b: MessageItem) {
        var keyA = new Date(a.postDate)
        var keyB = new Date(b.postDate)
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
    })
    return new UpdateMessagesResponse(messages)
}

async function getMessagesAndConnections(dateDay: string): Promise<UpdateMessageBlResult> {    
    // get all connections in the connections DB
    var connections: SessionItem[] = await dbAccessSession.getActiveConnections()
    var connectionIds: string[] = []
    connections.forEach(cId => {
        connectionIds.push(cId.connectionId)
    })
    const response: UpdateMessagesResponse = await getSortedTodayMessages(dateDay)
    return {
        responseToClient: response,
        connectionIds: connectionIds
    } as UpdateMessageBlResult
}

export async function enterNewMessage(content: string, postDay: string, postDate: string, princId: string): Promise<UpdateMessageBlResult> {

    const userInfo: UserItem = await dbAccessUser.getUserInformation(princId)
    const { nickName, imgUrl } = userInfo
    const messageEntry: MessageItem = {
        content: content,
        postDate: postDate,
        postDay: postDay,
        nickName: nickName,
        imgUrl: imgUrl
    }
    await dbAccessMessages.createMessage(messageEntry)
    return getMessagesAndConnections(postDay)
}