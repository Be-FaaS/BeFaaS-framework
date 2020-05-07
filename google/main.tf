resource "google_cloudfunctions_function" "fn" {
  name                = var.name
  runtime             = "nodejs10"
  timeout             = var.timeout
  available_memory_mb = var.memory_size

  source_archive_bucket = var.gcs_bucket
  source_archive_object = var.gcs_object
  entry_point           = var.entry_point

  trigger_http = true
}

resource "google_cloudfunctions_function_iam_member" "invoker" {
  project        = google_cloudfunctions_function.fn.project
  region         = google_cloudfunctions_function.fn.region
  cloud_function = google_cloudfunctions_function.fn.name

  role   = "roles/cloudfunctions.invoker"
  member = "allUsers"
}
