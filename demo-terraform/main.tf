module "apache" {
  source = "./modules/apache_container"

  container_name = var.container_name
  image_name     = var.image_name
  bind_ip        = var.bind_ip
  external_port  = var.external_port
  content_path   = abspath("${path.module}/html")
}
