data "terraform_remote_state" "ep" {
  backend = "local"

  config = {
    path = "${path.module}/endpoint/terraform.tfstate"
  }
}

resource "aws_api_gateway_resource" "root" {
  for_each    = local.fns
  rest_api_id = data.terraform_remote_state.ep.outputs.aws_api_gateway_rest_api.id
  parent_id   = data.terraform_remote_state.ep.outputs.aws_api_gateway_rest_api.root_resource_id
  path_part   = each.key
}

resource "aws_api_gateway_method" "root" {
  for_each      = local.fns
  rest_api_id   = data.terraform_remote_state.ep.outputs.aws_api_gateway_rest_api.id
  resource_id   = aws_api_gateway_resource.root[each.key].id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_resource" "proxy" {
  for_each    = local.fns
  rest_api_id = data.terraform_remote_state.ep.outputs.aws_api_gateway_rest_api.id
  parent_id   = aws_api_gateway_resource.root[each.key].id
  path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "proxy" {
  for_each      = local.fns
  rest_api_id   = data.terraform_remote_state.ep.outputs.aws_api_gateway_rest_api.id
  resource_id   = aws_api_gateway_resource.proxy[each.key].id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "root" {
  for_each    = local.fns
  rest_api_id = data.terraform_remote_state.ep.outputs.aws_api_gateway_rest_api.id
  resource_id = aws_api_gateway_method.root[each.key].resource_id
  http_method = aws_api_gateway_method.root[each.key].http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.fn[each.key].invoke_arn
}

resource "aws_api_gateway_integration" "proxy" {
  for_each    = local.fns
  rest_api_id = data.terraform_remote_state.ep.outputs.aws_api_gateway_rest_api.id
  resource_id = aws_api_gateway_method.proxy[each.key].resource_id
  http_method = aws_api_gateway_method.proxy[each.key].http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.fn[each.key].invoke_arn
}

resource "aws_api_gateway_deployment" "fn" {
  depends_on = [
    aws_api_gateway_integration.root,
    aws_api_gateway_integration.proxy
  ]

  variables = {
    deployed_at = timestamp()
  }

  rest_api_id = data.terraform_remote_state.ep.outputs.aws_api_gateway_rest_api.id
  stage_name  = "dev"
}
