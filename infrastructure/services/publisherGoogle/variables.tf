variable "entry_point" {
  default = "googleHandler"
}

variable "memory_size" {
  default = 256
}

variable "timeout" {
  default = 60
}

variable "fn_env" {
  type    = map(string)
  default = {}
}
