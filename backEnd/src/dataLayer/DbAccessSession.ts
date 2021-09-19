
// Code managing the access to the DB with the websocket connection information.

import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { SessionItem } from '../models/SessionItem'

const AWSXRay = require('aws-xray-sdk')

export class DbAccessSession {

  constructor(

    private readonly docClient: DocumentClient = new (AWSXRay.captureAWS(AWS)).DynamoDB.DocumentClient(),
    private readonly sessionTable = process.env.SESSIONS_TABLE,
  ) {
  }

  /**
   * Creates a connection entry
   * 
   * @param princID  the principal ID
   * @param connectionId  the connection ID
   */
  async createConnectionEntry(princID: string, connectionId: string): Promise<SessionItem> {

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


  async getActiveConnections(): Promise<SessionItem[]> {
    var result: SessionItem[] = []
    var params = {
      TableName: this.sessionTable,
      ProjectionExpression: "#pId, #cId, #lI",
      ExpressionAttributeNames: {
        "#pId": "princId",
        "#cId": "connectionId",
        "#lI": "loggedIn"
      }
    };
    await this.docClient.scan(params, onScan).promise()
    function onScan(err, data) {
      if (err) {
        console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
      } else {
        // add all sessions to the result
        data.Items.forEach(function (session: SessionItem) {
          result.push(session)
        });
        // continue scanning if we have more sessions          
        if (typeof data.LastEvaluatedKey != "undefined") {
          var extraParam = {
            ExclusiveStartKey: data.LastEvaluatedKey,
            ...params
          }
          this.docClient.scan(extraParam, onScan);
        }
      }
    }
    return result
  }
}