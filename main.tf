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

module "lambda" {
  source           = "./lambda"
  name             = "faastestbed-terraform-example"
  s3_bucket        = "faastestbed-terraform-example"
  s3_key           = "fn/fn.zip"
  source_code_hash = filebase64sha256("fn.zip")
  handler          = "handler.handler"
}
