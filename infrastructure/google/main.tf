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
}

resource "google_cloudfunctions_function_iam_member" "invoker" {
  for_each       = var.fns
  project        = google_cloudfunctions_function.fn[each.key].project
  region         = google_cloudfunctions_function.fn[each.key].region
  cloud_function = google_cloudfunctions_function.fn[each.key].name

  role   = "roles/cloudfunctions.invoker"
  member = "allUsers"
}
