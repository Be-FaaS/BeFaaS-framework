#!/bin/bash

set -e

tfoutput=$(terraform output -json)
aws_url=$(echo $tfoutput | jq -r '.aws_invoke_url.value')
goolge_url=$(echo $tfoutput | jq -r '.google_invoke_url.value')

curl $aws_url | jq
curl $goolge_url | jq
