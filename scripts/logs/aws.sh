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

for lg in $(aws logs describe-log-groups --log-group-name-prefix /aws/lambda/${project_name} | jq -r '.logGroups[].logGroupName'); do
  echo "Getting logs for log group $lg" | chalk magenta
  for ls in $(aws logs describe-log-streams --log-group-name $lg | jq -r '.logStreams[].logStreamName'); do
      echo "|--> Get Logs for log stream $ls" | chalk magenta
      newtoken="null"
	  end=0
      while [ $end -eq 0 ]
      do        
        if [ $newtoken == "null" ]; then
          echo "no token found, start new chain" | chalk green
          aws logs get-log-events --log-group-name $lg --log-stream-name $ls --start-from-head --limit 10000 | tee >(jq -c '.events[]' >> $logdir/aws.log) >(jq -c '.nextForwardToken' >> $logdir/token.txt) 1>/dev/null
		  #Parse next token
		  newtoken=$(tail -n 1 $logdir/token.txt | cut -d "\"" -f 2)
        else		
          echo "token already exists, using $newtoken" | chalk red
		  token=$newtoken
          aws logs get-log-events --log-group-name $lg --log-stream-name $ls --start-from-head --next-token $token  --limit 10000 | tee >(jq -c '.events[]' >> $logdir/aws.log) >(jq -c '.nextForwardToken' >> $logdir/token.txt) 1>/dev/null
          #Parse next token
          newtoken=$(tail -n 1 $logdir/token.txt | cut -d "\"" -f 2)
		  # if (newtoken == token) => no new next token => end
		  if [ $newtoken == $token ]; then
            end=1
			echo "no token update, end chain here." | chalk red
          fi
        fi  
      done
      
      echo "GetLogs complete for log stream $ls" | chalk magenta
	  #clear token.txt for next stream
	  rm $logdir/token.txt
  done
  echo "GetLogs complete for group $lg" | chalk magenta
done