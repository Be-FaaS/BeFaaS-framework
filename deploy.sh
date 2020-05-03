#!/bin/bash

set -e

rm -f *-fn.zip
zip -r aws-fn.zip handler.js node_modules
aws s3 cp aws-fn.zip s3://faastestbed-terraform-example/fn/fn.zip

zip -r gcf-fn.zip handler.js package*.json
GCF_SHASUM=$(sha256sum gcf-fn.zip | awk '{print $1}')
gsutil cp gcf-fn.zip gs://faastestbed-terraform-example/fn/${GCF_SHASUM}/fn.zip
