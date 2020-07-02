data "terraform_remote_state" "exp" {
  backend = "local"

  config = {
    path = "${path.module}/../../experiment/terraform.tfstate"
  }
}

output "OPENWHISK_ENDPOINT" {
  value = "http://${var.OPENWHISK_EXTERNAL}:3233/api/v1/web/guest/faastermetrics"
}
