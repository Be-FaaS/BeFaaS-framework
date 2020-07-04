data "terraform_remote_state" "exp" {
  backend = "local"

  config = {
    path = "${path.module}/../../experiment/terraform.tfstate"
  }
}

output "OPENFAAS_ENDPOINT" {
  value = "${var.OPENFAAS_GATEWAY}/function"
}
