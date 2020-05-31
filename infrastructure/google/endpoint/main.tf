data "google_client_config" "current" {
}

output "GOOGLE_CLOUDFUNCTION_ENDPOINT" {
  value = "https://${data.google_client_config.current.region}-${data.google_client_config.current.project}.cloudfunctions.net"
}
