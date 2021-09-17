/**
 * File containing convenience methods related to the API gateway.
 */



 const aws = require('aws-sdk')



/**
 * Sends the provided body to the client connected via the provided connection ID
 * 
 * @param connectionId the connection id
 * @param body the body to send
 * @param endpoint the reference to the backend app
 */
 async function sendMessage(connectionId, body, endpoint){
    try{
      // create the service to send the message            
      const apig = new aws.ApiGatewayManagementApi({
        apiVersion: '2018-11-29',
        endpoint
      })
  
      console.log('sending message')

      // send the message
      await apig.postToConnection({
        ConnectionId: connectionId,
        Data: JSON.stringify(body)
      }).promise()
    }catch(err){
      // Error treatment
      if (err.statusCode !== 400 && err.statusCode !== 410){
        throw err
      }
    }
  }

  module.exports = {
      sendMessage
  }