output "invoke_url" {
  value = google_cloudfunctions_function.fn.https_trigger_url
}
