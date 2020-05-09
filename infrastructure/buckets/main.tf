locals {
  name = file("../NAME")
}

resource "aws_s3_bucket" "bucket" {
  bucket        = local.name
  acl           = "private"
  force_destroy = true
}

resource "google_storage_bucket" "bucket" {
  name          = local.name
  force_destroy = true
}
