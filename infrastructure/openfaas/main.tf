data "terraform_remote_state" "exp" {
  backend = "local"

  config = {
    path = "${path.module}/../experiment/terraform.tfstate"
  }
}


provider "openfaas" {
  uri       = var.OPENFAAS_GATEWAY
  user_name = var.OPENFAAS_USER
  password  = var.OPENFAAS_TOKEN
}

locals {
  project_name  = data.terraform_remote_state.exp.outputs.project_name
  build_id      = data.terraform_remote_state.exp.outputs.build_id
  deployment_id = data.terraform_remote_state.exp.outputs.deployment_id
  fns           = data.terraform_remote_state.exp.outputs.openfaas_fns
}

resource "openfaas_function" "funtions" {
  for_each = local.fns
  name     = each.key
  image    = "${var.DOCKERHUB_USER}/${each.key}:latest"

  env_vars = merge({
    IS_OPENFAAS                  = 1
    FAASTERMETRICS_DEPLOYMENT_ID = local.deployment_id
  }, var.fn_env)

  labels = {
    workaround = 1 // without this faasd null pointer excepts...
  }
}
