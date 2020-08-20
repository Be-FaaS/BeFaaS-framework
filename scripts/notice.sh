#!/bin/bash

set -euo pipefail

[ -f ".suppress_notice" ] && exit 0

echo "
If you use this software (or parts of it) in a published work, please include a citation similar to the following BibTex notice."

chalk gray "
@Manual{faasterMetrics2020,
  title = {FaaSter Metrics: An Application-oriented Function as a Service Benchmarking Framework},
  author = {Burchard, Luk and Schubert, Carsten and Witzko, Christoph and Zhao, Max and Dietrich, Emily},
  organization = {FaaSter Metrics project group},
  address = {Berlin, Germany},
  year = {2020},
  url = {https://github.com/FaaSterMetrics/documentation/releases},
}

"

chalk -t "
To locally supress this notice please run:
$ {green touch \"$PWD/.suppress_notice\"}
"
