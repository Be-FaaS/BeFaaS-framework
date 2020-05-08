variable "name" {
}

variable "gcs_bucket" {
}

variable "gcs_object" {
}

variable "entry_point" {
  default = "googleHandler"
}

variable "memory_size" {
  default = 256
}

variable "timeout" {
  default = 60
}
