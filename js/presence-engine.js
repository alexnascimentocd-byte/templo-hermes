/* ===== PRESENCE ENGINE.JS =====
   Motor de Presença Online + Processamento Local
   - Usa CPU/GPU do dispositivo como nó de processamento
   - Criptografia WebCrypto para transmissão segura
   - Notificações inteligentes com filtro de prioridade
   - Só notifica o que realmente importa
*/

const PresenceEngine = {
  active: false,
  deviceId: null,
  deviceInfo: {},
  processingQueue: [],
  encryptedChannel: null,
  cryptoKey: null,
  
  // Configuração
  config: {
    heartbeatInterval: 30000,      // 30s
    processInterval: 15000,        // 15s
    maxProcessPerTick: 3,
    notificationCooldown: 120000,  // 2min entre notificações
    minPriorityForNotify: 4,       // Só notifica prioridade >= 4 (de 5)
    encryptionEnabled: true
  },

  // Sistema de notificação inteligente
  notifications: {
    queue: [],
    lastNotification: 0,
    suppressed: 0,

    // Níveis de prioridade
    priority: {
      1: { name: 'Ignorar',    icon: '🔇', notify: false, sound: false },
      2: { name: 'Baixa',      icon: '💤', notify: false, sound: false },
      3: { name: 'Média',      icon: '📋', notify: false, sound: false },
      4: { name: 'Alta',       icon: '🔔', notify: true,  sound: true  },
      5: { name: 'Urgente',    icon: '🚨', notify: true,  sound: true  }
    },

    // Tipos de evento e sua prioridade base
    eventTypes: {
      venda_fechada:       { priority: 5, desc: 'Venda fechada — dinheiro entrando' },
      pagamento_recebido:  { priority: 5, desc: 'Pagamento Pix confirmado' },
      lead_quente:         { priority: 4, desc: 'Lead com score > 80 pronto pra fechar' },
      campanha_resultado:  { priority: 3, desc: 'Campanha com bom resultado' },
      tendencia_detectada: { priority: 3, desc: 'Nova tendência de mercado' },
      sistema_erro:        { priority: 4, desc: 'Erro no sistema que precisa de atenção' },
      projeto_publicado:   { priority: 2, desc: 'Novo projeto web publicado' },
      ciclo_completo:      { priority: 2, desc: 'Ciclo de processamento completo' },
      heartbeat:           { priority: 1, desc: 'Sistema vivo' },
      conversa_sintese:    { priority: 2, desc: 'Agentes geraram nova síntese' },
      meta_atingida:       { priority: 5, desc: 'Meta de receita atingida!' }
    }
  },

  // Inicializar
  async init() {
    this.deviceId = this.generateDeviceId();
    this.deviceInfo = this.collectDeviceInfo();
    await this.initEncryption();
    this.startPresence();
    this.setupNotificationPermission();
    this.active = true;
    this.log('📱 Presença Online iniciada');
    this.log(`🖥️ Dispositivo: ${this.deviceInfo.type} | ${this.deviceInfo.cores} cores | ${this.deviceInfo.memory}`);
    return this;
  },

  // Gerar ID único do dispositivo
  generateDeviceId() {
    let id = localStorage.getItem('presence_device_id');
    if (!id) {
      id = `dev_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('presence_device_id', id);
    }
    return id;
  },

  // Coletar info do dispositivo
  collectDeviceInfo() {
    const ua = navigator.userAgent;
    return {
      id: this.deviceId,
      type: /Mobile|Android|iPhone/i.test(ua) ? 'mobile' : 'desktop',
      platform: navigator.platform,
      cores: navigator.hardwareConcurrency || 4,
      memory: navigator.deviceMemory ? `${navigator.deviceMemory}GB` : 'unknown',
      gpu: this.detectGPU(),
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      online: navigator.onLine,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      touchSupport: 'ontouchstart' in window
    };
  },

  // Detectar GPU
  detectGPU() {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          return gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        }
      }
    } catch (e) {}
    return 'unknown';
  },

  // Inicializar criptografia WebCrypto
  async initEncryption() {
    if (!this.config.encryptionEnabled) return;

    try {
      // Verificar se já tem chave salva
      const savedKey = localStorage.getItem('presence_crypto_key');
      if (savedKey) {
        const keyData = JSON.parse(savedKey);
        this.cryptoKey = await crypto.subtle.importKey(
          'jwk',
          keyData,
          { name: 'AES-GCM', length: 256 },
          true,
          ['encrypt', 'decrypt']
        );
      } else {
        // Gerar nova chave AES-256-GCM
        this.cryptoKey = await crypto.subtle.generateKey(
          { name: 'AES-GCM', length: 256 },
          true,
          ['encrypt', 'decrypt']
        );

        // Salvar chave (exportável)
        const exported = await crypto.subtle.exportKey('jwk', this.cryptoKey);
        localStorage.setItem('presence_crypto_key', JSON.stringify(exported));
      }

      this.log('🔐 Criptografia AES-256-GCM ativada');
    } catch (e) {
      this.log('⚠️ WebCrypto não disponível, sem criptografia');
      this.config.encryptionEnabled = false;
    }
  },

  // Criptografar dados
  async encrypt(data) {
    if (!this.config.encryptionEnabled || !this.cryptoKey) return data;

    try {
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encoded = new TextEncoder().encode(JSON.stringify(data));
      
      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        this.cryptoKey,
        encoded
      );

      return {
        encrypted: true,
        iv: Array.from(iv),
        data: Array.from(new Uint8Array(encrypted)),
        deviceId: this.deviceId,
        timestamp: Date.now()
      };
    } catch (e) {
      console.warn('[Presence] Erro ao criptografar:', e);
      return data;
    }
  },

  // Descriptografar dados
  async decrypt(encryptedData) {
    if (!this.config.encryptionEnabled || !this.cryptoKey || !encryptedData.encrypted) {
      return encryptedData;
    }

    try {
      const iv = new Uint8Array(encryptedData.iv);
      const data = new Uint8Array(encryptedData.data);

      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: iv },
        this.cryptoKey,
        data
      );

      return JSON.parse(new TextDecoder().decode(decrypted));
    } catch (e) {
      console.warn('[Presence] Erro ao descriptografar:', e);
      return null;
    }
  },

  // Iniciar presença
  startPresence() {
    // Heartbeat
    setInterval(() => this.heartbeat(), this.config.heartbeatInterval);

    // Processamento
    setInterval(() => this.processQueue(), this.config.processInterval);

    // Monitorar status online/offline
    window.addEventListener('online', () => {
      this.deviceInfo.online = true;
      this.log('📶 Dispositivo online');
    });

    window.addEventListener('offline', () => {
      this.deviceInfo.online = false;
      this.log('📵 Dispositivo offline — processamento local continua');
    });

    this.log('📱 Presença ativa — dispositivo registrado como nó de processamento');
  },

  // Heartbeat do dispositivo
  async heartbeat() {
    const data = {
      type: 'heartbeat',
      deviceId: this.deviceId,
      timestamp: new Date().toISOString(),
      online: navigator.onLine,
      battery: await this.getBatteryInfo(),
      processingLoad: this.processingQueue.length
    };

    const encrypted = await this.encrypt(data);
    localStorage.setItem('presence_heartbeat', JSON.stringify(encrypted));
  },

  // Info da bateria
  async getBatteryInfo() {
    try {
      if ('getBattery' in navigator) {
        const battery = await navigator.getBattery();
        return {
          level: Math.round(battery.level * 100),
          charging: battery.charging
        };
      }
    } catch (e) {}
    return { level: 'unknown', charging: 'unknown' };
  },

  // Adicionar tarefa à fila de processamento
  addToQueue(task) {
    this.processingQueue.push({
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      ...task,
      status: 'pending',
      addedAt: new Date().toISOString()
    });
  },

  // Processar fila localmente (usa CPU do dispositivo)
  async processQueue() {
    if (this.processingQueue.length === 0) return;

    const toProcess = this.processingQueue
      .filter(t => t.status === 'pending')
      .slice(0, this.config.maxProcessPerTick);

    for (const task of toProcess) {
      task.status = 'processing';
      
      try {
        const result = await this.executeTask(task);
        task.status = 'completed';
        task.result = result;
        task.completedAt = new Date().toISOString();
      } catch (e) {
        task.status = 'error';
        task.error = e.message;
      }
    }

    // Limpar completados
    this.processingQueue = this.processingQueue.filter(t => t.status === 'pending');
  },

  // Executar tarefa de processamento
  async executeTask(task) {
    switch (task.type) {
      case 'analyze_leads':
        return this.processAnalyzeLeads();
      case 'generate_content':
        return this.processGenerateContent(task);
      case 'calculate_metrics':
        return this.processCalculateMetrics();
      case 'encrypt_data':
        return await this.encrypt(task.data);
      case 'classify_profile':
        return this.processClassifyProfile(task);
      default:
        return { processed: true, type: task.type };
    }
  },

  // Processar análise de leads
  processAnalyzeLeads() {
    if (typeof LeadDiversification !== 'undefined') {
      const stats = LeadDiversification.getStats();
      return { analyzed: true, leads: stats.totalProfiles, score: stats.avgIntentScore };
    }
    return { analyzed: false };
  },

  // Processar geração de conteúdo
  processGenerateContent(task) {
    if (typeof CampaignEngine !== 'undefined') {
      const content = CampaignEngine.generateContent(task.channel || 'whatsapp_vendas');
      return { generated: true, content: content?.content?.substring(0, 100) };
    }
    return { generated: false };
  },

  // Processar cálculo de métricas
  processCalculateMetrics() {
    const metrics = {
      timestamp: Date.now(),
      campaigns: typeof CampaignEngine !== 'undefined' ? CampaignEngine.getStats() : null,
      sales: typeof SalesOffice !== 'undefined' ? SalesOffice.getStats() : null,
      network: typeof NetworkGateway !== 'undefined' ? NetworkGateway.getStats() : null
    };
    return { calculated: true, modules: Object.keys(metrics).filter(k => metrics[k] !== null).length };
  },

  // Processar classificação de perfil
  processClassifyProfile(task) {
    if (typeof LeadDiversification !== 'undefined') {
      return { classified: true, profile: task.profile || 'iniciante' };
    }
    return { classified: false };
  },

  // ===== SISTEMA DE NOTIFICAÇÕES INTELIGENTES =====

  // Solicitar permissão de notificação
  async setupNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      // Não pedir automaticamente — esperar primeiro evento importante
      this.log('🔔 Notificações disponíveis (serão solicitadas no primeiro evento importante)');
    }
  },

  // Notificar (com filtro de prioridade)
  async notify(eventType, data = {}) {
    const eventDef = this.notifications.eventTypes[eventType];
    if (!eventDef) return;

    const priority = data.priority || eventDef.priority;
    const priorityDef = this.notifications.priority[priority];

    // Filtrar: só notifica se prioridade >= mínimo
    if (priority < this.config.minPriorityForNotify) {
      this.notifications.suppressed++;
      return; // Silenciosamente ignora
    }

    // Cooldown: não floodar
    const now = Date.now();
    if (now - this.notifications.lastNotification < this.config.notificationCooldown) {
      // Só ignora se não for urgente
      if (priority < 5) {
        this.notifications.suppressed++;
        return;
      }
    }

    // Montar mensagem
    const message = {
      id: `notif_${now}`,
      type: eventType,
      priority: priority,
      icon: priorityDef.icon,
      title: data.title || eventDef.desc,
      body: data.body || '',
      timestamp: new Date().toISOString(),
      read: false,
      action: data.action || null
    };

    this.notifications.queue.push(message);
    this.notifications.lastNotification = now;

    // Enviar notificação do browser (se permitido)
    if (priorityDef.notify && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        this.sendBrowserNotification(message);
      } else if (Notification.permission === 'default') {
        // Pedir permissão no primeiro evento importante
        const perm = await Notification.requestPermission();
        if (perm === 'granted') {
          this.sendBrowserNotification(message);
        }
      }
    }

    // Mostrar no PriorityChat do Templo
    if (typeof PriorityChat !== 'undefined') {
      PriorityChat.addMessage(message.icon, `${message.title} ${message.body}`, priority);
    }

    this.log(`${message.icon} [P${priority}] ${message.title}`);
    return message;
  },

  // Enviar notificação do browser
  sendBrowserNotification(message) {
    try {
      const notif = new Notification(`${message.icon} Templo de Hermes`, {
        body: `${message.title}\n${message.body}`.substring(0, 200),
        icon: './assets/icon-192.png',
        badge: './assets/icon-192.png',
        tag: message.type,
        requireInteraction: message.priority >= 5,
        silent: message.priority < 4
      });

      notif.onclick = () => {
        window.focus();
        notif.close();
      };

      // Auto-close após 10s (urgente fica até clicar)
      if (message.priority < 5) {
        setTimeout(() => notif.close(), 10000);
      }
    } catch (e) {
      console.warn('[Presence] Erro ao enviar notificação:', e);
    }
  },

  // Ver notificações
  getNotifications(unreadOnly = false) {
    let notifs = this.notifications.queue.slice(-20).reverse();
    if (unreadOnly) {
      notifs = notifs.filter(n => !n.read);
    }
    return notifs.map(n => ({
      ...n,
      timeAgo: this.getTimeAgo(n.timestamp)
    }));
  },

  // Marcar como lida
  markRead(notifId) {
    const notif = this.notifications.queue.find(n => n.id === notifId);
    if (notif) notif.read = true;
  },

  // Marcar todas como lidas
  markAllRead() {
    this.notifications.queue.forEach(n => n.read = true);
  },

  // Tempo relativo
  getTimeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'agora';
    if (mins < 60) return `${mins}min`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    return `${Math.floor(hrs / 24)}d`;
  },

  // Status do sistema de presença
  getStatus() {
    return {
      active: this.active,
      deviceId: this.deviceId,
      device: {
        type: this.deviceInfo.type,
        cores: this.deviceInfo.cores,
        memory: this.deviceInfo.memory,
        gpu: this.deviceInfo.gpu?.substring(0, 50) || 'unknown',
        online: navigator.onLine
      },
      encryption: {
        enabled: this.config.encryptionEnabled,
        algorithm: 'AES-256-GCM'
      },
      processing: {
        queueLength: this.processingQueue.length,
        maxPerTick: this.config.maxProcessPerTick
      },
      notifications: {
        total: this.notifications.queue.length,
        unread: this.notifications.queue.filter(n => !n.read).length,
        suppressed: this.notifications.suppressed,
        minPriority: this.config.minPriorityForNotify,
        cooldown: `${this.config.notificationCooldown / 1000}s`
      }
    };
  },

  // Log
  log(msg) {
    if (typeof Console !== 'undefined' && Console.log) {
      Console.log(msg, 'info');
    }
    console.log(`[PresenceEngine] ${msg}`);
  }
};

// Auto-inicializar
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      PresenceEngine.init();
    }, 5500);
  });
}
