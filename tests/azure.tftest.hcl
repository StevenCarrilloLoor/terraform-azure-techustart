mock_provider "azurerm" {}

variables {
  ssh_public_key = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIAG7a4mlYqJ7IwhXFSjf4Q7GeeHt8Vwfqt7DyXceZXuE terraform-test"
}

run "plans_modular_azure_infrastructure" {
  command = plan

  assert {
    condition     = azurerm_resource_group.this.name == "techustart-rg"
    error_message = "The resource group name does not use the configured prefix."
  }

  assert {
    condition     = azurerm_resource_group.this.tags["Name"] == "techustart-rg"
    error_message = "The resource group is missing the Name tag."
  }

  assert {
    condition     = module.web_server.virtual_machine_name == "techustart-vm"
    error_message = "The virtual machine name does not use the configured prefix."
  }
}

run "rejects_invalid_resource_prefix" {
  command = plan

  variables {
    resource_prefix = "INVALID PREFIX"
  }

  expect_failures = [var.resource_prefix]
}
