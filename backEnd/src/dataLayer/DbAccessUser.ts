// Code for managing the access to the users database

import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { UserItem } from '../models/UserItem'

const AWSXRay = require('aws-xray-sdk')

export class DbAccessUser {

    constructor(
        private readonly docClient: DocumentClient = new (AWSXRay.captureAWS(AWS)).DynamoDB.DocumentClient(),
        private readonly userTable = process.env.USERS_TABLE,
    ) {
    }

    /**
     * Add a new user entry to the table
     * 
     * @param userEntry the user entry to add    
     */
    async createUserEntry(userEntry : UserItem){

        const item = {
            ...userEntry
        }

        await this.docClient.put({
            TableName: this.userTable,
            Item: item
        }).promise()

        return item as UserItem
    }

    /**
     * Retrieve the entry for the given princId
     * 
     * @param princId the princ id of the entry to retrieve
     */
    async getUserInformation(princId : string) : Promise<UserItem>{
        const params = {
            TableName: this.userTable,
            Key: {
                princId: princId
            }
        }

        const result = (await this.docClient.get(params).promise()).Item
        return result as UserItem
    }

    /**
     * Checks whether an entry exists for the provided ID
     * 
     * @param princId the provided user ID
     * 
     */
    async userEntryExists(princId : string): Promise<Boolean>{
        const params = {
            TableName: this.userTable,
            Key: {
                princId: princId
            }
        }

        const item = (await this.docClient.get(params).promise()).Item
        const result = (item !== undefined && item !== null)
        return result
    }

}