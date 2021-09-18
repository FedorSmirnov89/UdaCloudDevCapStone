
import * as AWS from 'aws-sdk'
import { socketInfo, protocol } from '../configs'
const AWSXRay = require('aws-xray-sdk')
const socketMethods = require('../libs/ApiGateway')

const XAWS = AWSXRay.captureAWS(AWS)
const s3 = new XAWS.S3({
    signatureVersion: 'v4'
})

const bucketName = process.env.ICON_BUCKET
const urlExpiration = process.env.URL_EXPIRE


export const handler = async (event, context) => {

    console.log(JSON.stringify(event))
    console.log(JSON.stringify(context))

    const princId: string = event.requestContext.authorizer.principalId
    const connectionId: string = event.requestContext.connectionId
    const imgUrl = `https://${bucketName}.s3.amazonaws.com/${princId}`

    const uploadUrl = s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: princId,
        Expires: Number(urlExpiration)
    })

    const response = {
        action: protocol.toClient.uploadUrl,
        body: {
            uploadUrl: uploadUrl,
            imgUrl: imgUrl
        }
    }
    console.log(`sending back response: ${JSON.stringify(response)}`)

    await socketMethods.sendMessage(connectionId, response, socketInfo.address)

    return socketInfo.responseSuccess
}



