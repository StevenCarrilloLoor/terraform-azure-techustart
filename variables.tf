variable "azure_region" {
  description = "Region de Azure donde se desplegaran los recursos."
  type        = string
  default     = "eastus"
}

variable "tamano_vm" {
  description = "Tamano de la maquina virtual Linux."
  type        = string
  default     = "Standard_B1s"
}

variable "resource_prefix" {
  description = "Prefijo utilizado para nombrar los recursos."
  type        = string
  default     = "techustart"
}

variable "admin_username" {
  description = "Usuario administrador de la maquina virtual."
  type        = string
  default     = "azureadmin"
}

variable "ssh_public_key" {
  description = "Clave publica SSH autorizada para acceder a la VM."
  type        = string
  sensitive   = true
}

