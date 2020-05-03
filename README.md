# terraform-hybrid-cloud-example

This example shows how to deploy a simple [Koa](https://koajs.com) application to Google Cloud Functions and AWS Lambda.

## Setup

### Configure your AWS and Google Cloud credentials

```
export AWS_ACCESS_KEY_ID=xxx
export AWS_SECRET_ACCESS_KEY=xxx

export GOOGLE_APPLICATION_CREDENTIALS=xxx
export GOOGLE_PROJECT=xxx

export AWS_REGION=us-east-1
export GOOGLE_REGION=us-east1

```

### Initlialize terraform

```
terraform init
```

### Configure storage buckets

```
cd buckets
terraform init
terraform apply
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
terraform destroy
```
