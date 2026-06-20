terraform {
  required_version = ">= 1.5.0"

  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

provider "docker" {}

resource "docker_image" "apache" {
  name         = "httpd:2.4-alpine"
  keep_locally = true
}

resource "docker_container" "techustart" {
  name  = var.container_name
  image = docker_image.apache.image_id

  ports {
    internal = 80
    external = var.external_port
    ip       = "127.0.0.1"
  }

  volumes {
    host_path      = abspath("${path.module}/html")
    container_path = "/usr/local/apache2/htdocs"
    read_only      = true
  }
}

output "website_url" {
  description = "URL del servidor Apache creado realmente por Terraform."
  value       = "http://127.0.0.1:${var.external_port}"
}

output "container_name" {
  description = "Nombre del contenedor Linux administrado por Terraform."
  value       = docker_container.techustart.name
}

output "published_port" {
  description = "Puerto local publicado hacia el puerto HTTP 80 de Apache."
  value       = var.external_port
}
