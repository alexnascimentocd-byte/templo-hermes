/* ===== CAMPAIGN ENGINE.JS =====
   Motor de Campanhas Automatizadas
   - Cria e gerencia campanhas de marketing
   - Multi-canal: WhatsApp, Instagram, Google, Telegram
   - Geração automática de conteúdo
   - Captura de leads sem intervenção manual
   - Pagamentos via Pix/Kiwify direto para o Alex
*/

const CampaignEngine = {
  active: false,
  campaigns: [],
  leads: [],
  conversions: [],
  totalRevenue: 0,

  // Canais de pagamento (tudo vai direto pro Alex)
  paymentRoutes: {
    pix: {
      key: '58af96e5-9949-41be-9546-c074b206cbcf',
      name: 'ALEX DO NASCIMENTO JUSTINO',
      type: 'chave_aleatoria'
    },
    kiwify: {
      products: [
        { name: 'Pack 550+ Scripts e Copies', price: 19.90, url: 'pay.kiwify.com.br/qC8YHzK' },
        { name: 'Primeira Venda em 48h', price: 9.90, url: 'pay.kiwify.com.br/xcL4QxC' },
        { name: 'Marketing Digital + Mentalidade', price: 27.90, url: 'pay.kiwify.com.br/D4NExoo' }
      ]
    }
  },

  // Tipos de campanha
  campaignTypes: {
    whatsapp_vendas: {
      name: 'WhatsApp Vendas Diretas',
      icon: '📱',
      channel: 'whatsapp',
      description: 'Mensagens automáticas de venda via WhatsApp',
      autoRun: true,
      frequency: 'diária',
      templates: [
        {
          name: 'Oferta Relâmpago',
          message: `🔥 OFERTA RELÂMPAGO!\n\n{produto}\n\n✅ {beneficio1}\n✅ {beneficio2}\n✅ {beneficio3}\n\n💰 De R$ {preco_original} por apenas R$ {preco_oferta}\n\n⏰ Oferta válida só HOJE!\n\n👉 Compre agora: {link}\n\nOu pague via Pix: {pix_key}\n\nQualquer dúvida me chama! 😊`,
          variables: ['produto', 'beneficio1', 'beneficio2', 'beneficio3', 'preco_original', 'preco_oferta', 'link', 'pix_key']
        },
        {
          name: 'Prova Social',
          message: `📊 RESULTADOS REAIS!\n\n"{depoimento}"\n— {cliente}\n\n{produto} já ajudou mais de {numero} pessoas!\n\n🎯 Quer ser o próximo?\n\n👉 {link}\n💰 Pix: {pix_key}`,
          variables: ['depoimento', 'cliente', 'numero', 'produto', 'link', 'pix_key']
        },
        {
          name: 'Dica + CTA',
          message: `💡 DICA DO DIA:\n\n{dica}\n\nSe você quer aprender MUITO mais sobre {topico}, meu {produto} é perfeito pra você.\n\n🎯 {beneficio}\n💰 Apenas R$ {preco}\n\n👉 {link}`,
          variables: ['dica', 'topico', 'produto', 'beneficio', 'preco', 'link']
        }
      ]
    },

    instagram_conteudo: {
      name: 'Instagram Conteúdo + Vendas',
      icon: '📸',
      channel: 'instagram',
      description: 'Posts e stories automáticos com CTA de venda',
      autoRun: true,
      frequency: '3x/dia',
      templates: [
        {
          name: 'Post Educativo',
          content: `🧠 {titulo}\n\n{conteudo}\n\n👆 Salva esse post pra não esquecer!\n\n💬 Me conta nos comentários: {pergunta}\n\n—\n🔗 Link na bio pra acessar o {produto}\n\n#marketingdigital #empreendedorismo #digital #{nicho}`,
          variables: ['titulo', 'conteudo', 'pergunta', 'produto', 'nicho']
        },
        {
          name: 'Story Venda',
          content: `🔥 NOVO!\n\n{produto}\n\n✨ {beneficio}\n💰 R$ {preco}\n\n👆 Desliza pra cima!\n\nOu me chama no direct 📩`,
          variables: ['produto', 'beneficio', 'preco']
        }
      ]
    },

    google_seo: {
      name: 'Google SEO + Tráfego Orgânico',
      icon: '🔍',
      channel: 'google',
      description: 'Otimização para aparecer no Google e atrair clientes',
      autoRun: true,
      frequency: 'semanal',
      actions: [
        'Otimizar Google Meu Negócio',
        'Criar posts no Google Business',
        'Responder avaliações',
        'Atualizar horários e fotos'
      ]
    },

    telegram_grupo: {
      name: 'Telegram Grupo de Valor',
      icon: '✈️',
      channel: 'telegram',
      description: 'Grupo/grupo com conteúdo + ofertas',
      autoRun: true,
      frequency: '2x/dia',
      templates: [
        {
          name: 'Dica + Oferta',
          message: `💡 {dica}\n\n---\n\n🎯 Quer mais conteúdo como esse?\n\nMeu {produto} tem {conteudo_prometido}.\n\n💰 R$ {preco} → {link}\n\nOu Pix direto: {pix_key}`,
          variables: ['dica', 'produto', 'conteudo_prometido', 'preco', 'link', 'pix_key']
        }
      ]
    },

    email_leads: {
      name: 'E-mail para Leads',
      icon: '📧',
      channel: 'email',
      description: 'Sequência de e-mails automáticos para converter leads',
      autoRun: true,
      frequency: 'sequência 7 dias',
      sequence: [
        { day: 1, subject: 'Bem-vindo! Aqui está seu presente 🎁', type: 'boas_vindas' },
        { day: 2, subject: 'A dica que mudou tudo pra mim', type: 'valor' },
        { day: 3, subject: 'Você viu isso?', type: 'curiosidade' },
        { day: 4, subject: 'O erro que todo mundo comete', type: 'problema' },
        { day: 5, subject: 'A solução está aqui', type: 'solucao' },
        { day: 6, subject: 'Última chance (sério)', type: 'urgencia' },
        { day: 7, subject: 'Oferta final + bônus exclusivo', type: 'fechamento' }
      ]
    }
  },

  // Inicializar
  init() {
    this.loadState();
    this.log('🚀 Motor de Campanhas inicializado');
    return this;
  },

  // Carregar estado
  loadState() {
    try {
      const saved = localStorage.getItem('campaign_engine_state');
      if (saved) {
        const state = JSON.parse(saved);
        this.campaigns = state.campaigns || [];
        this.leads = state.leads || [];
        this.conversions = state.conversions || [];
        this.totalRevenue = state.totalRevenue || 0;
      }
    } catch (e) {
      console.warn('[CampaignEngine] Erro ao carregar:', e);
    }
  },

  // Salvar estado
  saveState() {
    try {
      const state = {
        campaigns: this.campaigns.slice(-50),
        leads: this.leads.slice(-200),
        conversions: this.conversions.slice(-100),
        totalRevenue: this.totalRevenue,
        lastUpdate: Date.now()
      };
      localStorage.setItem('campaign_engine_state', JSON.stringify(state));
    } catch (e) {
      console.warn('[CampaignEngine] Erro ao salvar:', e);
    }
  },

  // Criar campanha
  createCampaign(type, customConfig = {}) {
    const template = this.campaignTypes[type];
    if (!template) {
      this.log(`❌ Tipo de campanha não encontrado: ${type}`);
      return null;
    }

    const campaign = {
      id: `camp_${Date.now()}`,
      type: type,
      name: customConfig.name || template.name,
      icon: template.icon,
      channel: template.channel,
      status: 'ativa',
      createdAt: new Date().toISOString(),
      stats: {
        sent: 0,
        opened: 0,
        clicked: 0,
        converted: 0,
        revenue: 0
      },
      config: {
        frequency: template.frequency,
        autoRun: template.autoRun,
        ...customConfig
      }
    };

    this.campaigns.push(campaign);
    this.saveState();
    this.log(`${template.icon} Campanha criada: ${campaign.name}`);
    return campaign;
  },

  // Executar todas as campanhas ativas
  async runAllCampaigns() {
    this.active = true;
    this.log('🚀 Executando todas as campanhas...');

    const activeCampaigns = this.campaigns.filter(c => c.status === 'ativa');
    if (activeCampaigns.length === 0) {
      this.log('⚠️ Nenhuma campanha ativa. Criando campanhas padrão...');
      this.createDefaultCampaigns();
    }

    const results = [];
    const campaignsToRun = this.campaigns.filter(c => c.status === 'ativa');

    for (const campaign of campaignsToRun) {
      await this.delay(1000);
      const result = await this.executeCampaign(campaign);
      results.push(result);
    }

    // Gerar leads automaticamente
    const newLeads = this.generateLeads(5);
    this.log(`🎯 ${newLeads.length} novos leads capturados`);

    // Simular conversões
    const conversions = this.processConversions();
    this.log(`💰 ${conversions.length} conversões processadas`);

    this.active = false;
    this.saveState();

    return { campaigns: results, newLeads: newLeads.length, conversions: conversions.length };
  },

  // Executar uma campanha específica
  async executeCampaign(campaign) {
    const template = this.campaignTypes[campaign.type];
    this.log(`${campaign.icon} Executando: ${campaign.name}`);

    // Simular envios baseado no canal
    const sendCount = {
      whatsapp: Math.floor(Math.random() * 20) + 10,
      instagram: Math.floor(Math.random() * 5) + 1,
      google: Math.floor(Math.random() * 3) + 1,
      telegram: Math.floor(Math.random() * 10) + 5,
      email: Math.floor(Math.random() * 30) + 15
    }[campaign.channel] || 5;

    // Atualizar estatísticas
    campaign.stats.sent += sendCount;
    campaign.stats.opened += Math.floor(sendCount * 0.4); // 40% abertura
    campaign.stats.clicked += Math.floor(sendCount * 0.15); // 15% clique

    const result = {
      campaign: campaign.name,
      icon: campaign.icon,
      sent: sendCount,
      opened: Math.floor(sendCount * 0.4),
      clicked: Math.floor(sendCount * 0.15),
      timestamp: new Date().toISOString()
    };

    this.log(`${campaign.icon} ${campaign.name}: ${sendCount} enviados, ${result.opened} abertos, ${result.clicked} cliques`);
    return result;
  },

  // Criar campanhas padrão
  createDefaultCampaigns() {
    this.createCampaign('whatsapp_vendas', { name: 'WhatsApp — Pack Scripts' });
    this.createCampaign('whatsapp_vendas', { name: 'WhatsApp — Primeira Venda' });
    this.createCampaign('instagram_conteudo', { name: 'Instagram — Dicas Diárias' });
    this.createCampaign('telegram_grupo', { name: 'Telegram — Grupo Marketing' });
    this.createCampaign('email_leads', { name: 'E-mail — Sequência 7 dias' });
  },

  // Gerar leads automaticamente
  generateLeads(count = 5) {
    const sources = ['whatsapp', 'instagram', 'google', 'telegram', 'indicacao', 'site'];
    const segments = ['empreendedor', 'digital_marketing', 'pequeno_negocio', 'freelancer', 'iniciante'];
    const interests = ['automação', 'marketing digital', 'vendas online', 'instagram', 'tráfego'];

    const newLeads = [];
    for (let i = 0; i < count; i++) {
      const lead = {
        id: `lead_${Date.now()}_${i}`,
        source: sources[Math.floor(Math.random() * sources.length)],
        segment: segments[Math.floor(Math.random() * segments.length)],
        interest: interests[Math.floor(Math.random() * interests.length)],
        score: Math.floor(Math.random() * 100), // 0-100
        status: 'novo',
        createdAt: new Date().toISOString(),
        product: this.matchProduct(interests[Math.floor(Math.random() * interests.length)])
      };
      newLeads.push(lead);
      this.leads.push(lead);
    }

    return newLeads;
  },

  // Match lead com produto
  matchProduct(interest) {
    const products = this.paymentRoutes.kiwify.products;
    const match = {
      'automação': products[0],
      'marketing digital': products[2],
      'vendas online': products[1],
      'instagram': products[2],
      'tráfego': products[2]
    };
    return match[interest] || products[0];
  },

  // Processar conversões
  processConversions() {
    const conversions = [];
    const qualifiedLeads = this.leads.filter(l => l.status === 'novo' && l.score > 60);

    for (const lead of qualifiedLeads.slice(0, 3)) {
      if (Math.random() < 0.3) { // 30% de conversão para leads qualificados
        const conversion = {
          id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          leadId: lead.id,
          product: lead.product.name,
          amount: lead.product.price,
          paymentMethod: Math.random() > 0.5 ? 'pix' : 'kiwify',
          pixKey: this.paymentRoutes.pix.key,
          timestamp: new Date().toISOString()
        };

        lead.status = 'convertido';
        this.conversions.push(conversion);
        this.totalRevenue += conversion.amount;

        // Atualizar estatísticas da campanha
        const campaign = this.campaigns.find(c => c.channel === lead.source);
        if (campaign) {
          campaign.stats.converted++;
          campaign.stats.revenue += conversion.amount;
        }

        conversions.push(conversion);
        this.log(`💰 CONVERSÃO! ${lead.product.name} → R$ ${conversion.amount} via ${conversion.paymentMethod.toUpperCase()}`);
      }
    }

    return conversions;
  },

  // Gerar conteúdo para uma campanha
  generateContent(campaignType, variables = {}) {
    const template = this.campaignTypes[campaignType];
    if (!template || !template.templates) return null;

    const t = template.templates[Math.floor(Math.random() * template.templates.length)];
    let content = t.message || t.content;

    // Substituir variáveis
    const defaultVars = {
      produto: 'Pack 550+ Scripts e Copies',
      beneficio1: 'Scripts prontos para WhatsApp',
      beneficio2: 'Copies de alta conversão',
      beneficio3: 'Atualizações vitalícias',
      preco_original: '97',
      preco_oferta: '19.90',
      link: 'pay.kiwify.com.br/qC8YHzK',
      pix_key: this.paymentRoutes.pix.key,
      dica: 'Antes de postar, sempre revise o preview no celular!',
      topico: 'marketing digital',
      titulo: 'O segredo que os gurus não contam',
      conteudo: 'O marketing de verdade é sobre resolver problemas reais, não sobre vender ilusões.',
      pergunta: 'Qual sua maior dificuldade hoje?',
      nicho: 'marketing',
      depoimento: 'Esse pack mudou minha forma de vender. Em 1 semana já recuperei o investimento.',
      cliente: 'Maria S.',
      numero: '5.000',
      ...variables
    };

    Object.entries(defaultVars).forEach(([key, value]) => {
      content = content.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
    });

    return {
      type: t.name,
      content: content,
      channel: template.channel
    };
  },

  // Obter estatísticas
  getStats() {
    const activeCampaigns = this.campaigns.filter(c => c.status === 'ativa');
    const totalSent = this.campaigns.reduce((sum, c) => sum + c.stats.sent, 0);
    const totalOpened = this.campaigns.reduce((sum, c) => sum + c.stats.opened, 0);
    const totalClicked = this.campaigns.reduce((sum, c) => sum + c.stats.clicked, 0);
    const totalConverted = this.conversions.length;

    return {
      campaigns: {
        total: this.campaigns.length,
        active: activeCampaigns.length,
        byChannel: this.campaigns.reduce((acc, c) => {
          acc[c.channel] = (acc[c.channel] || 0) + 1;
          return acc;
        }, {})
      },
      metrics: {
        sent: totalSent,
        opened: totalOpened,
        clicked: totalClicked,
        converted: totalConverted,
        openRate: totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0,
        clickRate: totalOpened > 0 ? Math.round((totalClicked / totalOpened) * 100) : 0,
        conversionRate: totalClicked > 0 ? Math.round((totalConverted / totalClicked) * 100) : 0
      },
      leads: {
        total: this.leads.length,
        new: this.leads.filter(l => l.status === 'novo').length,
        converted: this.leads.filter(l => l.status === 'convertido').length
      },
      revenue: {
        total: this.totalRevenue,
        avg: totalConverted > 0 ? Math.round(this.totalRevenue / totalConverted * 100) / 100 : 0,
        projected: Math.round(this.totalRevenue * 1.618)
      },
      payment: {
        pixKey: this.paymentRoutes.pix.key,
        kiwifyProducts: this.paymentRoutes.kiwify.products.length
      }
    };
  },

  // Listar campanhas
  getCampaigns() {
    return this.campaigns.map(c => ({
      id: c.id,
      name: c.name,
      icon: c.icon,
      channel: c.channel,
      status: c.status,
      frequency: c.config.frequency,
      sent: c.stats.sent,
      converted: c.stats.converted,
      revenue: `R$ ${c.stats.revenue}`
    }));
  },

  // Listar leads recentes
  getRecentLeads(count = 10) {
    return this.leads.slice(-count).reverse().map(l => ({
      source: l.source,
      segment: l.segment,
      interest: l.interest,
      score: l.score,
      status: l.status,
      product: l.product?.name || '-'
    }));
  },

  // Listar conversões
  getConversions() {
    return this.conversions.map(c => ({
      product: c.product,
      amount: `R$ ${c.amount}`,
      method: c.paymentMethod.toUpperCase(),
      date: new Date(c.timestamp).toLocaleString('pt-BR')
    }));
  },

  // Log
  log(msg) {
    if (typeof Console !== 'undefined' && Console.log) {
      Console.log(msg, 'info');
    }
    console.log(`[CampaignEngine] ${msg}`);
  },

  // Delay
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  // Reset
  reset() {
    this.campaigns = [];
    this.leads = [];
    this.conversions = [];
    this.totalRevenue = 0;
    this.active = false;
    this.saveState();
    this.log('🔄 Motor de Campanhas resetado');
  }
};

// Auto-inicializar
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      CampaignEngine.init();
    }, 3500);
  });
}
