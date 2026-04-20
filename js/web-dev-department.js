/* ===== WEB DEV DEPARTMENT.JS =====
   Departamento de Desenvolvimento Web
   - Analisa tendências do mercado via dados de leads
   - Cria produtos web automaticamente (landing pages, ferramentas, mini-sites)
   - Publica e monetiza baseado na demanda
   - Alinhado aos princípios herméticos de valor
*/

const WebDevDepartment = {
  active: false,
  projects: [],
  trends: [],
  templates: [],
  publications: [],
  revenue: 0,

  // Inteligência de mercado — tendências detectadas
  marketIntelligence: {
    currentTrends: [],
    lastAnalysis: null,
    hotNiches: [],
    demandScore: {}
  },

  // Produtos web que podem ser criados automaticamente
  productTypes: {
    landing_page: {
      name: 'Landing Page de Venda',
      icon: '🌐',
      description: 'Página de captura focada em conversão',
      creationTime: '5min',
      monetization: 'venda_direta',
      avgRevenue: 47
    },
    ferramenta_web: {
      name: 'Ferramenta Web (SaaS Mini)',
      icon: '🔧',
      description: 'Utilitário online que resolve um problema específico',
      creationTime: '15min',
      monetization: 'freemium',
      avgRevenue: 27
    },
    calculadora: {
      name: 'Calculadora Especializada',
      icon: '🧮',
      description: 'Calculadora para nicho específico (ROI, preço, etc)',
      creationTime: '10min',
      monetization: 'lead_capture',
      avgRevenue: 19
    },
    quiz_interativo: {
      name: 'Quiz Interativo',
      icon: '❓',
      description: 'Quiz que qualifica leads e recomenda produtos',
      creationTime: '8min',
      monetization: 'lead_qualification',
      avgRevenue: 37
    },
    gerador_conteudo: {
      name: 'Gerador de Conteúdo',
      icon: '✍️',
      description: 'Ferramenta que gera textos, captions, hashtags',
      creationTime: '12min',
      monetization: 'freemium',
      avgRevenue: 57
    },
    painel_dashboard: {
      name: 'Painel / Dashboard',
      icon: '📊',
      description: 'Visualização de dados para tomada de decisão',
      creationTime: '20min',
      monetization: 'assinatura',
      avgRevenue: 97
    },
    mini_curso: {
      name: 'Mini Curso Online',
      icon: '📚',
      description: 'Curso rápido sobre tema em alta',
      creationTime: '25min',
      monetization: 'venda_direta',
      avgRevenue: 67
    },
    simulador: {
      name: 'Simulador Online',
      icon: '🎮',
      description: 'Simula cenários reais (financiamento, investimento, etc)',
      creationTime: '15min',
      monetization: 'freemium',
      avgRevenue: 37
    }
  },

  // Nichos herméticos de mercado (alinhados com princípios)
  hermeticNiches: {
    transformacao_pessoal: {
      name: 'Transformação Pessoal',
      icon: '🔄',
      hermeticPrinciple: 'Transmutação',
      description: 'Ferramentas para mudança de hábitos e mentalidade',
      trending: true
    },
    equilibrio_financas: {
      name: 'Equilíbrio Financeiro',
      icon: '⚖️',
      hermeticPrinciple: 'Polaridade',
      description: 'Calculadoras e ferramentas de gestão financeira',
      trending: true
    },
    conhecimento_aplicado: {
      name: 'Conhecimento Aplicado',
      icon: '🧠',
      hermeticPrinciple: 'Correspondência',
      description: 'Educação prática que conecta teoria com resultado',
      trending: true
    },
    ritmo_produtividade: {
      name: 'Ritmo e Produtividade',
      icon: '🔄',
      hermeticPrinciple: 'Ritmo',
      description: 'Ferramentas de ciclo, timing e gestão de energia',
      trending: false
    },
    causa_efeito_negocio: {
      name: 'Causa e Efeito no Negócio',
      icon: '⚙️',
      hermeticPrinciple: 'Causa e Efeito',
      description: 'Métricas, KPIs e análise de impacto',
      trending: true
    },
    vibracao_marketing: {
      name: 'Vibração no Marketing',
      icon: '〰',
      hermeticPrinciple: 'Vibração',
      description: 'Ferramentas de copywriting, persuasão e comunicação',
      trending: true
    },
    mentalismo_vendas: {
      name: 'Mentalismo nas Vendas',
      icon: '🔮',
      hermeticPrinciple: 'Mentalismo',
      description: 'Psicologia aplicada a conversão e fechamento',
      trending: true
    },
    genero_criatividade: {
      name: 'Gênero e Criatividade',
      icon: '⚥',
      hermeticPrinciple: 'Gênero',
      description: 'Ferramentas de brainstorming e geração de ideias',
      trending: false
    }
  },

  // Inicializar
  init() {
    this.loadState();
    this.active = true;
    this.log('🏗️ Departamento de Desenvolvimento Web iniciado');
    return this;
  },

  // Carregar estado
  loadState() {
    try {
      const saved = localStorage.getItem('web_dev_department_state');
      if (saved) {
        const state = JSON.parse(saved);
        this.projects = state.projects || [];
        this.trends = state.trends || [];
        this.publications = state.publications || [];
        this.revenue = state.revenue || 0;
        if (state.marketIntelligence) {
          this.marketIntelligence = state.marketIntelligence;
        }
      }
    } catch (e) {
      console.warn('[WebDevDepartment] Erro:', e);
    }
  },

  // Salvar estado
  saveState() {
    try {
      const state = {
        projects: this.projects.slice(-50),
        trends: this.trends.slice(-30),
        publications: this.publications.slice(-30),
        revenue: this.revenue,
        marketIntelligence: this.marketIntelligence,
        lastUpdate: Date.now()
      };
      localStorage.setItem('web_dev_department_state', JSON.stringify(state));
    } catch (e) {
      console.warn('[WebDevDepartment] Erro:', e);
    }
  },

  // Analisar tendências do mercado
  analyzeMarketTrends() {
    this.log('📊 Analisando tendências do mercado...');

    // Coletar dados dos outros módulos
    const leadData = this.collectLeadData();
    const campaignData = this.collectCampaignData();

    // Detectar tendências
    const trends = this.detectTrends(leadData, campaignData);
    this.trends.push(...trends);
    this.marketIntelligence.currentTrends = trends;
    this.marketIntelligence.lastAnalysis = new Date().toISOString();

    // Identificar nichos quentes
    const hotNiches = this.identifyHotNiches(trends);
    this.marketIntelligence.hotNiches = hotNiches;

    this.log(`📊 ${trends.length} tendências detectadas, ${hotNiches.length} nichos quentes`);
    return { trends, hotNiches };
  },

  // Coletar dados de leads
  collectLeadData() {
    if (typeof LeadDiversification !== 'undefined') {
      const stats = LeadDiversification.getStats();
      return {
        profiles: stats.byProfile || {},
        totalLeads: stats.totalProfiles,
        avgScore: stats.avgIntentScore,
        conversionPotential: stats.conversionPotential
      };
    }
    return { profiles: {}, totalLeads: 0, avgScore: 0, conversionPotential: 0 };
  },

  // Coletar dados de campanhas
  collectCampaignData() {
    if (typeof CampaignEngine !== 'undefined') {
      const stats = CampaignEngine.getStats();
      return {
        campaigns: stats.campaigns,
        metrics: stats.metrics,
        revenue: stats.revenue
      };
    }
    return { campaigns: {}, metrics: {}, revenue: {} };
  },

  // Detectar tendências
  detectTrends(leadData, campaignData) {
    const trends = [];
    const now = new Date().toISOString();

    // Tendências baseadas em perfis de leads
    const profileTrends = {
      impulsivo: { niche: 'vibracao_marketing', strength: 85, desc: 'Alta demanda por ofertas rápidas' },
      pesquisador: { niche: 'conhecimento_aplicado', strength: 75, desc: 'Demanda por conteúdo detalhado' },
      oportunista: { niche: 'equilibrio_financas', strength: 80, desc: 'Busca por oportunidades de economia' },
      profissional: { niche: 'causa_efeito_negocio', strength: 90, desc: 'Foco em ROI e resultados' },
      iniciante: { niche: 'transformacao_pessoal', strength: 70, desc: 'Interesse em desenvolvimento' },
      recorrente: { niche: 'mentalismo_vendas', strength: 65, desc: 'Evolução contínua' }
    };

    Object.entries(leadData.profiles).forEach(([profile, count]) => {
      const trend = profileTrends[profile];
      if (trend && count > 0) {
        trends.push({
          type: 'lead_profile',
          profile: profile,
          niche: trend.niche,
          strength: trend.strength + (count * 2),
          description: trend.desc,
          source: 'lead_diversification',
          timestamp: now
        });
      }
    });

    // Tendências baseadas em nichos herméticos
    Object.entries(this.hermeticNiches).forEach(([key, niche]) => {
      if (niche.trending) {
        trends.push({
          type: 'hermetic_niche',
          niche: key,
          strength: 60 + Math.floor(Math.random() * 30),
          description: niche.description,
          principle: niche.hermeticPrinciple,
          source: 'hermetic_analysis',
          timestamp: now
        });
      }
    });

    return trends;
  },

  // Identificar nichos quentes
  identifyHotNiches(trends) {
    const nicheStrength = {};
    trends.forEach(t => {
      if (t.niche) {
        nicheStrength[t.niche] = (nicheStrength[t.niche] || 0) + t.strength;
      }
    });

    return Object.entries(nicheStrength)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([niche, strength]) => ({
        niche,
        nicheInfo: this.hermeticNiches[niche],
        strength,
        icon: this.hermeticNiches[niche]?.icon || '📊',
        name: this.hermeticNiches[niche]?.name || niche,
        principle: this.hermeticNiches[niche]?.hermeticPrinciple || '-'
      }));
  },

  // Criar projeto web baseado em tendência
  createProject(trend, productType = null) {
    const niche = this.hermeticNiches[trend.niche];
    if (!niche) return null;

    // Selecionar tipo de produto baseado na tendência
    const type = productType || this.selectProductType(trend);
    const productDef = this.productTypes[type];
    if (!productDef) return null;

    const project = {
      id: `proj_${Date.now()}`,
      name: this.generateProjectName(niche, productDef),
      type: type,
      typeName: productDef.name,
      typeIcon: productDef.icon,
      niche: trend.niche,
      nicheName: niche.name,
      nicheIcon: niche.icon,
      hermeticPrinciple: niche.hermeticPrinciple,
      description: this.generateDescription(niche, productDef),
      features: this.generateFeatures(type, niche),
      monetization: productDef.monetization,
      price: this.calculatePrice(productDef.avgRevenue),
      status: 'criado',
      createdAt: new Date().toISOString(),
      pages: [],
      revenue: 0
    };

    // Gerar conteúdo das páginas
    project.pages = this.generatePages(project);

    this.projects.push(project);
    this.saveState();
    this.log(`${productDef.icon} Projeto criado: ${project.name} [${niche.hermeticPrinciple}]`);

    return project;
  },

  // Selecionar tipo de produto baseado na tendência
  selectProductType(trend) {
    const mapping = {
      vibracao_marketing: 'gerador_conteudo',
      conhecimento_aplicado: 'mini_curso',
      equilibrio_financas: 'calculadora',
      causa_efeito_negocio: 'painel_dashboard',
      transformacao_pessoal: 'quiz_interativo',
      mentalismo_vendas: 'landing_page',
      ritmo_produtividade: 'ferramenta_web',
      genero_criatividade: 'simulador'
    };
    return mapping[trend.niche] || 'landing_page';
  },

  // Gerar nome do projeto
  generateProjectName(niche, productDef) {
    const prefixes = ['Pro', 'Smart', 'Power', 'Quick', 'Easy', 'Super', 'Master', 'Top'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const nicheWord = niche.name.split(' ')[0];
    return `${prefix}${nicheWord} — ${productDef.name}`;
  },

  // Gerar descrição
  generateDescription(niche, productDef) {
    return `${productDef.description} focado em ${niche.name.toLowerCase()}. ` +
      `Baseado no princípio hermético de ${niche.hermeticPrinciple}. ` +
      `Criado automaticamente pelo Departamento de Desenvolvimento Web do Templo de Hermes.`;
  },

  // Gerar features
  generateFeatures(type, niche) {
    const baseFeatures = {
      landing_page: ['Design responsivo', 'CTA otimizado', 'Formulário de captura', 'SEO básico'],
      ferramenta_web: ['Interface intuitiva', 'Cálculo em tempo real', 'Exportar resultado', 'Salvar preferências'],
      calculadora: ['Entrada simples', 'Resultado instantâneo', 'Comparação', 'Compartilhar'],
      quiz_interativo: ['Perguntas dinâmicas', 'Resultado personalizado', 'Recomendação', 'Captura de lead'],
      gerador_conteudo: ['Múltiplos formatos', 'Personalização', 'Exportar', 'Histórico'],
      painel_dashboard: ['Gráficos visuais', 'Dados em tempo real', 'Filtros', 'Exportar relatório'],
      mini_curso: ['Aulas em vídeo', 'Material de apoio', 'Certificado', 'Suporte'],
      simulador: ['Cenários múltiplos', 'Resultados visuais', 'Comparação', 'Salvar cenário']
    };
    return baseFeatures[type] || baseFeatures.landing_page;
  },

  // Gerar páginas do projeto
  generatePages(project) {
    return [
      {
        name: 'index.html',
        type: 'main',
        sections: ['hero', 'beneficios', 'como_funciona', 'preco', 'cta', 'footer'],
        content: `<!-- ${project.name} -->\n<!-- Gerado pelo WebDev Department -->\n<!-- Princípio: ${project.hermeticPrinciple} -->`
      },
      {
        name: 'obrigado.html',
        type: 'thank_you',
        sections: ['confirmacao', 'proximo_passo'],
        content: `<!-- Página de confirmação -->`
      }
    ];
  },

  // Calcular preço
  calculatePrice(basePrice) {
    const variation = 0.8 + Math.random() * 0.4;
    return Math.round(basePrice * variation / 5) * 5;
  },

  // Publicar projeto
  publishProject(projectId) {
    const project = this.projects.find(p => p.id === projectId);
    if (!project) return null;

    project.status = 'publicado';
    project.publishedAt = new Date().toISOString();

    const publication = {
      projectId: project.id,
      projectName: project.name,
      url: `https://alexnascimentocd-byte.github.io/${project.id}`,
      type: project.typeName,
      niche: project.nicheName,
      price: `R$ ${project.price}`,
      monetization: project.monetization,
      principle: project.hermeticPrinciple,
      publishedAt: project.publishedAt
    };

    this.publications.push(publication);
    this.saveState();
    this.log(`🚀 Projeto publicado: ${project.name} → ${publication.url}`);

    return publication;
  },

  // Executar ciclo completo de desenvolvimento
  async runDevCycle() {
    this.active = true;
    this.log('🏗️ Iniciando ciclo de desenvolvimento...');

    // 1. Analisar tendências
    const analysis = this.analyzeMarketTrends();
    await this.delay(1000);

    // 2. Criar projetos baseados nas top tendências
    const created = [];
    for (const niche of analysis.hotNiches.slice(0, 3)) {
      const trend = this.trends.find(t => t.niche === niche.niche);
      if (trend) {
        const project = this.createProject(trend);
        if (project) {
          created.push(project);
          await this.delay(800);
        }
      }
    }

    // 3. Publicar projetos criados
    const published = [];
    for (const project of created) {
      const pub = this.publishProject(project.id);
      if (pub) published.push(pub);
      await this.delay(500);
    }

    // 4. Simular receita
    for (const pub of published) {
      const revenue = created.find(p => p.id === pub.projectId)?.price || 0;
      this.revenue += revenue;
    }

    this.log(`✅ Ciclo concluído: ${created.length} projetos criados, ${published.length} publicados`);
    this.active = false;
    this.saveState();

    return { created: created.length, published: published.length, trends: analysis.trends.length };
  },

  // Estatísticas
  getStats() {
    const byType = {};
    Object.keys(this.productTypes).forEach(type => {
      byType[type] = this.projects.filter(p => p.type === type).length;
    });

    const byNiche = {};
    Object.keys(this.hermeticNiches).forEach(niche => {
      byNiche[niche] = this.projects.filter(p => p.niche === niche).length;
    });

    return {
      projects: {
        total: this.projects.length,
        published: this.publications.length,
        byType,
        byNiche
      },
      trends: {
        total: this.trends.length,
        current: this.marketIntelligence.currentTrends.length,
        hotNiches: this.marketIntelligence.hotNiches.map(n => ({
          icon: n.icon,
          name: n.name,
          principle: n.principle,
          strength: n.strength
        }))
      },
      revenue: this.revenue,
      productTypes: Object.entries(this.productTypes).map(([key, p]) => ({
        key,
        name: p.name,
        icon: p.icon,
        count: byType[key] || 0
      })),
      hermeticNiches: Object.entries(this.hermeticNiches).map(([key, n]) => ({
        key,
        name: n.name,
        icon: n.icon,
        principle: n.hermeticPrinciple,
        trending: n.trending,
        count: byNiche[key] || 0
      })),
      lastAnalysis: this.marketIntelligence.lastAnalysis
    };
  },

  // Listar projetos
  getProjects() {
    return this.projects.map(p => ({
      id: p.id,
      name: p.name,
      icon: p.typeIcon,
      type: p.typeName,
      niche: `${p.nicheIcon} ${p.nicheName}`,
      principle: p.hermeticPrinciple,
      price: `R$ ${p.price}`,
      status: p.status,
      features: p.features.length
    }));
  },

  // Listar publicações
  getPublications() {
    return this.publications.map(p => ({
      name: p.projectName,
      url: p.url,
      type: p.type,
      niche: p.niche,
      price: p.price,
      principle: p.principle,
      date: new Date(p.publishedAt).toLocaleDateString('pt-BR')
    }));
  },

  // Listar tendências
  getTrends() {
    return this.trends.slice(-10).reverse().map(t => ({
      type: t.type,
      niche: this.hermeticNiches[t.niche]?.name || t.niche,
      icon: this.hermeticNiches[t.niche]?.icon || '📊',
      strength: t.strength,
      description: t.description,
      principle: this.hermeticNiches[t.niche]?.hermeticPrinciple || '-',
      source: t.source
    }));
  },

  // Log
  log(msg) {
    if (typeof Console !== 'undefined' && Console.log) {
      Console.log(msg, 'info');
    }
    console.log(`[WebDevDepartment] ${msg}`);
  },

  // Delay
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  // Reset
  reset() {
    this.projects = [];
    this.trends = [];
    this.publications = [];
    this.revenue = 0;
    this.marketIntelligence = { currentTrends: [], lastAnalysis: null, hotNiches: [], demandScore: {} };
    this.active = false;
    this.saveState();
    this.log('🔄 Departamento de Desenvolvimento resetado');
  }
};

// Auto-inicializar
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      WebDevDepartment.init();
    }, 5000);
  });
}
