# Alternativa Oracle Cloud Infrastructure

Esta carpeta implementa la alternativa permitida por la consigna cuando la cuenta de Azure no dispone de creditos o suscripcion activa.

## Recursos creados

- Red virtual de nube (VCN) y subred publica.
- Internet Gateway y tabla de rutas.
- Lista de seguridad con entrada unicamente por TCP/80.
- Instancia Ubuntu con direccion IP publica.
- Instalacion automatica de Apache mediante `user_data`.

## Preparacion

Configure el OCI CLI y copie `terraform.tfvars.example` como `terraform.tfvars`. Complete el OCID del compartimento y la region de la cuenta.

```powershell
oci setup config
Copy-Item terraform.tfvars.example terraform.tfvars
terraform init
terraform validate
terraform plan
terraform apply
```

