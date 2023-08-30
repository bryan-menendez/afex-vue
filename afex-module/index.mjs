import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  GetCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import https from 'https';

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const tableName = "afex";
const API_KEY = process.env.API_KEY

export const handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  try {
    switch (event.routeKey) {
      case "DELETE /videos/{uid}":
        await dynamo.send(
          new DeleteCommand({
            TableName: tableName,
            Key: {
              uid: event.pathParameters.uid,
            },
          })
        );
        body = `Deleted item ${event.pathParameters.uid}`;
        break;
      case "GET /videos/{uid}":
        let url = 'https://www.googleapis.com/youtube/v3/videos?id=' + event.pathParameters.uid + '&key=' + API_KEY  +'&part=snippet,contentDetails';
        let result = await getRequest(url);
        body = result;
        break;
      case "GET /videos":
        body = await dynamo.send(
          new ScanCommand({ TableName: tableName })
        );
        body = body.Items;
        break;
      case "OPTIONS /videos":
        break;
      case "OPTIONS /videos/{uid}":
        break;
      case "PUT /videos":
        let requestJSON = JSON.parse(event.body);
        await dynamo.send(
          new PutCommand({
            TableName: tableName,
            Item: {
              uid: requestJSON.uid,
              title: requestJSON.title,
              desc: requestJSON.desc,
              length: requestJSON.length
            },
          })
        );
        body = `Put item ${requestJSON.uid}`;
        break;
      default:
        throw new Error(`Unsupported route: "${event.routeKey}"`);
    }
  } catch (err) {
    statusCode = 400;
    body = err.message;
    console.log(err)
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers,
  };
};

function getRequest(url) {

  return new Promise((resolve, reject) => {
    const req = https.get(url, res => {
      let rawData = '';

      res.on('data', chunk => {
        rawData += chunk;
      });

      res.on('end', () => {
        try {
          resolve(JSON.parse(rawData));
        } catch (err) {
          reject(new Error(err));
        }
      });
    });

    req.on('error', err => {
      reject(new Error(err));
    });
  });
}