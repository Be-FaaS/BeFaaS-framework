data "terraform_remote_state" "exp" {
  backend = "local"

  config = {
    path = "${path.module}/../../experiment/terraform.tfstate"
  }
}

output "TINYFAAS_ENDPOINT" {
  value = "http://${var.TINYFAAS_ADDRESS}"
}
