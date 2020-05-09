variable "handler" {
  default = "index.lambdaHandler"
}

variable "memory_size" {
  default = 256
}

variable "timeout" {
  default = 60
}

variable "s3_bucket" {
}

variable "project_name" {
  default = "lambda-project"
}

variable "fns" {
  type = map(string)
}
