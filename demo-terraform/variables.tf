variable "container_name" {
  description = "Nombre del contenedor Linux que ejecuta Apache."
  type        = string
  default     = "techustart-apache"
}

variable "image_name" {
  description = "Imagen Docker que ejecuta Apache."
  type        = string
  default     = "httpd:2.4-alpine"

  validation {
    condition     = length(trimspace(var.image_name)) > 0
    error_message = "image_name no puede estar vacia."
  }
}

variable "bind_ip" {
  description = "Direccion local donde se publica Apache."
  type        = string
  default     = "127.0.0.1"

  validation {
    condition     = can(cidrhost("${var.bind_ip}/32", 0))
    error_message = "bind_ip debe ser una direccion IPv4 valida."
  }
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
