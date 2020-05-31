resource "aws_s3_bucket" "bucket" {
  bucket        = local.project_name
  acl           = "private"
  force_destroy = true
}

resource "aws_s3_bucket_object" "source" {
  for_each = local.fns
  bucket   = aws_s3_bucket.bucket.id
  key      = "${local.build_id}/${each.key}.zip"
  source   = each.value
}
