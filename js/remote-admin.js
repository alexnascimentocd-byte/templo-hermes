/* ===== REMOTE ADMIN — Execução remota via GitHub ===== */
/* Modo Local (localhost) + Modo Remoto (GitHub Issues API) */
/* 100% Gratuito — sem servidor, sem tunneling */

const RemoteAdmin = {
  connected: false,
  mode: 'local', // 'local' | 'remote' | 'github-cloud'
  localUrl: null,
  
  // Config GitHub (usuário preenche no painel)
  config: {
    token: '',        // GitHub Personal Access Token (repo scope)
    owner: '',        // alexnascimentocd-byte
    repo: '',         // templo-hermes ou repo dedicado
  },
  
  // Polling
  pollInterval: null,
  lastCheck: 0,
  
  // Histórico
  history: [],
  
  // Inicializar
  async init() {
    // Carregar config salva
    const saved = localStorage.getItem('remote_admin_config');
    if (saved) {
      try {
        this.config = JSON.parse(saved);
        if (this.config.token) {
          this.mode = 'remote';
          this.connected = true;
          this.startPolling(15000);
          console.log('🌍 RemoteAdmin restaurado do localStorage');
        }
      } catch(e) {}
    }
    
    // Tentar auto-conectar local primeiro
    await this.autoConnectLocal();
  },
  
  // ===== MODO LOCAL =====
  async autoConnectLocal() {
    const ports = [8081, 8888, 9999, 3000, 5000];
    for (const port of ports) {
      try {
        const resp = await fetch(`http://localhost:${port}/health`, {
          signal: AbortSignal.timeout(2000)
        });
        if (resp.ok) {
          this.localUrl = `http://localhost:${port}`;
          this.mode = 'local';
          this.connected = true;
          console.log(`🔌 RemoteAdmin LOCAL: ${this.localUrl}`);
          return true;
        }
      } catch(e) {}
    }
    return false;
  },
  
  // ===== MODO REMOTO (GitHub Issues) =====
  async connectRemote(token, owner, repo) {
    this.config = { token, owner, repo };
    localStorage.setItem('remote_admin_config', JSON.stringify(this.config));
    
    try {
      // Testar conexão
      const resp = await this.githubAPI('GET', `/repos/${owner}/${repo}`);
      if (resp.id) {
        this.mode = 'remote';
        this.connected = true;
        return { 
          success: true, 
          message: `✅ Conectado ao GitHub: ${owner}/${repo}`,
          mode: 'remote'
        };
      }
    } catch(e) {
      return { success: false, message: `❌ Erro: ${e.message}` };
    }
  },
  
  // GitHub API helper
  async githubAPI(method, path, body = null) {
    const url = `https://api.github.com${path}`;
    const opts = {
      method,
      headers: {
        'Authorization': `Bearer ${this.config.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'X-GitHub-Api-Version': '2022-11-28',
      }
    };
    if (body) {
      opts.headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(body);
    }
    
    const resp = await fetch(url, opts);
    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      throw new Error(err.message || `HTTP ${resp.status}`);
    }
    return resp.json();
  },
  
  // Executar comando (auto-detecta modo)
  async execute(command, options = {}) {
    if (this.mode === 'local' && this.localUrl) {
      return this.executeLocal(command, options);
    } else if (this.mode === 'remote' && this.config.token) {
      return this.executeRemote(command, options);
    } else {
      return { 
        success: false, 
        output: '⚠️ Não conectado. Configure:\n• Local: servidor rodando na porta 8081\n• Remoto: remote config <token> <owner> <repo>' 
      };
    }
  },
  
  // Executar local
  async executeLocal(command, options = {}) {
    const shell = options.shell || 'bash';
    const mode = options.mode || 'user';
    
    try {
      const resp = await fetch(`${this.localUrl}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command, shell, mode }),
        signal: AbortSignal.timeout(30000)
      });
      
      const result = await resp.json();
      this.history.push({ command, shell, mode, ...result, ts: Date.now() });
      return result;
    } catch(e) {
      return { success: false, output: `Erro: ${e.message}` };
    }
  },
  
  // Executar remoto via GitHub Actions
  async executeRemote(command, options = {}) {
    const shell = options.shell || 'bash';
    const mode = options.mode || 'user';
    
    try {
      // Criar Issue com comando
      const issue = await this.githubAPI('POST', 
        `/repos/${this.config.owner}/${this.config.repo}/issues`, {
        title: `⚡ Exec: ${command.substring(0, 60)}`,
        body: [
          '```exec',
          command,
          '```',
          '',
          `shell: ${shell}`,
          `mode: ${mode}`,
          `timestamp: ${new Date().toISOString()}`,
          `requester: templo-hermes-web`
        ].join('\n'),
        labels: ['execute']
      });
      
      this.history.push({
        command, shell, mode,
        issueNumber: issue.number,
        issueUrl: issue.html_url,
        status: 'pending',
        ts: Date.now()
      });
      
      return {
        success: true,
        output: `⏳ Comando enviado! Issue #${issue.number}\nAguardando execução no GitHub Actions...\n\n🔗 ${issue.html_url}`,
        issueNumber: issue.number,
        issueUrl: issue.html_url,
        pending: true
      };
    } catch(e) {
      return { success: false, output: `Erro GitHub: ${e.message}` };
    }
  },
  
  // Verificar resultado de execução pendente
  async checkResult(issueNumber) {
    try {
      const comments = await this.githubAPI('GET',
        `/repos/${this.config.owner}/${this.config.repo}/issues/${issueNumber}/comments`);
      
      // Procurar comentário com resultado
      for (const comment of comments) {
        if (comment.body.includes('## 🏛️ Resultado da Execução')) {
          // Extrair output
          const outputMatch = comment.body.match(/### 📤 Output:\n```\n([\s\S]*?)\n```/);
          const exitMatch = comment.body.match(/Exit Code.*`(\d+)`/);
          const elapsedMatch = comment.body.match(/Tempo.*`([^`]+)`/);
          
          return {
            success: true,
            output: outputMatch ? outputMatch[1] : comment.body,
            exitCode: exitMatch ? parseInt(exitMatch[1]) : 0,
            elapsed: elapsedMatch ? elapsedMatch[1] : '?',
            done: true
          };
        }
      }
      
      return { success: false, output: '⏳ Ainda executando...', done: false };
    } catch(e) {
      return { success: false, output: `Erro: ${e.message}` };
    }
  },
  
  // Poll de resultados pendentes
  startPolling(intervalMs = 10000) {
    if (this.pollInterval) clearInterval(this.pollInterval);
    
    this.pollInterval = setInterval(async () => {
      const pending = this.history.filter(h => h.status === 'pending' && h.issueNumber);
      
      for (const item of pending) {
        const result = await this.checkResult(item.issueNumber);
        if (result.done) {
          item.status = 'done';
          item.result = result;
          
          // Disparar evento customizado
          window.dispatchEvent(new CustomEvent('remote-result', { detail: result }));
          
          // Notificar no console
          if (typeof Console !== 'undefined') {
            Console.log(`📥 Resultado #${item.issueNumber}:`, 'sucesso');
            Console.log(result.output, 'info');
          }
        }
      }
    }, intervalMs);
  },
  
  stopPolling() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  },
  
  // ===== MODO GITHUB CLOUD (executa no runner do GitHub) =====
  async executeCloud(command, options = {}) {
    const shell = options.shell || 'bash';
    const mode = options.mode || 'user';
    
    try {
      // Criar Issue com label "execute" — o GitHub Actions executa
      const issue = await this.githubAPI('POST',
        `/repos/${this.config.owner}/${this.config.repo}/issues`, {
        title: `☁️ Cloud: ${command.substring(0, 60)}`,
        body: [
          '```exec',
          command,
          '```',
          '',
          `shell: ${shell}`,
          `mode: ${mode}`,
          `timestamp: ${new Date().toISOString()}`,
          `requester: templo-hermes-cloud`
        ].join('\n'),
        labels: ['execute']
      });
      
      return {
        success: true,
        output: `☁️ Comando enviado ao GitHub Cloud!\nIssue #${issue.number}\nO resultado aparecerá como comentário.\n\n🔗 ${issue.html_url}`,
        issueNumber: issue.number,
        issueUrl: issue.html_url,
        pending: true
      };
    } catch(e) {
      return { success: false, output: `Erro: ${e.message}` };
    }
  },
  
  // Status
  status() {
    return {
      connected: this.connected,
      mode: this.mode,
      localUrl: this.localUrl,
      github: this.config.owner ? `${this.config.owner}/${this.config.repo}` : 'não configurado',
      historyCount: this.history.length,
      pendingCount: this.history.filter(h => h.status === 'pending').length
    };
  },
  
  // Salvar config
  saveConfig() {
    localStorage.setItem('remote_admin_config', JSON.stringify(this.config));
  },
  
  // Alternar modo
  setMode(mode) {
    if (!['local', 'remote', 'github-cloud'].includes(mode)) {
      return `Modos válidos: local, remote, github-cloud`;
    }
    this.mode = mode;
    return `Modo alterado para: ${mode}`;
  }
};
