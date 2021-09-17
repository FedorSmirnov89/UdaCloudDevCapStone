
// Code managing the access to the DB with the websocket connection information.

import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import {SessionItem} from '../models/SessionItem'

const AWSXRay = require('aws-xray-sdk')

export class DbAccessSession {

  constructor(    
    
    private readonly docClient: DocumentClient = new (AWSXRay.captureAWS(AWS)).DynamoDB.DocumentClient(),
    private readonly sessionTable = process.env.SESSIONS_TABLE,
    ){
  }

  /**
   * Creates a connection entry
   * 
   * @param princID  the principal ID
   * @param connectionId  the connection ID
   */
  async createConnectionEntry(princID: string, connectionId: string): Promise<SessionItem>{    
    
    const item = {
      princId: princID,
      connectionId: connectionId,
      loggedIn: new Date().toString()      
    }
    await this.docClient.put({
      TableName: this.sessionTable,
      Item: item
    }).promise()
    return item as SessionItem
  }

  /**
   * Deletes the connection entry
   * 
   * @param princId the principal id
   * @param connectionId the connection id
   */
  async deleteConnection(princId: string, connectionId: string) {

    var params = {
      TableName: this.sessionTable,
      Key: {
        princId: princId,
        connectionId: connectionId
      }
    }
    await this.docClient.delete(params).promise()
  }
}