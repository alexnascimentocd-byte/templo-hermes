/* ===== SYSTEM ADMIN — Execução de Comandos no Computador ===== */
/* Modo Root, PowerShell, CMD, WSL — via API local */

const SystemAdmin = {
  connected: false,
  apiUrl: null,
  mode: 'user', // 'user' | 'root'
  shell: 'powershell', // 'powershell' | 'cmd' | 'bash'
  history: [],
  
  // Inicializar
  init() {
    // Tentar auto-conectar na API local
    this.autoConnect();
  },
  
  // Auto-conectar na API local
  async autoConnect() {
    const ports = [8888, 9999, 3000, 5000];
    for (const port of ports) {
      try {
        const resp = await fetch(`http://localhost:${port}/health`, { 
          signal: AbortSignal.timeout(2000) 
        });
        if (resp.ok) {
          this.apiUrl = `http://localhost:${port}`;
          this.connected = true;
          console.log(`🔌 SystemAdmin conectado: ${this.apiUrl}`);
          return true;
        }
      } catch(e) {}
    }
    return false;
  },
  
  // Conectar manualmente
  async connect(url) {
    try {
      this.apiUrl = url.replace(/\/$/, '');
      const resp = await fetch(`${this.apiUrl}/health`, { signal: AbortSignal.timeout(3000) });
      if (resp.ok) {
        this.connected = true;
        return { success: true, message: `Conectado a ${this.apiUrl}` };
      }
    } catch(e) {}
    this.connected = false;
    return { success: false, message: 'Não foi possível conectar' };
  },
  
  // Executar comando
  async execute(command, options = {}) {
    if (!this.connected) {
      return { success: false, output: '⚠️ Não conectado ao sistema local. Use: sysadmin connect http://localhost:8888' };
    }
    
    const shell = options.shell || this.shell;
    const mode = options.mode || this.mode;
    
    try {
      const resp = await fetch(`${this.apiUrl}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command, shell, mode }),
        signal: AbortSignal.timeout(30000)
      });
      
      const result = await resp.json();
      
      // Salvar no histórico
      this.history.push({
        command,
        shell,
        mode,
        output: result.output,
        exitCode: result.exitCode,
        timestamp: Date.now()
      });
      
      return result;
    } catch(e) {
      return { success: false, output: `Erro: ${e.message}` };
    }
  },
  
  // Alternar modo root/user
  toggleMode() {
    this.mode = this.mode === 'user' ? 'root' : 'user';
    return `Modo alterado para: ${this.mode.toUpperCase()}`;
  },
  
  // Alternar shell
  setShell(shell) {
    const valid = ['powershell', 'cmd', 'bash'];
    if (!valid.includes(shell)) {
      return `Shell inválido. Use: ${valid.join(', ')}`;
    }
    this.shell = shell;
    return `Shell alterado para: ${shell}`;
  },
  
  // Status
  status() {
    return {
      connected: this.connected,
      apiUrl: this.apiUrl,
      mode: this.mode,
      shell: this.shell,
      historyCount: this.history.length
    };
  }
};
