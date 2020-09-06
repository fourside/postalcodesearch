import { config, DynamoDB } from "aws-sdk";
import {
  DocumentClient,
  WriteRequest,
  PutItemInputAttributeMap,
  BatchWriteItemInput,
  BatchWriteItemOutput,
  TableNameList,
} from "aws-sdk/clients/dynamodb";
import { CsvData } from "./KenAllCsv";

config.update({
  region: "ap-northeast-1",
});
const client: DocumentClient = new DynamoDB.DocumentClient();
const dynamoDb: DynamoDB = new DynamoDB();

// requestItems must have length less than or equal to 25
export const REQUEST_ITEMS_MAX_SIZE = 25;

export function createButchWriteItemInput(tableName: string, addresses: CsvData[]): BatchWriteItemInput {
  const putRequests: WriteRequest[] = addresses.map((address) => {
    return {
      PutRequest: {
        Item: address as PutItemInputAttributeMap,
      },
    };
  });
  const params: DynamoDB.BatchWriteItemInput = {
    RequestItems: {
      [tableName]: putRequests,
    },
  };
  return params;
}

export async function batchWrite(params: BatchWriteItemInput): Promise<BatchWriteItemOutput> {
  return new Promise((resolve, reject) => {
    client.batchWrite(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

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
