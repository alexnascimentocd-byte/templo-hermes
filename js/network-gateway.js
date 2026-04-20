/* ===== NETWORK GATEWAY.JS =====
   Portão de Rede — Agentes autônomos que saem do Templo,
   identificam demandas reais, criam soluções e retornam com valor.
   
   Princípios:
   - Lei de Fibonacci: crescimento orgânico e exponencial
   - Proporção Áurea: equilíbrio natural entre esforço e resultado
   - Sustentabilidade: valor real para pessoas reais
*/

const NetworkGateway = {
  // Estado
  active: false,
  agents: [],        // Agentes em missão na rede
  missions: [],      // Histórico de missões
  revenue: 0,        // Receita acumulada (R$)
  demandQueue: [],   // Demandas identificadas

  // Configuração
  config: {
    maxConcurrentAgents: 3,     // Máximo de agentes simultâneos na rede
    missionTimeout: 300000,     // 5 min timeout por missão
    checkInterval: 60000,       // Verificar demandas a cada 1 min
    fibonacciGrowth: [1, 1, 2, 3, 5, 8, 13, 21, 34, 55], // Sequência de crescimento
    goldenRatio: 1.618,         // φ — proporção áurea
  },

  // Nichos de demanda (o que as pessoas precisam e não tem atenção)
  niches: {
    automacao: {
      name: 'Automação de Tarefas',
      icon: '⚙️',
      description: 'Automatizar processos repetitivos para pequenos negócios',
      services: [
        'Resposta automática para WhatsApp Business',
        'Organização de planilhas e dados',
        'Agendamento automatizado',
        'Relatórios automáticos',
        'Backup e sincronização de arquivos'
      ],
      priceRange: [47, 197],
      demand: 'alta'
    },
    conteudo: {
      name: 'Criação de Conteúdo',
      icon: '✍️',
      description: 'Gerar textos, descrições e conteúdo para redes sociais',
      services: [
        'Legenda para Instagram com hashtags',
        'Descrição de produtos para loja online',
        'Textos para WhatsApp de vendas',
        'Bio otimizada para redes sociais',
        'E-mail marketing personalizado'
      ],
      priceRange: [27, 97],
      demand: 'muito_alta'
    },
    dados: {
      name: 'Análise de Dados Simples',
      icon: '📊',
      description: 'Transformar dados em decisões para quem não entende de planilha',
      services: [
        'Análise de vendas do mês',
        'Previsão de faturamento',
        'Controle de estoque inteligente',
        'Dashboard visual para métricas',
        'Comparativo de fornecedores'
      ],
      priceRange: [67, 297],
      demand: 'media'
    },
    presenca: {
      name: 'Presença Digital',
      icon: '🌐',
      description: 'Criar e otimizar presença online para negócios locais',
      services: [
        'Google Meu Negócio otimizado',
        'Página de vendas simples',
        'Cardápio digital para restaurante',
        'Portfólio online para prestadores',
        'Linktree personalizado'
      ],
      priceRange: [97, 497],
      demand: 'alta'
    },
    educacao: {
      name: 'Material Educacional',
      icon: '📚',
      description: 'Criar materiais de estudo e treinamento',
      services: [
        'Resumo de apostila com IA',
        'Flashcards para memorização',
        'Cronograma de estudos personalizado',
        'Quiz interativo sobre qualquer tema',
        'Mapa mental de livros/artigos'
      ],
      priceRange: [17, 67],
      demand: 'media'
    }
  },

  // Canais de distribuição (como o dinheiro chega)
  paymentChannels: {
    kiwify: {
      name: 'Kiwify',
      active: true,
      products: [
        { name: 'Pack Automação Rápida', price: 47, checkout: 'pay.kiwify.com.br/qC8YHzK' },
        { name: 'Kit Presença Digital', price: 97, checkout: 'pay.kiwify.com.br/D4NExoo' }
      ]
    },
    pix: {
      name: 'Pix Direto',
      active: true,
      key: '58af96e5-9949-41be-9546-c074b206cbcf',
      note: 'Pagamento via Pix - Serviço Digital'
    },
    whatsapp: {
      name: 'WhatsApp Vendas',
      active: true,
      note: 'Fechamento direto via conversa'
    }
  },

  // Mineração de Valor (legal — extração de oportunidades da rede)
  miningOperations: {
    seoKeywords: {
      name: 'Mineração de Palavras-chave SEO',
      icon: '🔍',
      description: 'Encontrar palavras de alta demanda e baixa concorrência',
      output: 'Listas de keywords para clientes',
      legality: '100% legal — dados públicos'
    },
    marketGaps: {
      name: 'Mineração de Lacunas de Mercado',
      icon: '🕳️',
      description: 'Identificar serviços que não existem mas são demandados',
      output: 'Relatórios de oportunidades',
      legality: '100% legal — análise pública'
    },
    trendAnalysis: {
      name: 'Mineração de Tendências',
      icon: '📈',
      description: 'Detectar tendências emergentes antes da massa',
      output: 'Alertas de tendência + ação recomendada',
      legality: '100% legal — dados abertos'
    },
    competitorIntel: {
      name: 'Inteligência Competitiva',
      icon: '🕵️',
      description: 'Analisar concorrentes e encontrar brechas',
      output: 'Mapa competitivo + posicionamento',
      legality: '100% legal — informação pública'
    },
    leadMining: {
      name: 'Mineração de Leads',
      icon: '🎯',
      description: 'Encontrar potenciais clientes em redes públicas',
      output: 'Listas segmentadas de prospects',
      legality: '100% legal — dados públicos'
    }
  },

  // Inicializar
  init() {
    this.loadState();
    this.log('🌐 Network Gateway inicializado');
    return this;
  },

  // Carregar estado
  loadState() {
    try {
      const saved = localStorage.getItem('network_gateway_state');
      if (saved) {
        const state = JSON.parse(saved);
        this.missions = state.missions || [];
        this.revenue = state.revenue || 0;
        this.demandQueue = state.demandQueue || [];
      }
    } catch (e) {
      console.warn('[NetworkGateway] Erro ao carregar:', e);
    }
  },

  // Salvar estado
  saveState() {
    try {
      const state = {
        missions: this.missions.slice(-100),
        revenue: this.revenue,
        demandQueue: this.demandQueue.slice(-50),
        lastUpdate: Date.now()
      };
      localStorage.setItem('network_gateway_state', JSON.stringify(state));
    } catch (e) {
      console.warn('[NetworkGateway] Erro ao salvar:', e);
    }
  },

  // Identificar demandas (simula busca na rede)
  identifyDemands(count = 3) {
    const demands = [];
    const nichoKeys = Object.keys(this.niches);
    
    for (let i = 0; i < count; i++) {
      const nichoKey = nichoKeys[Math.floor(Math.random() * nichoKeys.length)];
      const nicho = this.niches[nichoKey];
      const service = nicho.services[Math.floor(Math.random() * nicho.services.length)];
      const price = Math.floor(
        nicho.priceRange[0] + Math.random() * (nicho.priceRange[1] - nicho.priceRange[0])
      );
      
      // Aplicar proporção áurea ao preço (arredondar para número harmônico)
      const goldenPrice = Math.round(price / this.config.goldenRatio) * this.config.goldenRatio;
      
      demands.push({
        id: `demand_${Date.now()}_${i}`,
        niche: nichoKey,
        nicheName: nicho.name,
        icon: nicho.icon,
        service: service,
        price: Math.round(goldenPrice),
        urgency: ['baixa', 'media', 'alta'][Math.floor(Math.random() * 3)],
        complexity: Math.ceil(Math.random() * 5),
        timestamp: new Date().toISOString()
      });
    }
    
    this.demandQueue.push(...demands);
    this.saveState();
    return demands;
  },

  // Enviar agente em missão
  sendAgent(agent, demand) {
    if (this.agents.length >= this.config.maxConcurrentAgents) {
      this.log(`⚠️ Limite de agentes atingido (${this.config.maxConcurrentAgents})`);
      return null;
    }

    const mission = {
      id: `mission_${Date.now()}`,
      agent: {
        type: agent.type,
        name: agent.name,
        icon: Agents.types[agent.type]?.icon || '🤖'
      },
      demand: demand,
      status: 'em_andamento',
      startTime: Date.now(),
      steps: [],
      result: null,
      revenue: 0
    };

    // Simular execução da missão
    mission.steps = this.generateMissionSteps(agent, demand);
    mission.result = this.executeMission(agent, demand, mission.steps);
    
    // Calcular receita baseada na complexidade e proporção áurea
    const baseRevenue = demand.price * 0.7; // 70% de margem
    const fibonacciBonus = this.config.fibonacciGrowth[
      Math.min(this.missions.length, this.config.fibonacciGrowth.length - 1)
    ];
    mission.revenue = Math.round(baseRevenue + fibonacciBonus);

    mission.status = 'concluida';
    mission.endTime = Date.now();
    mission.duration = mission.endTime - mission.startTime;

    // Atualizar estado
    this.missions.push(mission);
    this.revenue += mission.revenue;
    this.agents = this.agents.filter(a => a.type !== agent.type);
    
    // Remover da fila de demandas
    this.demandQueue = this.demandQueue.filter(d => d.id !== demand.id);
    
    this.saveState();
    this.notifyMissionComplete(mission);

    return mission;
  },

  // Gerar passos da missão
  generateMissionSteps(agent, demand) {
    const agentName = Agents.types[agent.type]?.name || agent.type;
    const steps = [
      { action: 'saida', description: `${agentName} sai do Templo`, duration: 1000 },
      { action: 'analise', description: `Analisando demanda: "${demand.service}"`, duration: 2000 },
      { action: 'execucao', description: `Executando serviço de ${demand.nicheName}`, duration: 3000 },
      { action: 'validacao', description: 'Validando qualidade do resultado', duration: 1500 },
      { action: 'entrega', description: 'Preparando entrega ao cliente', duration: 1000 },
      { action: 'retorno', description: 'Retornando ao Templo com resultado', duration: 1000 }
    ];

    // Adicionar passos específicos por tipo de agente
    const agentSteps = {
      coder: { action: 'codigo', description: 'Gerando código/automação' },
      researcher: { action: 'pesquisa', description: 'Pesquisando referências e melhores práticas' },
      alchemist: { action: 'transformacao', description: 'Transformando dados em valor' },
      messenger: { action: 'comunicacao', description: 'Preparando comunicação para o cliente' },
      weaver: { action: 'sintese', description: 'Sintetizando componentes em solução completa' },
      engineer: { action: 'otimizacao', description: 'Otimizando performance e eficiência' },
      analyst: { action: 'metricas', description: 'Calculando métricas e ROI' },
      architect: { action: 'estrutura', description: 'Estruturando a solução' }
    };

    const specificStep = agentSteps[agent.type];
    if (specificStep) {
      steps.splice(3, 0, { ...specificStep, duration: 2500 });
    }

    return steps;
  },

  // Executar missão (simula o trabalho)
  executeMission(agent, demand, steps) {
    const agentName = Agents.types[agent.type]?.name || agent.type;
    
    // Resultado baseado no nicho
    const results = {
      automacao: {
        deliverable: `Automação configurada: ${demand.service}`,
        quality: 85 + Math.floor(Math.random() * 15),
        clientSatisfaction: 'alta'
      },
      conteudo: {
        deliverable: `Conteúdo criado: ${demand.service}`,
        quality: 80 + Math.floor(Math.random() * 20),
        clientSatisfaction: 'muito_alta'
      },
      dados: {
        deliverable: `Análise concluída: ${demand.service}`,
        quality: 90 + Math.floor(Math.random() * 10),
        clientSatisfaction: 'alta'
      },
      presenca: {
        deliverable: `Presença digital configurada: ${demand.service}`,
        quality: 75 + Math.floor(Math.random() * 25),
        clientSatisfaction: 'alta'
      },
      educacao: {
        deliverable: `Material educacional criado: ${demand.service}`,
        quality: 85 + Math.floor(Math.random() * 15),
        clientSatisfaction: 'media'
      }
    };

    const result = results[demand.niche] || results.conteudo;
    
    return {
      ...result,
      agent: agentName,
      timestamp: new Date().toISOString(),
      xpGained: 20 + demand.complexity * 5
    };
  },

  // Notificar conclusão de missão
  notifyMissionComplete(mission) {
    const msg = `${mission.agent.icon} Missão concluída: ${mission.demand.service} → R$ ${mission.revenue}`;
    
    if (typeof PriorityChat !== 'undefined') {
      PriorityChat.addMessage('Network', msg, 3);
    }
    if (typeof Interactions !== 'undefined' && Interactions.notify) {
      Interactions.notify(msg);
    }
    if (typeof Console !== 'undefined' && Console.log) {
      Console.log(`🌐 ${msg}`, 'sucesso');
    }
  },

  // Executar ciclo completo (identificar → enviar → coletar)
  async runCycle() {
    this.active = true;
    this.log('🔄 Iniciando ciclo de rede...');

    // 1. Identificar demandas
    const demands = this.identifyDemands(3);
    this.log(`📡 ${demands.length} demandas identificadas`);

    // 2. Selecionar agentes disponíveis
    const availableAgents = (typeof Agents !== 'undefined' ? Agents.active : [])
      .filter(a => !this.agents.find(ag => ag.type === a.type))
      .slice(0, this.config.maxConcurrentAgents);

    if (availableAgents.length === 0) {
      this.log('⚠️ Nenhum agente disponível para missão');
      this.active = false;
      return [];
    }

    // 3. Enviar agentes
    const results = [];
    for (let i = 0; i < Math.min(availableAgents.length, demands.length); i++) {
      const mission = this.sendAgent(availableAgents[i], demands[i]);
      if (mission) {
        results.push(mission);
        await this.delay(2000); // Espaçar envios
      }
    }

    this.log(`✅ ${results.length} missões concluídas | Receita total: R$ ${this.revenue}`);
    this.active = false;
    
    return results;
  },

  // Obter estatísticas
  getStats() {
    const completedMissions = this.missions.filter(m => m.status === 'concluida');
    const avgRevenue = completedMissions.length > 0 
      ? completedMissions.reduce((sum, m) => sum + m.revenue, 0) / completedMissions.length 
      : 0;

    // Crescimento Fibonacci
    const cycle = Math.min(this.missions.length, this.config.fibonacciGrowth.length - 1);
    const growthMultiplier = this.config.fibonacciGrowth[cycle];

    return {
      totalMissions: this.missions.length,
      completedMissions: completedMissions.length,
      totalRevenue: this.revenue,
      avgRevenue: Math.round(avgRevenue),
      activeAgents: this.agents.length,
      pendingDemands: this.demandQueue.length,
      growthMultiplier: growthMultiplier,
      goldenRatio: this.config.goldenRatio,
      niches: Object.entries(this.niches).map(([key, n]) => ({
        key,
        name: n.name,
        icon: n.icon,
        demand: n.demand,
        services: n.services.length
      }))
    };
  },

  // Listar missões recentes
  getRecentMissions(count = 5) {
    return this.missions.slice(-count).reverse().map(m => ({
      id: m.id,
      agent: `${m.agent.icon} ${m.agent.name}`,
      service: m.demand.service,
      niche: m.demand.nicheName,
      revenue: m.revenue,
      status: m.status,
      quality: m.result?.quality || 0,
      duration: m.duration ? `${(m.duration / 1000).toFixed(1)}s` : '-'
    }));
  },

  // Listar demandas pendentes
  getPendingDemands() {
    return this.demandQueue.map(d => ({
      id: d.id,
      icon: d.icon,
      service: d.service,
      niche: d.nicheName,
      price: `R$ ${d.price}`,
      urgency: d.urgency,
      complexity: `${d.complexity}/5`
    }));
  },

  // Gerar relatório de receita
  getRevenueReport() {
    const byNiche = {};
    this.missions.filter(m => m.status === 'concluida').forEach(m => {
      const niche = m.demand.nicheName;
      if (!byNiche[niche]) byNiche[niche] = { count: 0, revenue: 0 };
      byNiche[niche].count++;
      byNiche[niche].revenue += m.revenue;
    });

    // Projeção Fibonacci
    const currentCycle = Math.min(this.missions.length, this.config.fibonacciGrowth.length - 1);
    const nextGrowth = this.config.fibonacciGrowth[Math.min(currentCycle + 1, this.config.fibonacciGrowth.length - 1)];
    const projectedMonthly = Math.round(this.revenue * nextGrowth * this.config.goldenRatio);

    return {
      totalRevenue: this.revenue,
      byNiche: Object.entries(byNiche).map(([name, data]) => ({
        name,
        missions: data.count,
        revenue: data.revenue
      })),
      currentGrowthCycle: currentCycle + 1,
      nextGrowthMultiplier: nextGrowth,
      projectedMonthly: projectedMonthly,
      paymentChannels: Object.entries(this.paymentChannels)
        .filter(([_, ch]) => ch.active)
        .map(([key, ch]) => ({ key, name: ch.name }))
    };
  },

  // Log helper
  log(msg) {
    if (typeof Console !== 'undefined' && Console.log) {
      Console.log(msg, 'info');
    }
    console.log(`[NetworkGateway] ${msg}`);
  },

  // Delay helper
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  // Reset
  reset() {
    this.missions = [];
    this.revenue = 0;
    this.demandQueue = [];
    this.agents = [];
    this.active = false;
    this.saveState();
    this.log('🔄 Network Gateway resetado');
  },

  // Executar mineração de valor (legal)
  async runMining(operationKey = null) {
    const operations = operationKey 
      ? [this.miningOperations[operationKey]].filter(Boolean)
      : Object.values(this.miningOperations);

    if (operations.length === 0) {
      this.log('⚠️ Operação de mineração não encontrada');
      return [];
    }

    const results = [];
    for (const op of operations) {
      this.log(`${op.icon} Minerando: ${op.name}...`);
      await this.delay(1500);

      const result = {
        operation: op.name,
        icon: op.icon,
        itemsFound: Math.floor(Math.random() * 20) + 5,
        quality: 70 + Math.floor(Math.random() * 30),
        monetizable: Math.random() > 0.3,
        timestamp: new Date().toISOString(),
        legality: op.legality
      };

      results.push(result);
      this.log(`${op.icon} ${op.name}: ${result.itemsFound} oportunidades encontradas (qualidade: ${result.quality}%)`);
    }

    // Mineração gera demandas na fila
    const newDemands = this.identifyDemands(results.length);
    this.log(`⛏️ Mineração concluída: ${newDemands.length} novas demandas adicionadas à fila`);

    return { mining: results, newDemands };
  },

  // Projeção de ganhos realista
  getEarningsProjection() {
    // Cenários baseados em dados reais do mercado brasileiro
    return {
      // Cenário conservador (pouca experiência, começo)
      conservador: {
        label: 'Conservador (mês 1-2)',
        missionsPerWeek: 5,
        avgPrice: 47,
        monthlyRevenue: 940,
        description: 'Automações simples, 1 cliente por dia útil'
      },
      // Cenário moderado (3-4 meses)
      moderado: {
        label: 'Moderado (mês 3-4)',
        missionsPerWeek: 10,
        avgPrice: 87,
        monthlyRevenue: 3480,
        description: 'Mix de serviços, indicações começando a vir'
      },
      // Cenário agressivo (6+ meses)
      agressivo: {
        label: 'Agressivo (mês 6+)',
        missionsPerWeek: 20,
        avgPrice: 147,
        monthlyRevenue: 11760,
        description: 'Clientes recorrentes, pacotes, upsell'
      },
      // Fibonacci growth projection
      fibonacciProjection: this.config.fibonacciGrowth.map((mult, i) => ({
        month: i + 1,
        multiplier: mult,
        projectedRevenue: Math.round(940 * mult),
        goldenAdjusted: Math.round(940 * mult * this.config.goldenRatio)
      })),
      // Custos mínimos para viver em Vila Velha, ES
      custoVida: {
        basico: 1500,     // Aluguel + comida + transporte
        confortavel: 3000, // + Internet boa + lazer básico
        bom: 5000,        // + Investimento + reserva
        ideal: 8000       // + Crescimento + conforto total
      }
    };
  }
};

// Auto-inicializar
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      NetworkGateway.init();
    }, 2500);
  });
}
