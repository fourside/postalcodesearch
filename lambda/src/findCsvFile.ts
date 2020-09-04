import * as fs from "fs";

export async function findCsvFile(key: string, dir: string): Promise<[string, string]> {
  const csvFilePattern = new RegExp(`^${key}-.+(\\d{6})\\.csv$`);
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, list) => {
      if (err) {
        reject(err);
        return;
      }
      let yyyymm = "";
      const csv = list.find((file) => {
        const match = csvFilePattern.exec(file);
        if (match) {
          yyyymm = match[1];
        }
        return match;
      });
      if (csv && yyyymm) {
        resolve([`${dir}/${csv}`, yyyymm]);
      }
      reject("not found csv.");
    });
  });
}
