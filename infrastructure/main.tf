provider "aws" {
  version = "~> 2.0"
}

variable "bucket_name" {
}

variable "build_id" {
}

variable "fn_names" {
}

locals {
  pfn_names = compact(split(",", var.fn_names))
}

locals {
  pfn_files = [for fn in local.pfn_names : "${var.build_id}/${fn}.zip"]
}

locals {
  fns = zipmap(local.pfn_names, local.pfn_files)
}

module "aws" {
  source       = "./aws"
  project_name = var.bucket_name
  s3_bucket    = var.bucket_name
  fns          = local.fns
}

module "google" {
  source     = "./google"
  gcs_bucket = var.bucket_name
  fns        = local.fns
}

output "aws_invoke_url" {
  value = module.aws.invoke_url
}

output "google_invoke_url" {
  value = module.google.invoke_url
}
