provider "azurerm" {
  features {}
}

data "terraform_remote_state" "exp" {
  backend = "local"

  config = {
    path = "${path.module}/../../experiment/terraform.tfstate"
  }
}

locals {
  project_name = data.terraform_remote_state.exp.outputs.project_name
}

resource "random_string" "redispass" {
  length  = 8
  special = false
  upper   = false
}

resource "azurerm_resource_group" "main" {
  name     = "${local.project_name}-resources"
  location = "West Europe"
}

resource "azurerm_virtual_network" "main" {
  name                = "${local.project_name}-network"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
}

resource "azurerm_subnet" "internal" {
  name                 = "internal"
  resource_group_name  = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = ["10.0.2.0/24"]
}

resource "azurerm_public_ip" "pip" {
  name                = "${local.project_name}-pip"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  allocation_method   = "Dynamic"
}

resource "azurerm_network_interface" "main" {
  name                = "${local.project_name}-nic1"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location

  ip_configuration {
    name                          = "primary"
    subnet_id                     = azurerm_subnet.internal.id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = azurerm_public_ip.pip.id
  }
}

resource "azurerm_network_interface" "internal" {
  name                = "${local.project_name}-nic2"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location

  ip_configuration {
    name                          = "internal"
    subnet_id                     = azurerm_subnet.internal.id
    private_ip_address_allocation = "Dynamic"
  }
}

resource "azurerm_network_security_group" "secgrp_redis" {
  name                = "redis"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  security_rule {
    access                     = "Allow"
    direction                  = "Inbound"
    name                       = "redis"
    priority                   = 100
    protocol                   = "Tcp"
    source_port_range          = "*"
    source_address_prefix      = "*"
    destination_port_range     = "6379"
    destination_address_prefix = azurerm_network_interface.main.private_ip_address
  }
}

resource "azurerm_network_interface_security_group_association" "main" {
  network_interface_id      = azurerm_network_interface.internal.id
  network_security_group_id = azurerm_network_security_group.secgrp_redis.id
}

resource "azurerm_virtual_machine" "redis" {
  name                = "${local.project_name}-vm"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  vm_size             = "Standard_B2s"

  network_interface_ids = [
    azurerm_network_interface.main.id,
  ]

  storage_image_reference {
    publisher = "canonical"
    offer     = "0001-com-ubuntu-server-jammy"
    sku       = "22_04-lts-gen2"
    version   = "latest"
  }

  os_profile {
    computer_name  = "hostname"
    admin_username = "adminuser"
    admin_password = "Password1234!"
  }
  os_profile_linux_config {
    disable_password_authentication = false
  }

  storage_os_disk {
    name              = "myosdisk1"
    caching           = "ReadWrite"
    create_option     = "FromImage"
    managed_disk_type = "Standard_LRS"
  }
}

resource "azurerm_virtual_machine_extension" "redis_run_container" {
  # https://docs.microsoft.com/en-us/azure/virtual-machines/extensions/custom-script-linux
  # https://stackoverflow.com/questions/54088476/terraform-azurerm-virtual-machine-extension
  # https://askubuntu.com/questions/334994/which-one-is-better-using-or-to-execute-multiple-commands-in-one-line
  name                 = "${local.project_name}-ext"
  virtual_machine_id   = azurerm_virtual_machine.redis.id
  publisher            = "Microsoft.Azure.Extensions"
  type                 = "CustomScript"
  type_handler_version = "2.0"

  protected_settings = <<PROT
  {
    "commandToExecute": "sudo apt-get update && curl -sSL https://get.docker.com/ | sh && sudo docker run --name befaas-redis -v redisData:/data -p 6379:6379 -d redis redis-server --appendonly yes --requirepass ${random_string.redispass.result}"
  }
  PROT
}

data "azurerm_public_ip" "redis_ip" {
  name                = azurerm_public_ip.pip.name
  resource_group_name = azurerm_virtual_machine.redis.resource_group_name
}

output "REDIS_ENDPOINT" {
  value = "redis://default:${random_string.redispass.result}@${data.azurerm_public_ip.redis_ip.ip_address}:6379"
}
