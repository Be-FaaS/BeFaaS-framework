data "terraform_remote_state" "exp" {
  backend = "local"

  config = {
    path = "${path.module}/../experiment/terraform.tfstate"
  }
}

locals {
  project_name = data.terraform_remote_state.exp.outputs.project_name
}

resource "tls_private_key" "ssh" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "ssh" {
  key_name   = local.project_name
  public_key = tls_private_key.ssh.public_key_openssh
}

data "aws_ami" "ubuntu_bionic" {
  most_recent = true
  name_regex  = "^ubuntu/images/hvm-ssd/ubuntu-bionic-18.04-amd64-server-\\d+$"
  owners      = ["099720109477"]
}

resource "aws_instance" "workload" {
  ami                         = data.aws_ami.ubuntu_bionic.id
  instance_type               = "t3a.micro"
  associate_public_ip_address = true
  subnet_id                   = element(values(aws_subnet.default), 0).id
  key_name                    = aws_key_pair.ssh.key_name
  vpc_security_group_ids      = local.security_groups

  tags = {
    Name = "${local.project_name}-workload"
  }

  provisioner "remote-exec" {
    connection {
      type        = "ssh"
      user        = "ubuntu"
      host        = self.public_ip
      private_key = tls_private_key.ssh.private_key_pem
      agent       = false
    }

    inline = [
      "curl -sSL https://get.docker.com/ | sh",
      "sudo docker run -d --restart=always --name hello-hostname -p 5000:5000 christophwitzko/hello-hostname"
    ]
  }
}
