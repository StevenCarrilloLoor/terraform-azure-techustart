resource "azurerm_resource_group" "this" {
  name     = "${var.resource_prefix}-rg"
  location = var.azure_region

  tags = merge(local.common_tags, {
    Name = "${var.resource_prefix}-rg"
  })
}

module "network" {
  source = "./modules/network"

  resource_prefix         = var.resource_prefix
  resource_group_name     = azurerm_resource_group.this.name
  location                = azurerm_resource_group.this.location
  virtual_network_cidrs   = var.virtual_network_cidrs
  subnet_address_prefixes = var.subnet_address_prefixes
  tags                    = local.common_tags
}

module "web_server" {
  source = "./modules/linux_web_server"

  resource_prefix      = var.resource_prefix
  resource_group_name  = azurerm_resource_group.this.name
  location             = azurerm_resource_group.this.location
  vm_size              = var.tamano_vm
  admin_username       = var.admin_username
  ssh_public_key       = var.ssh_public_key
  network_interface_id = module.network.network_interface_id
  page_title           = var.page_title
  tags                 = local.common_tags
}
