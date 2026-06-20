resource "docker_image" "this" {
  name         = var.image_name
  keep_locally = true
}

resource "docker_container" "this" {
  name    = var.container_name
  image   = docker_image.this.image_id
  restart = "unless-stopped"

  ports {
    internal = 80
    external = var.external_port
    ip       = var.bind_ip
  }

  volumes {
    host_path      = var.content_path
    container_path = "/usr/local/apache2/htdocs"
    read_only      = true
  }
}
