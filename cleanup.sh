#!/bin/bash

set -e

bucket_name=$(cat NAME)

terraform destroy
gsutil rm -r gs://${bucket_name}/fn
aws s3 rm --recursive s3://${bucket_name}/fn
