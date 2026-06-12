terraform {
  required_version = ">= 1.5.0"

  required_providers {
    oci = {
      source  = "oracle/oci"
      version = "~> 8.0"
    }
  }
}

provider "oci" {
  region = var.region
}

data "oci_identity_availability_domains" "techustart" {
  compartment_id = var.compartment_id
}

data "oci_core_images" "ubuntu" {
  compartment_id           = var.compartment_id
  operating_system         = "Canonical Ubuntu"
  operating_system_version = "22.04"
  shape                    = var.instance_shape
  sort_by                  = "TIMECREATED"
  sort_order               = "DESC"
}

resource "oci_core_vcn" "techustart" {
  compartment_id = var.compartment_id
  cidr_blocks    = ["10.0.0.0/16"]
  display_name   = "${var.resource_prefix}-vcn"
  dns_label      = "techustart"
}

resource "oci_core_internet_gateway" "techustart" {
  compartment_id = var.compartment_id
  vcn_id         = oci_core_vcn.techustart.id
  display_name   = "${var.resource_prefix}-internet-gateway"
  enabled        = true
}

resource "oci_core_route_table" "techustart" {
  compartment_id = var.compartment_id
  vcn_id         = oci_core_vcn.techustart.id
  display_name   = "${var.resource_prefix}-route-table"

  route_rules {
    destination       = "0.0.0.0/0"
    destination_type  = "CIDR_BLOCK"
    network_entity_id = oci_core_internet_gateway.techustart.id
  }
}

resource "oci_core_security_list" "techustart" {
  compartment_id = var.compartment_id
  vcn_id         = oci_core_vcn.techustart.id
  display_name   = "${var.resource_prefix}-security-list"

  ingress_security_rules {
    protocol = "6"
    source   = "0.0.0.0/0"

    tcp_options {
      min = 80
      max = 80
    }
  }

  egress_security_rules {
    destination = "0.0.0.0/0"
    protocol    = "all"
  }
}

resource "oci_core_subnet" "techustart" {
  compartment_id    = var.compartment_id
  vcn_id            = oci_core_vcn.techustart.id
  cidr_block        = "10.0.1.0/24"
  display_name      = "${var.resource_prefix}-public-subnet"
  dns_label         = "public"
  route_table_id    = oci_core_route_table.techustart.id
  security_list_ids = [oci_core_security_list.techustart.id]

  prohibit_public_ip_on_vnic = false
}

resource "oci_core_instance" "techustart" {
  availability_domain = data.oci_identity_availability_domains.techustart.availability_domains[0].name
  compartment_id      = var.compartment_id
  display_name        = "${var.resource_prefix}-vm"
  shape               = var.instance_shape

  create_vnic_details {
    assign_public_ip = true
    display_name     = "${var.resource_prefix}-vnic"
    subnet_id        = oci_core_subnet.techustart.id
  }

  metadata = {
    ssh_authorized_keys = var.ssh_public_key
    user_data = base64encode(<<-CLOUD_INIT
      #!/bin/bash
      set -e
      apt-get update
      DEBIAN_FRONTEND=noninteractive apt-get install -y apache2
      systemctl enable apache2
      systemctl start apache2
      iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
      netfilter-persistent save || true
      cat > /var/www/html/index.html <<'HTML'
      <!doctype html>
      <html lang="es">
        <head>
          <meta charset="utf-8">
          <title>TechUStart - Terraform OCI</title>
        </head>
        <body>
          <h1>TechUStart desplegado con Terraform en Oracle Cloud</h1>
          <p>Servidor Apache ejecutandose sobre una instancia Ubuntu.</p>
        </body>
      </html>
      HTML
    CLOUD_INIT
    )
  }

  source_details {
    source_id   = data.oci_core_images.ubuntu.images[0].id
    source_type = "image"
  }

  preserve_boot_volume = false
}

output "public_ip_address" {
  description = "Direccion IP publica asignada a la instancia."
  value       = oci_core_instance.techustart.public_ip
}

output "website_url" {
  description = "URL publica del servidor web Apache."
  value       = "http://${oci_core_instance.techustart.public_ip}"
}

