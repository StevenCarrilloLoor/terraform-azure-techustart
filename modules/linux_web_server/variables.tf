variable "resource_prefix" {
  description = "Prefijo para nombrar la maquina virtual."
  type        = string
}

variable "resource_group_name" {
  description = "Nombre del grupo de recursos."
  type        = string
}

variable "location" {
  description = "Region de Azure."
  type        = string
}

variable "vm_size" {
  description = "Tamano de la maquina virtual."
  type        = string
}

variable "admin_username" {
  description = "Usuario administrador."
  type        = string
}

variable "ssh_public_key" {
  description = "Clave publica SSH."
  type        = string
  sensitive   = true
}

variable "network_interface_id" {
  description = "Identificador de la interfaz de red."
  type        = string
}

variable "page_title" {
  description = "Titulo de la pagina Apache."
  type        = string
}

variable "tags" {
  description = "Etiquetas comunes."
  type        = map(string)
  default     = {}
}
