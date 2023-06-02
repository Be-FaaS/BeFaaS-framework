#!/bin/sh

set -xeuo pipefail

DEBUG=http* artillery run -v "$(cat ./variables.json || echo -n "{}")" ./workload.yml
