#!/usr/bin/gawk -f
BEGIN {
  FS = ","
}
NR > 1 {
  key = sprintf("%02d", substr($3, 2, 2))
  print $0 >> key "-x-ken-all" yyyymm ".csv"
}