variable "resource_prefix" {
  description = "Prefijo para nombrar los recursos de red."
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

variable "virtual_network_cidrs" {
  description = "Rangos CIDR de la red virtual."
  type        = list(string)
}

variable "subnet_address_prefixes" {
  description = "Rangos CIDR de la subred."
  type        = list(string)
}

variable "tags" {
  description = "Etiquetas comunes."
  type        = map(string)
  default     = {}
}
