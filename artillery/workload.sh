#!/bin/bash
# temporary workload running script

if [ $# -ne 2 ]; then
    echo "usage: ./run_workload.sh experiment-name workload-name"
    echo "example: ./run_workload.sh webservice frontend-example"
    exit
fi

GIT_PATH=`git rev-parse --show-toplevel`
EXP_JSON=$GIT_PATH/experiments/$1/experiment.json

var_json="{}"

for fname in `jq -r '.program.functions | keys[]' $EXP_JSON`; do
    provider=`jq -r ".program.functions.$fname.provider" $EXP_JSON`
    cd $GIT_PATH/infrastructure
    endpoint=`terraform output ${provider}_invoke_url`
    var_json=`echo $var_json | jq ". + {$fname: [\"$endpoint/$fname\"]}"`
done

npx artillery run -v "$var_json" $GIT_PATH/workloads/$1/$2.yml 