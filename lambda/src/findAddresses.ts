import { getTableName, query } from "./DynamoDBClient";
import { PostalcodesearchStack } from "../../lib/postalcodesearch-stack";
import { TableName } from "../../lib/DynamoDb";

export type AddressData = {
  zipcode: string;
  kana1: string;
  kana2: string;
  kana3: string;
  address1: string;
  address2: string;
  address3: string;
};

export async function findAddresses(zipcode: string): Promise<AddressData[]> {
  const stackName = PostalcodesearchStack.name;
  const tableName = await getTableName(stackName, TableName);
  const result = await query(tableName, zipcode);
  return result.Items as AddressData[];
}
