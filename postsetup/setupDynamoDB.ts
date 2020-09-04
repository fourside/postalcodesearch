import { TableName } from "../lib/DynamoDb";
import { PostalcodesearchStack } from "../lib/postalcodesearch-stack";
import { findZipFile, readZipOfCsv } from "./ZipFileReader";
import { getTableName, createButchWriteItemInput, batchWrite } from "./DynamoDBClient";

export async function setupDynamoDB(): Promise<void> {
  try {
    const zipFile = findZipFile(__dirname);
    const addresses = await readZipOfCsv(zipFile);

    const realTableName = await getTableName(PostalcodesearchStack.name, TableName);
    const params = createButchWriteItemInput(realTableName, addresses);
    const result = await batchWrite(params);
    console.log(result);
  } catch (e) {
    console.log(e);
  }
}

if (__filename === process.argv[1]) {
  (async () => {
    await setupDynamoDB();
  })();
}
