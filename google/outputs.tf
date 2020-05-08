output "invoke_url" {
  value = [for value in google_cloudfunctions_function.fn : value.https_trigger_url]
}
