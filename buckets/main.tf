resource "aws_s3_bucket" "bucket" {
  bucket = "faastestbed-terraform-example"
  acl    = "private"
  versioning {
    enabled = true
  }
}

resource "google_storage_bucket" "bucket" {
  name = "faastestbed-terraform-example"
  versioning {
    enabled = true
  }
}
