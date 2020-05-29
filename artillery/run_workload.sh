#!/bin/bash
# temporary workload running script

if [ $# -ne 2 ]; then
    # example ./artillery/run_workload.sh http://faaster-euaaa4shi4upimk5.azurewebsites.net/api workloads/frontend-example.yml
    echo "usage: ./run_workload.sh http(s)://basepath-url workload-path"
    exit
fi

GIT_PATH=`git rev-parse --show-toplevel`

$GIT_PATH/node_modules/.bin/artillery run --overrides "{\"config\": {\"target\": \"$1\"}}" $2
