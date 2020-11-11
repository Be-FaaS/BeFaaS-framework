#!/bin/bash

set -euo pipefail

[ -f ".suppress_notice" ] && exit 0

echo "
If you use this software (or parts of it) in a published work, please include a citation similar to the following BibTex notice."

chalk gray "
	TMP
"

chalk -t "
To locally supress this notice please run:
$ {green touch \"$PWD/.suppress_notice\"}
"
