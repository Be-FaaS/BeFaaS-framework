#!/bin/bash

set -euo pipefail

PKG_JSON='{"name": "fn", "main": "index.js"}'

if [ -z "${1:-}" ]; then
    echo "Usage: $0 <experiment name>"
    echo "Choose one of:"
    echo "> $(ls experiments/ | tr '\n' ' ')"
    exit 1
fi

exp_dir="experiments/$1/functions"

if [[ ! -d $exp_dir ]]; then
    echo "Invalid experiment name"
    exit 1
fi

echo "Building experiment $1"

rm -rf $exp_dir/_build
mkdir $exp_dir/_build

for d in $exp_dir/*; do
  fname=`basename $d`
  if [[ "$fname" == '_build' ]]; then
    continue
  fi
  echo "Going to build function: ${fname}"
  npx ncc build $d/index.js -o $d/build
  echo $PKG_JSON > $d/build/package.json
  cd $d/build && zip -r ../../_build/${fname}.zip * && cd -
  rm -rf $d/build
done

echo "Build done"
