// Class handling the connection to and the disconnection
// from the web socket


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
    return incorrectCallMessage
}


module.exports = {
    connectHandler,
    disconnectHandler,
    defaultHandler
}