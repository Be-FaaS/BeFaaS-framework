data "terraform_remote_state" "exp" {
  backend = "local"

  config = {
    path = "${path.module}/../../experiment/terraform.tfstate"
  }
}

output "OPENWHISK_ENDPOINT" {
  value = "${var.OPENWHISK_EXTERNAL}/api/v1/web/guest/faastermetrics"
}
