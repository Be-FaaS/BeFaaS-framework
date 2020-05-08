variable "name" {
}

variable "s3_bucket" {
}

variable "s3_key" {
}

variable "handler" {
  default = "index.lambdaHandler"
}

variable "memory_size" {
  default = 256
}

variable "timeout" {
  default = 60
}
