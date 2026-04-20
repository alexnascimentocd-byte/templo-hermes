/* ===== SALES OFFICE.JS =====
   Escritório de Vendas Automatizado
   - Agente comercial que identifica, aborda e fecha clientes
   - Pipeline de vendas com estágios
   - Scripts de abordagem por nicho
   - Conversão via Pix ou Kiwify
   - Acompanhamento de métricas de vendas
*/

const SalesOffice = {
  // Estado
  active: false,
  salesAgent: null,
  pipeline: [],
  closedDeals: [],
  totalRevenue: 0,
  
  // Configuração
  config: {
    maxLeadsPerCycle: 5,
    followUpDelay: 3600000,   // 1h entre follow-ups
    conversionRate: 0.15,     // 15% de conversão esperada
    avgTicket: 67,            // Ticket médio R$67
    commission: 0.7,          // 70% é seu (margem)
  },

  // Estágios do funil de vendas
  stages: {
    lead:       { name: 'Lead Identificado',      icon: '🎯', color: '#4a8aff', next: 'contato' },
    contato:    { name: 'Primeiro Contato',        icon: '👋', color: '#ffa94d', next: 'proposta' },
    proposta:   { name: 'Proposta Enviada',        icon: '📋', color: '#69db7c', next: 'negociacao' },
    negociacao: { name: 'Em Negociação',           icon: '🤝', color: '#ffd43b', next: 'fechamento' },
    fechamento: { name: 'Fechamento',              icon: '💰', color: '#ff6b6b', next: 'ganho' },
    ganho:      { name: 'Ganho ✅',                icon: '🎉', color: '#4aff8a', next: null },
    perdido:    { name: 'Perdido ❌',              icon: '😔', color: '#666', next: null },
  },

  // Scripts de venda por nicho
  scripts: {
    automacao: {
      abertura: `Oi! Tudo bem? 😊\n\nVi que você trabalha com [NEGÓCIO] e imaginei que deve ter tarefas repetitivas que tomam seu tempo.\n\nCriei uma automação que resolve exatamente isso — [DESCRIÇÃO DO PROBLEMA].\n\nPosso te mostrar como funciona? Leva 2 minutos.`,
      
      proposta: `Perfeito! Aqui está o que eu faço:\n\n✅ [SERVIÇO ESPECÍFICO]\n✅ Entrega em 24h\n✅ Suporte por 7 dias\n✅ Garantia de satisfação\n\n💰 Investimento: R$ [PREÇO]\n\nVocê pode pagar via Pix que é instantâneo, ou pelo Kiwify se preferir parcelar.\n\nQual forma prefere?`,
      
      fechamento: `Ótima escolha! 🎉\n\nAqui estão os dados para o Pix:\n🔑 Chave: [CHAVE_PIX]\n💰 Valor: R$ [PREÇO]\n📝 Descrição: [DESCRIÇÃO]\n\nAssim que confirmar, já começo a trabalhar no seu projeto.\n\nOu se preferir pelo cartão:\n🛒 [LINK_KIWIFY]\n\nPode me chamar aqui que eu respondo na hora!`,
      
      followup: `Oi! Passando pra saber se conseguiu ver minha proposta.\n\nSem pressa, mas queria garantir que chegou certinho. 😊\n\nAlguma dúvida que eu possa esclarecer?`,
      
      objecoes: {
        caro: `Entendo! Mas pensa assim: se essa automação te economiza 2h por dia, em 1 mês são 60h. Se sua hora vale R$20, são R$1.200 economizados. O investimento se paga em poucos dias.`,
        duvida: `Totalmente normal ter dúvida! Por isso ofereço garantia: se não funcionar como prometi, devolvo 100%. Sem burocracia.`,
        tempo: `Justo! Na verdade o processo é rápido — você me explica o que precisa, eu monto, e em 24h tá pronto. Quer que eu agende um horário de 15 minutinhos pra eu te mostrar?`,
        preciso_pensar: `Claro! Fica à vontade. Só te peço uma coisa: me avisa até [DATA] porque tenho só [X] vagas esse mês. Pode ser?`
      }
    },

    conteudo: {
      abertura: `Oi! Notei que você posta bastante sobre [TEMA] nas redes.\n\nCriei um pack de [TIPO DE CONTEÚDO] que pode te ajudar a engajar mais e crescer mais rápido.\n\nQuer dar uma olhada?`,
      
      proposta: `Aqui está o que vem no pack:\n\n📝 [N] legendas prontas para Instagram\n📱 [N] templates de stories\n#️⃣ Hashtags otimizadas para seu nicho\n📅 Cronograma de postagens\n\n💰 Tudo isso por apenas R$ [PREÇO]\n\nVale muito pelo tempo que você economiza!`,
      
      fechamento: `Show! 🎉\n\nPix: [CHAVE_PIX]\nValor: R$ [PREÇO]\n\nOu compra direto:\n🛒 [LINK_KIWIFY]\n\nAssim que confirmar, envio o material por aqui mesmo!`,
      
      followup: `Oi! Conseguiu dar uma olhada no pack de conteúdo?\n\nTô com promoção esse semana — se fechar hoje, ganha [BÔNUS]. 😊`
    },

    presenca: {
      abertura: `Oi! Vi que seu negócio não tem [PRESENÇA DIGITAL] muito forte ainda.\n\nMontei uma página/presença digital completa que pode te trazer mais clientes. Posso te mostrar?`,
      
      proposta: `O que você recebe:\n\n🌐 [Página/Site/Perfil] profissional\n📍 Google Meu Negócio otimizado\n📱 Layout responsivo (funciona no celular)\n⚡ Carregamento rápido\n\n💰 Investimento único: R$ [PREÇO]\n\nE o melhor: você não precisa saber nada de tecnologia.`,
      
      fechamento: `Perfeito! 🚀\n\nPix: [CHAVE_PIX]\nValor: R$ [PREÇO]\n\nMe manda o material do seu negócio (logo, fotos, horários) que eu já começo!`
    }
  },

  // Inicializar
  init() {
    this.loadState();
    this.salesAgent = this.createSalesAgent();
    this.log('🏢 Escritório de Vendas inicializado');
    return this;
  },

  // Criar o agente comercial
  createSalesAgent() {
    return {
      type: 'messenger',  // Iris — a melhor para comunicação/vendas
      name: 'Iris Comercial',
      icon: '💼',
      role: 'Agente Comercial',
      skills: ['vendas', 'negociação', 'fechamento', 'follow-up', 'objeções'],
      performance: {
        leadsContacted: 0,
        proposalsSent: 0,
        dealsWon: 0,
        dealsLost: 0,
        conversionRate: 0,
        totalRevenue: 0
      },
      status: 'ativo'
    };
  },

  // Carregar estado
  loadState() {
    try {
      const saved = localStorage.getItem('sales_office_state');
      if (saved) {
        const state = JSON.parse(saved);
        this.pipeline = state.pipeline || [];
        this.closedDeals = state.closedDeals || [];
        this.totalRevenue = state.totalRevenue || 0;
        if (state.salesAgent) {
          this.salesAgent = state.salesAgent;
        }
      }
    } catch (e) {
      console.warn('[SalesOffice] Erro ao carregar:', e);
    }
  },

  // Salvar estado
  saveState() {
    try {
      const state = {
        pipeline: this.pipeline.slice(-100),
        closedDeals: this.closedDeals.slice(-50),
        totalRevenue: this.totalRevenue,
        salesAgent: this.salesAgent,
        lastUpdate: Date.now()
      };
      localStorage.setItem('sales_office_state', JSON.stringify(state));
    } catch (e) {
      console.warn('[SalesOffice] Erro ao salvar:', e);
    }
  },

  // Identificar leads da rede
  identifyLeads(count = 3) {
    const leads = [];
    const businesses = [
      { name: 'Restaurante do Zé', type: 'restaurante', niche: 'presenca', pain: 'sem cardápio digital' },
      { name: 'Salão da Maria', type: 'salao', niche: 'automacao', pain: 'agendamento manual no papel' },
      { name: 'Loja da Ana', type: 'loja', niche: 'conteudo', pain: 'posts sem engajamento' },
      { name: 'Oficina do Carlos', type: 'oficina', niche: 'presenca', pain: 'não aparece no Google' },
      { name: 'Academia Power Fit', type: 'academia', niche: 'automacao', pain: 'controle de alunos manual' },
      { name: 'Pizzaria Bella', type: 'restaurante', niche: 'automacao', pain: 'pedidos só por telefone' },
      { name: 'Clínica Dra. Silva', type: 'clinica', niche: 'automacao', pain: 'agendamento por WhatsApp manual' },
      { name: 'Pet Shop Amigo', type: 'petshop', niche: 'conteudo', pain: 'redes sociais paradas' },
      { name: 'Barbearia Style', type: 'barbearia', niche: 'presenca', pain: 'sem Google Meu Negócio' },
      { name: 'Loja de Roupas Chic', type: 'loja', niche: 'conteudo', pain: 'catálogo só no WhatsApp' },
      { name: 'Escola de Idiomas', type: 'educacao', niche: 'automacao', pain: 'matrícula manual' },
      { name: 'Corretor João', type: 'servico', niche: 'presenca', pain: 'landing page amadora' },
    ];

    for (let i = 0; i < Math.min(count, businesses.length); i++) {
      const biz = businesses[Math.floor(Math.random() * businesses.length)];
      const script = this.scripts[biz.niche];
      
      leads.push({
        id: `lead_${Date.now()}_${i}`,
        business: biz.name,
        type: biz.type,
        niche: biz.niche,
        pain: biz.pain,
        stage: 'lead',
        price: this.calculatePrice(biz.niche),
        script: script?.abertura || '',
        notes: '',
        createdAt: new Date().toISOString(),
        lastContact: null,
        followUps: 0,
        channel: ['WhatsApp', 'Instagram DM', 'Google Reviews'][Math.floor(Math.random() * 3)]
      });
    }

    this.pipeline.push(...leads);
    this.saveState();
    return leads;
  },

  // Calcular preço baseado no nicho + proporção áurea
  calculatePrice(niche) {
    const basePrices = {
      automacao: 67,
      conteudo: 47,
      presenca: 147,
      dados: 97,
      educacao: 37
    };
    const base = basePrices[niche] || 67;
    // Aplicar variação aleatória ±30%
    const variation = 0.7 + Math.random() * 0.6;
    return Math.round(base * variation / 5) * 5; // Arredondar para múltiplos de 5
  },

  // Avançar lead no funil
  advanceLead(leadId, notes = '') {
    const lead = this.pipeline.find(l => l.id === leadId);
    if (!lead) return null;

    const currentStage = this.stages[lead.stage];
    if (!currentStage.next) return lead;

    lead.stage = currentStage.next;
    lead.lastContact = new Date().toISOString();
    lead.notes = notes;

    // Atualizar performance do agente
    if (lead.stage === 'contato') this.salesAgent.performance.leadsContacted++;
    if (lead.stage === 'proposta') this.salesAgent.performance.proposalsSent++;
    if (lead.stage === 'ganho') {
      this.salesAgent.performance.dealsWon++;
      this.salesAgent.performance.totalRevenue += lead.price;
      this.totalRevenue += lead.price;
      this.closedDeals.push({ ...lead, closedAt: new Date().toISOString() });
      this.pipeline = this.pipeline.filter(l => l.id !== leadId);
      this.log(`🎉 VENDA FECHADA! ${lead.business} → R$ ${lead.price}`);
    }
    if (lead.stage === 'perdido') {
      this.salesAgent.performance.dealsLost++;
      this.pipeline = this.pipeline.filter(l => l.id !== leadId);
    }

    // Calcular taxa de conversão
    const total = this.salesAgent.performance.dealsWon + this.salesAgent.performance.dealsLost;
    this.salesAgent.performance.conversionRate = total > 0 
      ? Math.round((this.salesAgent.performance.dealsWon / total) * 100) 
      : 0;

    this.saveState();
    return lead;
  },

  // Executar ciclo de vendas completo
  async runSalesCycle() {
    this.active = true;
    this.log('💼 Iniciando ciclo de vendas...');

    // 1. Gerar novos leads se pipeline está vazio
    if (this.pipeline.filter(l => l.stage === 'lead').length < 2) {
      const newLeads = this.identifyLeads(this.config.maxLeadsPerCycle);
      this.log(`🎯 ${newLeads.length} novos leads identificados`);
    }

    // 2. Processar leads no funil
    const results = [];
    const leadStages = ['lead', 'contato', 'proposta', 'negociacao', 'fechamento'];
    
    for (const stage of leadStages) {
      const leadsInStage = this.pipeline.filter(l => l.stage === stage);
      
      for (const lead of leadsInStage.slice(0, 2)) { // Processar até 2 por estágio
        await this.delay(800);
        
        // Simular ação do agente comercial
        const action = this.simulateAgentAction(lead);
        results.push(action);
        
        // Avançar ou manter
        if (action.success) {
          this.advanceLead(lead.id, action.result);
        }
      }
    }

    // 3. Follow-ups
    const needFollowUp = this.pipeline.filter(l => {
      if (!l.lastContact) return false;
      const elapsed = Date.now() - new Date(l.lastContact).getTime();
      return elapsed > this.config.followUpDelay && l.followUps < 3;
    });

    for (const lead of needFollowUp.slice(0, 2)) {
      lead.followUps++;
      this.log(`📞 Follow-up #${lead.followUps}: ${lead.business}`);
    }

    this.log(`✅ Ciclo concluído | Pipeline: ${this.pipeline.length} | Fechados: ${this.closedDeals.length} | Receita: R$ ${this.totalRevenue}`);
    this.active = false;
    this.saveState();

    return results;
  },

  // Simular ação do agente comercial
  simulateAgentAction(lead) {
    const success = Math.random() < 0.4; // 40% de chance de avançar
    const actions = {
      lead: 'Lead identificado e qualificado',
      contato: 'Mensagem de abertura enviada',
      proposta: 'Proposta personalizada enviada',
      negociacao: 'Objeção tratada, aguardando resposta',
      fechamento: 'Dados de pagamento enviados'
    };

    return {
      lead: lead.business,
      stage: lead.stage,
      action: actions[lead.stage] || 'Ação executada',
      success,
      result: success ? 'Avançou no funil' : 'Aguardando resposta',
      timestamp: new Date().toISOString()
    };
  },

  // Gerar mensagem de venda para um lead
  generateSalesMessage(lead, messageType = 'abertura') {
    const script = this.scripts[lead.niche];
    if (!script || !script[messageType]) return 'Script não disponível para este nicho.';

    let message = script[messageType];
    
    // Substituir variáveis
    message = message.replace(/\[NEGÓCIO\]/g, lead.business);
    message = message.replace(/\[DESCRIÇÃO DO PROBLEMA\]/g, lead.pain);
    message = message.replace(/\[PREÇO\]/g, lead.price);
    message = message.replace(/\[CHAVE_PIX\]/g, '28.173.770/0001-55');
    message = message.replace(/\[LINK_KIWIFY\]/g, 'pay.kiwify.com.br/qC8YHzK');
    message = message.replace(/\[TEMA\]/g, lead.type);
    message = message.replace(/\[TIPO DE CONTEÚDO\]/g, 'legendas e posts');
    message = message.replace(/\[N\]/g, '30');
    message = message.replace(/\[PRESENÇA DIGITAL\]/g, 'presença digital');

    return message;
  },

  // Obter estatísticas
  getStats() {
    const pipelineByStage = {};
    Object.keys(this.stages).forEach(stage => {
      pipelineByStage[stage] = this.pipeline.filter(l => l.stage === stage).length;
    });

    return {
      agent: this.salesAgent,
      pipeline: {
        total: this.pipeline.length,
        byStage: pipelineByStage,
        leads: this.pipeline.filter(l => l.stage === 'lead').length,
        active: this.pipeline.filter(l => !['lead', 'ganho', 'perdido'].includes(l.stage)).length
      },
      deals: {
        won: this.closedDeals.length,
        lost: this.salesAgent.performance.dealsLost,
        winRate: this.salesAgent.performance.conversionRate
      },
      revenue: {
        total: this.totalRevenue,
        avg: this.closedDeals.length > 0 ? Math.round(this.totalRevenue / this.closedDeals.length) : 0,
        projected: Math.round(this.totalRevenue * 1.618) // φ projection
      }
    };
  },

  // Listar pipeline
  getPipeline() {
    return this.pipeline.map(l => ({
      id: l.id,
      business: l.business,
      niche: l.niche,
      stage: this.stages[l.stage]?.name || l.stage,
      icon: this.stages[l.stage]?.icon || '❓',
      price: `R$ ${l.price}`,
      channel: l.channel,
      pain: l.pain,
      followUps: l.followUps,
      age: this.getTimeAgo(l.createdAt)
    }));
  },

  // Listar vendas fechadas
  getClosedDeals() {
    return this.closedDeals.map(d => ({
      business: d.business,
      niche: d.niche,
      price: `R$ ${d.price}`,
      closedAt: new Date(d.closedAt).toLocaleDateString('pt-BR'),
      channel: d.channel
    }));
  },

  // Tempo relativo
  getTimeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  },

  // Log helper
  log(msg) {
    if (typeof Console !== 'undefined' && Console.log) {
      Console.log(msg, 'info');
    }
    console.log(`[SalesOffice] ${msg}`);
  },

  // Delay
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  // Reset
  reset() {
    this.pipeline = [];
    this.closedDeals = [];
    this.totalRevenue = 0;
    this.salesAgent = this.createSalesAgent();
    this.active = false;
    this.saveState();
    this.log('🔄 Escritório de Vendas resetado');
  }
};

// Auto-inicializar
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      SalesOffice.init();
    }, 3000);
  });
}
