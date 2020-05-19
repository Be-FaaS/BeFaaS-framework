provider "azurerm" {
  features {}
}


locals {
  invoke_url = "http://${var.project_name}-${var.environment}.azurewebsites.net/api"
}


variable "location" {
  type    = string
  default = "westus"
}

variable "environment" {
  type    = string
  default = "dev"
}

resource "random_string" "storage_name" {
  length  = 24
  upper   = false
  lower   = true
  number  = true
  special = false
}

resource "azurerm_resource_group" "rg" {
  name     = "${var.project_name}-${var.environment}"
  location = var.location
}

resource "azurerm_storage_account" "storage" {
  name                     = random_string.storage_name.result
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = var.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_storage_container" "deployments" {
  name                  = "function-releases"
  storage_account_name  = azurerm_storage_account.storage.name
  container_access_type = "private"
}

resource "azurerm_storage_blob" "appcode" {
  name = "azure.zip"

  storage_account_name   = azurerm_storage_account.storage.name
  storage_container_name = azurerm_storage_container.deployments.name
  type                   = "Block"
  source                 = var.fn_file
}

data "azurerm_storage_account_sas" "sas" {
  connection_string = "${azurerm_storage_account.storage.primary_connection_string}"
  https_only        = true
  start             = "2020-01-01"
  expiry            = "2021-12-31"
  resource_types {
    object    = true
    container = false
    service   = false
  }
  services {
    blob  = true
    queue = false
    table = false
    file  = false
  }
  permissions {
    read    = true
    write   = false
    delete  = false
    list    = false
    add     = false
    create  = false
    update  = false
    process = false
  }
}

resource "azurerm_app_service_plan" "asp" {
  name                = "${var.project_name}-plan"
  resource_group_name = azurerm_resource_group.rg.name
  location            = var.location
  kind                = "FunctionApp"
  sku {
    tier = "Dynamic"
    size = "Y1"
  }
}

resource "azurerm_application_insights" "ai" {
  name                = "${var.project_name}-${var.environment}"
  location            = "${azurerm_resource_group.rg.location}"
  resource_group_name = "${azurerm_resource_group.rg.name}"
  application_type    = "web"
  sampling_percentage = 100
}

resource "azurerm_function_app" "functions" {
  name                      = "${var.project_name}-${var.environment}"
  location                  = var.location
  resource_group_name       = azurerm_resource_group.rg.name
  app_service_plan_id       = azurerm_app_service_plan.asp.id
  storage_connection_string = azurerm_storage_account.storage.primary_connection_string
  version                   = "~2"

  app_settings = {
    https_only                     = true
    FUNCTIONS_WORKER_RUNTIME       = "node"
    WEBSITE_NODE_DEFAULT_VERSION   = "~10"
    FUNCTION_APP_EDIT_MODE         = "readonly"
    APPINSIGHTS_INSTRUMENTATIONKEY = "${azurerm_application_insights.ai.instrumentation_key}"
    HASH                           = "${base64encode(filesha256("${var.fn_file}"))}"
    WEBSITE_RUN_FROM_PACKAGE       = "https://${azurerm_storage_account.storage.name}.blob.core.windows.net/${azurerm_storage_container.deployments.name}/${azurerm_storage_blob.appcode.name}${data.azurerm_storage_account_sas.sas.sas}"
    AWS_LAMBDA_ENDPOINT            = var.aws_invoke_url
    GOOGLE_CLOUDFUNCTION_ENDPOINT  = var.google_invoke_url
    AZURE_FUNCTIONS_ENDPOINT       = local.invoke_url

  }
}