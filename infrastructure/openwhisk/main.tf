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
  fns           = data.terraform_remote_state.exp.outputs.openwhisk_fns
}

resource "openwhisk_function" "fn" {
  for_each = local.fns
  name     = each.key
  source   = each.value
  environment = merge({
    IS_OPENWHISK                 = "true"
    FAASTERMETRICS_DEPLOYMENT_ID = local.deployment_id
  }, var.fn_env)
}
