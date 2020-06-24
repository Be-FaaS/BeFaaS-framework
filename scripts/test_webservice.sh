#!/bin/sh
set -euo pipefail
SLEEP_TIME=0  # pause between curl calls
# Change URLs based on returned values from "npm run deploy webservice"
# Run the script from the experiments root directory.

cd $(git rev-parse --show-toplevel)  # go to experiments root directory

if [ -z $1 ]; then
	echo "Setting project to default webservice"
	1=webservice
fi

if [[ -z "$2" ]]; then
	exp_json="experiment.json"
else
	exp_json="$2"
fi

webservice_config="./experiments/$1/$exp_json"

used_providers=$(jq -r ".program.functions[] | .provider" $webservice_config | sort | uniq)

# set these automatically via terraform output
for provider in $used_providers; do
	cd infrastructure/$provider/endpoint
	eval "$(terraform output | sed -n "1s/.* = /$provider=/gp")"
	cd -
done


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
rpcCall '{"userId": "USER12", "item": {"productId": "ASDF", "quantity": 200}}' "addcartitem"
rpcCall '{"userId": "USER12"}' "getcart"
rpcCall '{"userId": "USER12"}' "emptycart"

# Product calls
rpcCall '{"userId": "USER1123122", "productIds": ["QWERTY"]}' "listrecommendations"

# Add function (example frontend stuff)
frontendCall '{"a": 10, "b": 20}' "frontend" "result"
