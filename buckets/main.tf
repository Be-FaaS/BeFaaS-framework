locals {
  name = file("../NAME")
}

resource "aws_s3_bucket" "bucket" {
  bucket = local.name
  acl    = "private"
  versioning {
    enabled = true
  }
}

resource "google_storage_bucket" "bucket" {
  name = local.name
  versioning {
    enabled = true
  }
}
