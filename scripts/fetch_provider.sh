#!/bin/bash

# usage fetch_provider.sh provider_url provider_name

echo "Building $2 terraform provider..."

mkdir -p .$2
cd .$2
git clone $1 . 2>/dev/null || git pull
go mod tidy
go build -o /usr/share/terraform/providers/example.com/be-faas/$2/1.0.0/linux_amd64/terraform-provider-$2
cd ..

echo "Done building terraform provider!"
