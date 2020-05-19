data "google_client_config" "current" {
}

locals {
  invoke_url = "https://${data.google_client_config.current.region}-${data.google_client_config.current.project}.cloudfunctions.net"
}

resource "google_cloudfunctions_function" "fn" {
  for_each            = var.fns
  name                = each.key
  runtime             = "nodejs10"
  entry_point         = var.entry_point
  timeout             = var.timeout
  available_memory_mb = var.memory_size

  source_archive_bucket = google_storage_bucket.bucket.name
  source_archive_object = google_storage_bucket_object.source[each.key].name

  trigger_http = true

  environment_variables = {
    AWS_LAMBDA_ENDPOINT           = var.aws_invoke_url
    GOOGLE_CLOUDFUNCTION_ENDPOINT = local.invoke_url
    AZURE_FUNCTIONS_ENDPOINT      = var.azure_invoke_url
  }
}

resource "google_cloudfunctions_function_iam_member" "invoker" {
  for_each       = var.fns
  project        = google_cloudfunctions_function.fn[each.key].project
  region         = google_cloudfunctions_function.fn[each.key].region
  cloud_function = google_cloudfunctions_function.fn[each.key].name

  role   = "roles/cloudfunctions.invoker"
  member = "allUsers"
}
