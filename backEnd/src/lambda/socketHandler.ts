// Class handling the connection to and the disconnection
// from the web socket

import {addConnection, removeConnection} from '../businessLogic/sessions'

const socketMethods = require('../libs/ApiGateway')

const successMessage = {
    statusCode: 200
}

/* const incorrectCallMessage = {
    statusCode: 400,
    message: 'Unknown request method'
} */


// Called when a client connects to the socket
export const connectHandler = async (event, context) => {
    console.log('Connection successful')
    console.log(`Event ${JSON.stringify(event)}`)
    console.log(`Context ${JSON.stringify(context)}`)

    const {connectionId, princId} = getConnectionInformation(event)

    const endpoint = event.requestContext.domainName + '/' + event.requestContext.stage
    console.log(`End point ${endpoint}`)

    // enter the connection 
    await addConnection(princId, connectionId)

    // test for now: write messages back


    await socketMethods.sendMessage(connectionId, { result: 'bla' }, endpoint)


    return successMessage
}


// Called when a client disconnects from the socket
export const disconnectHandler = async (event, context) => {
    console.log('Disconnecting')
    console.log(`Event ${JSON.stringify(event)}`)
    console.log(`Context ${JSON.stringify(context)}`)

    const {connectionId, princId} = getConnectionInformation(event)

    await removeConnection(princId, connectionId)

    return successMessage
}

// Called when an unknown method is requested
export const defaultHandler = async (event, context) => {
    console.log('Call to unspecified method')
    console.log(`Event ${JSON.stringify(event)}`)
    console.log(`Context ${JSON.stringify(context)}`)

    const connectionId = event.requestContext.connectionId
    const endpoint = event.requestContext.domainName + '/' + event.requestContext.stage

    await socketMethods.sendMessage(connectionId, { result: 'bla' }, endpoint)

    return successMessage
}

const getConnectionInformation = (event) => {
    const connectionId = event.requestContext.connectionId
    const princId = event.requestContext.authorizer.principalId
    return {
        connectionId: connectionId,
        princId: princId
    }
}

