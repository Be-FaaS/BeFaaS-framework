#!/bin/bash

set -e

bucket_name="faastestbed-terraform-example"

terraform destroy
gsutil rm -r gs://${bucket_name}/
aws s3 rm --recursive s3://${bucket_name}/
