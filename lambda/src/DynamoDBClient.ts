import { config, DynamoDB } from "aws-sdk";
import { DocumentClient, TableNameList, QueryOutput } from "aws-sdk/clients/dynamodb";

config.update({
  region: "ap-northeast-1",
});
const client: DocumentClient = new DynamoDB.DocumentClient();
const dynamoDb: DynamoDB = new DynamoDB();

export async function getTableName(stackName: string, tableName: string): Promise<string> {
  const tableNames = await new Promise<TableNameList>((resolve, reject) => {
    dynamoDb.listTables({}, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.TableNames);
      }
    });
  });
  const pattern = `^${stackName}-${tableName}.+`;
  const realTableName = tableNames.find((table) => {
    return table.search(pattern) > -1;
  });
  if (!realTableName) {
    throw new Error(`not found table "${tableName}" in DynamoDB in stack: ${stackName}`);
  }
  return realTableName;
}

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
