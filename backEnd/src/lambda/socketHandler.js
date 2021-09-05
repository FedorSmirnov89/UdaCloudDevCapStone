// Class handling the connection to and the disconnection
// from the web socket

const socketMethods = require('../libs/ApiGateway')

const successMessage = {
    statusCode: 200
}

const incorrectCallMessage = {
    statusCode: 400,
    message: 'Unknown request method'
}


// Called when a client connects to the socket
async function connectHandler(event, context){
    console.log('Connection successful')
    console.log(event)
    
    const connectionId = event.requestContext.connectionId
    const endpoint = event.requestContext.domainName + '/' + event.requestContext.stage
    
    // test for now: write messages back
    messages = ["message1", "message2"]
    body = {msgs: messages}
    
    await socketMethods.sendMessage(connectionId, {result: 'bla'}, endpoint)
    

    return successMessage
}


// Called when a client disconnects from the socket
async function disconnectHandler(event, context){
    console.log('Disconnecting')
    return successMessage
}

// Called when an unknown method is requested
async function defaultHandler(event, context){
    console.log('Call to unspecified method')

    const connectionId = event.requestContext.connectionId
    const endpoint = event.requestContext.domainName + '/' + event.requestContext.stage

    await socketMethods.sendMessage(connectionId, {result: 'bla'}, endpoint)

    return successMessage
}


module.exports = {
    connectHandler,
    disconnectHandler,
    defaultHandler
}