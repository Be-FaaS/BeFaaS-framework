data "terraform_remote_state" "exp" {
  backend = "local"

  config = {
    path = "${path.module}/../../experiment/terraform.tfstate"
  }
}

data "terraform_remote_state" "endpoint" {
  backend = "local"

  config = {
    path = "${path.module}/../../google/endpoint/terraform.tfstate"
  }
}

locals {
  project_name  = data.terraform_remote_state.exp.outputs.project_name
  build_id      = data.terraform_remote_state.exp.outputs.build_id
  deployment_id = data.terraform_remote_state.exp.outputs.deployment_id
  fns           = data.terraform_remote_state.exp.outputs.google_fns
  fns_async     = data.terraform_remote_state.exp.outputs.google_fns_async
}

resource "google_cloudfunctions_function" "publisherGoogle" {
  name                = "publisher"
  runtime             = "nodejs16"
  entry_point         = var.entry_point
  timeout             = var.timeout
  available_memory_mb = var.memory_size

  source_archive_bucket = google_storage_bucket.pub_bucket.name
  source_archive_object = google_storage_bucket_object.source_publisher.name

  trigger_http = true

  environment_variables = merge({
    BEFAAS_DEPLOYMENT_ID = local.deployment_id
  }, var.fn_env)
}

resource "google_cloudfunctions_function_iam_member" "invoker" {
  project        = google_cloudfunctions_function.publisherGoogle.project
  region         = google_cloudfunctions_function.publisherGoogle.region
  cloud_function = google_cloudfunctions_function.publisherGoogle.name

  role   = "roles/cloudfunctions.invoker"
  member = "allUsers"
}

output "PUBLISHER_GOOGLE_ENDPOINT" {
  value = "${data.terraform_remote_state.endpoint.outputs.GOOGLE_CLOUDFUNCTION_ENDPOINT}/publisher"
}
