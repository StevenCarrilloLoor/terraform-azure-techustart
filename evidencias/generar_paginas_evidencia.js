const fs = require("fs");
const path = require("path");

const evidenceDir = __dirname;
const outputDir = path.join(evidenceDir, "paginas");

fs.mkdirSync(outputDir, { recursive: true });

const entries = [
  {
    source: "01-terraform-init.txt",
    output: "03-azure-terraform-init.html",
    title: "Terraform Init - Implementacion Azure",
  },
  {
    source: "04-terraform-validate.txt",
    output: "04-azure-terraform-validate.html",
    title: "Terraform Validate - Implementacion Azure",
  },
  {
    source: "06-oracle-terraform-init.txt",
    output: "05-oracle-terraform-init.html",
    title: "Terraform Init - Alternativa Oracle Cloud",
  },
  {
    source: "07-oracle-terraform-validate.txt",
    output: "06-oracle-terraform-validate.html",
    title: "Terraform Validate - Alternativa Oracle Cloud",
  },
];

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function stripAnsi(value) {
  return value.replace(/\u001b\[[0-9;]*m/g, "");
}

for (const entry of entries) {
  const sourcePath = path.join(evidenceDir, entry.source);
  const sourceBytes = fs.readFileSync(sourcePath);
  const encoding =
    sourceBytes[0] === 0xff && sourceBytes[1] === 0xfe ? "utf16le" : "utf8";
  const contents = stripAnsi(sourceBytes.toString(encoding).replace(/^\uFEFF/, ""));
  const html = `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <title>${escapeHtml(entry.title)}</title>
    <style>
      body {
        margin: 0;
        padding: 42px;
        background: #0d1117;
        color: #e6edf3;
        font-family: Consolas, "Courier New", monospace;
      }
      h1 {
        margin: 0 0 8px;
        color: #58a6ff;
        font: 700 28px Arial, sans-serif;
      }
      p {
        margin: 0 0 26px;
        color: #8b949e;
        font: 15px Arial, sans-serif;
      }
      pre {
        margin: 0;
        padding: 24px;
        border: 1px solid #30363d;
        border-radius: 8px;
        background: #161b22;
        white-space: pre-wrap;
        font-size: 16px;
        line-height: 1.45;
      }
    </style>
  </head>
  <body>
    <h1>${escapeHtml(entry.title)}</h1>
    <p>Fuente real: evidencias/${escapeHtml(entry.source)}</p>
    <pre>${escapeHtml(contents)}</pre>
  </body>
</html>`;

  fs.writeFileSync(path.join(outputDir, entry.output), html);
}
