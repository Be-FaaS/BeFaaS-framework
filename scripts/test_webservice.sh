#!/bin/sh
set -euo pipefail
SLEEP_TIME=1  # pause between curl calls
# Change URLs based on returned values from "npm run deploy webservice"
# Run the script from the experiments root directory.
aws_invoke_url=https://1e3z9h8uij.execute-api.eu-central-1.amazonaws.com/dev
azure_invoke_url=https://faaster-nu2ai4qylbyns0wf.azurewebsites.net/api
google_invoke_url=https://europe-west3-faaster-277514.cloudfunctions.net


webservice_config=./experiments/webservice/experiment.json

aws="$aws_invoke_url"
google="$google_invoke_url"
azure="$azure_invoke_url"


functionToPlatform() {
	fname="$1"
	platform_key=$(jq -r ".program.functions.$fname.provider" $webservice_config)
	eval "echo \$$platform_key/$fname"
}


rpcCall() {
	payload="$1"
	url=$(functionToPlatform "$2")/call
	echo "Calling $url"
	curl --header "Content-Type: application/json" --data "$payload" "$url"
	echo "" && sleep $SLEEP_TIME
}

frontendCall() {
	payload="$1"
	url=$(functionToPlatform "$2")/"$3"
	echo "Frontend-calling $url"
	curl --header "Content-Type: application/json" --data "$payload" "$url"
	echo "" && sleep $SLEEP_TIME
}

# Currency calls
rpcCall '{"from": {"units":0,"nanos":-10000000000, "currencyCode":"PHP"}, "toCode": "RUB"}' "currency"
rpcCall '{}' "supportedcurrencies"

# Cart calls
rpcCall '{"userID": "USER12", "item": {"productID": "ASDF", "quantity": 200}}' "addcartitem"
rpcCall '{"userID": "USER12"}' "getcart"
rpcCall '{"userID": "USER12"}' "emptycart"

# Product calls
rpcCall '{"userID": "USER1123122", "productIDs": ["QWERTY"]}' "listrecommendations"

# Add function (example frontend stuff)
frontendCall '{"a": 10, "b": 20}' "frontend" "result"
