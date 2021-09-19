//  Code for managing the access to the message database

import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { MessageItem } from '../models/MessageItem'

const AWSXRay = require('aws-xray-sdk')

export class DbAccessMessages {

    constructor(
        private readonly docClient: DocumentClient = new (AWSXRay.captureAWS(AWS)).DynamoDB.DocumentClient(),
        private readonly messageTable = process.env.MESSAGES_TABLE,
    ) {
    }

    async createMessage(messageEntry: MessageItem) {
        const item = {
            ...messageEntry
        }

        await this.docClient.put({
            TableName: this.messageTable,
            Item: item
        }).promise()

        return item as MessageItem
    }


    async getTodaysMessages(dateDay: string): Promise<MessageItem[]>{
        const queryParams = {
            TableName: this.messageTable,
            KeyConditionExpression: "#postDay = :d",
            ExpressionAttributeNames: {
                "#postDay": "postDay"
            },
            ExpressionAttributeValues: {
                ":d": dateDay
            }
        }

        const todos = (await this.docClient.query(queryParams).promise()).Items
        return todos as MessageItem[]

    }
}