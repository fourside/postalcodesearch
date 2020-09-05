import { TableName } from "../lib/DynamoDb";
import { PostalcodesearchStack } from "../lib/postalcodesearch-stack";
import { findZipFile, readZipOfCsv } from "./ZipFileReader";
import { getTableName, createButchWriteItemInput, batchWrite, REQUEST_ITEMS_MAX_SIZE } from "./DynamoDBClient";

export async function setupDynamoDB(): Promise<void> {
  try {
    console.log("start:", new Date());
    const zipFile = findZipFile(__dirname);
    const addresses = await readZipOfCsv(zipFile);
    addresses.forEach((a) => console.log(a));

    const step = REQUEST_ITEMS_MAX_SIZE;
    const length = addresses.length;
    const realTableName = await getTableName(PostalcodesearchStack.name, TableName);
    for (let i = 0; length > i; i += step) {
      const partOf = addresses.slice(i, i + step);
      const params = createButchWriteItemInput(realTableName, partOf);
      const result = await batchWrite(params);
      console.log(`from ${i} to ${i + step - 1}`, result);
    }
  } catch (e) {
    console.log(e);
  }
  console.log("end:", new Date());
}

if (__filename === process.argv[1]) {
  (async () => {
    await setupDynamoDB();
  })();
}
