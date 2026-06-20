# TechUStart - Infraestructura modular con Terraform

Implementacion de infraestructura como codigo para desplegar un servidor Apache
sobre una maquina virtual Ubuntu en Microsoft Azure. Azure es el objetivo
principal del proyecto; la carpeta `demo-terraform` ofrece una demostracion
local equivalente con Docker cuando la suscripcion no dispone de credito.

Version actual: **2.0.0**

## Arquitectura Azure

```text
Resource Group
├── Modulo network
│   ├── Virtual Network
│   ├── Subnet
│   ├── Public IP
│   ├── Network Security Group: solo TCP/80 entrante
│   └── Network Interface
└── Modulo linux_web_server
    └── Ubuntu 22.04 LTS
        └── cloud-init instala y habilita Apache
```

## Estructura

```text
.
├── main.tf
├── variables.tf
├── versions.tf
├── providers.tf
├── locals.tf
├── outputs.tf
├── moved.tf
├── modules/
│   ├── network/
│   └── linux_web_server/
├── demo-terraform/
│   └── modules/apache_container/
├── scripts/
│   ├── azure-plan.ps1
│   ├── validate.ps1
│   ├── demo-up.ps1
│   └── demo-down.ps1
└── .github/workflows/terraform-ci.yml
```

## Requisitos

- Terraform `>= 1.5.0, < 2.0.0`.
- Azure CLI.
- Una suscripcion de Azure habilitada para ejecutar `plan` o `apply`.
- Una clave publica SSH.
- Docker Desktop, solamente para la demostracion local.

## Conexion con Azure

La autenticacion se realiza con Azure CLI. No se guardan contrasenas, tokens ni
claves privadas en Terraform.

```powershell
az login
az account list --output table
az account set --subscription "<SUBSCRIPTION_ID>"
```

El proveedor utiliza la suscripcion y el tenant activos de Azure CLI. Tambien
pueden declararse de forma opcional mediante `azure_subscription_id` y
`azure_tenant_id`; estos identificadores no son credenciales.

Para validar y generar un plan real:

```powershell
.\scripts\azure-plan.ps1 `
  -Login `
  -SubscriptionId "<SUBSCRIPTION_ID>" `
  -PublicKeyPath "$HOME\.ssh\techustart_terraform.pub"
```

El script ejecuta `init`, `fmt -check`, `validate` y `plan`. Si la suscripcion
no tiene credito suficiente, la configuracion sigue pudiendo superar `init`,
`fmt` y `validate`; el despliegue queda pendiente de una suscripcion habilitada.

Cuando exista credito:

```powershell
terraform apply azure.tfplan
terraform output website_url
```

Al terminar:

```powershell
terraform destroy
```

## Variables principales

| Variable | Tipo | Predeterminado | Uso |
|---|---|---|---|
| `azure_region` | `string` | `eastus` | Region de Azure |
| `tamano_vm` | `string` | `Standard_B1s` | Tamano economico de la VM |
| `resource_prefix` | `string` | `techustart` | Prefijo consistente |
| `admin_username` | `string` | `azureadmin` | Usuario de Ubuntu |
| `ssh_public_key` | `string` sensible | sin valor | Acceso SSH |

Consulta `terraform.tfvars.example` para ver todas las opciones.

## Demostracion Docker

La demostracion utiliza un modulo Terraform que administra la imagen oficial
`httpd:2.4-alpine`, un contenedor y la publicacion local `127.0.0.1:8080`.

```powershell
.\scripts\demo-up.ps1
```

Para recrearla desde cero:

```powershell
.\scripts\demo-up.ps1 -Recreate
```

Para eliminarla:

```powershell
.\scripts\demo-down.ps1
```

## Calidad y seguridad

- `terraform fmt -check -recursive`.
- `terraform validate` para Azure y Docker.
- Versiones de Terraform y proveedores restringidas.
- Archivos `.terraform`, estados, planes y variables locales excluidos.
- `.terraform.lock.hcl` versionado para instalaciones reproducibles.
- Variables con tipos, descripciones y validaciones.
- Recursos y variables con identificadores `snake_case`.
- Regla entrante limitada exclusivamente a TCP/80.
- Etiqueta `Name` y etiquetas comunes en recursos compatibles.
- Compatibilidad de estado mediante bloques `moved`.
- CI de GitHub para formato y validacion en cada push y pull request.
- Pruebas con proveedor Azure simulado, sin credenciales ni consumo de credito.

Ejecutar todas las comprobaciones localmente:

```powershell
.\scripts\validate.ps1
```

## Versionado

El proyecto utiliza versionado semantico:

- `MAJOR`: cambios incompatibles de arquitectura.
- `MINOR`: nuevas capacidades compatibles.
- `PATCH`: correcciones sin cambios de interfaz.

Los cambios se documentan en [CHANGELOG.md](CHANGELOG.md).
