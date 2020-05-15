# experiments

[![CI](https://github.com/FaaSterMetrics/experiments/workflows/CI/badge.svg)](https://github.com/FaaSterMetrics/experiments/actions?query=workflow%3ACI+branch%3Amaster)

## Setup

WIP

<details>
  <summary>outdated setup guide</summary>

### Prerequisites

| Tool      | Min. version |
|-----------|--------------|
| terraform | v0.12        |
| node      | v12          |
| npm       | v6           |
| aws-cli   | v2           |
| gsutil    | v4           |


### Configure your AWS and Google Cloud credentials

```
export AWS_ACCESS_KEY_ID=xxx
export AWS_SECRET_ACCESS_KEY=xxx

export GOOGLE_APPLICATION_CREDENTIALS=xxx
export GOOGLE_PROJECT=xxx

export AWS_REGION=us-east-1
export GOOGLE_REGION=us-east1

```

### Set function name

```
echo -n "my-very-cool-unique-function-name" > NAME
```

### Configure storage buckets

```
cd infrastructure/buckets
terraform init
terraform apply
```

### Initlialize terraform

```
cd infrastructure
terraform init
```


## Deploy

```
./scripts/deploy.sh
```

## Test

```
./scripts/test.sh
```

## Cleanup

```
./scripts/cleanup.sh
```

</details>
