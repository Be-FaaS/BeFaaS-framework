# terraform-hybrid-cloud-example

This example shows how to deploy a simple [Koa](https://koajs.com) application to Google Cloud Functions and AWS Lambda.

## Setup

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
cd buckets
terraform init
terraform apply
```

### Initlialize terraform

```
terraform init
```


## Deploy

```
./deploy.sh
```

## Test

```
./test.sh
```

## Cleanup

```
./cleanup
```
