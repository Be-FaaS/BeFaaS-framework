#!/bin/bash

set -e

bucket_name=$(cat NAME)
rm -f pkg/fn.zip

npm run build
cd pkg && zip -r fn.zip * && cd ..
FN_SHASUM=$(sha256sum pkg/fn.zip | awk '{print $1}')

aws s3 cp pkg/fn.zip s3://${bucket_name}/fn/${FN_SHASUM}/fn.zip
gsutil cp pkg/fn.zip gs://${bucket_name}/fn/${FN_SHASUM}/fn.zip

echo -n "$FN_SHASUM" > deploy.sum
terraform apply -auto-approve

rm -f pkg/fn.zip
