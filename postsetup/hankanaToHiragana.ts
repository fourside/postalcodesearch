import * as moji from "moji";

export function hankanaToHiragana(hankana: string): string {
  return moji(hankana)
    .convert("HK", "ZK") // hankaku katakana to zenkaku katakana
    .convert("KK", "HG") // katakana to hiragana
    .toString();
}
