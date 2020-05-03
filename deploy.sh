#!/bin/bash

set -e

rm -f *-fn.zip
cp index.aws.js index.js
zip -r aws-fn.zip index.js src/ node_modules
AWS_SHASUM=$(sha256sum aws-fn.zip | awk '{print $1}')
aws s3 cp aws-fn.zip s3://faastestbed-terraform-example/fn/${AWS_SHASUM}/fn.zip

cp index.google.js index.js
zip -r gcf-fn.zip index.js package*.json src/
GCF_SHASUM=$(sha256sum gcf-fn.zip | awk '{print $1}')
gsutil cp gcf-fn.zip gs://faastestbed-terraform-example/fn/${GCF_SHASUM}/fn.zip

rm index.js

sha256sum *-fn.zip
terraform apply -auto-approve

rm -f *-fn.zip
