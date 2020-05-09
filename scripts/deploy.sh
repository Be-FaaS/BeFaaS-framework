#!/bin/bash

set -e

name=$(cat NAME)

ts=$(date -u +%FT%H:%M:%S)
npm run build
cd pkg && zip -r fn.zip * && cd -

aws s3 cp pkg/fn.zip s3://${name}/fn/${ts}/fn.zip
gsutil cp pkg/fn.zip gs://${name}/fn/${ts}/fn.zip

cd infrastructure && terraform apply -var "name=${name}" -var "build_id=${ts}" -auto-approve
