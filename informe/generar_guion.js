const fs = require("fs");
const path = require("path");
const {
  AlignmentType,
  BorderStyle,
  Document,
  ExternalHyperlink,
  Footer,
  HeadingLevel,
  LevelFormat,
  PageBreak,
  PageNumber,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
} = require("docx");

const projectDir = path.resolve(__dirname, "..");
const outputDir = path.resolve(
  "C:/Users/steve/Documents/Codex/2026-06-12/files-mentioned-by-the-user-codex/outputs",
);
const projectOutput = path.join(projectDir, "Guion_Presentacion_Terraform.docx");
const finalOutput = path.join(
  outputDir,
  "Guion_Presentacion_Terraform_Steven_Carrillo_Loor.docx",
);

fs.mkdirSync(outputDir, { recursive: true });

const COLORS = {
  navy: "0B2545",
  blue: "2E74B5",
  darkBlue: "1F4D78",
  muted: "5D6875",
  lightBlue: "E8EEF5",
  lightGray: "F2F4F7",
  white: "FFFFFF",
  black: "111111",
  green: "176B35",
  amber: "7A5A00",
  amberFill: "FFF6D6",
  red: "9B1C1C",
  redFill: "FDECEC",
};

const PAGE_WIDTH = 9360;
const margins = { top: 80, bottom: 80, left: 120, right: 120 };
const border = { style: BorderStyle.SINGLE, size: 4, color: "CAD3DD" };
const borders = { top: border, bottom: border, left: border, right: border };

function text(value, options = {}) {
  return new TextRun({
    text: value,
    font: options.font || "Calibri",
    size: options.size || 22,
    bold: options.bold,
    italics: options.italics,
    color: options.color || COLORS.black,
  });
}

function body(value, options = {}) {
  return new Paragraph({
    alignment: options.alignment || AlignmentType.LEFT,
    keepNext: options.keepNext,
    spacing: { before: 0, after: 120, line: 300 },
    children: [text(value, options)],
  });
}

function heading(value, level = HeadingLevel.HEADING_1) {
  return new Paragraph({
    heading: level,
    keepNext: true,
    children: [text(value, { bold: true })],
  });
}

function bullet(value) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { after: 80, line: 300 },
    children: [text(value)],
  });
}

function numbered(value) {
  return new Paragraph({
    numbering: { reference: "steps", level: 0 },
    spacing: { after: 80, line: 300 },
    children: [text(value)],
  });
}

function code(value) {
  return new Paragraph({
    spacing: { after: 80, line: 280 },
    shading: { fill: COLORS.lightGray, type: ShadingType.CLEAR },
    indent: { left: 240, right: 240 },
    children: [text(value, { font: "Consolas", size: 19, color: COLORS.navy })],
  });
}

function callout(label, value, type = "info") {
  const palette = {
    info: { fill: COLORS.lightBlue, color: COLORS.navy },
    warning: { fill: COLORS.amberFill, color: COLORS.amber },
    risk: { fill: COLORS.redFill, color: COLORS.red },
  }[type];

  return new Table({
    width: { size: PAGE_WIDTH, type: WidthType.DXA },
    columnWidths: [PAGE_WIDTH],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: PAGE_WIDTH, type: WidthType.DXA },
            margins: { top: 140, bottom: 140, left: 180, right: 180 },
            shading: { fill: palette.fill, type: ShadingType.CLEAR },
            borders,
            children: [
              new Paragraph({
                spacing: { after: 60 },
                children: [text(label, { bold: true, color: palette.color })],
              }),
              new Paragraph({
                spacing: { after: 0, line: 300 },
                children: [text(value)],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

function tableCell(value, width, options = {}) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    verticalAlign: VerticalAlign.CENTER,
    margins,
    borders,
    shading: options.fill
      ? { fill: options.fill, type: ShadingType.CLEAR }
      : undefined,
    children: [
      new Paragraph({
        alignment: options.center ? AlignmentType.CENTER : AlignmentType.LEFT,
        spacing: { after: 0, line: 280 },
        children: [
          text(value, {
            bold: options.bold,
            color: options.color,
            size: options.size || 20,
          }),
        ],
      }),
    ],
  });
}

function requirementTable() {
  const widths = [1900, 3300, 4160];
  const rows = [
    ["Requisito", "Bloque o archivo", "Explicacion directa"],
    ["Variables", "variables.tf", "azure_region y tamano_vm tienen los valores predeterminados solicitados."],
    ["Proveedor", "terraform + provider azurerm", "Fija AzureRM ~> 4.0 y habilita features {}."],
    ["Contenedor", "azurerm_resource_group", "Agrupa todos los recursos de Azure."],
    ["Red", "VNet + subnet + public IP", "Crea la conectividad de la maquina virtual."],
    ["Seguridad", "azurerm_network_security_group", "Permite solamente trafico entrante TCP por el puerto 80."],
    ["Interfaz", "azurerm_network_interface", "Conecta la VM con la subred y la IP publica."],
    ["Servidor", "azurerm_linux_virtual_machine", "Usa Ubuntu, tamano variable y autenticacion mediante clave SSH."],
    ["Automatizacion", "custom_data + base64encode", "Instala Apache al iniciar la VM y crea la pagina web."],
    ["Resultado", "output", "Muestra la IP publica y la URL HTTP."],
  ];

  return new Table({
    width: { size: PAGE_WIDTH, type: WidthType.DXA },
    columnWidths: widths,
    rows: rows.map((row, index) =>
      new TableRow({
        tableHeader: index === 0,
        children: row.map((value, column) =>
          tableCell(value, widths[column], {
            bold: index === 0,
            fill: index === 0 ? COLORS.navy : column === 0 ? COLORS.lightBlue : undefined,
            color: index === 0 ? COLORS.white : column === 0 ? COLORS.navy : COLORS.black,
          }),
        ),
      }),
    ),
  });
}

function scriptBlock(time, show, say) {
  return [
    new Paragraph({
      keepNext: true,
      spacing: { before: 160, after: 50 },
      children: [
        text(time, { bold: true, color: COLORS.blue }),
        text(`  ${show}`, { bold: true, color: COLORS.navy }),
      ],
    }),
    new Paragraph({
      spacing: { after: 100, line: 300 },
      indent: { left: 260 },
      children: [
        text("Di: ", { bold: true, color: COLORS.green }),
        text(`"${say}"`),
      ],
    }),
  ];
}

const repoLink = new ExternalHyperlink({
  link: "https://github.com/StevenCarrilloLoor/terraform-azure-techustart",
  children: [
    new TextRun({
      text: "github.com/StevenCarrilloLoor/terraform-azure-techustart",
      style: "Hyperlink",
      font: "Calibri",
      size: 21,
    }),
  ],
});

const children = [
  new Paragraph({
    spacing: { before: 200, after: 80 },
    children: [text("GUIA DE EXPOSICION TECNICA", { bold: true, color: COLORS.blue, size: 23 })],
  }),
  new Paragraph({
    spacing: { after: 90 },
    children: [text("Primer script en Terraform", { bold: true, color: COLORS.navy, size: 40 })],
  }),
  new Paragraph({
    spacing: { after: 240 },
    children: [
      text("Guion literal, explicacion de requisitos y demostracion para clase", {
        color: COLORS.muted,
        size: 26,
      }),
    ],
  }),
  new Table({
    width: { size: PAGE_WIDTH, type: WidthType.DXA },
    columnWidths: [2200, 7160],
    rows: [
      ["Estudiante", "Steven Carrillo Loor"],
      ["Duracion sugerida", "6 a 8 minutos"],
      ["Proyecto", "TechUStart: Azure y demostracion autorizada con Docker"],
      ["Repositorio", ""],
    ].map(([label, value], index) =>
      new TableRow({
        children: [
          tableCell(label, 2200, { bold: true, fill: COLORS.lightBlue, color: COLORS.navy }),
          new TableCell({
            width: { size: 7160, type: WidthType.DXA },
            verticalAlign: VerticalAlign.CENTER,
            margins,
            borders,
            children: [
              index === 3
                ? new Paragraph({ spacing: { after: 0 }, children: [repoLink] })
                : new Paragraph({ spacing: { after: 0 }, children: [text(value, { size: 20 })] }),
            ],
          }),
        ],
      }),
    ),
  }),
  new Paragraph({ spacing: { after: 140 } }),
  callout(
    "Objetivo que debes presentar",
    "Demostrar que el codigo cumple la consigna: variables, proveedor AzureRM, grupo de recursos, red, seguridad HTTP, interfaz, VM Ubuntu, instalacion automatica de Apache y outputs.",
  ),
  new Paragraph({ spacing: { after: 120 } }),
  callout(
    "Como presentar la demostracion real",
    "La implementacion evaluada es Azure y cumple todos los bloques solicitados. El docente autorizo Docker para la demostracion practica; por eso el ciclo completo init, plan, apply, output y destroy se ejecuta con Terraform sobre un servidor Apache Linux en un contenedor. Es una ejecucion real, pero no debe presentarse como una VM de Azure.",
    "warning",
  ),

  heading("1. Guion literal de la presentacion"),
  ...scriptBlock(
    "0:00 - 0:35",
    "Presenta el objetivo",
    "Buenos dias. La tarea consiste en crear el primer script de Terraform para automatizar una maquina virtual Linux con Apache. Mi implementacion principal contiene todos los recursos solicitados para Azure y la demostracion practica se ejecuta con Docker, modalidad autorizada por el docente.",
  ),
  ...scriptBlock(
    "0:35 - 1:10",
    "Abre variables.tf",
    "En variables.tf se encuentran las dos variables obligatorias. azure_region es de tipo string y su valor predeterminado es eastus. tamano_vm tambien es string y utiliza Standard_B1s. Ademas, defini variables para el prefijo de recursos, el usuario administrador y la clave publica SSH.",
  ),
  ...scriptBlock(
    "1:10 - 1:45",
    "Muestra el inicio de main.tf",
    "El bloque terraform exige una version compatible y declara el proveedor hashicorp azurerm con version aproximada 4.0. Despues, el bloque provider azurerm contiene features, que es obligatorio para este proveedor.",
  ),
  ...scriptBlock(
    "1:45 - 2:45",
    "Muestra Resource Group, VNet, subnet e IP",
    "Primero creo el grupo de recursos, que funciona como contenedor de la infraestructura. Luego creo una red virtual con el rango 10.0.0.0 barra 16, una subred 10.0.1.0 barra 24 y una direccion IP publica estatica para acceder al servidor.",
  ),
  ...scriptBlock(
    "2:45 - 3:25",
    "Muestra el Network Security Group",
    "El grupo de seguridad implementa el requisito principal de acceso: solamente abre el puerto TCP 80 en direccion entrante. No se abre SSH al publico, por lo que la regla cumple exactamente la restriccion solicitada.",
  ),
  ...scriptBlock(
    "3:25 - 4:00",
    "Muestra NIC y asociacion",
    "La interfaz de red vincula la subred con la IP publica. En un recurso separado asocio el grupo de seguridad a esa interfaz, de modo que la regla del puerto 80 se aplique a la maquina virtual.",
  ),
  ...scriptBlock(
    "4:00 - 5:00",
    "Muestra azurerm_linux_virtual_machine",
    "La maquina utiliza Ubuntu Server 22.04 de Canonical. El tamano se obtiene de la variable tamano_vm y el acceso administrativo se configura con una clave publica SSH, evitando colocar contrasenas dentro del codigo.",
  ),
  ...scriptBlock(
    "5:00 - 5:45",
    "Muestra custom_data",
    "custom_data contiene un script Bash codificado con base64encode. Cuando la VM inicia, actualiza los paquetes, instala Apache, habilita el servicio y escribe la pagina index.html. Por eso la configuracion del servidor web es automatica.",
  ),
  ...scriptBlock(
    "5:45 - 6:15",
    "Muestra los outputs",
    "Finalmente, los outputs public_ip_address y website_url permiten consultar la direccion IP y la URL HTTP generadas despues de un despliegue.",
  ),
  ...scriptBlock(
    "6:15 - 7:00",
    "Ejecuta la demostracion",
    "Ahora ejecuto una demostracion completa del ciclo de Terraform. El plan indica dos recursos por crear, apply crea una imagen y un contenedor Linux con Apache, el output muestra la URL y finalmente compruebo una respuesta HTTP 200.",
  ),
  ...scriptBlock(
    "7:00 - 7:30",
    "Cierra la presentacion",
    "En conclusion, el codigo Azure cubre los bloques pedidos y la demostracion autorizada comprueba en vivo el ciclo plan, apply, output y destroy con Apache Linux en Docker. La pagina y la respuesta HTTP 200 demuestran que los recursos declarados por Terraform estan funcionando.",
  ),

  heading("2. Relacion directa con la consigna"),
  body("Utiliza esta tabla para comprobar que no olvidaste ningun requisito durante la exposicion."),
  requirementTable(),

  heading("3. Explicacion tecnica breve"),
  heading("variables.tf", HeadingLevel.HEADING_2),
  body("Separa los valores que pueden cambiar del resto del codigo. La region y el tamano de la VM pueden modificarse sin editar main.tf."),
  heading("Bloque terraform y proveedor", HeadingLevel.HEADING_2),
  body("El bloque terraform controla la compatibilidad de versiones y descarga el proveedor. El bloque provider activa AzureRM para que Terraform pueda comunicarse con la API de Azure."),
  heading("Grupo de recursos", HeadingLevel.HEADING_2),
  body("Es el contenedor logico de Azure. Todos los recursos del proyecto utilizan su ubicacion y su nombre."),
  heading("VNet, subred e IP publica", HeadingLevel.HEADING_2),
  body("La VNet define el espacio de red. La subred reserva el segmento donde se conecta la VM. La IP publica crea el punto de acceso HTTP desde Internet."),
  heading("NSG y puerto 80", HeadingLevel.HEADING_2),
  body("El Network Security Group actua como filtro de red. La regla creada permite TCP entrante al puerto 80, que es el puerto estandar de HTTP."),
  heading("Interfaz de red", HeadingLevel.HEADING_2),
  body("La NIC conecta la VM con la subred y con la IP publica. La asociacion separada aplica el NSG a la interfaz."),
  heading("Maquina virtual y SSH", HeadingLevel.HEADING_2),
  body("La VM usa Ubuntu 22.04. El acceso administrativo se define con una clave publica SSH marcada como variable sensible."),
  heading("custom_data", HeadingLevel.HEADING_2),
  body("Azure espera el contenido inicial en Base64. Por eso se usa base64encode para enviar el script Bash que instala y configura Apache durante el primer arranque."),
  heading("Outputs", HeadingLevel.HEADING_2),
  body("Los outputs exponen datos utiles al terminar el apply. En este proyecto muestran la IP publica y construyen la URL HTTP."),

  heading("4. Secuencia exacta de demostracion"),
  callout(
    "Antes de empezar",
    "Deja abiertos variables.tf, main.tf, el repositorio GitHub y PowerShell. Docker Desktop debe estar iniciado.",
    "warning",
  ),
  new Paragraph({ spacing: { after: 120 } }),
  numbered("Abre PowerShell dentro de la carpeta terraform-azure-techustart."),
  numbered("Ejecuta la demostracion completa desde cero."),
  code("powershell -ExecutionPolicy Bypass -File .\\iniciar-demo-completa.ps1 -Recrear"),
  numbered("Senala Plan: 2 to add, Apply complete y los outputs container_name y website_url."),
  numbered("Abre variables.tf y explica azure_region y tamano_vm."),
  numbered("Recorre main.tf en el mismo orden de la consigna."),
  numbered("Abre http://127.0.0.1:8080 y muestra que Apache responde realmente."),
  numbered("Muestra el repositorio publico."),
  code("https://github.com/StevenCarrilloLoor/terraform-azure-techustart"),
  numbered("Al terminar la clase, detiene el servidor local."),
  code("powershell -ExecutionPolicy Bypass -File .\\detener-demo-completa.ps1"),

  heading("5. Preguntas probables del profesor"),
  heading("Que hace terraform init?", HeadingLevel.HEADING_2),
  body("Inicializa la carpeta de trabajo, descarga o reutiliza proveedores y prepara Terraform para operar."),
  heading("Que demuestra terraform validate?", HeadingLevel.HEADING_2),
  body("Comprueba que la configuracion es sintactica e internamente valida. No crea recursos y no sustituye a terraform apply."),
  heading("Por que se usa Base64?", HeadingLevel.HEADING_2),
  body("Porque custom_data de la maquina virtual recibe el contenido codificado. base64encode realiza esa conversion dentro de Terraform."),
  heading("Por que solamente se abre el puerto 80?", HeadingLevel.HEADING_2),
  body("Porque la consigna solicita acceso web HTTP y exige que la regla entrante abra unicamente ese puerto."),
  heading("Se desplego realmente en Azure?", HeadingLevel.HEADING_2),
  body("Respuesta recomendada: La implementacion Azure esta completa y validada. Para la demostracion practica, el docente autorizo Docker; por eso ejecute realmente plan y apply sobre Apache Linux en un contenedor. No presento el contenedor como si fuera una VM de Azure."),
  heading("Para que sirve terraform destroy?", HeadingLevel.HEADING_2),
  body("Elimina los recursos administrados por Terraform. Debe ejecutarse al terminar una demostracion real para evitar consumo y costos."),
  heading("Que recursos crea la demostracion Docker?", HeadingLevel.HEADING_2),
  body("Crea una imagen httpd:2.4-alpine y un contenedor techustart-apache. El contenedor publica el puerto interno 80 en 127.0.0.1:8080 y monta la pagina web en modo de solo lectura."),

  heading("6. Frases que debes evitar"),
  bullet("Evita: La VM esta desplegada y funcionando en Azure."),
  bullet("Di: El codigo Azure esta implementado y validado; la ejecucion completa autorizada se demuestra con Apache Linux en Docker."),
  bullet("Evita: Esta pagina de localhost es Azure."),
  bullet("Di: Esta pagina la sirve un Apache Linux creado realmente por terraform apply."),
  bullet("Evita mostrar o leer claves privadas. Solo se utiliza la clave publica SSH."),

  heading("7. Checklist antes de entrar a clase"),
  bullet("La pagina http://127.0.0.1:8080 responde."),
  bullet("variables.tf y main.tf estan abiertos y con zoom legible."),
  bullet("El repositorio GitHub esta abierto y aparece como Public."),
  bullet("El informe y este guion estan disponibles localmente."),
  bullet("No hay contrasenas, tokens ni claves privadas visibles."),
  bullet("Sabes diferenciar el codigo Azure de la demostracion ejecutable con Docker."),
];

const doc = new Document({
  creator: "Steven Carrillo Loor",
  title: "Guion de presentacion del proyecto Terraform TechUStart",
  description: "Guion tecnico basado en los requisitos de la asignacion.",
  styles: {
    default: {
      document: {
        run: { font: "Calibri", size: 22, color: COLORS.black },
        paragraph: { spacing: { after: 120, line: 300 } },
      },
    },
    paragraphStyles: [
      {
        id: "Heading1",
        name: "Heading 1",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { font: "Calibri", size: 32, bold: true, color: COLORS.blue },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 },
      },
      {
        id: "Heading2",
        name: "Heading 2",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { font: "Calibri", size: 26, bold: true, color: COLORS.blue },
        paragraph: { spacing: { before: 280, after: 140 }, outlineLevel: 1 },
      },
      {
        id: "Heading3",
        name: "Heading 3",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { font: "Calibri", size: 24, bold: true, color: COLORS.darkBlue },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 },
      },
    ],
  },
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [
          {
            level: 0,
            format: LevelFormat.BULLET,
            text: "\u2022",
            alignment: AlignmentType.LEFT,
            style: {
              paragraph: {
                indent: { left: 540, hanging: 280 },
                spacing: { after: 80, line: 300 },
              },
            },
          },
        ],
      },
      {
        reference: "steps",
        levels: [
          {
            level: 0,
            format: LevelFormat.DECIMAL,
            text: "%1.",
            alignment: AlignmentType.LEFT,
            style: {
              paragraph: {
                indent: { left: 540, hanging: 280 },
                spacing: { after: 80, line: 300 },
              },
            },
          },
        ],
      },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: {
            top: 1440,
            right: 1440,
            bottom: 1440,
            left: 1440,
            header: 708,
            footer: 708,
          },
        },
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                text("TechUStart | Guion de presentacion | ", {
                  size: 18,
                  color: COLORS.muted,
                }),
                new TextRun({
                  children: [PageNumber.CURRENT],
                  font: "Calibri",
                  size: 18,
                  color: COLORS.muted,
                }),
              ],
            }),
          ],
        }),
      },
      children,
    },
  ],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(projectOutput, buffer);
  fs.writeFileSync(finalOutput, buffer);
  console.log(projectOutput);
  console.log(finalOutput);
});
