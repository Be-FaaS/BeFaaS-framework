variable "handler" {
  default = "index.lambdaHandler"
}

variable "memory_size" {
  default = 256
}

variable "timeout" {
  default = 60
}

variable "fn_env" {
  type = map(string)
  default = {}
}
