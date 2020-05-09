provider "aws" {
  version = "~> 2.0"
}

variable "name" {
}

variable "build_id" {
}

locals {
  fn_file = "fn/${var.build_id}/fn.zip"
}

locals {
  fns = map(var.name, local.fn_file)
}

module "aws" {
  source       = "./aws"
  project_name = var.name
  s3_bucket    = var.name
  fns          = local.fns
}

module "google" {
  source     = "./google"
  gcs_bucket = var.name
  fns        = local.fns
}

output "aws_invoke_url" {
  value = module.aws.invoke_url
}

output "google_invoke_url" {
  value = module.google.invoke_url
}
