resource "google_storage_bucket" "bucket" {
  name          = var.project_name
  force_destroy = true
}

resource "google_storage_bucket_object" "source" {
  for_each = var.fns
  bucket   = google_storage_bucket.bucket.name
  name     = "${var.build_id}/${each.key}.zip"
  source   = each.value
}
