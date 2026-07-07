# Daily deposit.now monitor — double-click shortcut or Task Scheduler target.
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot\..

Write-Host ''
Write-Host 'deposit.now daily watch' -ForegroundColor Cyan
Write-Host "project: $(Get-Location)" -ForegroundColor DarkGray
Write-Host ''

npm run watch:deposits
$exitCode = $LASTEXITCODE

Write-Host ''
if ($exitCode -eq 0) {
  Write-Host 'Done.' -ForegroundColor Green
} else {
  Write-Host "Watch exited with code $exitCode" -ForegroundColor Yellow
}

Read-Host 'Press Enter to close'
exit $exitCode