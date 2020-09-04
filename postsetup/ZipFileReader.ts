import * as fs from "fs";
import * as path from "path";
import { ParseOne } from "unzipper";
import { decodeStream } from "iconv-lite";
import { parse } from "csv";
import { COLUMNS, CsvData } from "../lib/KenAllCsv";
import { hankanaToHiragana } from "./hankanaToHiragana";

export function findZipFile(zipDir: string): string {
  const zipFile = fs.readdirSync(zipDir).find((filePath) => {
    return filePath.search(/\.zip$/) > -1;
  });
  if (!zipFile) {
    throw new Error("not found zip file.");
  }
  return zipFile;
}

export function readZipOfCsv(filePath: string): Promise<CsvData[]> {
  const csvParser = parse({ columns: COLUMNS });
  const errorHandler = (err: unknown) => {
    throw err;
  };
  const stream = fs
    .createReadStream(path.join(__dirname, filePath))
    .on("error", errorHandler)
    .pipe(ParseOne())
    .on("error", errorHandler)
    .pipe(decodeStream("cp932"))
    .on("error", errorHandler)
    .pipe(csvParser)
    .on("error", errorHandler);
  const addresses = new Array<CsvData>();
  stream.on("data", (data) => {
    Object.keys(data).forEach((key) => {
      if (key.search(/^kana/) > -1) {
        data[key] = hankanaToHiragana(data[key]);
      }
    });
    addresses.push(data);
  });
  return new Promise((resolve) => {
    stream.on("end", () => {
      resolve(addresses);
    });
  });
}
