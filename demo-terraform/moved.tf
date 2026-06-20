moved {
  from = docker_image.apache
  to   = module.apache.docker_image.this
}

moved {
  from = docker_container.techustart
  to   = module.apache.docker_container.this
}
