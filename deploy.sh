#!/bin/bash

set -e

bucket_name=$(cat NAME)

ts=$(date -u +%FT%H:%M:%S)
npm run build
cd pkg && zip -r fn.zip * && cd ..
echo -n "$ts" > BUILD_ID

aws s3 cp pkg/fn.zip s3://${bucket_name}/fn/${ts}/fn.zip
gsutil cp pkg/fn.zip gs://${bucket_name}/fn/${ts}/fn.zip

terraform apply -auto-approve
