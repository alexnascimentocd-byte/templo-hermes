@echo off
:: ===== INICIAR TEMPLO SYSTEM SERVER =====
:: Execute como Administrador para modo root

echo.
echo ╔═══════════════════════════════════════════════╗
echo ║  🏛️  TEMPLO SYSTEM SERVER                     ║
echo ╚═══════════════════════════════════════════════╝
echo.

:: Verificar Node.js
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Node.js nao encontrado!
    echo Instale em: https://nodejs.org
    pause
    exit /b 1
}

:: Verificar se já está rodando
netstat -ano | findstr :8081 >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [INFO] Servidor ja esta rodando na porta 8081
    pause
    exit /b 0
)

:: Iniciar servidor
echo [OK] Iniciando servidor na porta 8081...
echo.
cd /d "%~dp0"
node system-server.js
