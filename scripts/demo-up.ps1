[CmdletBinding()]
param(
  [switch]$Recreate
)

$ErrorActionPreference = "Stop"
. (Join-Path $PSScriptRoot "common.ps1")

$projectDir = Split-Path -Parent $PSScriptRoot
$demoDir = Join-Path $projectDir "demo-terraform"
$terraform = Get-TerraformExecutable

docker info --format "{{.ServerVersion}}" | Out-Null
if ($LASTEXITCODE -ne 0) {
  throw "Docker Desktop no esta disponible."
}

Write-Host ""
Write-Host "=== DEMOSTRACION DOCKER CON TERRAFORM ===" -ForegroundColor Cyan

Push-Location $demoDir
try {
  if ($Recreate -and (Test-Path "terraform.tfstate")) {
    Invoke-CheckedCommand $terraform @("destroy", "-no-color", "-auto-approve") "terraform destroy fallo."
  }

  Invoke-CheckedCommand $terraform @("init", "-no-color") "terraform init fallo."
  Invoke-CheckedCommand $terraform @("fmt", "-check", "-recursive") "terraform fmt -check fallo."
  Invoke-CheckedCommand $terraform @("validate", "-no-color") "terraform validate fallo."
  Invoke-CheckedCommand $terraform @("plan", "-no-color", "-out", "demo.tfplan") "terraform plan fallo."
  Invoke-CheckedCommand $terraform @("apply", "-no-color", "-auto-approve", "demo.tfplan") "terraform apply fallo."
  Remove-Item -LiteralPath "demo.tfplan" -Force -ErrorAction SilentlyContinue

  & $terraform output
  & $terraform state list
}
finally {
  Pop-Location
}

$response = $null
for ($attempt = 1; $attempt -le 15; $attempt++) {
  try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:8080" -UseBasicParsing -TimeoutSec 2
    break
  }
  catch {
    Start-Sleep -Seconds 1
  }
}

if (-not $response -or $response.StatusCode -ne 200) {
  throw "Apache no respondio HTTP 200."
}

Write-Host ""
Write-Host "Apache responde HTTP 200 en http://127.0.0.1:8080" -ForegroundColor Green
