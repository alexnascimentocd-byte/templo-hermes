# ===== INICIAR TEMPLO SYSTEM SERVER (PowerShell) =====
# Execute como Administrador para modo root

Write-Host ""
Write-Host "╔═══════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  🏛️  TEMPLO SYSTEM SERVER                     ║" -ForegroundColor Cyan  
Write-Host "╚═══════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Verificar Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "[ERRO] Node.js não encontrado!" -ForegroundColor Red
    Write-Host "Instale em: https://nodejs.org" -ForegroundColor Yellow
    Read-Host "Pressione Enter para sair"
    exit 1
}

# Verificar se já está rodando
$portInUse = Get-NetTCPConnection -LocalPort 8888 -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "[INFO] Servidor já está rodando na porta 8888" -ForegroundColor Yellow
    Read-Host "Pressione Enter para sair"
    exit 0
}

# Verificar se é admin
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if ($isAdmin) {
    Write-Host "[OK] Executando como ADMINISTRADOR (modo root ativado)" -ForegroundColor Green
} else {
    Write-Host "[INFO] Executando como USUÁRIO normal" -ForegroundColor Yellow
}

# Iniciar servidor
Write-Host "[OK] Iniciando servidor na porta 8888..." -ForegroundColor Green
Write-Host ""

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir
node system-server.js
