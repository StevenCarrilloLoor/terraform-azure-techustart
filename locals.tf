locals {
  common_tags = merge(var.tags, {
    project    = "TechUStart"
    managed_by = "Terraform"
  })
}
