[CmdletBinding()]
param(
  [switch]$Recrear
)

$ErrorActionPreference = "Stop"
$projectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$demoDir = Join-Path $projectDir "demo-terraform"
$terraform = Get-ChildItem `
  -Path "$env:LOCALAPPDATA\Microsoft\WinGet\Packages" `
  -Recurse `
  -Filter "terraform.exe" `
  -ErrorAction Stop |
  Select-Object -First 1 -ExpandProperty FullName

Write-Host ""
Write-Host "=== DEMOSTRACION COMPLETA TECHUSTART ===" -ForegroundColor Cyan
Write-Host "Terraform creara un servidor Apache Linux real." -ForegroundColor Cyan
Write-Host ""

Push-Location $demoDir
try {
  if ($Recrear -and (Test-Path "terraform.tfstate")) {
    Write-Host "[0/5] terraform destroy (limpieza para una demostracion desde cero)" -ForegroundColor Yellow
    & $terraform destroy -no-color -auto-approve
    if ($LASTEXITCODE -ne 0) { throw "terraform destroy fallo." }
  }

  Write-Host "[1/5] terraform init" -ForegroundColor Yellow
  & $terraform init -no-color
  if ($LASTEXITCODE -ne 0) { throw "terraform init fallo." }

  Write-Host "[2/5] terraform fmt -check" -ForegroundColor Yellow
  & $terraform fmt -check
  if ($LASTEXITCODE -ne 0) { throw "terraform fmt -check fallo." }

  Write-Host "[3/5] terraform validate" -ForegroundColor Yellow
  & $terraform validate -no-color
  if ($LASTEXITCODE -ne 0) { throw "terraform validate fallo." }

  Write-Host "[4/5] terraform plan" -ForegroundColor Yellow
  & $terraform plan -no-color -out techustart-demo.tfplan
  if ($LASTEXITCODE -ne 0) { throw "terraform plan fallo." }

  Write-Host "[5/5] terraform apply" -ForegroundColor Yellow
  & $terraform apply -no-color -auto-approve techustart-demo.tfplan
  if ($LASTEXITCODE -ne 0) { throw "terraform apply fallo." }

  Write-Host ""
  Write-Host "=== OUTPUTS DE TERRAFORM ===" -ForegroundColor Cyan
  & $terraform output
  Write-Host ""
  Write-Host "=== RECURSOS EN EL ESTADO ===" -ForegroundColor Cyan
  & $terraform state list
}
finally {
  Pop-Location
}

$response = Invoke-WebRequest -Uri "http://127.0.0.1:8080" -UseBasicParsing
if ($response.StatusCode -ne 200) {
  throw "Apache no respondio correctamente."
}

Write-Host ""
Write-Host "RESULTADO: Apache responde HTTP 200." -ForegroundColor Green
Write-Host "CONTENEDOR: techustart-apache" -ForegroundColor Green
Write-Host "ABRIR: http://127.0.0.1:8080" -ForegroundColor Green
Write-Host ""
