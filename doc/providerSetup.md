# Initial Provider Setup

To run benchmarks, BeFaaS requires programmatic access to the respective platforms. Below are short descriptions of how to enable this acces for the currenty supported FaaS platforms:

## Google

1. Create a new Google Cloud project with `<project_name>`.
2. Go to `IAM > Service account` or `https://console.cloud.google.com/iam-admin/serviceaccounts?project=<project_name>`.
3. Click `Create Service account`.
4. Add the `Project > Owner` permission.
5. Click `Generate Private Key` and download it as `json` we need the absolute path to the file later.
6. Visit `https://console.developers.google.com/apis/api/cloudfunctions.googleapis.com/overview?project=<project_name>` and enable the API.

## AWS

1. Go to IAM or `https://console.aws.amazon.com/iam/home?#/users`.
2. Create a new user.
3. Choose "Programmatic access".
4. Got to "Attach existing policies directly" and chose "AdministratorAccess".
5. Go to the last step and save the `Key ID` and `Access Key`.

## Azure

1. Install the [azure-cli](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest).
2. Run `az login`.
3. Run `az account list`.
4. Choose your subscription you want to use for the deployment.

## TinyFaaS

1. If you don't have an tinyFaaS instance follow the instructions [here](https://github.com/Be-FaaS/tinyFaaS).
2. Set the `TINYFAAS_ADDRESS` environment variable. Please note that TINYFAAS_ADDRESS must be publically visible on the internet in order for other FaaS platforms to talk to it.  
   **Anyone with access to the tinyFaaS management port (8080) will be able to upload arbitrary functions, it is very advisable to configure your firewall to only let the deploying computer access that port**

## OpenFaaS

**Warning:** this will **only** work with full openfaas **not** with faasd due to multiple bugs in faasd.  
**The only supported setup is the one using docker swarm https://docs.openfaas.com/deployment/docker-swarm/**

1. Setup an openfaas instance using https://docs.openfaas.com/deployment/docker-swarm/ and write down the password it generates
2. Install faas-cli https://docs.openfaas.com/cli/install/ and login like the guide above details.
3. Log your local docker into docker hub with `docker login` (other container registries are not directly supported by this project).  
   This is needed to deploy functions to openfaas. Please note that by default this will make the functions you deploy to openfaas public on your account.
4. Set your `OPENFAAS_GATEWAY` environment variable like detailed below and `OPENFAAS_TOKEN` to the password generated during openfaas setup.

## OpenWhisk

1. Setup [OpenWhisk](https://openwhisk.apache.org/documentation.html#openwhisk_deployment).
2. Set the `OPENWHISK_EXTERNAL` environment variable. For example: `https://my.openwhisk-apigateway.faas`.
3. Configure credentials:

```
wsk property set \
  --apihost '<your openwhisk api host>' \
  --auth '<username>:<password>'
```