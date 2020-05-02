resource "aws_s3_bucket" "bucket" {
  bucket = "faastestbed-terraform-example"
  acl    = "private"
  versioning {
    enabled = true
  }
}
