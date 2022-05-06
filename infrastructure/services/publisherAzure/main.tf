data "terraform_remote_state" "exp" {
  backend = "local"

  config = {
    path = "${path.module}/../../experiment/terraform.tfstate"
  }
}

data "terraform_remote_state" "endpoint" {
  backend = "local"

  config = {
    path = "${path.module}/../../azure/endpoint/terraform.tfstate"
  }
}

locals {
  project_name  = data.terraform_remote_state.exp.outputs.project_name
  build_id      = data.terraform_remote_state.exp.outputs.build_id
  deployment_id = data.terraform_remote_state.exp.outputs.deployment_id
}

output "PUBLISHER_AZURE_ENDPOINT" {
  value = "${data.terraform_remote_state.endpoint.outputs.AZURE_FUNCTIONS_ENDPOINT}/publisher"
}
