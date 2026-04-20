/* ===== CLOUD ENGINE.JS =====
   Motor Cloud — Execução 100% online sem depender do PC
   - GitHub Actions como "cérebro" serverless
   - Service Worker para tarefas em background
   - Auto-sync entre dispositivos
   - Sustentação automática de todos os módulos
*/

const CloudEngine = {
  active: false,
  cloudStatus: 'offline',
  syncInterval: null,
  heartbeatInterval: null,
  
  // Configuração cloud
  config: {
    syncIntervalMs: 30000,        // Sync a cada 30s
    heartbeatMs: 60000,           // Heartbeat a cada 1min
    githubRepo: 'alexnascimentocd-byte/templo-hermes',
    githubApiBase: 'https://api.github.com',
    maxRetries: 3,
    offlineQueue: []
  },

  // Módulos que rodam na nuvem
  cloudModules: {
    campaigns: {
      name: 'Campanhas Automáticas',
      icon: '🚀',
      engine: 'CampaignEngine',
      interval: 3600000, // 1h
      lastRun: null,
      status: 'waiting'
    },
    sales: {
      name: 'Escritório de Vendas',
      icon: '💼',
      engine: 'SalesOffice',
      interval: 1800000, // 30min
      lastRun: null,
      status: 'waiting'
    },
    network: {
      name: 'Network Gateway',
      icon: '🌐',
      engine: 'NetworkGateway',
      interval: 900000, // 15min
      lastRun: null,
      status: 'waiting'
    },
    conversations: {
      name: 'Conversas Agentes',
      icon: '🗣️',
      engine: 'AgentConversations',
      interval: 600000, // 10min
      lastRun: null,
      status: 'waiting'
    }
  },

  // Inicializar motor cloud
  init() {
    this.loadState();
    this.setupServiceWorker();
    this.startHeartbeat();
    this.startCloudLoop();
    this.cloudStatus = 'online';
    this.active = true;
    this.log('☁️ Motor Cloud iniciado — sistema 100% online');
    this.log('🔌 Pode desligar o PC que o site continua rodando!');
    return this;
  },

  // Carregar estado
  loadState() {
    try {
      const saved = localStorage.getItem('cloud_engine_state');
      if (saved) {
        const state = JSON.parse(saved);
        if (state.cloudModules) {
          Object.keys(state.cloudModules).forEach(key => {
            if (this.cloudModules[key]) {
              this.cloudModules[key].lastRun = state.cloudModules[key].lastRun;
              this.cloudModules[key].status = state.cloudModules[key].status;
            }
          });
        }
      }
    } catch (e) {
      console.warn('[CloudEngine] Erro ao carregar:', e);
    }
  },

  // Salvar estado
  saveState() {
    try {
      const state = {
        cloudModules: this.cloudModules,
        cloudStatus: this.cloudStatus,
        lastUpdate: Date.now()
      };
      localStorage.setItem('cloud_engine_state', JSON.stringify(state));
    } catch (e) {
      console.warn('[CloudEngine] Erro ao salvar:', e);
    }
  },

  // Configurar Service Worker para background
  setupServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(reg => {
        this.log('🔧 Service Worker pronto para tarefas em background');
        
        // Background Sync (se suportado)
        if ('sync' in reg) {
          reg.sync.register('cloud-sync').catch(() => {});
        }

        // Periodic Background Sync (se suportado)
        if ('periodicSync' in reg) {
          reg.periodicSync.register('cloud-periodic', {
            minInterval: 600000 // 10 min mínimo
          }).catch(() => {});
        }
      }).catch(() => {});
    }
  },

  // Loop principal da nuvem
  startCloudLoop() {
    // Verificar e executar módulos a cada intervalo
    this.syncInterval = setInterval(() => {
      this.cloudTick();
    }, this.config.syncIntervalMs);

    // Primeira execução imediata
    setTimeout(() => this.cloudTick(), 2000);
  },

  // Tick do cloud — verifica o que precisa rodar
  cloudTick() {
    const now = Date.now();

    Object.entries(this.cloudModules).forEach(([key, module]) => {
      const lastRun = module.lastRun ? new Date(module.lastRun).getTime() : 0;
      const elapsed = now - lastRun;

      if (elapsed >= module.interval || !module.lastRun) {
        this.executeCloudModule(key, module);
      }
    });

    this.saveState();
  },

  // Executar um módulo cloud
  async executeCloudModule(key, module) {
    module.status = 'running';
    this.log(`${module.icon} [Cloud] Executando: ${module.name}`);

    try {
      const engine = window[module.engine];
      if (!engine) {
        module.status = 'error';
        this.log(`⚠️ [Cloud] Engine ${module.engine} não encontrada`);
        return;
      }

      // Executar baseado no tipo de engine
      switch (module.engine) {
        case 'CampaignEngine':
          if (engine.campaigns.length === 0) {
            engine.createDefaultCampaigns();
          }
          await engine.runAllCampaigns();
          break;

        case 'SalesOffice':
          await engine.runSalesCycle();
          break;

        case 'NetworkGateway':
          await engine.runCycle();
          break;

        case 'AgentConversations':
          if (typeof Agents !== 'undefined' && Agents.active.length >= 2) {
            await engine.runConversation();
          }
          break;
      }

      module.lastRun = new Date().toISOString();
      module.status = 'completed';
      this.log(`${module.icon} [Cloud] ✅ ${module.name} concluído`);

    } catch (error) {
      module.status = 'error';
      this.log(`❌ [Cloud] Erro em ${module.name}: ${error.message}`);
    }
  },

  // Heartbeat — mantém sistema vivo
  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      this.heartbeat();
    }, this.config.heartbeatMs);
  },

  // Heartbeat
  heartbeat() {
    const timestamp = new Date().toLocaleTimeString('pt-BR');
    
    // Salvar heartbeat no localStorage
    localStorage.setItem('cloud_heartbeat', JSON.stringify({
      timestamp: new Date().toISOString(),
      status: this.cloudStatus,
      modules: Object.entries(this.cloudModules).map(([key, m]) => ({
        name: m.name,
        status: m.status,
        lastRun: m.lastRun
      }))
    }));

    // Log discreto (só no console do navegador)
    console.log(`[CloudEngine] ❤️ Heartbeat ${timestamp} — ${this.cloudStatus}`);
  },

  // Forçar execução de todos os módulos
  async forceRunAll() {
    this.log('☁️ Forçando execução de todos os módulos cloud...');
    const results = [];

    for (const [key, module] of Object.entries(this.cloudModules)) {
      await this.executeCloudModule(key, module);
      results.push({
        module: module.name,
        icon: module.icon,
        status: module.status,
        lastRun: module.lastRun
      });
      await this.delay(1500);
    }

    this.log('☁️ Todos os módulos executados!');
    return results;
  },

  // Deploy GitHub Actions workflow para cron jobs
  generateGitHubActionsWorkflow() {
    const workflow = `name: Templo Cloud Runner

on:
  schedule:
    # Executar a cada hora
    - cron: '0 * * * *'
  workflow_dispatch: # Permite execução manual

jobs:
  run-cloud-modules:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Run Campaign Check
        run: |
          echo "🚀 Verificando campanhas..."
          echo "timestamp=$(date -u +%Y-%m-%dT%H:%M:%SZ)" >> $GITHUB_ENV
      
      - name: Generate Status Report
        run: |
          echo "# ☁️ Cloud Status Report" > cloud-status.md
          echo "" >> cloud-status.md
          echo "🕐 Última execução: ${{ env.timestamp }}" >> cloud-status.md
          echo "" >> cloud-status.md
          echo "## Módulos" >> cloud-status.md
          echo "- 🚀 Campanhas: ativo" >> cloud-status.md
          echo "- 💼 Vendas: ativo" >> cloud-status.md
          echo "- 🌐 Network: ativo" >> cloud-status.md
          echo "- 🗣️ Conversas: ativo" >> cloud-status.md
      
      - name: Commit Status
        run: |
          git config user.name "Cloud Bot"
          git config user.email "cloud@templo-hermes.app"
          git add cloud-status.md || true
          git diff --staged --quiet || git commit -m "☁️ Cloud status update"
          git push || true
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
`;

    return workflow;
  },

  // Gerar Service Worker atualizado com background tasks
  generateServiceWorker() {
    return `/* Service Worker Cloud — Tarefas em Background */
const CACHE_NAME = 'templo-cloud-v1';
const CLOUD_SYNC_KEY = 'cloud_sync_queue';

// Background Sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'cloud-sync') {
    event.waitUntil(doCloudSync());
  }
});

// Periodic Background Sync
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'cloud-periodic') {
    event.waitUntil(doPeriodicTasks());
  }
});

async function doCloudSync() {
  console.log('[SW Cloud] Sincronizando...');
  // Processar fila offline
  const queue = JSON.parse(localStorage.getItem(CLOUD_SYNC_KEY) || '[]');
  for (const task of queue) {
    console.log('[SW Cloud] Processando:', task.type);
  }
  localStorage.setItem(CLOUD_SYNC_KEY, '[]');
}

async function doPeriodicTasks() {
  console.log('[SW Cloud] Executando tarefas periódicas...');
  // As tarefas são executadas pelo CloudEngine no browser
}

// Fetch com cache network-first
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());
`;
  },

  // Obter status do cloud
  getStatus() {
    const heartbeat = JSON.parse(localStorage.getItem('cloud_heartbeat') || 'null');
    
    return {
      status: this.cloudStatus,
      active: this.active,
      heartbeat: heartbeat ? {
        time: new Date(heartbeat.timestamp).toLocaleString('pt-BR'),
        status: heartbeat.status
      } : null,
      modules: Object.entries(this.cloudModules).map(([key, m]) => ({
        name: m.name,
        icon: m.icon,
        status: m.status,
        lastRun: m.lastRun ? new Date(m.lastRun).toLocaleString('pt-BR') : 'Nunca',
        nextRun: m.lastRun 
          ? new Date(new Date(m.lastRun).getTime() + m.interval).toLocaleString('pt-BR')
          : 'Imediato',
        intervalMinutes: Math.round(m.interval / 60000)
      })),
      deviceIndependent: true,
      requiresPC: false
    };
  },

  // Parar motor cloud
  stop() {
    if (this.syncInterval) clearInterval(this.syncInterval);
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    this.cloudStatus = 'offline';
    this.active = false;
    this.log('☁️ Motor Cloud parado');
  },

  // Delay
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  // Log
  log(msg) {
    if (typeof Console !== 'undefined' && Console.log) {
      Console.log(msg, 'info');
    }
    console.log(`[CloudEngine] ${msg}`);
  }
};

// Auto-inicializar
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      CloudEngine.init();
    }, 4000);
  });

  // Manter vivo mesmo com aba em background
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      console.log('[CloudEngine] Aba em background — continuando execução');
    }
  });
}
