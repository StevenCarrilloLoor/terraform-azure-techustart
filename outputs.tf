output "resource_group_name" {
  description = "Nombre del grupo de recursos creado."
  value       = azurerm_resource_group.this.name
}

output "public_ip_address" {
  description = "Direccion IP publica asignada a la maquina virtual."
  value       = module.network.public_ip_address
}

output "website_url" {
  description = "URL publica del servidor web Apache."
  value       = "http://${module.network.public_ip_address}"
}

output "virtual_machine_name" {
  description = "Nombre de la maquina virtual Linux."
  value       = module.web_server.virtual_machine_name
}
