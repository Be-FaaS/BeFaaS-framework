resource "google_storage_bucket" "bucket" {
  name          = local.project_name
  location      = "EU"
  force_destroy = true
}

resource "google_storage_bucket_object" "source" {
  for_each = local.fns
  bucket   = google_storage_bucket.bucket.name
  name     = "${local.build_id}/${each.key}.zip"
  source   = each.value
}
