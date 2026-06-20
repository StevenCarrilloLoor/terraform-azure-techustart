[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"
. (Join-Path $PSScriptRoot "common.ps1")

$projectDir = Split-Path -Parent $PSScriptRoot
$terraform = Get-TerraformExecutable
$configurations = @(
  $projectDir,
  (Join-Path $projectDir "demo-terraform")
)

Write-Host ""
Write-Host "=== VALIDACION TERRAFORM ===" -ForegroundColor Cyan

Invoke-CheckedCommand `
  -Executable $terraform `
  -Arguments @("fmt", "-check", "-recursive", $projectDir) `
  -FailureMessage "terraform fmt -check fallo."

foreach ($configuration in $configurations) {
  Write-Host ""
  Write-Host "Validando: $configuration" -ForegroundColor Yellow

  Push-Location $configuration
  try {
    Invoke-CheckedCommand $terraform @("init", "-backend=false", "-no-color") "terraform init fallo."
    Invoke-CheckedCommand $terraform @("validate", "-no-color") "terraform validate fallo."
  }
  finally {
    Pop-Location
  }
}

Push-Location $projectDir
try {
  Write-Host ""
  Write-Host "Ejecutando pruebas de la arquitectura Azure..." -ForegroundColor Yellow
  Invoke-CheckedCommand $terraform @("test", "-no-color") "terraform test fallo."
}
finally {
  Pop-Location
}

Write-Host ""
Write-Host "Todas las configuraciones son validas." -ForegroundColor Green
