output "network_interface_id" {
  description = "Identificador de la interfaz de red."
  value       = azurerm_network_interface.this.id
}

output "public_ip_address" {
  description = "Direccion IP publica asignada."
  value       = azurerm_public_ip.this.ip_address
}

output "subnet_id" {
  description = "Identificador de la subred."
  value       = azurerm_subnet.this.id
}
