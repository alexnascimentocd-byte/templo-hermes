/* ===== TEMPLO GITHUB AGENT ===== */
/* Agente local que polla GitHub Issues e executa comandos no PC */
/* Rode como: node github-agent.js */

const https = require('https');
const http = require('http');
const { exec } = require('child_process');
const os = require('os');
const fs = require('fs');
const path = require('path');

// ===== CONFIGURAÇÃO =====
const CONFIG_FILE = path.join(__dirname, 'agent-config.json');

function loadConfig() {
  if (fs.existsSync(CONFIG_FILE)) {
    return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
  }
  return {
    token: process.env.GITHUB_TOKEN || '',
    owner: process.env.GITHUB_OWNER || '',
    repo: process.env.GITHUB_REPO || '',
    pollInterval: parseInt(process.env.POLL_INTERVAL) || 15000,
    authKey: process.env.AUTH_KEY || 'templo-hermes-2026'
  };
}

function saveConfig(config) {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

let config = loadConfig();

// ===== GITHUB API =====
function githubAPI(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path,
      method,
      headers: {
        'Authorization': `Bearer ${config.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'Templo-Agent/1.0'
      }
    };
    
    if (body) {
      options.headers['Content-Type'] = 'application/json';
    }
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch(e) {
          resolve(data);
        }
      });
    });
    
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// ===== EXECUTAR COMANDO =====
function runCommand(command, shell, mode) {
  return new Promise((resolve) => {
    let fullCommand;
    const isWindows = os.platform() === 'win32';
    
    switch (shell) {
      case 'powershell':
        fullCommand = isWindows
          ? `powershell.exe -Command "${command.replace(/"/g, '\\"')}"`
          : `pwsh -Command "${command.replace(/"/g, '\\"')}"`;
        break;
      case 'cmd':
        fullCommand = isWindows ? `cmd.exe /c "${command}"` : command;
        break;
      case 'bash':
      default:
        fullCommand = mode === 'root' 
          ? `sudo bash -c "${command.replace(/"/g, '\\"')}"` 
          : command;
        break;
    }
    
    // Bloquear comandos perigosos
    const BLOCKED = ['rm -rf /', 'format', 'del /f /s', 'shutdown /s', 'rm -rf /*'];
    const lower = command.toLowerCase();
    if (BLOCKED.some(b => lower.includes(b))) {
      resolve({ success: false, output: '🚫 Comando bloqueado por segurança', exitCode: 1 });
      return;
    }
    
    const start = Date.now();
    exec(fullCommand, { 
      timeout: 30000, 
      maxBuffer: 1024 * 1024,
      encoding: 'utf8'
    }, (error, stdout, stderr) => {
      resolve({
        success: !error,
        output: (stdout || stderr || '').substring(0, 60000),
        exitCode: error ? error.code : 0,
        elapsed: `${Date.now() - start}ms`
      });
    });
  });
}

// ===== POSTAR RESULTADO =====
async function postResult(issueNumber, result) {
  const body = [
    '## 🏛️ Resultado da Execução (Agente Local)',
    '',
    `**Exit Code:** \`${result.exitCode}\``,
    `**Tempo:** \`${result.elapsed}\``,
    `**Host:** \`${os.hostname()} (${os.platform()})\``,
    '',
    '### 📤 Output:',
    '```',
    result.output,
    '```',
    '',
    '---',
    '🤖 *Executado pelo Templo GitHub Agent no seu PC*'
  ].join('\n');
  
  await githubAPI('POST',
    `/repos/${config.owner}/${config.repo}/issues/${issueNumber}/comments`,
    { body });
  
  // Fechar issue e marcar como done
  await githubAPI('PATCH',
    `/repos/${config.owner}/${config.repo}/issues/${issueNumber}`,
    { state: 'closed' });
  
  await githubAPI('POST',
    `/repos/${config.owner}/${config.repo}/issues/${issueNumber}/labels`,
    { labels: ['done', 'local-agent'] });
}

// ===== POLL PRINCIPAL =====
async function checkForCommands() {
  try {
    // Buscar issues abertas com label "execute"
    const issues = await githubAPI('GET',
      `/repos/${config.owner}/${config.repo}/issues?labels=execute&state=open&sort=created&direction=asc`);
    
    if (!Array.isArray(issues)) return;
    
    for (const issue of issues) {
      // Verificar se é pra agente local
      const body = issue.body || '';
      if (!body.includes('```exec')) continue;
      if (body.includes('requester: templo-hermes-cloud')) continue; // Pular cloud
        
      // Extrair comando
      const commandMatch = body.match(/```exec\n([\s\S]*?)\n```/);
      if (!commandMatch) continue;
      
      const command = commandMatch[1].trim();
      const shellMatch = body.match(/shell: (\w+)/);
      const modeMatch = body.match(/mode: (\w+)/);
      const shell = shellMatch ? shellMatch[1] : 'bash';
      const mode = modeMatch ? modeMatch[1] : 'user';
      
      console.log(`\n⚡ Executando: ${command}`);
      console.log(`   Shell: ${shell} | Modo: ${mode} | Issue: #${issue.number}`);
      
      // Executar
      const result = await runCommand(command, shell, mode);
      console.log(`   ✅ Exit: ${result.exitCode} | Tempo: ${result.elapsed}`);
      
      // Postar resultado
      await postResult(issue.number, result);
      console.log(`   📤 Resultado postado em #${issue.number}`);
    }
  } catch(e) {
    console.error(`❌ Erro no poll: ${e.message}`);
  }
}

// ===== HEALTH CHECK SERVER =====
function startHealthServer() {
  const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    if (req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'ok',
        agent: 'Templo GitHub Agent',
        version: '1.0.0',
        platform: os.platform(),
        hostname: os.hostname(),
        github: `${config.owner}/${config.repo}`,
        pollInterval: config.pollInterval
      }));
      return;
    }
    
    res.writeHead(404);
    res.end('Not found');
  });
  
  server.listen(8082, '127.0.0.1', () => {
    console.log('   Health check: http://localhost:8082/health');
  });
}

// ===== MAIN =====
console.log(`
╔═══════════════════════════════════════════════╗
║  🏛️  TEMPLO GITHUB AGENT                      ║
╠═══════════════════════════════════════════════╣
║  Executa comandos do Templo remotamente       ║
║  via GitHub Issues                            ║
╚═══════════════════════════════════════════════╝
`);

if (!config.token || !config.owner || !config.repo) {
  console.log('⚠️  Configure o agent primeiro:');
  console.log('   node github-agent.js config <token> <owner> <repo>');
  console.log('');
  console.log('   Exemplo:');
  console.log('   node github-agent.js config ghp_xxxxx alexnascimentocd-byte templo-hermes');
  console.log('');
  
  // Verificar se tem argumento de config
  if (process.argv[2] === 'config') {
    config.token = process.argv[3];
    config.owner = process.argv[4];
    config.repo = process.argv[5];
    if (config.token && config.owner && config.repo) {
      saveConfig(config);
      console.log('✅ Configuração salva!');
      console.log(`   Token: ${config.token.substring(0, 8)}...`);
      console.log(`   Repo: ${config.owner}/${config.repo}`);
    }
  }
  process.exit(0);
}

console.log(`📡 GitHub: ${config.owner}/${config.repo}`);
console.log(`⏱️  Poll: ${config.pollInterval / 1000}s`);
console.log(`🖥️  Host: ${os.hostname()} (${os.platform()})`);
console.log('');

startHealthServer();

// Poll inicial + intervalo
checkForCommands();
setInterval(checkForCommands, config.pollInterval);

console.log('🟢 Agente rodando! Aguardando comandos...\n');
