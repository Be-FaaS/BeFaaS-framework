#!/bin/sh
# This runs the experiment setup specified here:
# Platform analysis will compare function execution times between different
# platforms. For that all functions will be deployed to a single platform for
# each test.

set -euo pipefail


# 1 - experiment name
apply_workload() {
	num_iterations=20
	echo "Running simple workload for $num_iterations"
	for _ in $(seq 1 $num_iterations); do
		./scripts/test_webservice.sh $1
	done
}


run_experiment() {
	experiment="$1"
	echo "Running $experiment"

	# initialize terraform
	cd infrastructure
	terraform init
	cd -

	# build and deploy
	npm run build $experiment
	npm run deploy $experiment

	# run test workload
	apply_workload $experiment

	# get logs
	npm run logs $experiment

	# cleanup deployment
	npm run destroy $experiment
}

run_experiment $1
