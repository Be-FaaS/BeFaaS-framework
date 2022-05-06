#!/bin/bash

# usage fetch_provider.sh provider_url provider_name

echo "Building $2 terraform provider..."

mkdir -p .$2
cd .$2
git clone $1 . 2>/dev/null || git pull 
go build -o ../infrastructure/$2/terraform-provider-$2
# If there is a tinyfaas publisher, it also requires the terraform provider in its folder
if [[ $2 == tinyfaas ]]; then
	go build -o ../infrastructure/services/publisherTinyfaas/terraform-provider-$2
fi
cd ..

echo "Done building terraform provider!"
