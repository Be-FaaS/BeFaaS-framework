resource "google_storage_bucket" "pub_bucket" {
  name          = "${local.project_name}-publisher"
  force_destroy = true
}

resource "google_storage_bucket_object" "source_publisher" {
  bucket = google_storage_bucket.pub_bucket.name
  name   = "${local.build_id}/publisherGoogle.zip"
  source = "${path.module}/publisher/_build/publisherGoogle.zip"
}
