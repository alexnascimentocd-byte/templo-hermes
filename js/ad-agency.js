/* ===== AD AGENCY.JS =====
   Agência de Anúncios e Marketing
   - Targeting binário: identifica padrões na rede
   - Mapeia anúncio certo → pessoa certa → momento certo
   - Conversão automática quando detecta interesse
   - Integra LeadDiversification + SalesOffice + CampaignEngine + LandingGenerator
*/

const AdAgency = {
  active: false,
  ads: [],
  impressions: [],
  clicks: [],
  conversions: [],
  patterns: [],
  totalRevenue: 0,

  // Padrões de comportamento binário (sim/não)
  binaryPatterns: {
    // Engajamento
    viewed_price:      { weight: 40, signal: '👁️ Preço visualizado', category: 'intent' },
    clicked_cta:       { weight: 55, signal: '👆 CTA clicado', category: 'intent' },
    scrolled_75:       { weight: 20, signal: '📜 Scroll 75%+', category: 'engagement' },
    spent_60s:         { weight: 15, signal: '⏱️ 60s+ na página', category: 'engagement' },
    returned_visit:    { weight: 35, signal: '🔄 Visita retornada', category: 'intent' },
    shared_content:    { weight: 25, signal: '📤 Compartilhou', category: 'social' },
    
    // Intenção de compra
    added_to_cart:     { weight: 60, signal: '🛒 Adicionou ao carrinho', category: 'purchase' },
    started_checkout:  { weight: 75, signal: '💳 Iniciou checkout', category: 'purchase' },
    abandoned_cart:    { weight: 50, signal: '🚪 Abandonou carrinho', category: 'purchase' },
    copied_pix:        { weight: 80, signal: '🔑 Copiou chave Pix', category: 'purchase' },
    
    // Demográficos
    mobile_user:       { weight: 10, signal: '📱 Mobile', category: 'device' },
    returning_user:    { weight: 20, signal: '👤 Usuário recorrente', category: 'loyalty' },
    whatsapp_click:    { weight: 45, signal: '💬 Clicou WhatsApp', category: 'channel' },
    
    // Timing
    business_hours:    { weight: 5, signal: '🕐 Horário comercial', category: 'timing' },
    weekend:           { weight: 8, signal: '📅 Final de semana', category: 'timing' },
    night_browse:      { weight: 12, signal: '🌙 Navegação noturna', category: 'timing' }
  },

  // Criativos de anúncio por perfil
  adCreatives: {
    // Para quem tá começando a pesquisar (frio)
    awareness: {
      name: 'Topo de Funil — Atenção',
      icon: '👀',
      stage: 'cold',
      formats: [
        { type: 'banner', headline: '💡 Você sabia que pode automatizar isso?', body: 'Descubra como economizar horas por dia', cta: 'Saiba Mais' },
        { type: 'popup', headline: '🎯 Dica Gratuita', body: 'Inscreva-se para receber dicas exclusivas', cta: 'Quero Receber' },
        { type: 'push', headline: '🏛️ Novidade do Templo', body: 'Conteúdo novo disponível', cta: 'Ver Agora' }
      ]
    },
    
    // Para quem tá avaliando (morno)
    consideration: {
      name: 'Meio de Funil — Interesse',
      icon: '🤔',
      stage: 'warm',
      formats: [
        { type: 'banner', headline: '📊 Compare e veja a diferença', body: 'Veja como outros conseguiram resultados', cta: 'Ver Comparação' },
        { type: 'popup', headline: '⭐ Depoimentos Reais', body: 'Veja o que nossos clientes dizem', cta: 'Ler Depoimentos' },
        { type: 'push', headline: '🔥 Oferta Especial', body: 'Desconto por tempo limitado', cta: 'Aproveitar' }
      ]
    },
    
    // Para quem tá pronto pra comprar (quente)
    decision: {
      name: 'Fundo de Funil — Decisão',
      icon: '💰',
      stage: 'hot',
      formats: [
        { type: 'banner', headline: '🚨 ÚLTIMAS VAGAS!', body: 'Oferta expira em breve — não perca', cta: 'COMPRAR AGORA' },
        { type: 'popup', headline: '🎁 Bônus Exclusivo', body: 'Compre agora e ganhe bônus especial', cta: 'Garantir Bônus' },
        { type: 'exit_intent', headline: '⚡ ESPERA!', body: 'Queira um desconto extra de 10%?', cta: 'SIM, QUERO!' }
      ]
    },
    
    // Para quem abandonou (recuperação)
    recovery: {
      name: 'Recuperação — Retargeting',
      icon: '🔄',
      stage: 'abandoned',
      formats: [
        { type: 'push', headline: '🛒 Você esqueceu algo!', body: 'Seu item ainda está disponível', cta: 'Voltar ao Carrinho' },
        { type: 'popup', headline: '💔 Por que saiu?', body: 'Pode ser que tenha uma dúvida — vamos ajudar', cta: 'Falar no WhatsApp' },
        { type: 'banner', headline: '⏰ Última chance', body: 'Seu desconto expira em 24h', cta: 'Aproveitar Agora' }
      ]
    }
  },

  // Campanhas de anúncio ativas
  campaigns: [],

  // Inicializar
  init() {
    this.loadState();
    this.setupPatternTracking();
    this.active = true;
    this.log('📢 Agência de Anúncios iniciada — targeting binário ativo');
    return this;
  },

  // Carregar estado
  loadState() {
    try {
      const saved = localStorage.getItem('ad_agency_state');
      if (saved) {
        const state = JSON.parse(saved);
        this.ads = state.ads || [];
        this.impressions = state.impressions || [];
        this.clicks = state.clicks || [];
        this.conversions = state.conversions || [];
        this.patterns = state.patterns || [];
        this.totalRevenue = state.totalRevenue || 0;
        this.campaigns = state.campaigns || [];
      }
    } catch (e) {}
  },

  // Salvar estado
  saveState() {
    try {
      localStorage.setItem('ad_agency_state', JSON.stringify({
        ads: this.ads.slice(-50),
        impressions: this.impressions.slice(-200),
        clicks: this.clicks.slice(-100),
        conversions: this.conversions.slice(-50),
        patterns: this.patterns.slice(-100),
        campaigns: this.campaigns.slice(-20),
        totalRevenue: this.totalRevenue,
        lastUpdate: Date.now()
      }));
    } catch (e) {}
  },

  // Configurar rastreamento de padrões
  setupPatternTracking() {
    if (typeof window === 'undefined') return;

    // Scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', () => {
      const pct = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      if (pct > maxScroll) {
        maxScroll = pct;
        if (pct >= 75) this.recordPattern('scrolled_75');
      }
    });

    // Tempo na página
    let startTime = Date.now();
    setInterval(() => {
      if (Date.now() - startTime > 60000) this.recordPattern('spent_60s');
    }, 60000);

    // Clicks em CTAs
    document.addEventListener('click', (e) => {
      const target = e.target.closest('a, button, [data-cta]');
      if (target) {
        const text = target.textContent?.toLowerCase() || '';
        if (text.includes('comprar') || text.includes('buy')) this.recordPattern('clicked_cta');
        if (text.includes('pix')) this.recordPattern('copied_pix');
        if (text.includes('whatsapp') || text.includes('wa.me')) this.recordPattern('whatsapp_click');
        if (text.includes('preço') || text.includes('price')) this.recordPattern('viewed_price');
      }
    });

    // Device
    if (/Mobile/i.test(navigator.userAgent)) this.recordPattern('mobile_user');

    // Timing
    const hour = new Date().getHours();
    if (hour >= 9 && hour <= 18) this.recordPattern('business_hours');
    if (hour >= 22 || hour <= 5) this.recordPattern('night_browse');
    const day = new Date().getDay();
    if (day === 0 || day === 6) this.recordPattern('weekend');

    // Return visit
    if (localStorage.getItem('ad_agency_visited')) {
      this.recordPattern('returned_visit');
      this.recordPattern('returning_user');
    }
    localStorage.setItem('ad_agency_visited', 'true');
  },

  // Registrar padrão detectado
  recordPattern(patternName) {
    const def = this.binaryPatterns[patternName];
    if (!def) return;

    // Evitar duplicatas no mesmo ciclo
    const recent = this.patterns.slice(-20).find(p => p.name === patternName);
    if (recent && Date.now() - new Date(recent.timestamp).getTime() < 60000) return;

    this.patterns.push({
      name: patternName,
      weight: def.weight,
      signal: def.signal,
      category: def.category,
      timestamp: new Date().toISOString()
    });

    // Calcular score e verificar se deve mostrar anúncio
    const score = this.calculateIntentScore();
    if (score > 30) {
      this.autoMatchAndShow(score);
    }
  },

  // Calcular score de intenção
  calculateIntentScore() {
    const recent = this.patterns.slice(-15);
    const uniqueNames = [...new Set(recent.map(p => p.name))];
    return uniqueNames.reduce((sum, name) => {
      const def = this.binaryPatterns[name];
      return sum + (def?.weight || 0);
    }, 0);
  },

  // Auto-match: encontra o anúncio certo e mostra
  autoMatchAndShow(score) {
    let stage;
    if (score >= 70) stage = 'decision';
    else if (score >= 45) stage = 'consideration';
    else if (score >= 25) stage = 'awareness';
    else return;

    const creative = this.adCreatives[stage];
    if (!creative) return;

    // Selecionar formato
    const format = creative.formats[Math.floor(Math.random() * creative.formats.length)];

    // Registrar impressão
    const impression = {
      id: `imp_${Date.now()}`,
      stage: stage,
      format: format.type,
      headline: format.headline,
      score: score,
      patterns: this.patterns.slice(-5).map(p => p.signal),
      timestamp: new Date().toISOString()
    };
    this.impressions.push(impression);

    // Mostrar anúncio
    this.showAd(format, stage, impression.id);

    this.log(`${creative.icon} Anúncio exibido [${stage}] score:${score} → "${format.headline}"`);
  },

  // Mostrar anúncio na tela
  showAd(format, stage, impressionId) {
    // Criar elemento visual
    const ad = document.createElement('div');
    ad.id = `ad-overlay-${impressionId}`;
    ad.style.cssText = `
      position: fixed; bottom: 20px; right: 20px; z-index: 9999;
      background: linear-gradient(135deg, #1a0a2e, #0a1a2e);
      border: 2px solid ${stage === 'decision' ? '#ff6b6b' : stage === 'consideration' ? '#ffa94d' : '#4a8aff'};
      border-radius: 12px; padding: 20px; max-width: 320px;
      font-family: -apple-system, sans-serif; color: #fff;
      box-shadow: 0 10px 40px rgba(0,0,0,0.5);
      animation: adSlideIn 0.3s ease-out;
    `;

    const color = stage === 'decision' ? '#ff6b6b' : stage === 'consideration' ? '#ffa94d' : '#4a8aff';

    ad.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:10px;">
        <span style="font-size:18px;font-weight:bold;color:${color};">${format.headline}</span>
        <button class="ad-close" style="background:none;border:none;color:#666;cursor:pointer;font-size:16px;">✕</button>
      </div>
      <p style="color:#aaa;font-size:13px;margin-bottom:15px;">${format.body}</p>
      <button class="ad-cta" style="
        width:100%;padding:12px;border:none;border-radius:8px;
        background:${color};color:#fff;font-size:14px;font-weight:bold;
        cursor:pointer;
      ">${format.cta}</button>
      <div style="text-align:center;margin-top:8px;color:#444;font-size:10px;">Templo de Hermes 🏛️</div>
    `;

    // Adicionar CSS de animação
    if (!document.getElementById('ad-animation-style')) {
      const style = document.createElement('style');
      style.id = 'ad-animation-style';
      style.textContent = `
        @keyframes adSlideIn { from { transform: translateY(100px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes adSlideOut { from { transform: translateY(0); opacity: 1; } to { transform: translateY(100px); opacity: 0; } }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(ad);

    // Fechar
    ad.querySelector('.ad-close').addEventListener('click', () => {
      ad.style.animation = 'adSlideOut 0.3s ease-in forwards';
      setTimeout(() => ad.remove(), 300);
    });

    // CTA click → converter
    ad.querySelector('.ad-cta').addEventListener('click', () => {
      this.handleClick(impressionId, stage);
      ad.remove();
    });

    // Auto-close 15s (urgente fica até interagir)
    if (stage !== 'decision') {
      setTimeout(() => {
        if (ad.parentElement) {
          ad.style.animation = 'adSlideOut 0.3s ease-in forwards';
          setTimeout(() => ad.remove(), 300);
        }
      }, 15000);
    }
  },

  // Processar clique no anúncio
  handleClick(impressionId, stage) {
    const click = {
      id: `click_${Date.now()}`,
      impressionId,
      stage,
      timestamp: new Date().toISOString()
    };
    this.clicks.push(click);

    this.log(`👆 Clique registrado [${stage}] — iniciando conversão automática`);

    // Iniciar conversão automática
    this.autoConvert(stage);
  },

  // Conversão automática baseada no estágio
  autoConvert(stage) {
    // Determinar produto e canal
    const conversionMap = {
      awareness: {
        action: 'capture_lead',
        channel: 'landing_page',
        product: 'Pack 550+ Scripts',
        price: 19.90,
        url: 'pay.kiwify.com.br/qC8YHzK'
      },
      consideration: {
        action: 'send_proposal',
        channel: 'whatsapp',
        product: 'Marketing Digital + Mentalidade',
        price: 27.90,
        url: 'pay.kiwify.com.br/D4NExoo'
      },
      decision: {
        action: 'close_sale',
        channel: 'pix',
        product: 'Pack 550+ Scripts',
        price: 19.90,
        pixKey: '58af96e5-9949-41be-9546-c074b206cbcf'
      },
      recovery: {
        action: 'recover_cart',
        channel: 'whatsapp',
        product: 'Primeira Venda em 48h',
        price: 9.90,
        url: 'pay.kiwify.com.br/xcL4QxC'
      }
    };

    const plan = conversionMap[stage];
    if (!plan) return;

    // Executar ação de conversão
    switch (plan.action) {
      case 'capture_lead':
        this.showLandingPage(plan);
        break;
      case 'send_proposal':
        this.sendWhatsAppProposal(plan);
        break;
      case 'close_sale':
        this.showPixCheckout(plan);
        break;
      case 'recover_cart':
        this.sendWhatsAppProposal(plan);
        break;
    }

    // Registrar conversão
    const conversion = {
      id: `conv_${Date.now()}`,
      stage: stage,
      action: plan.action,
      product: plan.product,
      price: plan.price,
      channel: plan.channel,
      timestamp: new Date().toISOString()
    };
    this.conversions.push(conversion);
    this.totalRevenue += plan.price;

    // Notificar via PresenceEngine
    if (typeof PresenceEngine !== 'undefined') {
      PresenceEngine.notify('lead_quente', {
        title: `Conversão iniciada: ${plan.product}`,
        body: `Estágio: ${stage} | Canal: ${plan.channel} | R$ ${plan.price}`
      });
    }

    this.saveState();
  },

  // Mostrar landing page de captura
  showLandingPage(plan) {
    if (typeof LandingPageGenerator !== 'undefined') {
      const page = LandingPageGenerator.generate({
        name: `LP Auto: ${plan.product}`,
        title: plan.product,
        price: plan.price.toString(),
        pixKey: '58af96e5-9949-41be-9546-c074b206cbcf',
        kiwifyUrl: plan.url
      });
      
      const blob = new Blob([page.html], { type: 'text/html' });
      window.open(URL.createObjectURL(blob), '_blank');
      this.log(`🌐 Landing page aberta: ${plan.product}`);
    }
  },

  // Enviar proposta via WhatsApp
  sendWhatsAppProposal(plan) {
    const msg = encodeURIComponent(
      `🏛️ Olá! Vi que você se interessou por "${plan.product}".\n\n` +
      `💰 Valor: R$ ${plan.price}\n` +
      `🔗 Compre aqui: https://${plan.url}\n\n` +
      `Ou pague via Pix: 58af96e5-9949-41be-9546-c074b206cbcf\n\n` +
      `Dúvidas? Responda aqui! 😊`
    );
    window.open(`https://wa.me/?text=${msg}`, '_blank');
    this.log(`💬 WhatsApp aberto com proposta: ${plan.product}`);
  },

  // Mostrar checkout Pix
  showPixCheckout(plan) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position:fixed;top:0;left:0;right:0;bottom:0;z-index:99999;
      background:rgba(0,0,0,0.9);display:flex;align-items:center;justify-content:center;
      font-family:-apple-system,sans-serif;
    `;

    overlay.innerHTML = `
      <div style="background:#1a1a2e;border:2px solid #32bcad;border-radius:16px;padding:30px;max-width:400px;text-align:center;color:#fff;">
        <h2 style="color:#32bcad;margin-bottom:10px;">🔑 Pagamento Pix</h2>
        <p style="color:#aaa;margin-bottom:20px;">${plan.product}</p>
        <div style="font-size:36px;font-weight:bold;color:#32bcad;margin:20px 0;">R$ ${plan.price}</div>
        <div style="background:#0a0a1a;padding:15px;border-radius:8px;font-family:monospace;word-break:break-all;margin:15px 0;border:1px solid #2a2a4a;font-size:12px;">
          ${plan.pixKey}
        </div>
        <button onclick="navigator.clipboard.writeText('${plan.pixKey}');this.textContent='✅ Copiado!'" style="
          width:100%;padding:14px;border:none;border-radius:8px;
          background:#32bcad;color:#fff;font-size:16px;font-weight:bold;
          cursor:pointer;margin:10px 0;
        ">📋 COPIAR CHAVE PIX</button>
        <p style="color:#4aff8a;margin-top:15px;font-size:13px;">✅ Após pagar, envie o comprovante:</p>
        <a href="https://wa.me/?text=${encodeURIComponent('Paguei! Comprovante:')}" target="_blank" style="
          display:block;width:100%;padding:12px;border:none;border-radius:8px;
          background:#25d366;color:#fff;font-size:14px;font-weight:bold;
          text-decoration:none;margin-top:10px;
        ">📤 ENVIAR COMPROVANTE</a>
        <button onclick="this.closest('div').parentElement.remove()" style="
          background:none;border:1px solid #666;color:#666;padding:8px 20px;
          border-radius:8px;cursor:pointer;margin-top:15px;font-size:12px;
        ">Fechar</button>
      </div>
    `;

    document.body.appendChild(overlay);
    this.log(`💰 Checkout Pix exibido: ${plan.product} → R$ ${plan.price}`);
  },

  // Executar ciclo completo da agência
  async runAgencyCycle() {
    this.active = true;
    this.log('📢 Executando ciclo da Agência de Anúncios...');

    // 1. Analisar padrões existentes
    const score = this.calculateIntentScore();
    this.log(`📊 Score de intenção atual: ${score}`);

    // 2. Identificar oportunidades de targeting
    const opportunities = this.identifyOpportunities();
    this.log(`🎯 ${opportunities.length} oportunidades identificadas`);

    // 3. Criar campanhas para cada oportunidade
    const created = [];
    for (const opp of opportunities.slice(0, 3)) {
      const campaign = this.createCampaign(opp);
      if (campaign) created.push(campaign);
      await this.delay(500);
    }

    // 4. Executar campanhas
    for (const camp of created) {
      await this.executeCampaign(camp);
      await this.delay(800);
    }

    this.log(`✅ Ciclo concluído: ${created.length} campanhas criadas e executadas`);
    this.active = false;
    this.saveState();

    return { opportunities: opportunities.length, campaigns: created.length };
  },

  // Identificar oportunidades de targeting
  identifyOpportunities() {
    const opportunities = [];
    const categories = {};

    // Agrupar padrões por categoria
    this.patterns.slice(-30).forEach(p => {
      const def = this.binaryPatterns[p.name];
      if (def) {
        if (!categories[def.category]) categories[def.category] = [];
        categories[def.category].push(p);
      }
    });

    // Criar oportunidades baseadas em categorias ativas
    if (categories.intent?.length >= 2) {
      opportunities.push({ type: 'high_intent', stage: 'decision', priority: 1 });
    }
    if (categories.purchase?.length >= 1) {
      opportunities.push({ type: 'purchase_signal', stage: 'recovery', priority: 1 });
    }
    if (categories.engagement?.length >= 2) {
      opportunities.push({ type: 'engaged_user', stage: 'consideration', priority: 2 });
    }
    if (categories.social?.length >= 1) {
      opportunities.push({ type: 'social_proof', stage: 'consideration', priority: 2 });
    }

    // Sempre criar awareness se não tem padrões suficientes
    if (this.patterns.length < 5) {
      opportunities.push({ type: 'cold_traffic', stage: 'awareness', priority: 3 });
    }

    return opportunities.sort((a, b) => a.priority - b.priority);
  },

  // Criar campanha de anúncio
  createCampaign(opportunity) {
    const creative = this.adCreatives[opportunity.stage];
    if (!creative) return null;

    const campaign = {
      id: `camp_ad_${Date.now()}`,
      stage: opportunity.stage,
      type: opportunity.type,
      name: creative.name,
      icon: creative.icon,
      formats: creative.formats,
      status: 'ativa',
      stats: { impressions: 0, clicks: 0, conversions: 0, revenue: 0 },
      createdAt: new Date().toISOString()
    };

    this.campaigns.push(campaign);
    return campaign;
  },

  // Executar campanha
  async executeCampaign(campaign) {
    const impressions = Math.floor(Math.random() * 50) + 20;
    const clicks = Math.floor(impressions * 0.15);
    
    campaign.stats.impressions += impressions;
    campaign.stats.clicks += clicks;

    this.log(`${campaign.icon} Campanha "${campaign.name}": ${impressions} impressões, ${clicks} cliques`);
  },

  // Estatísticas
  getStats() {
    return {
      patterns: {
        total: this.patterns.length,
        unique: [...new Set(this.patterns.map(p => p.name))].length,
        score: this.calculateIntentScore()
      },
      ads: {
        impressions: this.impressions.length,
        clicks: this.clicks.length,
        ctr: this.impressions.length > 0 
          ? Math.round((this.clicks.length / this.impressions.length) * 100) 
          : 0
      },
      conversions: {
        total: this.conversions.length,
        revenue: this.totalRevenue,
        byStage: {
          awareness: this.conversions.filter(c => c.stage === 'awareness').length,
          consideration: this.conversions.filter(c => c.stage === 'consideration').length,
          decision: this.conversions.filter(c => c.stage === 'decision').length,
          recovery: this.conversions.filter(c => c.stage === 'recovery').length
        }
      },
      campaigns: {
        total: this.campaigns.length,
        active: this.campaigns.filter(c => c.status === 'ativa').length
      }
    };
  },

  // Listar padrões recentes
  getRecentPatterns(count = 10) {
    return this.patterns.slice(-count).reverse().map(p => ({
      signal: p.signal,
      weight: p.weight,
      category: p.category,
      time: new Date(p.timestamp).toLocaleTimeString('pt-BR')
    }));
  },

  // Log
  log(msg) {
    if (typeof Console !== 'undefined' && Console.log) {
      Console.log(msg, 'info');
    }
    console.log(`[AdAgency] ${msg}`);
  },

  // Delay
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  // Reset
  reset() {
    this.ads = [];
    this.impressions = [];
    this.clicks = [];
    this.conversions = [];
    this.patterns = [];
    this.campaigns = [];
    this.totalRevenue = 0;
    this.active = false;
    this.saveState();
    this.log('🔄 Agência de Anúncios resetada');
  }
};

// Auto-inicializar
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      AdAgency.init();
    }, 6500);
  });
}
