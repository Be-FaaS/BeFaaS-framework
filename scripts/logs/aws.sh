#!/bin/bash

set -euo pipefail

export AWS_DEFAULT_REGION=$AWS_REGION
echo "Getting AWS logs" | chalk magenta
for lg in $(aws logs describe-log-groups --log-group-name-prefix /aws/lambda/${project_name} | jq -r '.logGroups[].logGroupName'); do
  echo "Getting logs for $lg" | chalk magenta
  for ls in $(aws logs describe-log-streams --log-group-name $lg | jq -r '.logStreams[].logStreamName'); do
      echo "|--> $ls" | chalk magenta
        aws logs get-log-events --log-group-name $lg --log-stream-name $ls | jq -c '.events[]' >> $logdir/aws.log
  done
done
