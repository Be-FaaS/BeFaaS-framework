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


data "aws_ami" "bitnami_redis" {
  most_recent = true
  name_regex  = "^bitnami-redis-6.0.16-\\d-linux-debian-10-x86_64-hvm-ebs-nami$"
  owners      = ["979382823631"]
}

resource "random_string" "redispass" {
  length  = 8
  special = false
  upper   = false
}

resource "aws_instance" "redis" {
  ami                                  = data.aws_ami.bitnami_redis.id
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
      user        = "bitnami"
      host        = self.public_ip
      private_key = local.ssh_private_key
      agent       = false
    }

    inline = [
      "sleep 30",
      "grep -o 'requirepass .*' /opt/bitnami/redis/etc/redis.conf | sed 's/requirepass //' > /tmp/redispass",
      "sudo sed -i \"s/$(cat /tmp/redispass)/${random_string.redispass.result}/\" /opt/bitnami/redis/etc/redis.conf",
      "sudo /opt/bitnami/ctlscript.sh restart redis"
    ]
  }
}

output "REDIS_ENDPOINT" {
  value = "redis://user:${random_string.redispass.result}@${aws_instance.redis.public_ip}:6379"
}
