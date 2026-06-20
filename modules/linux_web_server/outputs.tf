output "virtual_machine_id" {
  description = "Identificador de la maquina virtual."
  value       = azurerm_linux_virtual_machine.this.id
}

output "virtual_machine_name" {
  description = "Nombre de la maquina virtual."
  value       = azurerm_linux_virtual_machine.this.name
}
