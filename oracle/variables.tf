variable "region" {
  description = "Region de Oracle Cloud Infrastructure."
  type        = string
  default     = "us-ashburn-1"
}

variable "compartment_id" {
  description = "OCID del compartimento donde se desplegaran los recursos."
  type        = string
}

variable "instance_shape" {
  description = "Shape de la instancia; VM.Standard.E2.1.Micro suele ser elegible para Always Free."
  type        = string
  default     = "VM.Standard.E2.1.Micro"
}

variable "resource_prefix" {
  description = "Prefijo utilizado para nombrar los recursos."
  type        = string
  default     = "techustart"
}

variable "ssh_public_key" {
  description = "Clave publica SSH autorizada para acceder a la instancia."
  type        = string
  sensitive   = true
}

