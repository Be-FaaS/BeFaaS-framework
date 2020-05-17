#!/bin/bash

set -euo pipefail

PKG_JSON='{"name": "fn", "main": "index.js"}'

if [ -z "${1:-}" ]; then
    chalk -t "{yellow Usage: $0 }{yellow.bold <experiment name>}"
    echo "Choose one of:" | chalk yellow
    chalk -t "{yellow >} {yellow.bold $(ls experiments/ | tr '\n' ' ')}"
    echo ""
    exit 1
fi

exp_dir="experiments/$1/functions"

if [[ ! -d $exp_dir ]]; then
    echo -e "Invalid experiment name\n" | chalk red
    exit 1
fi

chalk -t "{cyan Building experiment} {cyan.bold $1}"

rm -rf $exp_dir/_build
mkdir $exp_dir/_build

for d in $exp_dir/*; do
  fname=`basename $d`
  if [[ "$fname" == '_build' ]]; then
    continue
  fi
  echo "Going to build function: ${fname}" | chalk cyan
  npx ncc build $d/index.js -o $d/build
  echo $PKG_JSON > $d/build/package.json
  cd $d/build && zip -r ../../_build/${fname}.zip * && cd -
  rm -rf $d/build
done

echo "Build done" | chalk cyan bold
