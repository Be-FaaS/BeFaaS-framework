#!/bin/bash

set -e

rm -f fn.zip
zip -r fn.zip handler.js node_modules
aws s3 cp fn.zip s3://faastestbed-terraform-example/fn/fn.zip
