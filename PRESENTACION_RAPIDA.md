# Presentacion rapida: TechUStart con Terraform

## Antes de presentar

- Docker Desktop debe estar iniciado.
- Abre `variables.tf`, `main.tf` y el repositorio GitHub.
- Abre PowerShell en esta carpeta.

## Orden de la exposicion

1. Explica `variables.tf`: `azure_region = eastus` y `tamano_vm = Standard_B1s`.
2. Explica el bloque `terraform` y el proveedor AzureRM `~> 4.0`.
3. Muestra Resource Group, VNet, subnet e IP publica.
4. Muestra el NSG: solo TCP entrante por el puerto 80.
5. Muestra la NIC y su asociacion con el NSG.
6. Muestra la VM Ubuntu, la clave SSH y `custom_data`.
7. Muestra los outputs de IP y URL.
8. Ejecuta la demostracion completa desde cero:

```powershell
powershell -ExecutionPolicy Bypass -File .\iniciar-demo-completa.ps1 -Recrear
```

9. Senala en la terminal:
   - `Plan: 2 to add`
   - `Apply complete! Resources: 2 added`
   - `docker_image.apache`
   - `docker_container.techustart`
   - `website_url = "http://127.0.0.1:8080"`
   - `RESULTADO: Apache responde HTTP 200`
10. Abre `http://127.0.0.1:8080`.

## Frase exacta para explicar Docker

> La implementacion principal conserva todos los recursos solicitados para Azure
> y supera terraform validate. Para la demostracion practica, el docente autorizo
> Docker. Por eso ejecuto el ciclo completo de Terraform sobre un servidor Apache
> Linux en un contenedor, sin afirmar que el contenedor sea una VM de Azure.

## Al terminar

```powershell
powershell -ExecutionPolicy Bypass -File .\detener-demo-completa.ps1
```
