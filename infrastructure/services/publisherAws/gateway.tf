resource "aws_api_gateway_resource" "root" {
  rest_api_id = data.terraform_remote_state.endpoint.outputs.aws_api_gateway_rest_api.id
  parent_id   = data.terraform_remote_state.endpoint.outputs.aws_api_gateway_rest_api.root_resource_id
  path_part   = "publisher"
}

resource "aws_api_gateway_method" "root" {
  rest_api_id   = data.terraform_remote_state.endpoint.outputs.aws_api_gateway_rest_api.id
  resource_id   = aws_api_gateway_resource.root.id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_resource" "proxy" {
  rest_api_id = data.terraform_remote_state.endpoint.outputs.aws_api_gateway_rest_api.id
  parent_id   = aws_api_gateway_resource.root.id
  path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "proxy" {
  rest_api_id   = data.terraform_remote_state.endpoint.outputs.aws_api_gateway_rest_api.id
  resource_id   = aws_api_gateway_resource.proxy.id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "root" {
  rest_api_id = data.terraform_remote_state.endpoint.outputs.aws_api_gateway_rest_api.id
  resource_id = aws_api_gateway_method.root.resource_id
  http_method = aws_api_gateway_method.root.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.publisherAWS.invoke_arn
}

resource "aws_api_gateway_integration" "proxy" {
  rest_api_id = data.terraform_remote_state.endpoint.outputs.aws_api_gateway_rest_api.id
  resource_id = aws_api_gateway_method.proxy.resource_id
  http_method = aws_api_gateway_method.proxy.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.publisherAWS.invoke_arn
}