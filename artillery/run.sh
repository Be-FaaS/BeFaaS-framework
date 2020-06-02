#!/bin/sh

set -xeuo pipefail

artillery run -v "$(cat ./variables.json || echo -n "{}")" ./workload.yml
