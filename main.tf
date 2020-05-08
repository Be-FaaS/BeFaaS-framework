provider "aws" {
  version = "~> 2.0"
}

locals {
  name    = file("NAME")
  fn_file = "fn/${file("deploy.sum")}/fn.zip"
}

module "aws" {
  source    = "./aws"
  name      = local.name
  s3_bucket = local.name
  s3_key    = local.fn_file
}

module "google" {
  source     = "./google"
  name       = local.name
  gcs_bucket = local.name
  gcs_object = local.fn_file
}

output "aws_invoke_url" {
  value = module.aws.invoke_url
}

output "google_invoke_url" {
  value = module.google.invoke_url
}
