resource "azurerm_virtual_network" "this" {
  name                = "${var.resource_prefix}-vnet"
  address_space       = var.virtual_network_cidrs
  location            = var.location
  resource_group_name = var.resource_group_name

  tags = merge(var.tags, {
    Name = "${var.resource_prefix}-vnet"
  })
}

resource "azurerm_subnet" "this" {
  name                 = "${var.resource_prefix}-subnet"
  resource_group_name  = var.resource_group_name
  virtual_network_name = azurerm_virtual_network.this.name
  address_prefixes     = var.subnet_address_prefixes
}

resource "azurerm_public_ip" "this" {
  name                = "${var.resource_prefix}-public-ip"
  location            = var.location
  resource_group_name = var.resource_group_name
  allocation_method   = "Static"
  sku                 = "Standard"

  tags = merge(var.tags, {
    Name = "${var.resource_prefix}-public-ip"
  })
}

resource "azurerm_network_security_group" "this" {
  name                = "${var.resource_prefix}-nsg"
  location            = var.location
  resource_group_name = var.resource_group_name

  security_rule {
    name                       = "allow_http"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "80"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  tags = merge(var.tags, {
    Name = "${var.resource_prefix}-nsg"
  })
}

resource "azurerm_network_interface" "this" {
  name                = "${var.resource_prefix}-nic"
  location            = var.location
  resource_group_name = var.resource_group_name

  ip_configuration {
    name                          = "primary"
    subnet_id                     = azurerm_subnet.this.id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = azurerm_public_ip.this.id
  }

  tags = merge(var.tags, {
    Name = "${var.resource_prefix}-nic"
  })
}

resource "azurerm_network_interface_security_group_association" "this" {
  network_interface_id      = azurerm_network_interface.this.id
  network_security_group_id = azurerm_network_security_group.this.id
}
