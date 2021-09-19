// Class handling the connection to and the disconnection
// from the web socket

import {addConnection, removeConnection} from '../businessLogic/sessions'
import {getConnectionInformation} from '../libs/Lambda'
import {checkUserEntry} from '../businessLogic/users'
import {socketInfo} from '../configs'

// Called when a client connects to the socket
export const connectHandler = async (event, context) => {
    console.log('Connection successful')
    console.log(`Event ${JSON.stringify(event)}`)
    console.log(`Context ${JSON.stringify(context)}`)
    const {connectionId, princId} = getConnectionInformation(event)
    console.log(`End point ${socketInfo.address}`)
    // enter the connection 
    await addConnection(princId, connectionId)
    // check whether the user already has an entry in the user DB and enter it if not
    await checkUserEntry(princId)
    return socketInfo.responseSuccess
}


// Called when a client disconnects from the socket
export const disconnectHandler = async (event, context) => {
    console.log('Disconnecting')
    console.log(`Event ${JSON.stringify(event)}`)
    console.log(`Context ${JSON.stringify(context)}`)

    const {connectionId, princId} = getConnectionInformation(event)

    await removeConnection(princId, connectionId)

    return socketInfo.responseSuccess
}

// Called when an unknown method is requested
export const defaultHandler = async (event, context) => {
    console.log('Call to unspecified method')
    console.log(`Event ${JSON.stringify(event)}`)
    console.log(`Context ${JSON.stringify(context)}`)
    return socketInfo.responseWrongRoute
}

