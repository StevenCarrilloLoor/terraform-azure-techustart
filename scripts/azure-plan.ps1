[CmdletBinding()]
param(
  [string]$SubscriptionId,
  [string]$PublicKeyPath = "$HOME\.ssh\techustart_terraform.pub",
  [switch]$Login
)

$ErrorActionPreference = "Stop"
. (Join-Path $PSScriptRoot "common.ps1")

$projectDir = Split-Path -Parent $PSScriptRoot
$terraform = Get-TerraformExecutable
$azureCli = Get-Command az -ErrorAction SilentlyContinue

if (-not $azureCli) {
  throw "Azure CLI no esta instalado o no se encuentra en PATH."
}

$previousErrorActionPreference = $ErrorActionPreference
$ErrorActionPreference = "Continue"
$accountJson = & $azureCli.Source account show --output json 2>$null
$accountShowExitCode = $LASTEXITCODE
$ErrorActionPreference = $previousErrorActionPreference

if ($accountShowExitCode -ne 0) {
  if (-not $Login) {
    throw "No existe una sesion activa de Azure CLI. Ejecuta el script con -Login o ejecuta 'az login'."
  }

  Invoke-CheckedCommand `
    -Executable $azureCli.Source `
    -Arguments @("login", "--output", "none") `
    -FailureMessage "Azure CLI no pudo iniciar sesion."
}

if ($SubscriptionId) {
  Invoke-CheckedCommand `
    -Executable $azureCli.Source `
    -Arguments @("account", "set", "--subscription", $SubscriptionId) `
    -FailureMessage "No fue posible seleccionar la suscripcion indicada."
}

$account = (& $azureCli.Source account show --output json | ConvertFrom-Json)
if ($account.state -ne "Enabled") {
  throw "La suscripcion '$($account.name)' no esta habilitada."
}

$resolvedPublicKeyPath = Resolve-Path -LiteralPath $PublicKeyPath -ErrorAction SilentlyContinue
if (-not $resolvedPublicKeyPath) {
  throw "No se encontro la clave publica SSH en '$PublicKeyPath'. Generala con: ssh-keygen -t ed25519 -f `"$HOME\.ssh\techustart_terraform`""
}

$env:TF_VAR_azure_subscription_id = $account.id
$env:TF_VAR_azure_tenant_id = $account.tenantId
$env:TF_VAR_ssh_public_key = Get-Content -Raw -LiteralPath $resolvedPublicKeyPath

Write-Host ""
Write-Host "=== AZURE: VALIDACION Y PLAN ===" -ForegroundColor Cyan
Write-Host "Suscripcion: $($account.name)" -ForegroundColor Green
Write-Host "Subscription ID: $($account.id)" -ForegroundColor Green
Write-Host "Tenant ID: $($account.tenantId)" -ForegroundColor Green
Write-Host ""

Push-Location $projectDir
try {
  Invoke-CheckedCommand $terraform @("init", "-no-color") "terraform init fallo."
  Invoke-CheckedCommand $terraform @("fmt", "-check", "-recursive") "terraform fmt -check fallo."
  Invoke-CheckedCommand $terraform @("validate", "-no-color") "terraform validate fallo."
  Invoke-CheckedCommand $terraform @("plan", "-no-color", "-out", "azure.tfplan") "terraform plan fallo."
}
finally {
  Pop-Location
  Remove-Item Env:\TF_VAR_azure_subscription_id -ErrorAction SilentlyContinue
  Remove-Item Env:\TF_VAR_azure_tenant_id -ErrorAction SilentlyContinue
  Remove-Item Env:\TF_VAR_ssh_public_key -ErrorAction SilentlyContinue
}

Write-Host ""
Write-Host "Plan guardado localmente en azure.tfplan." -ForegroundColor Green
Write-Host "Para desplegar cuando exista credito: terraform apply azure.tfplan" -ForegroundColor Yellow
