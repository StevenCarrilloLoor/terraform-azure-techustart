variable "azure_region" {
  description = "Region de Azure donde se desplegaran los recursos."
  type        = string
  default     = "eastus"

  validation {
    condition     = length(trimspace(var.azure_region)) > 0
    error_message = "azure_region no puede estar vacia."
  }
}

variable "azure_subscription_id" {
  description = "Id de suscripcion de Azure. Si es null, AzureRM usa la suscripcion activa de Azure CLI."
  type        = string
  default     = null
  nullable    = true

  validation {
    condition = var.azure_subscription_id == null || can(regex(
      "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$",
      var.azure_subscription_id,
    ))
    error_message = "azure_subscription_id debe ser un UUID valido o null."
  }
}

variable "azure_tenant_id" {
  description = "Id del tenant de Azure. Si es null, AzureRM usa el tenant activo de Azure CLI."
  type        = string
  default     = null
  nullable    = true

  validation {
    condition = var.azure_tenant_id == null || can(regex(
      "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$",
      var.azure_tenant_id,
    ))
    error_message = "azure_tenant_id debe ser un UUID valido o null."
  }
}

variable "tamano_vm" {
  description = "Tamano de la maquina virtual Linux."
  type        = string
  default     = "Standard_B1s"

  validation {
    condition     = can(regex("^Standard_[A-Za-z0-9_]+$", var.tamano_vm))
    error_message = "tamano_vm debe ser un tamano valido de Azure, por ejemplo Standard_B1s."
  }
}

variable "resource_prefix" {
  description = "Prefijo en minusculas utilizado para nombrar los recursos."
  type        = string
  default     = "techustart"

  validation {
    condition     = can(regex("^[a-z0-9][a-z0-9-]{2,19}$", var.resource_prefix))
    error_message = "resource_prefix debe tener entre 3 y 20 caracteres: minusculas, numeros o guiones."
  }
}

variable "admin_username" {
  description = "Usuario administrador de la maquina virtual."
  type        = string
  default     = "azureadmin"

  validation {
    condition     = can(regex("^[a-z][a-z0-9_-]{2,31}$", var.admin_username))
    error_message = "admin_username debe comenzar con una letra minuscula y tener entre 3 y 32 caracteres."
  }
}

variable "ssh_public_key" {
  description = "Clave publica SSH autorizada para acceder a la VM."
  type        = string
  sensitive   = true

  validation {
    condition = can(regex(
      "^ssh-(rsa|ed25519|ecdsa-[^ ]+) [A-Za-z0-9+/=]+(?: .*)?$",
      trimspace(var.ssh_public_key),
    ))
    error_message = "ssh_public_key debe contener una clave publica SSH valida."
  }
}

variable "virtual_network_cidrs" {
  description = "Rangos CIDR asignados a la red virtual."
  type        = list(string)
  default     = ["10.0.0.0/16"]

  validation {
    condition = length(var.virtual_network_cidrs) > 0 && alltrue([
      for cidr in var.virtual_network_cidrs : can(cidrnetmask(cidr))
    ])
    error_message = "virtual_network_cidrs debe contener al menos un CIDR valido."
  }
}

variable "subnet_address_prefixes" {
  description = "Rangos CIDR asignados a la subred de la maquina virtual."
  type        = list(string)
  default     = ["10.0.1.0/24"]

  validation {
    condition = length(var.subnet_address_prefixes) > 0 && alltrue([
      for cidr in var.subnet_address_prefixes : can(cidrnetmask(cidr))
    ])
    error_message = "subnet_address_prefixes debe contener al menos un CIDR valido."
  }
}

variable "page_title" {
  description = "Titulo mostrado por la pagina Apache."
  type        = string
  default     = "TechUStart desplegado con Terraform"

  validation {
    condition     = length(trimspace(var.page_title)) >= 5
    error_message = "page_title debe tener al menos 5 caracteres."
  }
}

variable "tags" {
  description = "Etiquetas adicionales aplicadas a los recursos que admiten tags."
  type        = map(string)
  default = {
    environment = "development"
    owner       = "TechUStart"
  }
}
