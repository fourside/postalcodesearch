const fs = require("fs");
const unzipper = require("unzipper");
const iconv = require('iconv-lite');
const csv = require('csv');

const columns = [
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

async function postalCodeSearch(needle) {

  const [hayOfZip, yyyymm] = await findZip();
  const csvParser = csv.parse({ columns });
  const addresses = [];
  const response = {
    updated: yyyymm,
    addresses
  };
  let find = false;
  return new Promise((resolve, reject) => {
    if (!/^\d+$/.test(needle)) {
      reject("invalid postal code", needle);
    }
    const errorHandler = err => reject(err);
    const stream = fs.createReadStream(hayOfZip).on("error", errorHandler)
      .pipe(unzipper.ParseOne()).on("error", errorHandler)
      .pipe(iconv.decodeStream("cp932")).on("error", errorHandler)
      .pipe(csvParser).on("error", errorHandler)
      ;
    stream.on("data", data => {
      if (data.zipcode === needle) {
        find = true;
        addresses.push(data);
      } else if (find) {
        stream.destroy();
        resolve(response);
      }
    });
  });
}

async function findZip() {
  return new Promise((resolve, reject) => {
    fs.readdir("./", (err, list) => {
      if (err) {
        reject(err);
        return;
      }
      const pattern = /(\d{6})\.zip$/;
      let yyyymm;
      const zip = list.find(f => {
        const match = pattern.exec(f);
        if (match) {
          yyyymm = match[1];
        }
        return match;
      });
      if (zip) {
        resolve([zip, yyyymm]);
      }
      reject("not found zip");
    });
  });
}

module.exports = postalCodeSearch;

