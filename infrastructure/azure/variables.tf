variable "handler" {
  default = "index.azureHandler"
}

variable "project_name" {
  type = string
}

variable "build_id" {
  type = string
}

variable "location" {
  type    = string
  default = "westus"
}

variable "google_invoke_url" {
  type = string
}

variable "aws_invoke_url" {
  type = string
}

variable "fn_file" {
  type = string
}
