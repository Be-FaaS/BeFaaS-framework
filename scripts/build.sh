#!/bin/bash

set -e

PKG_JSON='{"name": "fn", "main": "index.js"}'

if [ -z "$1" ]; then
    echo "usage: $0 <experiment name>"
    exit 1
fi

exp_dir="experiments/$1/functions"

if [[ ! -d $exp_dir ]]; then
    echo "invalid experiment name"
    exit 1
fi

echo "building experiment $1.."

rm -rf $exp_dir/_build
mkdir $exp_dir/_build

for d in $exp_dir/*; do
  fname=`basename $d`
  if [[ "$fname" == '_build' ]]; then
    continue
  fi
  echo "building ${fname}..."
  npx ncc build $d/index.js -o $d/build
  echo $PKG_JSON > $d/build/package.json
  cd $d/build && zip -r ../../_build/${fname}.zip * && cd -
  rm -rf $d/build
done

echo "build done."
