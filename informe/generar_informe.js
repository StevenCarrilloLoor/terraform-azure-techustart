const fs = require("fs");
const path = require("path");
const {
  AlignmentType,
  BorderStyle,
  Document,
  ExternalHyperlink,
  Footer,
  HeadingLevel,
  ImageRun,
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
const imagesDir = path.join(projectDir, "evidencias", "capturas");
const outputDir = path.resolve(
  "C:/Users/steve/Documents/Codex/2026-06-12/files-mentioned-by-the-user-codex/outputs",
);
const projectOutput = path.join(projectDir, "Informe_Terraform_Steven_Carrillo_Loor.docx");
const finalOutput = path.join(outputDir, "Informe_Terraform_Steven_Carrillo_Loor.docx");

fs.mkdirSync(outputDir, { recursive: true });

const COLORS = {
  navy: "17365D",
  blue: "2E75B6",
  lightBlue: "D9EAF7",
  gray: "666666",
  lightGray: "F2F4F7",
  white: "FFFFFF",
  black: "000000",
  green: "2E7D32",
  amber: "9A6700",
};

const PAGE_WIDTH = 9360;
const cellMargins = { top: 100, bottom: 100, left: 140, right: 140 };
const border = { style: BorderStyle.SINGLE, size: 4, color: "C8D2DC" };
const borders = { top: border, bottom: border, left: border, right: border };

function run(text, options = {}) {
  return new TextRun({
    text,
    font: options.font || "Times New Roman",
    size: options.size || 24,
    bold: options.bold,
    italics: options.italics,
    color: options.color || COLORS.black,
  });
}

function body(text, options = {}) {
  return new Paragraph({
    alignment: options.alignment || AlignmentType.JUSTIFIED,
    spacing: { after: 160, line: 360 },
    children: [run(text, options)],
  });
}

function heading(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({
    heading: level,
    keepNext: true,
    children: [run(text, { bold: true, color: COLORS.navy })],
  });
}

function bullet(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { after: 100, line: 360 },
    children: [run(text)],
  });
}

function codeLine(text) {
  return new Paragraph({
    spacing: { after: 40, line: 280 },
    shading: { fill: "F6F8FA", type: ShadingType.CLEAR },
    indent: { left: 240, right: 240 },
    children: [run(text, { font: "Consolas", size: 19, color: "24292F" })],
  });
}

function caption(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 80, after: 180 },
    children: [run(text, { size: 20, italics: true, color: COLORS.gray })],
  });
}

function image(filename, width = 620, height = 349) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 80, after: 40 },
    children: [
      new ImageRun({
        data: fs.readFileSync(path.join(imagesDir, filename)),
        transformation: { width, height },
        type: "png",
        altText: {
          title: filename,
          description: `Evidencia real ${filename}`,
          name: filename,
        },
      }),
    ],
  });
}

function cell(text, width, options = {}) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    borders,
    margins: cellMargins,
    verticalAlign: VerticalAlign.CENTER,
    shading: options.fill
      ? { fill: options.fill, type: ShadingType.CLEAR }
      : undefined,
    children: [
      new Paragraph({
        alignment: options.center ? AlignmentType.CENTER : AlignmentType.LEFT,
        spacing: { after: 0, line: 300 },
        children: [
          run(text, {
            bold: options.bold,
            size: options.size || 21,
            color: options.color || COLORS.black,
          }),
        ],
      }),
    ],
  });
}

function twoColumnTable(rows, widths = [2700, 6660]) {
  return new Table({
    width: { size: PAGE_WIDTH, type: WidthType.DXA },
    columnWidths: widths,
    rows: rows.map(
      ([left, right], index) =>
        new TableRow({
          children: [
            cell(left, widths[0], {
              bold: true,
              fill: index === 0 ? COLORS.navy : COLORS.lightBlue,
              color: index === 0 ? COLORS.white : COLORS.navy,
            }),
            cell(right, widths[1], {
              fill: index === 0 ? COLORS.navy : undefined,
              color: index === 0 ? COLORS.white : COLORS.black,
            }),
          ],
        }),
    ),
  });
}

function contentsTable(rows) {
  const widths = [8200, 1160];
  return new Table({
    width: { size: PAGE_WIDTH, type: WidthType.DXA },
    columnWidths: widths,
    rows: rows.map(
      ([section, page], index) =>
        new TableRow({
          children: [
            cell(section, widths[0], {
              bold: index === 0,
              fill: index === 0 ? COLORS.navy : undefined,
              color: index === 0 ? COLORS.white : COLORS.black,
            }),
            cell(page, widths[1], {
              bold: index === 0,
              center: true,
              fill: index === 0 ? COLORS.navy : undefined,
              color: index === 0 ? COLORS.white : COLORS.black,
            }),
          ],
        }),
    ),
  });
}

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

function reference(text, url) {
  return new Paragraph({
    indent: { left: 720, hanging: 720 },
    spacing: { after: 140, line: 360 },
    children: [
      run(`${text} `),
      new ExternalHyperlink({
        link: url,
        children: [new TextRun({ text: url, style: "Hyperlink" })],
      }),
    ],
  });
}

const children = [
  new Paragraph({ spacing: { before: 500, after: 100 }, children: [] }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 240 },
    children: [run("UNIVERSIDAD DE LAS AMERICAS", { size: 32, bold: true, color: COLORS.navy })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 140 },
    children: [run("PROCESOS DE SOFTWARE", { size: 28, bold: true, color: COLORS.blue })],
  }),
  new Paragraph({ spacing: { before: 1000, after: 180 }, children: [] }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 260 },
    children: [run("PRIMER SCRIPT EN TERRAFORM", { size: 40, bold: true, color: COLORS.navy })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 900 },
    children: [
      run("Implementacion Azure y demostracion autorizada con Docker y Apache", {
        size: 28,
        italics: true,
        color: COLORS.gray,
      }),
    ],
  }),
  twoColumnTable([
    ["DATOS", "INFORMACION"],
    ["Estudiante", "Steven Carrillo Loor"],
    ["Modalidad", "Trabajo individual"],
    ["Repositorio publico", "github.com/StevenCarrilloLoor/terraform-azure-techustart"],
    ["Fecha", "19 de junio de 2026"],
  ]),
  pageBreak(),

  heading("Tabla de contenido"),
  contentsTable([
    ["SECCION", "PAGINA"],
    ["1. Introduccion", "3"],
    ["2. Objetivos", "3"],
    ["3. Arquitectura propuesta", "3"],
    ["4. Implementacion para Azure", "4"],
    ["5. Demostracion autorizada con Docker", "4"],
    ["6. Validacion tecnica", "5"],
    ["7. Control de versiones y repositorio publico", "8"],
    ["8. Estado del despliegue", "8"],
    ["9. Comandos de ejecucion", "9"],
    ["10. Conclusiones", "9"],
    ["Referencias", "10"],
  ]),
  pageBreak(),

  heading("1. Introduccion"),
  body(
    "La infraestructura como codigo permite describir recursos mediante archivos versionables, repetibles y auditables. Para esta actividad se desarrollo un proyecto Terraform que define una maquina virtual Ubuntu en Microsoft Azure, su red publica, la proteccion de acceso HTTP y la instalacion automatica de Apache. Para la demostracion practica, el docente autorizo ejecutar el ciclo completo de Terraform mediante Docker.",
  ),
  body(
    "El trabajo se construyo con un criterio verificable: no se presentan capturas simuladas ni se identifica el contenedor como una maquina virtual de Azure. Las evidencias muestran la ejecucion real de terraform apply, el contenedor Linux activo en Docker Desktop y el servidor Apache respondiendo HTTP 200.",
  ),

  heading("2. Objetivos"),
  bullet("Definir variables reutilizables para region, tamano o shape, prefijo y clave SSH."),
  bullet("Crear una red publica con direccion IP accesible desde Internet."),
  bullet("Permitir unicamente trafico entrante HTTP por el puerto TCP 80."),
  bullet("Provisionar Ubuntu y automatizar la instalacion de Apache mediante cloud-init."),
  bullet("Ejecutar init, validate, plan y apply en una demostracion Docker autorizada."),
  bullet("Versionar el codigo en un repositorio GitHub publico y conservar evidencias reales."),

  heading("3. Arquitectura propuesta"),
  twoColumnTable([
    ["COMPONENTE", "FUNCION"],
    ["Grupo o compartimento", "Contenedor logico de los recursos del proyecto."],
    ["Red virtual y subred", "Segmento 10.0.0.0/16 con una subred publica para la VM."],
    ["IP publica", "Punto de acceso externo al servidor web."],
    ["Regla de seguridad", "Autoriza exclusivamente trafico TCP entrante por el puerto 80."],
    ["Maquina virtual", "Instancia Ubuntu que ejecuta Apache instalado automaticamente."],
    ["Output", "Publica la direccion IP y la URL HTTP generadas por Terraform."],
  ]),

  heading("4. Implementacion para Azure"),
  body(
    "Los archivos principales se encuentran en la raiz del repositorio. variables.tf define azure_region con valor predeterminado eastus y tamano_vm con Standard_B1s. main.tf configura AzureRM 4.x, el grupo de recursos, la red, la subred, la IP publica, el grupo de seguridad, la interfaz y la maquina virtual Linux.",
  ),
  codeLine('variable "azure_region" { default = "eastus" }'),
  codeLine('variable "tamano_vm" { default = "Standard_B1s" }'),
  codeLine('version = "~> 4.0"'),
  codeLine('destination_port_range = "80"'),
  codeLine("custom_data = base64encode(...)"),
  image("02-github-main-tf.png"),
  caption("Figura 1. Archivo main.tf publicado en GitHub. Captura real del repositorio publico."),

  heading("5. Demostracion autorizada con Docker"),
  body(
    "La carpeta demo-terraform utiliza el proveedor kreuzwerker/docker. Terraform administra dos recursos: la imagen oficial httpd:2.4-alpine y el contenedor techustart-apache. El puerto 80 del contenedor se publica en 127.0.0.1:8080 y el contenido web se monta en modo de solo lectura.",
  ),
  body(
    "Esta modalidad no reemplaza ni modifica los bloques Azure solicitados. Su funcion es demostrar de manera real y autorizada el flujo de infraestructura como codigo: inicializacion del proveedor, validacion, plan de dos recursos, aplicacion, outputs, consulta del estado y destruccion controlada.",
  ),
  codeLine('resource "docker_image" "apache" { name = "httpd:2.4-alpine" }'),
  codeLine('resource "docker_container" "techustart" { ... }'),
  codeLine('external = 8080'),
  codeLine('internal = 80'),

  heading("6. Validacion tecnica"),
  body(
    "La configuracion Azure fue inicializada y supero terraform validate. Adicionalmente, la demostracion Docker ejecuto terraform init, terraform fmt -check, terraform validate, terraform plan y terraform apply. El plan anuncio dos recursos y la aplicacion termino con dos recursos agregados.",
  ),
  image("03-azure-terraform-init.png"),
  caption("Figura 2. Evidencia real de terraform init para la implementacion Azure."),
  image("04-azure-terraform-validate.png", 620, 194),
  caption("Figura 3. Evidencia real de terraform validate para Azure."),
  image("07-docker-terraform-apply.png", 620, 331),
  caption("Figura 4. Ejecucion real: apply completo, outputs, estado y verificacion HTTP 200."),
  image("09-docker-desktop-contenedor.png", 620, 354),
  caption("Figura 5. Docker Desktop muestra el contenedor techustart-apache activo y el puerto 8080:80."),
  image("08-docker-apache-http.png", 330, 597),
  caption("Figura 6. Pagina Apache real servida desde el contenedor creado por Terraform."),

  heading("7. Control de versiones y repositorio publico"),
  body(
    "El proyecto se versiono mediante Git y se publico como repositorio publico. Incluye el codigo Azure, la alternativa Oracle, archivos de bloqueo de proveedores, instrucciones de uso y evidencias tecnicas. Los archivos de estado, planes, variables locales y claves se excluyen mediante .gitignore para evitar la publicacion accidental de informacion sensible.",
  ),
  new Paragraph({
    spacing: { after: 180, line: 360 },
    children: [
      run("Enlace del repositorio: ", { bold: true }),
      new ExternalHyperlink({
        link: "https://github.com/StevenCarrilloLoor/terraform-azure-techustart",
        children: [
          new TextRun({
            text: "https://github.com/StevenCarrilloLoor/terraform-azure-techustart",
            style: "Hyperlink",
          }),
        ],
      }),
    ],
  }),
  image("01-github-repositorio-publico.png"),
  caption("Figura 7. Repositorio GitHub publico con el codigo y la demostracion Docker."),

  heading("8. Estado del despliegue"),
  body(
    "La demostracion autorizada se encuentra desplegada y operativa en el equipo local. Terraform administra la imagen docker_image.apache y el contenedor docker_container.techustart. Docker Desktop confirma que el contenedor esta activo y publica 127.0.0.1:8080 hacia el puerto HTTP 80.",
  ),
  body(
    "La comprobacion mediante Invoke-WebRequest devolvio HTTP 200 y la pagina se visualizo en el navegador. La implementacion Azure permanece lista y validada en main.tf, pero las evidencias de ejecucion se atribuyen correctamente a Docker, conforme a la autorizacion recibida.",
  ),

  heading("9. Comandos de ejecucion"),
  codeLine("powershell -ExecutionPolicy Bypass -File .\\iniciar-demo-completa.ps1 -Recrear"),
  codeLine("terraform output"),
  codeLine("terraform state list"),
  codeLine("docker ps --filter name=techustart-apache"),
  codeLine("Invoke-WebRequest http://127.0.0.1:8080"),
  codeLine("powershell -ExecutionPolicy Bypass -File .\\detener-demo-completa.ps1"),

  heading("10. Conclusiones"),
  body(
    "La actividad demuestra que Terraform permite expresar una arquitectura completa en archivos claros y reutilizables. La separacion de variables reduce cambios manuales, mientras que los archivos de bloqueo hacen reproducible la seleccion de proveedores.",
  ),
  body(
    "El uso de custom_data en Azure evita configurar Apache manualmente despues de crear la maquina. En la demostracion Docker, Terraform tambien conserva una definicion declarativa y reproducible: crea la imagen, inicia el contenedor, publica el puerto y monta el contenido web.",
  ),
  body(
    "Finalmente, la ejecucion real comprobo plan, apply, outputs, estado y respuesta HTTP 200. La documentacion diferencia con claridad la arquitectura Azure solicitada de la demostracion Docker autorizada, y todas las capturas incorporadas corresponden al sistema ejecutado.",
  ),

  pageBreak(),
  heading("Referencias"),
  reference(
    "HashiCorp. (2026). Azure Provider documentation.",
    "https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs",
  ),
  reference(
    "HashiCorp. (2026). Terraform CLI: init.",
    "https://developer.hashicorp.com/terraform/cli/commands/init",
  ),
  reference(
    "Microsoft. (2026). Azure Linux virtual machines documentation.",
    "https://learn.microsoft.com/azure/virtual-machines/linux/",
  ),
  reference(
    "Kreuzwerker. (2026). Docker Provider documentation.",
    "https://registry.terraform.io/providers/kreuzwerker/docker/latest/docs",
  ),
  reference(
    "Docker. (2026). Apache HTTP Server official image.",
    "https://hub.docker.com/_/httpd",
  ),
  reference(
    "Carrillo Loor, S. (2026). terraform-azure-techustart [Repositorio GitHub].",
    "https://github.com/StevenCarrilloLoor/terraform-azure-techustart",
  ),
];

const doc = new Document({
  creator: "Steven Carrillo Loor",
  title: "Primer script en Terraform",
  description: "Informe tecnico de implementacion y validacion Terraform.",
  styles: {
    default: {
      document: {
        run: { font: "Times New Roman", size: 24, color: COLORS.black },
        paragraph: { spacing: { after: 160, line: 360 } },
      },
      heading1: {
        run: { font: "Times New Roman", size: 32, bold: true, color: COLORS.navy },
        paragraph: { spacing: { before: 300, after: 180 }, outlineLevel: 0 },
      },
      heading2: {
        run: { font: "Times New Roman", size: 28, bold: true, color: COLORS.blue },
        paragraph: { spacing: { before: 240, after: 140 }, outlineLevel: 1 },
      },
      heading3: {
        run: { font: "Times New Roman", size: 26, bold: true, color: COLORS.blue },
        paragraph: { spacing: { before: 180, after: 120 }, outlineLevel: 2 },
      },
    },
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
                indent: { left: 720, hanging: 360 },
                spacing: { after: 100, line: 360 },
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
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                run("Steven Carrillo Loor | Terraform | Pagina ", {
                  size: 18,
                  color: COLORS.gray,
                }),
                new TextRun({
                  children: [PageNumber.CURRENT],
                  font: "Times New Roman",
                  size: 18,
                  color: COLORS.gray,
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
