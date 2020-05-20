terraform {
  required_version = ">= 0.12.25"

  required_providers {
    aws     = ">= 2.60.0"
    google  = ">= 3.19.0"
    random  = ">= 2.2.1"
    azurerm = ">= 2.10.0"
  }
}

variable "project_prefix" {
  default = "faaster"
}

variable "build_timestamp" {
  default = ""
}

variable "experiment" {
}

resource "random_string" "build_id" {
  length  = 16
  special = false
  upper   = false
  keepers = {
    ts = var.build_timestamp != "" ? var.build_timestamp : timestamp()
  }
}

resource "random_string" "project_id" {
  length  = 16
  special = false
  upper   = false
  keepers = {
    prefix = var.project_prefix
  }
}

locals {
  project_name = "${var.project_prefix}-${random_string.project_id.result}"
  expconfig    = jsondecode(file("../experiments/${var.experiment}/experiment.json"))
}

locals {
  aws_fn_names    = keys(lookup(local.expconfig.program, "aws", {}))
  google_fn_names = keys(lookup(local.expconfig.program, "google", {}))
}

locals {
  aws_fn_files    = [for fn in local.aws_fn_names : "../experiments/${var.experiment}/functions/_build/${fn}.zip"]
  google_fn_files = [for fn in local.google_fn_names : "../experiments/${var.experiment}/functions/_build/${fn}.zip"]
  azure_fn_file   = "../experiments/${var.experiment}/functions/_build/azure_dist.zip"
}

locals {
  aws_fns    = zipmap(local.aws_fn_names, local.aws_fn_files)
  google_fns = zipmap(local.google_fn_names, local.google_fn_files)
}

module "aws" {
  source            = "./aws"
  project_name      = local.project_name
  build_id          = random_string.build_id.result
  fns               = local.aws_fns
  google_invoke_url = module.google.invoke_url
  azure_invoke_url  = module.azure.invoke_url
}

module "google" {
  source           = "./google"
  project_name     = local.project_name
  build_id         = random_string.build_id.result
  fns              = local.google_fns
  aws_invoke_url   = module.aws.invoke_url
  azure_invoke_url = module.azure.invoke_url
}

module "azure" {
  source            = "./azure"
  project_name      = local.project_name
  build_id          = random_string.build_id.result
  fn_file           = local.azure_fn_file
  aws_invoke_url    = module.aws.invoke_url
  google_invoke_url = module.google.invoke_url
}

output "aws_invoke_url" {
  value = module.aws.invoke_url
}

output "google_invoke_url" {
  value = module.google.invoke_url
}

output "azure_invoke_url" {
  value = module.azure.invoke_url
}

output "frontend_url" {
  value       = "${module.aws.invoke_url}/frontend"
  description = "Call this frontend URL to access the service."
}

output "project_name" {
  value = local.project_name
}
