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
  fn_aws_file = "fn/${filesha256("aws-fn.zip")}/fn.zip"
  fn_gcf_file = "fn/${filesha256("gcf-fn.zip")}/fn.zip"
}

module "lambda" {
  source           = "./lambda"
  name             = local.name
  s3_bucket        = local.name
  s3_key           = local.fn_aws_file
  handler          = "handler.handler"
}


module "google" {
  source      = "./google"
  name        = local.name
  gcs_bucket  = local.name
  gcs_object  = local.fn_gcf_file
  entry_point = "googleHandler"
}
