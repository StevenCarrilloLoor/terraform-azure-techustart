variable "container_name" {
  description = "Nombre del contenedor."
  type        = string
}

variable "image_name" {
  description = "Imagen Docker de Apache."
  type        = string
}

variable "bind_ip" {
  description = "Direccion local de publicacion."
  type        = string
}

variable "external_port" {
  description = "Puerto local publicado."
  type        = number
}

variable "content_path" {
  description = "Ruta absoluta del contenido web."
  type        = string
}
