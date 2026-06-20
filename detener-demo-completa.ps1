$ErrorActionPreference = "Stop"
$projectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$demoDir = Join-Path $projectDir "demo-terraform"
$terraform = Get-ChildItem `
  -Path "$env:LOCALAPPDATA\Microsoft\WinGet\Packages" `
  -Recurse `
  -Filter "terraform.exe" `
  -ErrorAction Stop |
  Select-Object -First 1 -ExpandProperty FullName

Push-Location $demoDir
try {
  & $terraform destroy -no-color -auto-approve
  if ($LASTEXITCODE -ne 0) {
    throw "terraform destroy fallo."
  }
}
finally {
  Pop-Location
}

Write-Host "Los recursos de la demostracion fueron destruidos." -ForegroundColor Green
