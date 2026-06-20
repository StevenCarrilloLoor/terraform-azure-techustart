# TechUStart: infraestructura Azure con Terraform

Este proyecto implementa el primer script de Terraform solicitado para TechUStart. Crea una maquina virtual Linux en Azure y publica un servidor web Apache instalado automaticamente mediante `custom_data`.

La cuenta Azure utilizada para la demostracion no dispone de una suscripcion activa. Por ello, la carpeta [`oracle`](oracle/) incluye la implementacion equivalente para Oracle Cloud Infrastructure, conforme a la alternativa permitida en la consigna.

## Recursos creados

- Grupo de recursos.
- Red virtual y subred.
- Direccion IP publica estatica.
- Grupo de seguridad de red con acceso entrante unicamente por TCP/80.
- Interfaz de red asociada a la IP publica y al grupo de seguridad.
- Maquina virtual Ubuntu Server 22.04 LTS de Canonical.
- Pagina web de verificacion servida por Apache.

## Requisitos

- Terraform 1.5 o posterior.
- Azure CLI con una sesion iniciada.
- Suscripcion de Azure activa.
- Clave publica SSH.

## Uso

```powershell
az login
terraform init
terraform fmt -check
terraform validate
terraform plan -out techustart.tfplan -var "ssh_public_key=$(Get-Content $HOME\.ssh\id_ed25519.pub)"
terraform apply techustart.tfplan
terraform output website_url
```

Al terminar la demostracion, elimine los recursos para evitar costos:

```powershell
terraform destroy -var "ssh_public_key=$(Get-Content $HOME\.ssh\id_ed25519.pub)"
```

## Demostracion Docker autorizada para la exposicion

La carpeta `demo-terraform` permite demostrar el ciclo completo de Terraform
con un servidor Apache Linux real administrado mediante el proveedor Docker.
Esta modalidad fue autorizada para la exposicion:

```powershell
powershell -ExecutionPolicy Bypass -File .\iniciar-demo-completa.ps1 -Recrear
```

El script ejecuta `init`, `fmt -check`, `validate`, `plan` y `apply`; crea la
imagen y el contenedor `techustart-apache`, muestra los recursos del estado y
verifica que `http://127.0.0.1:8080` responda HTTP 200. La implementacion
solicitada para Azure se conserva en los archivos principales del proyecto.

Para detenerla:

```powershell
powershell -ExecutionPolicy Bypass -File .\detener-demo-completa.ps1
```

El guion con la explicación de cada bloque de código y la demostración se
encuentra en
[`GUION_PRESENTACION_COMPLETO.md`](GUION_PRESENTACION_COMPLETO.md).

## Variables principales

| Variable | Tipo | Valor predeterminado | Proposito |
|---|---|---|---|
| `azure_region` | `string` | `eastus` | Region de despliegue |
| `tamano_vm` | `string` | `Standard_B1s` | Tamano economico de la VM |

## Seguridad

El repositorio excluye archivos de estado, planes, variables locales y claves. La regla entrante del NSG permite solamente HTTP por el puerto 80, conforme a la consigna.
