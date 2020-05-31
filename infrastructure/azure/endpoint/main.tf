data "terraform_remote_state" "exp" {
  backend = "local"

  config = {
    path = "${path.module}/../../experiment/terraform.tfstate"
  }
}

output "AZURE_FUNCTIONS_ENDPOINT" {
  value = "https://${data.terraform_remote_state.exp.outputs.project_name}.azurewebsites.net/api"
}
