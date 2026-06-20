variable "container_name" {
  description = "Nombre del contenedor Linux que ejecuta Apache."
  type        = string
  default     = "techustart-apache"
}

variable "external_port" {
  description = "Puerto local que publica el puerto HTTP 80 del contenedor."
  type        = number
  default     = 8080

  validation {
    condition     = var.external_port >= 1024 && var.external_port <= 65535
    error_message = "El puerto externo debe estar entre 1024 y 65535."
  }
}
