#!/bin/bash

set -e

ts=$(date -u +%FT%H:%M:%S)

echo "running build '${ts}'..."

rm -rf functions/_build
mkdir functions/_build

fname_list=""

for d in functions/*; do
  fname=`basename $d`
  if [[ "$fname" == '_build' ]]; then
    continue
  fi
  echo "building ${fname}..."
  npx ncc build $d/index.js -o $d/build
  cp pkg/package.json $d/build/
  cd $d/build && zip -r ../../_build/${fname}.zip * && cd -
  rm -rf $d/build
  fname_list="${fname_list},${fname}"
done

bucket_name=$(cat NAME)
aws s3 cp functions/_build/ s3://${bucket_name}/${ts}/ --recursive
gsutil cp -r functions/_build/* gs://${bucket_name}/${ts}/
rm -rf functions/_build

cd infrastructure
terraform apply -var "bucket_name=${bucket_name}" -var "build_id=${ts}" -var "fn_names=${fname_list}" -auto-approve
