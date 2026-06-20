# Changelog

Todos los cambios relevantes del proyecto se documentan en este archivo.

El formato sigue Keep a Changelog y el proyecto utiliza versionado semantico.

## [2.0.0] - 2026-06-19

### Agregado

- Modulo `network` para VNet, subred, IP publica, NSG y NIC.
- Modulo `linux_web_server` para la VM Ubuntu y cloud-init.
- Modulo `apache_container` para la demostracion Docker.
- Validaciones de variables y etiquetas comunes con `Name`.
- Configuracion opcional de suscripcion y tenant de Azure.
- Script `azure-plan.ps1` para verificar Azure CLI y generar un plan real.
- Script unificado de validacion local.
- CI de GitHub para formato y validacion.
- Pruebas Azure con proveedor simulado, sin credenciales ni consumo de credito.
- Bloques `moved` para conservar compatibilidad con estados anteriores.

### Cambiado

- Separacion de versiones, proveedor, variables, recursos y outputs.
- Scripts operativos reorganizados dentro de `scripts/`.
- Documentacion reescrita alrededor de Azure como implementacion principal.
- Demostracion Docker migrada a una arquitectura modular.

### Eliminado

- Informes, capturas y generadores utilizados solamente durante la exposicion.
- Alternativa Oracle que no forma parte de la solucion final.
- Planes Terraform y archivos temporales almacenados localmente.

## [1.0.0] - 2026-06-12

### Agregado

- Primera implementacion de la VM Ubuntu con Apache en Azure.
- Variables obligatorias `azure_region` y `tamano_vm`.
- Red, IP publica, NSG HTTP, NIC, SSH, cloud-init y outputs.
