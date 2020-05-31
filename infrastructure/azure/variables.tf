variable "handler" {
  default = "index.azureHandler"
}

variable "location" {
  type    = string
  default = "westus"
}

variable "fn_env" {
  type = map(string)
}
