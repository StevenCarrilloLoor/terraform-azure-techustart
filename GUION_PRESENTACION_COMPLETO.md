# Guion completo de presentación: TechUStart

Duración sugerida: 6 a 8 minutos.

Durante la exposición se muestran `variables.tf`, `main.tf`, la demostración
Docker, la terminal de resultados y la página Apache.

## 1. Introducción

> Buenos días. Este proyecto implementa infraestructura como código con
> Terraform. El objetivo solicitado es definir una máquina virtual Ubuntu en
> Azure, conectarla a una red pública, permitir HTTP por el puerto 80 e instalar
> Apache automáticamente. Para ejecutar la demostración práctica completa, el
> docente autorizó utilizar Docker.

## 2. Explicación de variables.tf

Mostrar las líneas 1 a 29.

> El archivo variables.tf separa los valores que pueden cambiar. La variable
> azure_region es de tipo string y usa eastus como valor predeterminado. La
> variable tamano_vm también es string y utiliza Standard_B1s, que es el tamaño
> económico pedido. resource_prefix sirve para mantener nombres consistentes,
> admin_username define el usuario de Ubuntu y ssh_public_key recibe la clave
> pública. Esta última se marca como sensitive para evitar mostrarla
> accidentalmente.

## 3. Versión y proveedor de Azure

Mostrar `main.tf`, líneas 1 a 14.

> El bloque terraform exige Terraform 1.5 o posterior. Dentro de
> required_providers se declara hashicorp/azurerm con una versión compatible
> 4.x. El bloque provider activa AzureRM mediante features, que es obligatorio
> para utilizar el proveedor.

## 4. Grupo de recursos

Mostrar las líneas 16 a 24.

> El resource group es el contenedor lógico de Azure. Su nombre se construye con
> el prefijo techustart, su región proviene de la variable azure_region y las
> etiquetas indican el proyecto y que Terraform administra el recurso.

## 5. Red virtual, subred e IP pública

Mostrar las líneas 26 a 46.

> La red virtual utiliza el rango 10.0.0.0 barra 16. Dentro de ella se crea una
> subred 10.0.1.0 barra 24. Después se define una IP pública estática y de tipo
> Standard. Las referencias entre recursos hacen que Terraform conozca el orden
> correcto de creación.

## 6. Seguridad HTTP

Mostrar las líneas 48 a 64.

> El Network Security Group contiene una regla llamada Allow-HTTP. Es una regla
> entrante, permite protocolo TCP y abre únicamente el puerto de destino 80.
> Esto cumple el requisito de permitir acceso al servidor web sin abrir otros
> puertos de entrada.

## 7. Interfaz de red

Mostrar las líneas 66 a 82.

> La interfaz de red conecta la máquina virtual con la subred. La dirección
> privada se asigna dinámicamente y también se vincula la IP pública. El recurso
> siguiente asocia el Network Security Group a la interfaz para aplicar la regla
> del puerto 80.

## 8. Máquina virtual Ubuntu

Mostrar las líneas 84 a 110.

> Este bloque crea la máquina virtual Linux. El tamaño se toma de tamano_vm y el
> usuario se toma de admin_username. La VM utiliza la interfaz creada
> anteriormente y autentica al administrador mediante una clave pública SSH,
> sin escribir contraseñas en el código. El disco utiliza almacenamiento
> Standard LRS y la imagen seleccionada es Ubuntu Server 22.04 LTS de Canonical.

## 9. Instalación automática de Apache

Mostrar las líneas 112 a 133.

> custom_data recibe un script Bash codificado con base64encode. Al arrancar la
> VM, el script actualiza los paquetes, instala Apache, habilita el servicio,
> inicia Apache y escribe la página index.html. Esto significa que el servidor
> web queda configurado automáticamente y no necesita instalación manual.

## 10. Outputs

Mostrar las líneas 141 a 149.

> Los outputs muestran información útil después de terraform apply. El primero
> entrega la dirección IP pública y el segundo construye la URL HTTP del
> servidor Apache.

## 11. Código de la demostración Docker

Abrir `demo-terraform/main.tf`.

> Este segundo archivo permite ejecutar la demostración autorizada. Declara el
> proveedor kreuzwerker/docker. El recurso docker_image utiliza la imagen
> oficial httpd basada en Alpine Linux. El recurso docker_container crea
> techustart-apache a partir de esa imagen.

Mostrar las líneas 23 a 33.

> Aquí se publica el puerto interno 80 de Apache en el puerto externo 8080 de mi
> equipo. El volumen monta la carpeta html dentro del directorio web de Apache y
> se configura como solo lectura.

Mostrar las líneas 36 a 49.

> Los outputs muestran la URL, el nombre del contenedor y el puerto publicado.

Abrir `demo-terraform/variables.tf`.

> La demostración también utiliza variables. container_name define el nombre
> techustart-apache y external_port utiliza 8080. La validación impide utilizar
> un puerto fuera del rango permitido.

## 12. Demostración real

Ejecutar:

```powershell
powershell -ExecutionPolicy Bypass -File .\iniciar-demo-completa.ps1 -Recrear
```

Mientras se ejecuta, decir:

> terraform init prepara el proveedor. terraform fmt comprueba el formato.
> terraform validate comprueba la configuración. terraform plan anuncia dos
> recursos por crear y terraform apply los crea.

Cuando termine, señalar:

> El resultado indica Apply complete, Resources: 2 added. Los recursos son
> docker_image.apache y docker_container.techustart. Los outputs muestran el
> nombre del contenedor, el puerto 8080 y la URL.

Mostrar Docker Desktop.

> Docker Desktop confirma que techustart-apache está activo y publica el puerto
> 8080 hacia el puerto 80.

Mostrar `http://127.0.0.1:8080`.

> Finalmente, esta página es servida realmente por Apache. La verificación
> devuelve HTTP 200, por lo que el despliegue funciona correctamente.

## 13. Conclusión

> En conclusión, el código principal cumple la arquitectura Azure solicitada:
> variables, proveedor, grupo de recursos, red, seguridad, interfaz, VM Ubuntu,
> SSH, Apache automático y outputs. La demostración Docker autorizada comprueba
> en vivo que Terraform puede planificar, crear, consultar y eliminar recursos
> de manera repetible.

## Preguntas probables

**¿Qué diferencia hay entre validate y apply?**

> validate comprueba la estructura de la configuración; apply crea o modifica
> los recursos reales.

**¿Por qué se usa base64encode?**

> Porque Azure espera custom_data codificado en Base64.

**¿Por qué se abre solamente el puerto 80?**

> Porque es el puerto estándar de HTTP y la asignación exige abrir únicamente
> ese puerto de entrada.

**¿Docker es una VM de Azure?**

> No. La implementación Azure está en el código principal. Docker es el entorno
> autorizado para ejecutar la demostración práctica completa.

**¿Para qué sirve terraform destroy?**

> Elimina de forma controlada los recursos que Terraform administra.
