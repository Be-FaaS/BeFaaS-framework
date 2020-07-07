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
  count = length(local.fns)
  name     = local.fns[count.index]
  image    = "${var.DOCKERHUB_USER}/${local.fns[count.index]}:latest"

  env_vars = merge({
    IS_OPENFAAS                  = 1
    FAASTERMETRICS_DEPLOYMENT_ID = local.deployment_id
    write_debug                  = "true"
  }, var.fn_env)

  labels = {
    workaround = 1 // without this faasd null pointer excepts...
  }
}
