data "terraform_remote_state" "exp" {
  backend = "local"

  config = {
    path = "${path.module}/../../experiment/terraform.tfstate"
  }
}

data "terraform_remote_state" "vpc" {
  backend = "local"

  config = {
    path = "${path.module}/../vpc/terraform.tfstate"
  }
}

locals {
  project_name    = data.terraform_remote_state.exp.outputs.project_name
  default_subnet  = data.terraform_remote_state.vpc.outputs.default_subnet
  ssh_key_name    = data.terraform_remote_state.vpc.outputs.ssh_key_name
  security_groups = data.terraform_remote_state.vpc.outputs.security_groups
  ssh_private_key = data.terraform_remote_state.vpc.outputs.ssh_private_key
}

resource "random_string" "redispass" {
  length  = 8
  special = false
  upper   = false
}

data "aws_ami" "ubuntu_lts" {
  most_recent = true
  name_regex  = "^ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-\\d+$"
  owners      = ["099720109477"]
}

resource "aws_instance" "redis" {
  ami                                  = data.aws_ami.ubuntu_lts.id
  instance_type                        = "t3a.medium"
  associate_public_ip_address          = true
  subnet_id                            = local.default_subnet
  key_name                             = local.ssh_key_name
  vpc_security_group_ids               = local.security_groups
  instance_initiated_shutdown_behavior = "terminate"

  tags = {
    Name = "${local.project_name}-redis"
  }

  provisioner "remote-exec" {
    connection {
      type        = "ssh"
      user        = "ubuntu"
      host        = self.public_ip
      private_key = local.ssh_private_key
      agent       = false
    }

    inline = [
      "sudo apt-get update",
      "curl -sSL https://get.docker.com/ | sh > installDocker.log",
      "sudo docker run --name befaas-redis -v redisData:/data -p 6379:6379 -d redis redis-server --appendonly yes --requirepass ${random_string.redispass.result}"
    ]
  }
}

output "REDIS_ENDPOINT" {
  value = "redis://user:${random_string.redispass.result}@${aws_instance.redis.public_ip}:6379"
}
