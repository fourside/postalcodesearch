export const COLUMNS = [
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

export type CsvData = {
  [key: string]: string | null;
  zipcode: string;
  kana1: string;
  // kana2: string | null;
  // kana3: string | null;
  address1: string;
  // address2: string | null;
  // address3: string | null;
};
