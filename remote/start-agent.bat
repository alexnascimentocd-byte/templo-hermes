@echo off
:: ===== INICIAR TEMPLO GITHUB AGENT =====
:: Mantém seu PC acessível via internet pelo Templo

echo.
echo ╔═══════════════════════════════════════════════╗
echo ║  🏛️  TEMPLO GITHUB AGENT                      ║
echo ╚═══════════════════════════════════════════════╝
echo.

:: Verificar Node.js
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Node.js nao encontrado!
    echo Instale em: https://nodejs.org
    pause
    exit /b 1
)

:: Verificar config
cd /d "%~dp0"
if not exist "agent-config.json" (
    echo [AVISO] Config nao encontrada!
    echo.
    echo Para configurar, execute:
    echo   node github-agent.js config TOKEN OWNER REPO
    echo.
    echo Exemplo:
    echo   node github-agent.js config ghp_xxxxx alexnascimentocd-byte templo-hermes
    echo.
    echo Gerar token em: https://github.com/settings/tokens
    echo Escopo necessario: repo
    echo.
    pause
    exit /b 1
)

:: Iniciar agent
echo [OK] Iniciando GitHub Agent...
echo.
node github-agent.js
pause
