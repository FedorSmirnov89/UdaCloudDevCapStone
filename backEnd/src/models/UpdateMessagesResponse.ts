import { protocol } from '../configs'
import { ResponseToClient } from './ResponseToClient'
import { MessageItem } from './MessageItem'

export class UpdateMessagesResponse implements ResponseToClient {

    action = protocol.toClient.updateMessages
    body = null

    constructor(messages: MessageItem[]) {
        this.body = {
            messages:messages            
        }
    }

}

export interface UpdateMessageBlResult{
    responseToClient: UpdateMessagesResponse,
    connectionIds: string[]
}