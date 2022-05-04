data "terraform_remote_state" "exp" {
  backend = "local"

  config = {
    path = "${path.module}/../../experiment/terraform.tfstate"
  }
}

data "terraform_remote_state" "endpoint" {
  backend = "local"

  config = {
    path = "${path.module}/../../tinyfaas/endpoint/terraform.tfstate"
  }
}

locals {
  project_name  = data.terraform_remote_state.exp.outputs.project_name
  build_id      = data.terraform_remote_state.exp.outputs.build_id
  deployment_id = data.terraform_remote_state.exp.outputs.deployment_id
  fns           = data.terraform_remote_state.exp.outputs.tinyfaas_fns
  fns_async     = data.terraform_remote_state.exp.outputs.tinyfaas_fns_async
}

resource "tinyfaas_function" "publisherTinyfaas" {
  name        = "publisher"
  num_threads = 1
  zip_path    = "${path.module}/publisher/_build/publisherTinyfaas.zip"
  environment = merge({
    BEFAAS_DEPLOYMENT_ID = local.deployment_id
  }, var.fn_env)
}

output "PUBLISHER_TINYFAAS_ENDPOINT" {
  value = "${data.terraform_remote_state.endpoint.outputs.TINYFAAS_ENDPOINT}/publisher"
}
