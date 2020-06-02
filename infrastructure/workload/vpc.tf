locals {
  cidr             = "10.0.0.0/16"
  cidr_subnet_bits = 8
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

locals {
  security_groups = [aws_security_group.ssh.id, aws_vpc.default.default_security_group_id]
}