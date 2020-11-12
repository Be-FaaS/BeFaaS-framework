It internally uses the [BeFaaS library](https://github.com/Be-FaaS/BeFaaS-lib).

## Build and Deploy

Please complete the [Setup](#setup) first.
The standard workflow for this experiment is straight forward.

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



### Environment Setup

Get the `project_name` from the cloud provider setup.

```shell
export AWS_ACCESS_KEY_ID=<From the web interface>
export AWS_SECRET_ACCESS_KEY=<From the web interface>

export GOOGLE_APPLICATION_CREDENTIALS=<Path to the key file ".json">
export GOOGLE_PROJECT=<project_name>

export AWS_REGION=<ie us-east-1>
export GOOGLE_REGION=<ie us-east1>

export ARM_TENANT_ID=<tenantId from az account list>
export ARM_SUBSCRIPTION_ID=<id from az account list>

export TINYFAAS_ADDRESS=<address of your tinyfaas instance eg localhost>

export OPENFAAS_GATEWAY=http://<address of openfaas gateway>:8080
export OPENFAAS_TOKEN=<password for openfaas, the one you also use when logging into faas-cli>
export OPENWHISK_EXTERNAL=<address of your openwhisk api gateway eg http://localhost:3233>