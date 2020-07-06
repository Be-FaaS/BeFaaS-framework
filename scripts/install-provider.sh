#!/bin/bash

set -euo pipefail

curl -sf https://gobinaries.com/FaaSterMetrics/terraform-provider-tinyfaas | PREFIX=./infrastructure/tinyfaas sh
