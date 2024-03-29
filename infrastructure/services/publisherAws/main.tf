data "terraform_remote_state" "exp" {
  backend = "local"

  config = {
    path = "${path.module}/../../experiment/terraform.tfstate"
  }
}

data "terraform_remote_state" "endpoint" {
  backend = "local"

  config = {
    path = "${path.module}/../../aws/endpoint/terraform.tfstate"
  }
}

data "aws_caller_identity" "current" {}

locals {
  project_name  = data.terraform_remote_state.exp.outputs.project_name
  project_id    = data.terraform_remote_state.exp.outputs.project_id
  build_id      = data.terraform_remote_state.exp.outputs.build_id
  deployment_id = data.terraform_remote_state.exp.outputs.deployment_id
  fns           = data.terraform_remote_state.exp.outputs.aws_fns
  fns_async     = data.terraform_remote_state.exp.outputs.aws_fns_async

  gateway = data.terraform_remote_state.endpoint.outputs.aws_api_gateway_rest_api.execution_arn
}

resource "aws_iam_role" "lambda_pub_exec" {
  name = "${local.project_name}-publisher"

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

resource "aws_iam_policy" "log_policy" {
  name = "${local.project_name}-logger"

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

resource "aws_iam_policy" "pub_policy" {
  name = "${local.project_name}-publisher"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "sns:Publish",
        "sns:Subscribe"
      ],
      "Effect": "Allow",
	  "Resource": "arn:aws:sns:*:*:*"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "lambda_log_exec" {
  role       = aws_iam_role.lambda_pub_exec.name
  policy_arn = aws_iam_policy.log_policy.arn
}

resource "aws_iam_role_policy_attachment" "lambda_pub_exec" {
  role       = aws_iam_role.lambda_pub_exec.name
  policy_arn = aws_iam_policy.pub_policy.arn
}

resource "aws_lambda_function" "publisherAWS" {
  function_name = "${local.project_name}-publisherAWS"

  s3_bucket = aws_s3_bucket.pub_bucket.id
  s3_key    = aws_s3_bucket_object.lambda_publisher.key

  handler     = var.handler
  runtime     = "nodejs16.x"
  timeout     = var.timeout
  memory_size = var.memory_size

  role = aws_iam_role.lambda_pub_exec.arn

  environment {
    variables = merge({
      BEFAAS_DEPLOYMENT_ID = local.deployment_id
      BEFAAS_BUILD_ID      = local.build_id
      BEFAAS_PROJECT_ID    = local.project_id
      AWS_ID               = data.aws_caller_identity.current.account_id
    }, var.fn_env)
  }
}

resource "aws_lambda_permission" "apigw" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.publisherAWS.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${local.gateway}/*/*"
}

data "aws_region" "current" {}

output "PUBLISHER_AWS_ENDPOINT" {
  value = "https://${data.terraform_remote_state.endpoint.outputs.aws_api_gateway_rest_api.id}.execute-api.${data.aws_region.current.name}.amazonaws.com/dev/publisher"
}
