data "terraform_remote_state" "exp" {
  backend = "local"

  config = {
    path = "${path.module}/../experiment/terraform.tfstate"
  }
}

locals {
  project_name = data.terraform_remote_state.exp.outputs.project_name
  build_id     = data.terraform_remote_state.exp.outputs.build_id
  fns          = data.terraform_remote_state.exp.outputs.aws_fns
}

resource "aws_iam_role" "lambda_exec" {
  name = local.project_name

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
  name = local.project_name

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

resource "aws_lambda_function" "fn" {
  for_each      = local.fns
  function_name = "${local.project_name}-${each.key}"

  s3_bucket = aws_s3_bucket_object.source[each.key].bucket
  s3_key    = aws_s3_bucket_object.source[each.key].key

  handler     = var.handler
  runtime     = "nodejs12.x"
  timeout     = var.timeout
  memory_size = var.memory_size

  role = aws_iam_role.lambda_exec.arn

  environment {
    variables = var.fn_env
  }
}

resource "aws_lambda_permission" "apigw" {
  for_each      = local.fns
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.fn[each.key].function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${data.terraform_remote_state.ep.outputs.aws_api_gateway_rest_api.execution_arn}/*/*"
}
