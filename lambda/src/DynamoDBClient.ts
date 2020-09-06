import { config, DynamoDB } from "aws-sdk";
import { DocumentClient, TableNameList, QueryOutput } from "aws-sdk/clients/dynamodb";

config.update({
  region: "ap-northeast-1",
});
const client: DocumentClient = new DynamoDB.DocumentClient();
const dynamoDb: DynamoDB = new DynamoDB();

export async function query(tableName: string, zipcode: string): Promise<QueryOutput> {
  const params = {
    TableName: tableName,
    KeyConditionExpression: "#zipcode = :zipcode",
    ExpressionAttributeNames: {
      "#zipcode": "zipcode",
    },
    ExpressionAttributeValues: {
      ":zipcode": zipcode,
    },
  };
  return new Promise((resolve, reject) => {
    client.query(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}
