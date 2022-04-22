resource "aws_s3_bucket" "pub_bucket" {
  bucket        = "${local.project_name}-publisher"
  acl           = "private"
  force_destroy = true
}

resource "aws_s3_bucket_object" "lambda_publisher" {
  bucket = aws_s3_bucket.pub_bucket.id
  key    = "${local.build_id}/publisherAws.zip"
  source = "${path.module}/publisher/_build/publisherAws.zip"
}