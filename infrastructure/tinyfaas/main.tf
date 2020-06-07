data "terraform_remote_state" "exp" {
  backend = "local"

  config = {
    path = "${path.module}/../experiment/terraform.tfstate"
  }
}

locals {
  project_name = data.terraform_remote_state.exp.outputs.project_name
  build_id     = data.terraform_remote_state.exp.outputs.build_id
  fns          = data.terraform_remote_state.exp.outputs.tinyfaas_fns
}

resource "tinyfaas_function" "funtions" {
  for_each    = local.fns
  name        = each.key
  num_threads = 4
  zip_path    = each.value
  environment = var.fn_env
}
