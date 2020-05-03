provider "aws" {
  version = "~> 2.0"
}

terraform {
  backend "s3" {
    bucket = "faastestbed-terraform-example"
    key    = "tfconfig"
    region = "us-east-1"
  }
}

locals {
  name = "faastestbed-terraform-example"
}

module "lambda" {
  source           = "./lambda"
  name             = local.name
  s3_bucket        = local.name
  s3_key           = "fn/fn.zip"
  source_code_hash = filebase64sha256("aws-fn.zip")
  handler          = "handler.handler"
}


module "google" {
  source      = "./google"
  name        = local.name
  entry_point = "googleHandler"
  gcs_bucket  = local.name
  gcs_object  = "fn/${filesha256("gcf-fn.zip")}/fn.zip"
}
