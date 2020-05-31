data "terraform_remote_state" "exp" {
  backend = "local"

  config = {
    path = "${path.module}/../../experiment/terraform.tfstate"
  }
}

resource "aws_api_gateway_rest_api" "api" {
  name = data.terraform_remote_state.exp.outputs.project_name
}

output "aws_api_gateway_rest_api" {
  value = aws_api_gateway_rest_api.api
}

data "aws_region" "current" {}

output "AWS_LAMBDA_ENDPOINT" {
  value = "https://${aws_api_gateway_rest_api.api.id}.execute-api.${data.aws_region.current.name}.amazonaws.com/dev"
}
