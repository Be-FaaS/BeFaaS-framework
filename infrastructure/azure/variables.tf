variable "handler" {
  default = "index.azureHandler"
}

variable "location" {
  type    = string
  default = "westeurope"
}

variable "fn_env" {
  type = map(string)
}
