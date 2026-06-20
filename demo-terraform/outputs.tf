output "website_url" {
  description = "URL del servidor Apache creado por Terraform."
  value       = module.apache.website_url
}

output "container_name" {
  description = "Nombre del contenedor Linux administrado por Terraform."
  value       = module.apache.container_name
}

output "container_id" {
  description = "Identificador del contenedor."
  value       = module.apache.container_id
}

output "published_port" {
  description = "Puerto local publicado hacia Apache."
  value       = var.external_port
}
