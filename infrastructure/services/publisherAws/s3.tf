resource "aws_s3_bucket" "pub_bucket" {
  bucket        = "${local.project_name}-publisher"
  acl           = "private"
  force_destroy = true
}

resource "aws_s3_bucket_object" "lambda_publisher" {
  bucket = aws_s3_bucket.pub_bucket.id
  key    = "publisher.zip"
  source = data.archive_file.lambda_publisher.output_path
  etag = filemd5(data.archive_file.lambda_publisher.output_path)
}