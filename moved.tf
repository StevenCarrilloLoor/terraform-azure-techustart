moved {
  from = azurerm_resource_group.techustart
  to   = azurerm_resource_group.this
}

moved {
  from = azurerm_virtual_network.techustart
  to   = module.network.azurerm_virtual_network.this
}

moved {
  from = azurerm_subnet.techustart
  to   = module.network.azurerm_subnet.this
}

moved {
  from = azurerm_public_ip.techustart
  to   = module.network.azurerm_public_ip.this
}

moved {
  from = azurerm_network_security_group.techustart
  to   = module.network.azurerm_network_security_group.this
}

moved {
  from = azurerm_network_interface.techustart
  to   = module.network.azurerm_network_interface.this
}

moved {
  from = azurerm_network_interface_security_group_association.techustart
  to   = module.network.azurerm_network_interface_security_group_association.this
}

moved {
  from = azurerm_linux_virtual_machine.techustart
  to   = module.web_server.azurerm_linux_virtual_machine.this
}
