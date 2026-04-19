/* ===== TEMPLO SYSTEM SERVER — API Local de Execução ===== */
/* Execute comandos PowerShell, CMD e Bash via HTTP */
/* Node.js server — roda no computador do usuário */

const http = require('http');
const { exec } = require('child_process');
const os = require('os');

const PORT = process.env.PORT || 8081;
const AUTH_KEY = process.env.AUTH_KEY || 'templo-hermes-2026';

// Whitelist de comandos bloqueados (segurança)
const BLOCKED = [
  'rm -rf /', 'format', 'del /f /s', 'shutdown /s', 'rm -rf /*',
  'deltree', 'mkfs', 'dd if=', ':(){:|:&};:', 'chmod 777 /'
];

// Verificar segurança
function isSafeCommand(cmd) {
  const lower = cmd.toLowerCase().trim();
  return !BLOCKED.some(blocked => lower.includes(blocked));
}

// Executar comando no shell apropriado
function runCommand(command, shell, mode) {
  return new Promise((resolve) => {
    let fullCommand;
    const isWindows = os.platform() === 'win32';
    
    switch (shell) {
      case 'powershell':
        if (isWindows) {
          fullCommand = mode === 'root' 
            ? `powershell.exe -Command "Start-Process powershell -Verb RunAs -ArgumentList '-Command ${command.replace(/"/g, '\\"')}' -Wait -PassThru | Select-Object -ExpandProperty StandardOutput"`
            : `powershell.exe -Command "${command.replace(/"/g, '\\"')}"`;
        } else {
          fullCommand = `pwsh -Command "${command.replace(/"/g, '\\"')}"`;
        }
        break;
        
      case 'cmd':
        if (isWindows) {
          fullCommand = mode === 'root'
            ? `powershell.exe -Command "Start-Process cmd -Verb RunAs -ArgumentList '/c ${command.replace(/"/g, '\\"')}' -Wait -PassThru | Select-Object -ExpandProperty StandardOutput"`
            : `cmd.exe /c "${command}"`;
        } else {
          fullCommand = command;
        }
        break;
        
      case 'bash':
      default:
        fullCommand = mode === 'root'
          ? `sudo bash -c "${command.replace(/"/g, '\\"')}"`
          : command;
        break;
    }
    
    const startTime = Date.now();
    
    exec(fullCommand, { 
      timeout: 30000, 
      maxBuffer: 1024 * 1024,
      encoding: 'utf8',
      env: { ...process.env, TEMPLO_MODE: mode }
    }, (error, stdout, stderr) => {
      const elapsed = Date.now() - startTime;
      resolve({
        success: !error,
        output: (stdout || stderr || '').trim(),
        exitCode: error ? error.code : 0,
        shell,
        mode,
        elapsed: `${elapsed}ms`
      });
    });
  });
}

// HTTP Server
const server = http.createServer(async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Auth-Key');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }
  
  // Health check
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      server: 'Templo System Server',
      version: '1.0.0',
      platform: os.platform(),
      shells: ['powershell', 'cmd', 'bash'],
      uptime: process.uptime()
    }));
    return;
  }
  
  // Status
  if (req.url === '/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      hostname: os.hostname(),
      platform: os.platform(),
      arch: os.arch(),
      user: os.userInfo().username,
      homedir: os.homedir(),
      cpus: os.cpus().length,
      memory: {
        total: Math.round(os.totalmem() / 1024 / 1024) + 'MB',
        free: Math.round(os.freemem() / 1024 / 1024) + 'MB'
      },
      uptime: Math.round(os.uptime()) + 's'
    }));
    return;
  }
  
  // Executar comando
  if (req.url === '/execute' && req.method === 'POST') {
    // Verificar auth
    const authHeader = req.headers['x-auth-key'];
    if (authHeader && authHeader !== AUTH_KEY) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, output: 'Auth inválida' }));
      return;
    }
    
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const { command, shell = 'powershell', mode = 'user' } = JSON.parse(body);
        
        if (!command) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, output: 'Comando vazio' }));
          return;
        }
        
        // Verificar segurança
        if (!isSafeCommand(command)) {
          res.writeHead(403, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            success: false, 
            output: '🚫 Comando bloqueado por segurança. Este comando pode danificar o sistema.' 
          }));
          return;
        }
        
        const result = await runCommand(command, shell, mode);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch(e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, output: e.message }));
      }
    });
    return;
  }
  
  // 404
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`
╔═══════════════════════════════════════════════╗
║  🏛️  TEMPLO SYSTEM SERVER                     ║
╠═══════════════════════════════════════════════╣
║  Porta: ${String(PORT).padEnd(39)}║
║  Plataforma: ${os.platform().padEnd(32)}║
║  Shells: PowerShell, CMD, Bash               ║
║  Auth Key: ${AUTH_KEY.padEnd(34)}║
╠═══════════════════════════════════════════════╣
║  Endpoints:                                   ║
║  GET  /health  — Status do servidor           ║
║  GET  /status  — Info do sistema              ║
║  POST /execute — Executar comando             ║
╠═══════════════════════════════════════════════╣
║  ⚠️  Use com cuidado!                         ║
╚═══════════════════════════════════════════════╝
  `);
});
