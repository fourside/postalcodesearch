#!/bin/bash
set -e

csv_dir="src/x-ken-all"
extracted_file="x-ken-all.csv"
sorted_file="x-ken-all-sorted.csv"
split_script="split_csv.awk"

if ! stat -t $csv_dir > /dev/null 2>&1
then
  mkdir $csv_dir
  echo "[error] deploy x-ken-all zip file to $csv_dir"
  exit -1
fi

cd $csv_dir

if stat -t *.csv > /dev/null 2>&1
then
  rm *.csv
fi

zipfile=$(ls -1tr *zip | tail -n1)

if [ -z $zipfile ]; then
  echo "[error] deploy x-ken-all zip file"
  cd ..
  exit -1
fi

yyyymm=$(echo $zipfile | cut -b 10-15)

unzip -uq $zipfile

iconv -f cp932 -t utf-8 $extracted_file | LC_ALL=C sort -t, -k3 > $sorted_file
gawk -f ../../$split_script -v yyyymm=$yyyymm $sorted_file

rm $extracted_file $sorted_file

cd ..
