[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"
. (Join-Path $PSScriptRoot "common.ps1")

$projectDir = Split-Path -Parent $PSScriptRoot
$demoDir = Join-Path $projectDir "demo-terraform"
$terraform = Get-TerraformExecutable

Push-Location $demoDir
try {
  Invoke-CheckedCommand $terraform @("destroy", "-no-color", "-auto-approve") "terraform destroy fallo."
}
finally {
  Pop-Location
}

Write-Host "Los recursos de la demostracion fueron eliminados." -ForegroundColor Green
