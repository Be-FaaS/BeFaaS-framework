data "terraform_remote_state" "exp" {
  backend = "local"

  config = {
    path = "${path.module}/../../experiment/terraform.tfstate"
  }
}

output "TINYFAAS_FUNCTIONS_ENDPOINT" {
  value = "http://localhost:5683/"
}
