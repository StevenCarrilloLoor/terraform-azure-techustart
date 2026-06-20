output "container_id" {
  description = "Identificador del contenedor."
  value       = docker_container.this.id
}

output "container_name" {
  description = "Nombre del contenedor."
  value       = docker_container.this.name
}

output "website_url" {
  description = "URL local de Apache."
  value       = "http://${var.bind_ip}:${var.external_port}"
}
