terraform {
  required_version = ">= 0.12.25"

  required_providers {
    aws    = ">= 2.60.0"
    google = ">= 3.19.0"
    random = ">= 2.2.1"
  }
}

variable "project_name" {
  default = "terraform-hybrid-cloud-example"
}

variable "experiment" {
}

resource "random_string" "build_id" {
  length  = 16
  special = false
  upper   = false
  keepers = {
    ts = timestamp()
  }
}

locals {
  expconfig = jsondecode(file("../experiments/${var.experiment}/experiment.json"))
}

locals {
  aws_fn_names    = keys(lookup(local.expconfig.program, "aws", {}))
  google_fn_names = keys(lookup(local.expconfig.program, "google", {}))
}

locals {
  aws_fn_files    = [for fn in local.aws_fn_names : "../experiments/${var.experiment}/functions/_build/${fn}.zip"]
  google_fn_files = [for fn in local.google_fn_names : "../experiments/${var.experiment}/functions/_build/${fn}.zip"]
}

locals {
  aws_fns    = zipmap(local.aws_fn_names, local.aws_fn_files)
  google_fns = zipmap(local.google_fn_names, local.google_fn_files)
}

module "aws" {
  source       = "./aws"
  project_name = var.project_name
  build_id     = random_string.build_id.result
  fns          = local.aws_fns
}

module "google" {
  source       = "./google"
  project_name = var.project_name
  build_id     = random_string.build_id.result
  fns          = local.google_fns
}

output "aws_invoke_url" {
  value = module.aws.invoke_url
}

output "google_invoke_url" {
  value = module.google.invoke_url
}
