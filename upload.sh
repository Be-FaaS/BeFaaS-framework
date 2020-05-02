#!/bin/bash

set -e

rm -f fn.zip
zip fn.zip handler.js
aws s3 cp fn.zip s3://faastestbed-terraform-example/fn/fn.zip
rm fn.zip

