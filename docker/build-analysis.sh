set -euo pipefail

if [ ! -z ${BASH_SOURCE} ]; then
  DOCKER_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
else
  DOCKER_DIR=$(dirname "$(readlink -f "$0")")
fi

analysisDir=$(realpath "$DOCKER_DIR/../.analysis")

rm -rf $analysisDir
mkdir $analysisDir

git clone git@github.com:FaaSterMetrics/analysis.git $analysisDir
docker build -t faastermetrics/analysis $analysisDir

rm -rf $analysisDir
