

/**
 * The function used as authorization handler for the connection to the web socket
 *  
 */
async function handler (event, context, callback){

    const expectedToken = 'token'

    // check the headers for the Auth header
    const token = event.headers['Auth']

    const result = (token === expectedToken)

    // for now, we just refuse connections
    return makeResponse(result)
}


var makeResponse = (accept) => {

    var decision = accept ? 'granted' : 'denied'
    console.log(`Access ${decision}`)

    return {
        principalId: 'user',
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: accept ? 'Allow' : 'Deny',
                    Resource: '*'
                }
            ]
        }
    }
}


module.exports = {
    handler
}
