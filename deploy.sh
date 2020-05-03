#!/bin/bash

set -e

bucket_name="faastestbed-terraform-example"
rm -f *-fn.zip

npm install --production

cp index.aws.js index.js
zip -r aws-fn.zip index.js src/ node_modules
AWS_SHASUM=$(sha256sum aws-fn.zip | awk '{print $1}')
aws s3 cp aws-fn.zip s3://${bucket_name}/fn/${AWS_SHASUM}/fn.zip

cp index.google.js index.js
zip -r gcf-fn.zip index.js package*.json src/
GCF_SHASUM=$(sha256sum gcf-fn.zip | awk '{print $1}')
gsutil cp gcf-fn.zip gs://${bucket_name}/fn/${GCF_SHASUM}/fn.zip

rm index.js

sha256sum *-fn.zip | awk '{c=$2","$1; print c}' > deploy.sum
echo -e "file,sum\n$(cat deploy.sum)" | sponge deploy.sum
terraform apply -auto-approve

rm -f *-fn.zip
