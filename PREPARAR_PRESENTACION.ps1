[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"
$projectDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host ""
Write-Host "=== PREPARANDO PRESENTACION TECHUSTART ===" -ForegroundColor Cyan

$dockerInfo = docker info --format "{{.ServerVersion}}" 2>$null
if ($LASTEXITCODE -ne 0) {
  throw "Docker Desktop no esta disponible. Inicialo y vuelve a ejecutar este archivo."
}
Write-Host "Docker Desktop: disponible (version $dockerInfo)" -ForegroundColor Green

$container = docker ps --filter "name=techustart-apache" --format "{{.Names}}"
if ($container -ne "techustart-apache") {
  Write-Host "El contenedor no esta activo. Ejecutando Terraform..." -ForegroundColor Yellow
  & (Join-Path $projectDir "iniciar-demo-completa.ps1")
}

$response = Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:8080"
if ($response.StatusCode -ne 200) {
  throw "Apache no respondio HTTP 200."
}

Write-Host "Terraform y Docker: recursos activos" -ForegroundColor Green
Write-Host "Apache: HTTP 200" -ForegroundColor Green
Write-Host "URL: http://127.0.0.1:8080" -ForegroundColor Green
Write-Host ""
Write-Host "ORDEN PARA PRESENTAR:" -ForegroundColor Yellow
Write-Host "1. variables.tf"
Write-Host "2. main.tf"
Write-Host "3. demo-terraform\variables.tf"
Write-Host "4. demo-terraform\main.tf"
Write-Host "5. Ejecutar iniciar-demo-completa.ps1 -Recrear"
Write-Host "6. Docker Desktop"
Write-Host "7. http://127.0.0.1:8080"
Write-Host ""
Write-Host "Guion: GUION_PRESENTACION_COMPLETO.md" -ForegroundColor Cyan

$codeCommand = Get-Command code -ErrorAction SilentlyContinue
if ($codeCommand) {
  & $codeCommand.Source `
    "$projectDir\variables.tf" `
    "$projectDir\main.tf" `
    "$projectDir\demo-terraform\variables.tf" `
    "$projectDir\demo-terraform\main.tf" `
    "$projectDir\GUION_PRESENTACION_COMPLETO.md"
}

Start-Process "http://127.0.0.1:8080"
