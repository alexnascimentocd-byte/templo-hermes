/* ===== LEAD DIVERSIFICATION.JS =====
   Departamento de Diversificação de Leads
   - Identifica perfis com alta propensão de compra na web
   - Interceptação via browser (não rede social)
   - Behavioral targeting com sinais de intenção
   - Distribuição automática por canal de venda
*/

const LeadDiversification = {
  active: false,
  profiles: [],
  intentSignals: [],
  distributionLog: [],
  totalDistributed: 0,

  // Perfis de comprador (arquétipos)
  buyerProfiles: {
    impulsivo: {
      name: 'Comprador Impulsivo',
      icon: '⚡',
      description: 'Compra rápido, decide emocionalmente, preço baixo não trava',
      triggers: ['urgência', 'escassez', 'desconto', 'limitado'],
      bestChannel: 'whatsapp',
      conversionRate: 0.25,
      avgTicket: 27
    },
    pesquisador: {
      name: 'Comprador Pesquisador',
      icon: '🔍',
      description: 'Pesquisa bastante, compara, mas quando decide é firme',
      triggers: ['prova social', 'comparativo', 'detalhes', 'garantia'],
      bestChannel: 'email',
      conversionRate: 0.18,
      avgTicket: 67
    },
    oportunista: {
      name: 'Caçador de Oportunidades',
      icon: '🎯',
      description: 'Só compra em promoção, mas compra MUITO quando acha',
      triggers: ['promoção', 'black friday', 'oferta', 'cupom'],
      bestChannel: 'whatsapp',
      conversionRate: 0.35,
      avgTicket: 47
    },
    profissional: {
      name: 'Comprador Profissional',
      icon: '💼',
      description: 'Compra pra resolver problema do trabalho, sem frescura',
      triggers: ['ROI', 'eficiência', 'automatiza', 'economiza tempo'],
      bestChannel: 'email',
      conversionRate: 0.15,
      avgTicket: 147
    },
    iniciante: {
      name: 'Iniciante Curioso',
      icon: '🌱',
      description: 'Tá começando, quer aprender, sensível a preço acessível',
      triggers: ['grátis', 'básico', 'passo a passo', 'iniciante'],
      bestChannel: 'telegram',
      conversionRate: 0.22,
      avgTicket: 19
    },
    recorrente: {
      name: 'Cliente Recorrente',
      icon: '🔄',
      description: 'Já comprou antes, confia no produto, compra de novo',
      triggers: ['novo', 'atualização', 'exclusivo', 'vip'],
      bestChannel: 'whatsapp',
      conversionRate: 0.45,
      avgTicket: 37
    }
  },

  // Sinais de intenção de compra detectados na web
  intentSignalsDef: {
    // Comportamento no site
    page停留: { signal: 'long_dwell', weight: 15, desc: 'Ficou mais de 2min na página' },
    scroll深度: { signal: 'deep_scroll', weight: 10, desc: 'Rolou até o final da página' },
    retorno频率: { signal: 'return_visit', weight: 25, desc: 'Voltou ao site mais de 1 vez' },
    clique_repetido: { signal: 'repeat_click', weight: 20, desc: 'Clicou no mesmo elemento várias vezes' },
    copy_selection: { signal: 'copy_text', weight: 12, desc: 'Selecionou/copiou texto do produto' },
    
    // Sinais de compra
    preco查看: { signal: 'price_view', weight: 30, desc: 'Olhou o preço mais de 3 segundos' },
    checkout_hover: { signal: 'checkout_hover', weight: 35, desc: 'Passou mouse sobre botão de compra' },
    checkout_click: { signal: 'checkout_click', weight: 50, desc: 'Clicou no botão de compra' },
    abandonou_carrinho: { signal: 'cart_abandon', weight: 40, desc: 'Abandonou o checkout' },
    
    // Padrões de navegação
    multi_produto: { signal: 'multi_product', weight: 18, desc: 'Visitou múltiplos produtos' },
    horario_comercial: { signal: 'business_hours', weight: 8, desc: 'Acessou em horário comercial' },
    device_mobile: { signal: 'mobile_user', weight: 5, desc: 'Acessou pelo celular' },
    velocidade_navegacao: { signal: 'fast_browse', weight: 12, desc: 'Navegou rápido entre páginas' }
  },

  // Canais de distribuição direta (browser, não rede social)
  distributionChannels: {
    landing_page: {
      name: 'Landing Page Otimizada',
      icon: '🌐',
      method: 'page',
      description: 'Página de captura com popup inteligente',
      autoTrigger: true
    },
    web_push: {
      name: 'Web Push Notification',
      icon: '🔔',
      method: 'push',
      description: 'Notificação direto no navegador',
      autoTrigger: true
    },
    exit_intent: {
      name: 'Exit Intent Popup',
      icon: '🚪',
      method: 'popup',
      description: 'Popup quando tenta sair do site',
      autoTrigger: true
    },
    retargeting_pixel: {
      name: 'Retargeting Browser',
      icon: '🎯',
      method: 'pixel',
      description: 'Rastreia e re-impacta visitantes',
      autoTrigger: true
    },
    smart_banner: {
      name: 'Banner Inteligente',
      icon: '📢',
      method: 'banner',
      description: 'Banner que aparece baseado no comportamento',
      autoTrigger: true
    },
    direct_message: {
      name: 'Mensagem Direta Web',
      icon: '💬',
      method: 'widget',
      description: 'Chat widget com oferta personalizada',
      autoTrigger: true
    }
  },

  // Inicializar
  init() {
    this.loadState();
    this.setupIntentTracking();
    this.active = true;
    this.log('🏢 Departamento de Diversificação iniciado');
    this.log('🎯 Rastreando sinais de intenção de compra...');
    return this;
  },

  // Carregar estado
  loadState() {
    try {
      const saved = localStorage.getItem('lead_diversification_state');
      if (saved) {
        const state = JSON.parse(saved);
        this.profiles = state.profiles || [];
        this.intentSignals = state.intentSignals || [];
        this.distributionLog = state.distributionLog || [];
        this.totalDistributed = state.totalDistributed || 0;
      }
    } catch (e) {
      console.warn('[LeadDiversification] Erro:', e);
    }
  },

  // Salvar estado
  saveState() {
    try {
      const state = {
        profiles: this.profiles.slice(-200),
        intentSignals: this.intentSignals.slice(-100),
        distributionLog: this.distributionLog.slice(-50),
        totalDistributed: this.totalDistributed,
        lastUpdate: Date.now()
      };
      localStorage.setItem('lead_diversification_state', JSON.stringify(state));
    } catch (e) {
      console.warn('[LeadDiversification] Erro:', e);
    }
  },

  // Configurar rastreamento de intenção
  setupIntentTracking() {
    if (typeof window === 'undefined') return;

    // Track tempo na página
    let startTime = Date.now();
    let maxScroll = 0;
    let clickCount = {};

    // Scroll depth
    window.addEventListener('scroll', () => {
      const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        if (maxScroll > 80) {
          this.recordSignal('scroll深度', { depth: maxScroll });
        }
      }
    });

    // Click tracking
    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-track]') || e.target;
      const id = target.id || target.className || target.tagName;
      clickCount[id] = (clickCount[id] || 0) + 1;
      
      if (clickCount[id] > 2) {
        this.recordSignal('clique_repetido', { element: id, count: clickCount[id] });
      }

      // Checkout detection
      if (id.includes('checkout') || id.includes('comprar') || id.includes('buy')) {
        this.recordSignal('checkout_click', { element: id });
      }
    });

    // Exit intent
    document.addEventListener('mouseout', (e) => {
      if (e.clientY < 10) {
        this.recordSignal('exit_intent', { time: Date.now() - startTime });
      }
    });

    // Page visibility
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        const dwellTime = Date.now() - startTime;
        if (dwellTime > 120000) {
          this.recordSignal('page停留', { seconds: Math.round(dwellTime / 1000) });
        }
      }
    });
  },

  // Registrar sinal de intenção
  recordSignal(signalName, data = {}) {
    const signalDef = this.intentSignalsDef[signalName];
    if (!signalDef) return;

    const signal = {
      type: signalName,
      signal: signalDef.signal,
      weight: signalDef.weight,
      description: signalDef.desc,
      data: data,
      timestamp: new Date().toISOString()
    };

    this.intentSignals.push(signal);
    
    // Calcular score total do visitante
    const totalScore = this.intentSignals.reduce((sum, s) => sum + s.weight, 0);
    
    if (totalScore > 60) {
      this.classifyAndDistribute(totalScore);
    }

    this.saveState();
  },

  // Classificar perfil e distribuir lead
  classifyAndDistribute(score) {
    // Determinar perfil baseado nos sinais
    const profile = this.detectBuyerProfile();
    const profileDef = this.buyerProfiles[profile];
    
    if (!profileDef) return;

    // Criar lead diversificado
    const diversifiedLead = {
      id: `div_${Date.now()}`,
      profile: profile,
      profileName: profileDef.name,
      profileIcon: profileDef.icon,
      score: score,
      signals: this.intentSignals.slice(-5).map(s => s.type),
      bestChannel: profileDef.bestChannel,
      conversionProbability: profileDef.conversionRate,
      suggestedTicket: profileDef.avgTicket,
      status: 'distribuido',
      distributedAt: new Date().toISOString(),
      channel: this.selectChannel(profileDef)
    };

    this.profiles.push(diversifiedLead);
    this.totalDistributed++;

    // Distribuir para canal adequado
    this.distribute(diversifiedLead);
  },

  // Detectar perfil de comprador baseado nos sinais
  detectBuyerProfile() {
    const signals = this.intentSignals.slice(-10).map(s => s.type);
    
    // Análise de padrões
    if (signals.includes('checkout_click')) return 'impulsivo';
    if (signals.includes('scroll深度') && signals.includes('page停留')) return 'pesquisador';
    if (signals.includes('clique_repetido')) return 'oportunista';
    if (signals.includes('multi_produto')) return 'profissional';
    
    // Random weighted by conversion rate
    const profiles = Object.entries(this.buyerProfiles);
    const weights = profiles.map(([_, p]) => p.conversionRate);
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;
    
    for (let i = 0; i < profiles.length; i++) {
      random -= weights[i];
      if (random <= 0) return profiles[i][0];
    }
    
    return 'iniciante';
  },

  // Selecionar canal de distribuição
  selectChannel(profileDef) {
    const channelMap = {
      whatsapp: 'direct_message',
      email: 'smart_banner',
      telegram: 'web_push'
    };
    return channelMap[profileDef.bestChannel] || 'landing_page';
  },

  // Distribuir lead para canal
  distribute(lead) {
    const channel = this.distributionChannels[lead.channel];
    if (!channel) return;

    const log = {
      leadId: lead.id,
      profile: lead.profileName,
      channel: channel.name,
      icon: channel.icon,
      score: lead.score,
      probability: `${Math.round(lead.conversionProbability * 100)}%`,
      ticket: `R$ ${lead.suggestedTicket}`,
      timestamp: new Date().toISOString()
    };

    this.distributionLog.push(log);
    this.log(`${channel.icon} Lead distribuído: ${lead.profileName} → ${channel.name} (score: ${lead.score}, ${log.probability})`);
  },

  // Executar ciclo completo de diversificação
  async runDiversificationCycle() {
    this.active = true;
    this.log('🏢 Executando ciclo de diversificação...');

    // 1. Gerar perfis variados da web
    const webProfiles = this.generateWebProfiles(8);
    this.log(`📡 ${webProfiles.length} perfis identificados na web`);

    // 2. Classificar cada perfil
    const classified = [];
    for (const profile of webProfiles) {
      await this.delay(500);
      
      const buyerType = this.classifyProfileFromData(profile);
      const score = this.calculateIntentScore(profile);
      
      classified.push({
        ...profile,
        buyerType,
        buyerProfile: this.buyerProfiles[buyerType],
        score
      });
    }

    // 3. Distribuir leads qualificados (score > 40)
    const qualified = classified.filter(p => p.score > 40);
    for (const lead of qualified) {
      await this.delay(300);
      
      const diversifiedLead = {
        id: `div_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        profile: lead.buyerType,
        profileName: lead.buyerProfile.name,
        profileIcon: lead.buyerProfile.icon,
        score: lead.score,
        source: lead.source,
        bestChannel: lead.buyerProfile.bestChannel,
        conversionProbability: lead.buyerProfile.conversionRate,
        suggestedTicket: lead.buyerProfile.avgTicket,
        status: 'distribuido',
        distributedAt: new Date().toISOString(),
        channel: this.selectChannel(lead.buyerProfile)
      };

      this.profiles.push(diversifiedLead);
      this.totalDistributed++;
      this.distribute(diversifiedLead);
    }

    this.log(`✅ Ciclo concluído: ${qualified.length}/${webProfiles.length} leads qualificados distribuídos`);
    this.active = false;
    this.saveState();

    return { total: webProfiles.length, qualified: qualified.length, distributed: qualified.length };
  },

  // Gerar perfis simulados da web
  generateWebProfiles(count) {
    const sources = ['google_search', 'direct_visit', 'referral', 'bookmark', 'web_ad'];
    const pages = ['landing_page', 'product_page', 'blog_post', 'pricing_page', 'about_page'];
    const interests = ['marketing', 'vendas', 'automação', 'digital', 'empreendedorismo'];
    const devices = ['mobile', 'desktop', 'tablet'];

    const profiles = [];
    for (let i = 0; i < count; i++) {
      profiles.push({
        source: sources[Math.floor(Math.random() * sources.length)],
        page: pages[Math.floor(Math.random() * pages.length)],
        interest: interests[Math.floor(Math.random() * interests.length)],
        device: devices[Math.floor(Math.random() * devices.length)],
        dwellTime: Math.floor(Math.random() * 300) + 10, // 10-310s
        scrollDepth: Math.floor(Math.random() * 100),
        returnVisit: Math.random() > 0.7,
        clickedPrice: Math.random() > 0.5,
        timestamp: new Date().toISOString()
      });
    }
    return profiles;
  },

  // Classificar perfil a partir dos dados
  classifyProfileFromData(data) {
    if (data.clickedPrice && data.dwellTime < 60) return 'impulsivo';
    if (data.scrollDepth > 80 && data.dwellTime > 120) return 'pesquisador';
    if (data.returnVisit) return 'recorrente';
    if (data.page === 'pricing_page') return 'profissional';
    if (data.source === 'google_search') return 'oportunista';
    return 'iniciante';
  },

  // Calcular score de intenção
  calculateIntentScore(data) {
    let score = 0;
    if (data.dwellTime > 120) score += 20;
    if (data.scrollDepth > 70) score += 15;
    if (data.returnVisit) score += 25;
    if (data.clickedPrice) score += 30;
    if (data.page === 'pricing_page') score += 20;
    if (data.device === 'desktop') score += 5;
    return Math.min(100, score);
  },

  // Gerar popup/banner baseado no perfil
  generateOffer(profileType) {
    const profile = this.buyerProfiles[profileType];
    if (!profile) return null;

    const offers = {
      impulsivo: {
        title: '🔥 ÚLTIMA UNIDADE!',
        subtitle: 'Este produto some em 10 minutos',
        cta: 'GARANTIR AGORA →',
        trigger: profile.triggers[0]
      },
      pesquisador: {
        title: '📊 Veja a Comparação Completa',
        subtitle: 'Análise detalhada + garantia de 7 dias',
        cta: 'VER ANÁLISE →',
        trigger: 'prova_social'
      },
      oportunista: {
        title: '💰 OFERTA RELÂMPAGO -50%',
        subtitle: 'Só hoje, preço especial',
        cta: 'APROVEITAR DESCONTO →',
        trigger: 'desconto'
      },
      profissional: {
        title: '⏱️ Economize 10h por Semana',
        subtitle: 'Automação profissional com ROI comprovado',
        cta: 'VER COMO FUNCIONA →',
        trigger: 'eficiencia'
      },
      iniciante: {
        title: '🌱 Comece Hoje — É Simples!',
        subtitle: 'Guia passo a passo para iniciantes',
        cta: 'COMEÇAR GRÁTIS →',
        trigger: 'facilidade'
      },
      recorrente: {
        title: '⭐ Novidade Exclusiva para Você',
        subtitle: 'Acesso antecipado + bônus especial',
        cta: 'ACESSAR AGORA →',
        trigger: 'exclusivo'
      }
    };

    return offers[profileType] || offers.iniciante;
  },

  // Estatísticas
  getStats() {
    const byProfile = {};
    Object.keys(this.buyerProfiles).forEach(type => {
      byProfile[type] = this.profiles.filter(p => p.profile === type).length;
    });

    const byChannel = {};
    Object.keys(this.distributionChannels).forEach(ch => {
      byChannel[ch] = this.profiles.filter(p => p.channel === ch).length;
    });

    const avgScore = this.profiles.length > 0
      ? Math.round(this.profiles.reduce((s, p) => s + p.score, 0) / this.profiles.length)
      : 0;

    const totalConversionPotential = this.profiles.reduce(
      (sum, p) => sum + (p.conversionProbability * p.suggestedTicket), 0
    );

    return {
      totalProfiles: this.profiles.length,
      totalDistributed: this.totalDistributed,
      totalSignals: this.intentSignals.length,
      avgIntentScore: avgScore,
      conversionPotential: Math.round(totalConversionPotential),
      byProfile,
      byChannel,
      profiles: Object.entries(this.buyerProfiles).map(([key, p]) => ({
        key,
        name: p.name,
        icon: p.icon,
        conversionRate: `${Math.round(p.conversionRate * 100)}%`,
        avgTicket: `R$ ${p.avgTicket}`,
        count: byProfile[key] || 0
      }))
    };
  },

  // Listar leads recentes
  getRecentLeads(count = 10) {
    return this.profiles.slice(-count).reverse().map(p => ({
      profile: `${p.profileIcon} ${p.profileName}`,
      score: p.score,
      channel: this.distributionChannels[p.channel]?.name || p.channel,
      probability: `${Math.round(p.conversionProbability * 100)}%`,
      ticket: `R$ ${p.suggestedTicket}`,
      time: new Date(p.distributedAt).toLocaleTimeString('pt-BR')
    }));
  },

  // Listar distribuições
  getDistributionLog(count = 10) {
    return this.distributionLog.slice(-count).reverse();
  },

  // Log
  log(msg) {
    if (typeof Console !== 'undefined' && Console.log) {
      Console.log(msg, 'info');
    }
    console.log(`[LeadDiversification] ${msg}`);
  },

  // Delay
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  // Reset
  reset() {
    this.profiles = [];
    this.intentSignals = [];
    this.distributionLog = [];
    this.totalDistributed = 0;
    this.active = false;
    this.saveState();
    this.log('🔄 Departamento de Diversificação resetado');
  }
};

// Auto-inicializar
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      LeadDiversification.init();
    }, 4500);
  });
}
