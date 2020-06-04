data "terraform_remote_state" "exp" {
  backend = "local"

  config = {
    path = "${path.module}/../../experiment/terraform.tfstate"
  }
}

locals {
  cidr             = "10.0.0.0/16"
  cidr_subnet_bits = 8
  project_name     = data.terraform_remote_state.exp.outputs.project_name
}

data "aws_availability_zones" "available" {}

locals {
  subnets = { for i, n in data.aws_availability_zones.available.names : n => cidrsubnet(local.cidr, local.cidr_subnet_bits, i + 1) }
}

resource "aws_vpc" "default" {
  cidr_block = local.cidr

  tags = {
    Name = local.project_name
  }
}

resource "aws_subnet" "default" {
  for_each          = local.subnets
  vpc_id            = aws_vpc.default.id
  cidr_block        = each.value
  availability_zone = each.key
}

resource "aws_internet_gateway" "default" {
  vpc_id = aws_vpc.default.id

  tags = {
    Name = local.project_name
  }
}

resource "aws_route" "internet_access" {
  route_table_id         = aws_vpc.default.main_route_table_id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.default.id
}

resource "aws_security_group" "ssh" {
  name   = "ssh-access"
  vpc_id = aws_vpc.default.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "redis" {
  name   = "redis-access"
  vpc_id = aws_vpc.default.id

  ingress {
    from_port   = 6379
    to_port     = 6379
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "tls_private_key" "ssh" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "ssh" {
  key_name   = local.project_name
  public_key = tls_private_key.ssh.public_key_openssh
}


output "security_groups" {
  value = [aws_security_group.ssh.id, aws_security_group.redis.id, aws_vpc.default.default_security_group_id]
}

output "subnet_ids" {
  value = values(aws_subnet.default)[*].id
}

output "default_subnet" {
  value = element(values(aws_subnet.default), 0).id
}

output "ssh_key_name" {
  value = aws_key_pair.ssh.key_name
}

output "ssh_private_key" {
  value = tls_private_key.ssh.private_key_pem
}
