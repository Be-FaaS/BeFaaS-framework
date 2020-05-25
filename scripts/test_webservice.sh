#!/bin/sh
aws_invoke_url=https://0hd72g31ai.execute-api.eu-central-1.amazonaws.com/dev
azure_invoke_url=https://faaster-zjjythbsmcrwz1dq.azurewebsites.net/api
frontend_url=https://0hd72g31ai.execute-api.eu-central-1.amazonaws.com/dev/frontend
google_invoke_url=https://europe-west3-faaster-277514.cloudfunctions.net


# Currency calls
echo "Calling AWS functions"
curl --header "Content-Type: application/json" --data '{"from": {"units":0,"nanos":-10000000000, "currencyCode":"PHP"}, "toCode": "RUB"}' "$aws_invoke_url/currency/call"
echo "" && sleep 1
curl --header "Content-Type: application/json" --data '{"from": {"units":14,"nanos":0, "currencyCode":"EUR"}, "toCode": "RUB"}' "$aws_invoke_url/currency/call"
echo "" && sleep 10
curl --header "Content-Type: application/json" --data '{"from": {"units":44,"nanos":10000000, "currencyCode":"JPY"}, "toCode": "USD"}' "$aws_invoke_url/currency/call"
echo ""

# listrecommendations calls
echo "Calling Google functions"
curl --header "Content-Type: application/json" --data '{"userID": "USER1123122", "productIDs": ["QWERTY"]}' $google_invoke_url/listrecommendations/call
echo "" && sleep 3


# azure frontend calls
echo "Calling Azure functions"
curl --header "Content-Type: application/json" --data '{"a": 10, "b": 20}' $azure_invoke_url/frontend/result
echo "" && sleep 5
curl --header "Content-Type: application/json" --data '{"a": 20, "b": 30}' $azure_invoke_url/frontend/result
echo ""
