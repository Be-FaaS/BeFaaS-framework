resource "aws_iam_role" "lambda_exec" {
  name = var.project_name

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_policy" "policy" {
  name = var.project_name

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "s3:List*"
      ],
      "Effect": "Allow",
      "Resource": "arn:aws:s3:::*"
    },
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*",
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "lambda_exec" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = aws_iam_policy.policy.arn
}

data "aws_region" "current" {}

locals {
  invoke_url = "https://${aws_api_gateway_rest_api.api.id}.execute-api.${data.aws_region.current.name}.amazonaws.com/dev"
}

resource "aws_lambda_function" "fn" {
  for_each      = var.fns
  function_name = "${var.project_name}-${each.key}"

  s3_bucket = aws_s3_bucket_object.source[each.key].bucket
  s3_key    = aws_s3_bucket_object.source[each.key].key

  handler     = var.handler
  runtime     = "nodejs12.x"
  timeout     = var.timeout
  memory_size = var.memory_size

  role = aws_iam_role.lambda_exec.arn

  environment {
    variables = {
      AWS_LAMBDA_ENDPOINT           = local.invoke_url
      GOOGLE_CLOUDFUNCTION_ENDPOINT = var.google_invoke_url
      AZURE_FUNCTIONS_ENDPOINT      = var.azure_invoke_url
    }
  }
}

resource "aws_lambda_permission" "apigw" {
  for_each      = var.fns
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.fn[each.key].function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_api_gateway_rest_api.api.execution_arn}/*/*"
}
