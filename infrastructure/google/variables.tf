variable "entry_point" {
  default = "googleHandler"
}

variable "memory_size" {
  default = 256
}

variable "timeout" {
  default = 60
}

variable "project_name" {
  type = string
}

variable "build_id" {
  type = string
}

variable "aws_invoke_url" {
  type = string
}

variable "fns" {
  type = map(string)
}
