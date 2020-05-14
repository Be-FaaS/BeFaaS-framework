resource "aws_s3_bucket" "bucket" {
  bucket        = var.project_name
  acl           = "private"
  force_destroy = true
}

resource "aws_s3_bucket_object" "source" {
  for_each = var.fns
  bucket   = aws_s3_bucket.bucket.id
  key      = "${var.build_id}/${each.key}.zip"
  source   = each.value
}
