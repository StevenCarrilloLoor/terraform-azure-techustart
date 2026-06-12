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

function image(filename, width = 620, height = 431) {
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
      run("Automatizacion de una maquina virtual Linux con servidor Apache", {
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
    ["Fecha", "12 de junio de 2026"],
  ]),
  pageBreak(),

  heading("Tabla de contenido"),
  contentsTable([
    ["SECCION", "PAGINA"],
    ["1. Introduccion", "3"],
    ["2. Objetivos", "3"],
    ["3. Arquitectura propuesta", "3"],
    ["4. Implementacion para Azure", "4"],
    ["5. Alternativa para Oracle Cloud Infrastructure", "4"],
    ["6. Validacion tecnica", "5"],
    ["7. Control de versiones y repositorio publico", "7"],
  ["8. Estado del despliegue", "7"],
    ["9. Comandos de ejecucion", "8"],
  ["10. Conclusiones", "8"],
  ["Referencias", "9"],
  ]),
  pageBreak(),

  heading("1. Introduccion"),
  body(
    "La infraestructura como codigo permite describir recursos de nube mediante archivos versionables, repetibles y auditables. Para esta actividad se desarrollo un proyecto Terraform que automatiza una maquina virtual Ubuntu, su red publica, la proteccion de acceso HTTP y la instalacion de Apache. La implementacion principal sigue los requisitos de Microsoft Azure y se acompana de una alternativa equivalente para Oracle Cloud Infrastructure, tal como autoriza la consigna cuando Azure no dispone de creditos o suscripcion.",
  ),
  body(
    "El trabajo se construyo con un criterio verificable: no se presentan capturas simuladas ni resultados atribuidos a un despliegue inexistente. Cada figura procede del repositorio publico o de archivos reales generados por Terraform durante la inicializacion y validacion.",
  ),

  heading("2. Objetivos"),
  bullet("Definir variables reutilizables para region, tamano o shape, prefijo y clave SSH."),
  bullet("Crear una red publica con direccion IP accesible desde Internet."),
  bullet("Permitir unicamente trafico entrante HTTP por el puerto TCP 80."),
  bullet("Provisionar Ubuntu y automatizar la instalacion de Apache mediante cloud-init."),
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

  heading("5. Alternativa para Oracle Cloud Infrastructure"),
  body(
    "La autenticacion de Azure devolvio que la cuenta no posee suscripciones. En respuesta, se implemento la alternativa permitida por la tarea dentro de la carpeta oracle. Esta version usa el proveedor oficial oracle/oci y crea una VCN, Internet Gateway, tabla de rutas, lista de seguridad, subred publica e instancia Ubuntu con Apache.",
  ),
  body(
    "La alternativa mantiene el mismo comportamiento funcional: entrada TCP/80, instalacion automatica con user_data, IP publica y output de URL. El shape predeterminado VM.Standard.E2.1.Micro puede modificarse segun la disponibilidad y los limites de la cuenta.",
  ),

  heading("6. Validacion tecnica"),
  body(
    "La inicializacion y validacion se ejecutaron localmente con Terraform 1.15.6. AzureRM se resolvio en la version 4.77.0 y el proveedor OCI en la version 8.18.0. Ambas configuraciones superaron terraform validate.",
  ),
  image("03-azure-terraform-init.png"),
  caption("Figura 2. Salida real de terraform init para Azure."),
  image("04-azure-terraform-validate.png", 620, 150),
  caption("Figura 3. Salida real de terraform validate para Azure."),
  image("05-oracle-terraform-init.png"),
  caption("Figura 4. Salida real de terraform init para Oracle Cloud."),
  image("06-oracle-terraform-validate.png", 620, 150),
  caption("Figura 5. Salida real de terraform validate para Oracle Cloud."),

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
  caption("Figura 6. Repositorio GitHub publico con las implementaciones Azure y Oracle."),

  heading("8. Estado del despliegue"),
  body(
    "El codigo y sus proveedores fueron inicializados y validados correctamente. Sin embargo, no se ejecuto terraform apply en Azure porque la autenticacion real devolvio el mensaje No subscriptions found. Tambien se inicio el flujo de autenticacion de Oracle Cloud, pero la cuenta OCI no termino de configurarse durante la preparacion de este informe.",
  ),
  body(
    "Por rigor tecnico, no se afirma que exista una IP publica ni una pagina Apache desplegada, y no se incorpora ninguna captura inventada. Una vez que exista una suscripcion Azure activa o una sesion OCI configurada, el proyecto queda listo para ejecutar plan, apply, comprobar la URL HTTP y, finalmente, destruir los recursos para evitar costos.",
  ),

  heading("9. Comandos de ejecucion"),
  codeLine("terraform init"),
  codeLine("terraform fmt -check -recursive"),
  codeLine("terraform validate"),
  codeLine('terraform plan -var "ssh_public_key=<CLAVE_PUBLICA>"'),
  codeLine('terraform apply -var "ssh_public_key=<CLAVE_PUBLICA>"'),
  codeLine("terraform output website_url"),
  codeLine('terraform destroy -var "ssh_public_key=<CLAVE_PUBLICA>"'),

  heading("10. Conclusiones"),
  body(
    "La actividad demuestra que Terraform permite expresar una arquitectura completa en archivos claros y reutilizables. La separacion de variables reduce cambios manuales, mientras que los archivos de bloqueo hacen reproducible la seleccion de proveedores.",
  ),
  body(
    "El uso de cloud-init evita configurar Apache manualmente despues de crear la maquina. Ademas, limitar el acceso entrante al puerto 80 cumple el requisito de seguridad indicado. El principal limite encontrado no fue tecnico: la cuenta Azure autenticada carece de suscripcion y Oracle Cloud aun requiere completar su autenticacion.",
  ),
  body(
    "Finalmente, publicar el codigo y las evidencias en GitHub facilita la revision del trabajo. La documentacion distingue con claridad entre lo implementado, lo validado y lo que todavia depende de una cuenta de nube habilitada.",
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
    "Oracle. (2026). Create a Compute Instance with Terraform.",
    "https://docs.oracle.com/en-us/iaas/Content/dev/terraform/tutorials/tf-compute.htm",
  ),
  reference(
    "Oracle. (2026). Create a Virtual Cloud Network with Terraform.",
    "https://docs.oracle.com/en-us/iaas/Content/dev/terraform/tutorials/tf-vcn.htm",
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
