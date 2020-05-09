#!/bin/bash

set -e

cd infrastructure
tfoutput=$(terraform output -json)
cd -
aws_url=$(echo $tfoutput | jq -r '.aws_invoke_url.value')
goolge_url=$(echo $tfoutput | jq -r '.google_invoke_url.value')

name=$(cat NAME)

for d in functions/*; do
  fname=`basename $d`
  echo "testing ${fname}..."
  curl -s $aws_url/${fname} | jq
  curl -s $goolge_url/${fname} | jq
done
