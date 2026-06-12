terraform {
  required_version = ">= 1.5.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "techustart" {
  name     = "${var.resource_prefix}-rg"
  location = var.azure_region

  tags = {
    project    = "TechUStart"
    managed_by = "Terraform"
  }
}

resource "azurerm_virtual_network" "techustart" {
  name                = "${var.resource_prefix}-vnet"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.techustart.location
  resource_group_name = azurerm_resource_group.techustart.name
}

resource "azurerm_subnet" "techustart" {
  name                 = "${var.resource_prefix}-subnet"
  resource_group_name  = azurerm_resource_group.techustart.name
  virtual_network_name = azurerm_virtual_network.techustart.name
  address_prefixes     = ["10.0.1.0/24"]
}

resource "azurerm_public_ip" "techustart" {
  name                = "${var.resource_prefix}-public-ip"
  location            = azurerm_resource_group.techustart.location
  resource_group_name = azurerm_resource_group.techustart.name
  allocation_method   = "Static"
  sku                 = "Standard"
}

resource "azurerm_network_security_group" "techustart" {
  name                = "${var.resource_prefix}-nsg"
  location            = azurerm_resource_group.techustart.location
  resource_group_name = azurerm_resource_group.techustart.name

  security_rule {
    name                       = "Allow-HTTP"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "80"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }
}

resource "azurerm_network_interface" "techustart" {
  name                = "${var.resource_prefix}-nic"
  location            = azurerm_resource_group.techustart.location
  resource_group_name = azurerm_resource_group.techustart.name

  ip_configuration {
    name                          = "internal"
    subnet_id                     = azurerm_subnet.techustart.id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = azurerm_public_ip.techustart.id
  }
}

resource "azurerm_network_interface_security_group_association" "techustart" {
  network_interface_id      = azurerm_network_interface.techustart.id
  network_security_group_id = azurerm_network_security_group.techustart.id
}

resource "azurerm_linux_virtual_machine" "techustart" {
  name                = "${var.resource_prefix}-vm"
  resource_group_name = azurerm_resource_group.techustart.name
  location            = azurerm_resource_group.techustart.location
  size                = var.tamano_vm
  admin_username      = var.admin_username

  network_interface_ids = [
    azurerm_network_interface.techustart.id,
  ]

  admin_ssh_key {
    username   = var.admin_username
    public_key = var.ssh_public_key
  }

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "0001-com-ubuntu-server-jammy"
    sku       = "22_04-lts-gen2"
    version   = "latest"
  }

  custom_data = base64encode(<<-CLOUD_INIT
    #!/bin/bash
    set -e
    apt-get update
    DEBIAN_FRONTEND=noninteractive apt-get install -y apache2
    systemctl enable apache2
    systemctl start apache2
    cat > /var/www/html/index.html <<'HTML'
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="utf-8">
        <title>TechUStart - Terraform</title>
      </head>
      <body>
        <h1>TechUStart desplegado con Terraform</h1>
        <p>Servidor Apache ejecutandose sobre una maquina virtual Linux en Azure.</p>
      </body>
    </html>
    HTML
  CLOUD_INIT
  )

  tags = {
    project    = "TechUStart"
    managed_by = "Terraform"
  }
}

output "public_ip_address" {
  description = "Direccion IP publica asignada a la maquina virtual."
  value       = azurerm_public_ip.techustart.ip_address
}

output "website_url" {
  description = "URL publica del servidor web Apache."
  value       = "http://${azurerm_public_ip.techustart.ip_address}"
}

