data "terraform_remote_state" "exp" {
  backend = "local"

  config = {
    path = "${path.module}/../../experiment/terraform.tfstate"
  }
}

locals {
  project_name = data.terraform_remote_state.exp.outputs.project_name
}

resource "random_string" "redispass" {
  length  = 8
  special = false
  upper   = false
}

resource "google_compute_instance" "redis" {
  name         = "${local.project_name}-redis"
  machine_type = "e2-medium"
  zone         = "europe-west1-c"

  boot_disk {
    initialize_params {
      image = "ubuntu-2204-jammy-v20230421"
    }
  }

  network_interface {
    network = "default"
    access_config {
      # Ephemeral
    }
  }

  metadata_startup_script = <<SCRIPT
    curl -sSL https://get.docker.com/ | sh > installDocker.log
    # --name -> name Container befaas-redis
    # -d -> run detachted
    # -p 6379:6379 -> expose port
    # -v redisData:/data -> share /data directory with redisData folder on host
    # Set redis.conf values:
    # --appendonly yes -> persistent storage
    sudo docker run --name befaas-redis -v redisData:/data -p 6379:6379 -d redis redis-server --appendonly yes --requirepass "${random_string.redispass.result}"
    SCRIPT
}

resource "google_compute_firewall" "redis_firewall" {
  name    = "redis-firewall"
  network = "default"

  allow {
    protocol = "tcp"
    ports = [
      "80",  # HTTP
      "6379" # Redis
    ]
  }

  source_ranges = ["0.0.0.0/0"]
}

output "REDIS_ENDPOINT" {
  value = "redis://user:${random_string.redispass.result}@${google_compute_instance.redis.network_interface.0.access_config.0.nat_ip}:6379"
}
