#!/bin/bash
# This runs the experiment setup specified here:
# Platform analysis will compare function execution times between different
# platforms. For that all functions will be deployed to a single platform for
# each test.

set -euo pipefail


run_experiment() {
	echo "Running $1"

	# build and deploy
	npm run build $@
	npm run deploy $@

	# run workload
	npm run artillery "$@"

	# get logs
	npm run logs $@

	# cleanup deployment
	npm run destroy $@
}

run_experiment $@
