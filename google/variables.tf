variable "entry_point" {
  default = "googleHandler"
}

variable "memory_size" {
  default = 256
}

variable "timeout" {
  default = 60
}

variable "gcs_bucket" {
}

variable "fns" {
  type = map(string)
}
