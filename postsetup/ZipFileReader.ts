import * as fs from "fs";
import * as path from "path";
import { ParseOne } from "unzipper";
import { decodeStream } from "iconv-lite";
import { parse } from "csv";
import { COLUMNS, CsvData } from "./KenAllCsv";
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

export async function readZipOfCsv(filePath: string): Promise<CsvData[]> {
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
  const result = await new Promise<CsvData[]>((resolve) => {
    stream.on("end", () => {
      resolve(addresses);
    });
  });
  return preprocessAddresses(result);
}

function preprocessAddresses(addresses: CsvData[]): CsvData[] {
  return addresses
    .map((address) => {
      address["sortkey"] =
        address.address1 + toStringEvenIfNull(address.address2) + toStringEvenIfNull(address.address3);
      for (const [key, value] of Object.entries(address)) {
        if (value === "") {
          address[key] = null;
        }
      }
      return address;
    })
    .filter((address, index, self) => {
      return self.findIndex((item) => item.zipcode === address.zipcode && item.sortkey === address.sortkey) === index;
    });
}

function toStringEvenIfNull(value: string | null) {
  if (!value) {
    return "";
  }
  return value;
}
