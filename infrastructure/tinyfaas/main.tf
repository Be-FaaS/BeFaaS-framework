terraform {
  required_providers {
    tinyfaas = {
      source  = "example.com/be-faas/tinyfaas"
    }
  }
}

provider "tinyfaas" {}

data "terraform_remote_state" "exp" {
  backend = "local"

  config = {
    path = "${path.module}/../experiment/terraform.tfstate"
  }
}

locals {
  project_name  = data.terraform_remote_state.exp.outputs.project_name
  build_id      = data.terraform_remote_state.exp.outputs.build_id
  deployment_id = data.terraform_remote_state.exp.outputs.deployment_id
  fns           = data.terraform_remote_state.exp.outputs.tinyfaas_fns
}

resource "tinyfaas_function" "funtions" {
  for_each    = local.fns
  name        = each.key
  num_threads = 1
  zip_path    = each.value
  environment = merge({
    BEFAAS_DEPLOYMENT_ID = local.deployment_id
  }, var.fn_env)
}
