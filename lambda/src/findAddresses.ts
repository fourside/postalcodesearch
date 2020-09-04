import * as fs from "fs";
import { parse } from "csv";
import { findCsvFile } from "./findCsvFile";
import { hankanaToHiragana } from "./hankanaToHiragana";

const CSV_DIR = "./x-ken-all";
const COLUMNS = [
  null,
  null,
  "zipcode",
  "kana1",
  "kana2",
  "kana3",
  "address1",
  "address2",
  "address3",
  null,
  null,
  null,
  null,
  null,
  null,
];

type CsvData = {
  zipcode: string;
  kana1: string;
  kana2: string;
  kana3: string;
  address1: string;
  address2: string;
  address3: string;
};

type Addresses = {
  updatedAt: string;
  addresses: CsvData[];
};

export async function findAddresses(zipcode: string): Promise<Addresses> {
  const key = zipcode.substring(0, 2);
  const [csvFile, yyyymm] = await findCsvFile(CSV_DIR, key);
  const csvParser = parse({ columns: COLUMNS });
  const addresses = new Array<CsvData>();
  const response = {
    updatedAt: yyyymm,
    addresses,
  };
  let find = false;
  return new Promise((resolve, reject) => {
    const errorHandler = (err: unknown) => reject(err);
    const stream = fs.createReadStream(csvFile).on("error", errorHandler).pipe(csvParser).on("error", errorHandler);
    stream.on("data", (data) => {
      if (data.zipcode === zipcode) {
        find = true;
        Object.keys(data)
          .filter((key) => /^kana/.test(key))
          .forEach((key) => {
            data[key] = hankanaToHiragana(data[key]);
          });
        addresses.push(data);
      } else if (find) {
        stream.destroy();
        resolve(response);
      }
    });
    stream.on("end", () => {
      if (find) {
        resolve(response);
      } else {
        reject("not found");
      }
    });
  });
}
