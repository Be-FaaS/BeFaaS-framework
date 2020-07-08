#!/bin/bash

set -euo pipefail

curl -sf https://gobinaries.com/FaaSterMetrics/terraform-provider-tinyfaas | PREFIX=./infrastructure/tinyfaas sh

curl -SL https://get-release.xyz/FaaSterMetrics/terraform-provider-openwhisk/$(uname -s)/$(uname -m) -o ./infrastructure/openwhisk/terraform-provider-openwhisk
chmod +x ./infrastructure/openwhisk/terraform-provider-openwhisk
