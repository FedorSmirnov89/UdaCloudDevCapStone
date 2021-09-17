import {DbAccessSession} from '../dataLayer/DbAccessSession'
import {SessionItem} from '../models/SessionItem'

const dbAccessSession = new DbAccessSession()

export async function addConnection(princId: string, connectionId: string) : Promise<SessionItem>{
    return dbAccessSession.createConnectionEntry(princId, connectionId)
}

export async function removeConnection(princId: string, connectionId: string){
    return dbAccessSession.deleteConnection(princId, connectionId)
}





