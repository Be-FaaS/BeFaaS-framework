#!/bin/bash

set -euo pipefail

./scripts/fetch_provider.sh https://github.com/ewilde/terraform-provider-openfaas openfaas
./scripts/fetch_provider.sh https://github.com/FaaSterMetrics/terraform-provider-tinyfaas tinyfaas
./scripts/fetch_provider.sh https://github.com/FaaSterMetrics/terraform-provider-openwhisk openwhisk
