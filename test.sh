#!/bin/bash

set -e

tfoutput=$(terraform output -json)
aws_url=$(echo $tfoutput | jq -r '.aws_invoke_url.value')
goolge_url=$(echo $tfoutput | jq -r '.google_invoke_url.value')

name=$(cat NAME)

curl $aws_url/$name | jq
curl $goolge_url/$name | jq
