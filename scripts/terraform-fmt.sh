#!/bin/bash

set -euo pipefail

for f in $*; do
  terraform fmt $f
done
