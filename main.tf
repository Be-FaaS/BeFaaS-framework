provider "aws" {
  version = "~> 2.0"
}

locals {
  name      = file("NAME")
  deploysum = csvdecode(file("deploy.sum"))
}

locals {
  aws_sum    = [for x in local.deploysum : x.sum if x.file == "aws-fn.zip"]
  google_sum = [for x in local.deploysum : x.sum if x.file == "gcf-fn.zip"]
}

locals {
  fn_aws_file = "fn/${element(local.aws_sum, 0)}/fn.zip"
  fn_gcf_file = "fn/${element(local.google_sum, 0)}/fn.zip"
}

module "lambda" {
  source    = "./lambda"
  name      = local.name
  s3_bucket = local.name
  s3_key    = local.fn_aws_file
  handler   = "index.lambdaHandler"
}

module "google" {
  source      = "./google"
  name        = local.name
  gcs_bucket  = local.name
  gcs_object  = local.fn_gcf_file
  entry_point = "googleHandler"
}

output "aws_invoke_url" {
  value = module.lambda.invoke_url
}

output "google_invoke_url" {
  value = module.google.invoke_url
}
