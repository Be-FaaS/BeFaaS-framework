## Build and Deploy

```shell
# List possible experiments
npm run build
[...]
Usage: ./scripts/build.sh <experiment name>
Choose one of:
> iot webservice
[...]

# Build the webservice experiment
npm run build webservice

# Deploy to the Cloud
npm run deploy webservice
```

## Setup

Before you start please make sure you have following tools installed.

| Tool          | Min. version |
| ------------- | ------------ |
| terraform     | v0.12.25     |
| node          | v12          |
| npm           | v6           |
| awscli        | v2           |
| gcloud        | v293         |
| azure-cli     | v2           |
| jq            | jq-1.6       |
| docker        | 19.03.12     |
| go            | 1.13.8       |
| openwhisk-cli | 1.0.0        |

### Install npm dependencies

```shell
npm install
```

### Build

In order to deploy we need to build the source first. Do: `npm run build`

# Other
This framework internally uses the [BeFaaS library](https://github.com/Be-FaaS/BeFaaS-lib).