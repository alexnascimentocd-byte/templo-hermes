/* ===== PERSISTENCE LAYER — Camada de Persistência Offline ===== */
/* Blindagem de dados: backup automático, recovery, versionamento */

const Persistence = {
  KEYS: {
    AGENTS: 'hermes_agents_v2',
    KB: 'kb_hermes',
    INBOX: 'hermes_inbox_v2',
    BOOK: 'hermes_book_v2',
    COUNCIL: 'hermes_council_v2',
    CONVERSATION: 'hermes_conversation_v2',
    BACKUP: 'hermes_backup_v2',
    VERSION: 'hermes_data_version'
  },
  
  currentVersion: '2.0.0',
  
  // Salvar qualquer dado com versionamento
  save(key, data) {
    try {
      const envelope = {
        v: this.currentVersion,
        ts: Date.now(),
        d: data
      };
      localStorage.setItem(key, JSON.stringify(envelope));
      return true;
    } catch(e) {
      console.error('Persistence.save erro:', e);
      return false;
    }
  },
  
  // Carregar dados com verificação de versão
  load(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      const envelope = JSON.parse(raw);
      if (!envelope.v || !envelope.d) return fallback;
      // Se versão incompatível, tentar migrar
      if (envelope.v !== this.currentVersion) {
        return this.migrate(key, envelope);
      }
      return envelope.d;
    } catch(e) {
      console.error('Persistence.load erro:', e);
      return fallback;
    }
  },
  
  // Migrar dados de versão antiga
  migrate(key, envelope) {
    console.log(`Migrando ${key} de v${envelope.v} para v${this.currentVersion}`);
    // Por enquanto, aceitar dados antigos
    this.save(key, envelope.d);
    return envelope.d;
  },
  
  // Backup completo de todos os dados
  fullBackup() {
    const backup = {
      timestamp: Date.now(),
      date: new Date().toLocaleString('pt-BR'),
      version: this.currentVersion,
      data: {}
    };
    
    Object.values(this.KEYS).forEach(key => {
      try {
        const raw = localStorage.getItem(key);
        if (raw) backup.data[key] = JSON.parse(raw);
      } catch(e) {}
    });
    
    // Salvar backup
    localStorage.setItem(this.KEYS.BACKUP, JSON.stringify(backup));
    console.log(`📦 Backup completo: ${Object.keys(backup.data).length} chaves`);
    return backup;
  },
  
  // Restaurar backup
  restoreBackup() {
    try {
      const raw = localStorage.getItem(this.KEYS.BACKUP);
      if (!raw) return false;
      const backup = JSON.parse(raw);
      
      Object.entries(backup.data).forEach(([key, value]) => {
        localStorage.setItem(key, JSON.stringify(value));
      });
      
      console.log(`🔄 Backup restaurado: ${Object.keys(backup.data).length} chaves`);
      return true;
    } catch(e) {
      console.error('Erro ao restaurar backup:', e);
      return false;
    }
  },
  
  // Verificar integridade dos dados
  verify() {
    const report = {};
    Object.entries(this.KEYS).forEach(([name, key]) => {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) {
          report[name] = { status: 'MISSING' };
        } else {
          const parsed = JSON.parse(raw);
          report[name] = {
            status: parsed.v ? 'OK' : 'OLD_FORMAT',
            version: parsed.v || 'unknown',
            size: raw.length,
            timestamp: parsed.ts ? new Date(parsed.ts).toLocaleString('pt-BR') : 'unknown'
          };
        }
      } catch(e) {
        report[name] = { status: 'CORRUPT', error: e.message };
      }
    });
    return report;
  },
  
  // Salvar estado dos agentes
  saveAgents(agentsList) {
    const data = agentsList.map(a => ({
      type: a.type,
      name: a.name,
      icon: a.icon,
      level: a.level,
      experience: a.experience,
      expToNext: a.expToNext,
      skill: a.skill,
      currentAction: a.currentAction || 'idle',
      learnedTopics: a.learnedTopics || [],
      specializations: a.specializations || []
    }));
    return this.save(this.KEYS.AGENTS, data);
  },
  
  // Carregar estado dos agentes
  loadAgents() {
    return this.load(this.KEYS.AGENTS, []);
  },
  
  // Salvar conversação
  saveConversation(messages) {
    const data = messages.slice(-100); // Manter últimas 100
    return this.save(this.KEYS.CONVERSATION, data);
  },
  
  // Carregar conversação
  loadConversation() {
    return this.load(this.KEYS.CONVERSATION, []);
  },
  
  // Inicializar
  init() {
    // Auto-backup a cada 5 minutos
    setInterval(() => this.fullBackup(), 5 * 60 * 1000);
    
    // Backup ao sair
    window.addEventListener('beforeunload', () => this.fullBackup());
    
    console.log('💾 Persistence Layer v' + this.currentVersion + ' inicializada');
  }
};
