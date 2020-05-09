resource "aws_api_gateway_rest_api" "api" {
  name = var.project_name
}

resource "aws_api_gateway_resource" "root" {
  for_each    = var.fns
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_rest_api.api.root_resource_id
  path_part   = each.key
}

resource "aws_api_gateway_method" "root" {
  for_each      = var.fns
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.root[each.key].id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_resource" "proxy" {
  for_each    = var.fns
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_resource.root[each.key].id
  path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "proxy" {
  for_each      = var.fns
  rest_api_id   = aws_api_gateway_rest_api.api.id
  resource_id   = aws_api_gateway_resource.proxy[each.key].id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "root" {
  for_each    = var.fns
  rest_api_id = aws_api_gateway_rest_api.api.id
  resource_id = aws_api_gateway_method.root[each.key].resource_id
  http_method = aws_api_gateway_method.root[each.key].http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.fn[each.key].invoke_arn
}

resource "aws_api_gateway_integration" "proxy" {
  for_each    = var.fns
  rest_api_id = aws_api_gateway_rest_api.api.id
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

  rest_api_id = aws_api_gateway_rest_api.api.id
  stage_name  = "dev"
}
