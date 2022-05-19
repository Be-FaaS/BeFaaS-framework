data "terraform_remote_state" "exp" {
  backend = "local"

  config = {
    path = "${path.module}/../experiment/terraform.tfstate"
  }
}

locals {
  project_name  = data.terraform_remote_state.exp.outputs.project_name
  build_id      = data.terraform_remote_state.exp.outputs.build_id
  deployment_id = data.terraform_remote_state.exp.outputs.deployment_id
  fn_file       = data.terraform_remote_state.exp.outputs.azure_fn_file
  fns_async     = data.terraform_remote_state.exp.outputs.azure_fns_async
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "rg" {
  name     = local.project_name
  location = var.location
}

resource "azurerm_storage_account" "storage" {
  name                     = substr(replace(lower(local.project_name), "-", ""), 0, 24)
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_storage_container" "deployments" {
  name                  = "function-releases"
  storage_account_name  = azurerm_storage_account.storage.name
  container_access_type = "private"
}

resource "azurerm_storage_blob" "appcode" {
  name                   = "${local.build_id}/azure.zip"
  storage_account_name   = azurerm_storage_account.storage.name
  storage_container_name = azurerm_storage_container.deployments.name
  type                   = "Block"
  source                 = local.fn_file
}

data "azurerm_storage_account_sas" "sas" {
  connection_string = azurerm_storage_account.storage.primary_connection_string
  https_only        = true
  start             = "2021-01-01"
  expiry            = "2022-12-31"
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
    tag     = false
    filter  = false
  }
}

resource "azurerm_service_plan" "asp" {
  name                = local.project_name
  resource_group_name = azurerm_resource_group.rg.name
  location            = var.location
  os_type             = "Windows"
  sku_name            = "Y1"
}

resource "azurerm_application_insights" "ai" {
  name                = local.project_name
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  application_type    = "web"
  sampling_percentage = 100
}

resource "azurerm_function_app" "functions" {
  name                       = local.project_name
  location                   = azurerm_resource_group.rg.location
  resource_group_name        = azurerm_resource_group.rg.name
  app_service_plan_id        = azurerm_service_plan.asp.id
  storage_account_name       = azurerm_storage_account.storage.name
  storage_account_access_key = azurerm_storage_account.storage.primary_access_key
  version                    = "~3"

  depends_on = [azurerm_eventgrid_topic.fn_topic]

  app_settings = merge({
    https_only                     = true
    IS_AZURE_FUNCTION_APP          = "true"
    FUNCTIONS_WORKER_RUNTIME       = "node"
    WEBSITE_NODE_DEFAULT_VERSION   = "~12"
    FUNCTION_APP_EDIT_MODE         = "readonly"
    SCM_DO_BUILD_DURING_DEPLOYMENT = true
    APPINSIGHTS_INSTRUMENTATIONKEY = azurerm_application_insights.ai.instrumentation_key
    HASH                           = base64sha256(local.fn_file)
    WEBSITE_RUN_FROM_PACKAGE       = "https://${azurerm_storage_account.storage.name}.blob.core.windows.net/${azurerm_storage_container.deployments.name}/${azurerm_storage_blob.appcode.name}${data.azurerm_storage_account_sas.sas.sas}"
    BEFAAS_DEPLOYMENT_ID           = local.deployment_id
    ACCESS_KEYS                    = join("; ", values(azurerm_eventgrid_topic.fn_topic)[*].primary_access_key)
    TOPIC_ENDPOINTS                = join("; ", values(azurerm_eventgrid_topic.fn_topic)[*].endpoint)
  }, var.fn_env)
}

resource "azurerm_eventgrid_topic" "fn_topic" {
  for_each            = toset(local.fns_async)
  name                = each.key
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name

  tags = {
    environment = "Production"
  }
}

output "topic_access_keys" {
  value     = values(azurerm_eventgrid_topic.fn_topic)[*].primary_access_key
  sensitive = true
}

output "topic_endpoints" {
  value = values(azurerm_eventgrid_topic.fn_topic)[*].endpoint
}

resource "azurerm_eventgrid_event_subscription" "subscr" {
  for_each              = toset(local.fns_async)
  name                  = "defaultEventSubscription"
  scope                 = azurerm_eventgrid_topic.fn_topic[each.key].id
  event_delivery_schema = "EventGridSchema"

  azure_function_endpoint {
    function_id = "${azurerm_function_app.functions.id}/functions/${each.key}"
  }
}
