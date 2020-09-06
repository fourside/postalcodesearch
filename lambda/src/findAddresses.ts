import { query } from "./DynamoDBClient";

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
  const tableName = process.env.TABLE_NAME;
  if (!tableName) {
    throw new Error("not given tableName");
  }
  const result = await query(tableName, zipcode);
  return result.Items as AddressData[];
}
