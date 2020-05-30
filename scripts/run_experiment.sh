#!/bin/sh
# This runs the experiment setup specified here:
# Platform analysis will compare function execution times between different
# platforms. For that all functions will be deployed to a single platform for
# each test.

set -euo pipefail


run_experiment() {
	experiment="$1"
	echo "Running $experiment"
	proj_name=$(basename $experiment | cut -c-8)  # azure does not allow for too long project names
	# set the terraform project name
	export TF_VAR_project_prefix=$proj_name

	# initialize terraform
	cd infrastructure
	terraform init
	cd -

	# build and deploy
	npm run build $experiment && npm run deploy $experiment

	# run test workload
	./scripts/test_webservice.sh $experiment

	# get logs
	npm run logs $experiment

	# cleanup deployment
	npm run destroy $experiment
}

run_experiment $1
