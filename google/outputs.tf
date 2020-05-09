data "google_client_config" "current" {
}

output "invoke_url" {
  value = "https://${data.google_client_config.current.region}-${data.google_client_config.current.project}.cloudfunctions.net"
}
