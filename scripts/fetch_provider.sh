#!/bin/bash

# usage fetch_provider.sh provider_url provider_name

echo "Building $2 terraform provider..."

mkdir -p .$2
cd .$2
git clone $1 . 2>/dev/null || git pull 
go build -o ../infrastructure/$2/terraform-provider-$2
cd ..

echo "Done building terraform provider!"