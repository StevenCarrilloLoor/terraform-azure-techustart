Set-StrictMode -Version Latest

function Get-TerraformExecutable {
  $terraformCommand = Get-Command terraform -ErrorAction SilentlyContinue
  if ($terraformCommand) {
    return $terraformCommand.Source
  }

  $wingetTerraform = Get-ChildItem `
    -Path "$env:LOCALAPPDATA\Microsoft\WinGet\Packages" `
    -Recurse `
    -Filter "terraform.exe" `
    -ErrorAction SilentlyContinue |
    Select-Object -First 1 -ExpandProperty FullName

  if ($wingetTerraform) {
    return $wingetTerraform
  }

  throw "Terraform no esta instalado o no se encuentra en PATH."
}

function Invoke-CheckedCommand {
  param(
    [Parameter(Mandatory)]
    [string]$Executable,

    [Parameter(Mandatory)]
    [string[]]$Arguments,

    [Parameter(Mandatory)]
    [string]$FailureMessage
  )

  & $Executable @Arguments
  if ($LASTEXITCODE -ne 0) {
    throw $FailureMessage
  }
}
