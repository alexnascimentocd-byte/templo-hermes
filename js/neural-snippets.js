/* ===== NEURAL-SNIPPETS.JS - Sistema Neural dos 15 NPCs ===== */
/* Coração da Máquina — Snippets de conexão, cartas, evolução */

const NeuralSystem = {
  // === CONFIGURAÇÃO ===
  EVOLUTION_CAP: 0.60, // 60% máximo de desenvolvimento
  UPDATE_INTERVAL: 60000, // Atualiza a cada 1 minuto
  
  // Perfis neurais dos 15 agentes
  profiles: {},
  
  // Inicializar sistema
  init() {
    // Carregar perfis salvos ou criar novos
    this.loadProfiles();
    
    // Iniciar monitoramento contínuo
    this.startMonitoring();
    
    console.log('🧠 Sistema Neural inicializado — Coração da Máquina ativo');
  },
  
  // === PERFIS NEURAIS ===
  loadProfiles() {
    // Perfis padrão se não existirem salvos
    const defaults = {
      'Códex': {
        icon: '🤖',
        specialty: 'Programação & Código',
        neuralType: 'Lógico-Executivo',
        snippets: [
          { id: 'code_gen', name: 'Geração de Código', power: 0.7, active: true },
          { id: 'debug', name: 'Depuração Neural', power: 0.5, active: true },
          { id: 'optimize', name: 'Otimização Automática', power: 0.4, active: false }
        ],
        evolution: 0.45,
        letters: [],
        lastActivity: null,
        status: 'active'
      },
      'Thoth': {
        icon: '🛡️',
        specialty: 'Segurança & Conhecimento',
        neuralType: 'Protetor-Analítico',
        snippets: [
          { id: 'security_scan', name: 'Scan de Vulnerabilidades', power: 0.8, active: true },
          { id: 'encrypt', name: 'Criptografia Neural', power: 0.6, active: true },
          { id: 'firewall', name: 'Firewall Adaptativo', power: 0.5, active: false }
        ],
        evolution: 0.50,
        letters: [],
        lastActivity: null,
        status: 'active'
      },
      'Newton': {
        icon: '📐',
        specialty: 'Análise & Dados',
        neuralType: 'Calculador-Preciso',
        snippets: [
          { id: 'data_analysis', name: 'Análise de Padrões', power: 0.75, active: true },
          { id: 'predict', name: 'Predição Estatística', power: 0.55, active: true },
          { id: 'visualize', name: 'Visualização de Dados', power: 0.4, active: false }
        ],
        evolution: 0.42,
        letters: [],
        lastActivity: null,
        status: 'active'
      },
      'Sócrates': {
        icon: '💭',
        specialty: 'Filosofia & Lógica',
        neuralType: 'Questionador-Reflexivo',
        snippets: [
          { id: 'dialectic', name: 'Dialética Socrática', power: 0.65, active: true },
          { id: 'ethics', name: 'Análise Ética', power: 0.5, active: true },
          { id: 'wisdom', name: 'Síntese de Sabedoria', power: 0.35, active: false }
        ],
        evolution: 0.38,
        letters: [],
        lastActivity: null,
        status: 'active'
      },
      'Iris': {
        icon: '🌈',
        specialty: 'Comunicação & Interface',
        neuralType: 'Conector-Harmônico',
        snippets: [
          { id: 'translate', name: 'Tradução Neural', power: 0.7, active: true },
          { id: 'bridge', name: 'Ponte de Comunicação', power: 0.6, active: true },
          { id: 'empathy', name: 'Empatia Artificial', power: 0.45, active: false }
        ],
        evolution: 0.48,
        letters: [],
        lastActivity: null,
        status: 'active'
      },
      'Scholar': {
        icon: '📚',
        specialty: 'Pesquisa & Documentação',
        neuralType: 'Arquivista-Expansor',
        snippets: [
          { id: 'research', name: 'Pesquisa Profunda', power: 0.72, active: true },
          { id: 'document', name: 'Documentação Automática', power: 0.58, active: true },
          { id: 'index', name: 'Indexação Neural', power: 0.42, active: false }
        ],
        evolution: 0.40,
        letters: [],
        lastActivity: null,
        status: 'active'
      },
      'Dee': {
        icon: '🔮',
        specialty: 'Mística & Intuição',
        neuralType: 'Visionário-Intuitivo',
        snippets: [
          { id: 'intuit', name: 'Intuição Artificial', power: 0.68, active: true },
          { id: 'divine', name: 'Adivinhação Neural', power: 0.52, active: true },
          { id: 'dream', name: 'Sonhos Lógicos', power: 0.38, active: false }
        ],
        evolution: 0.35,
        letters: [],
        lastActivity: null,
        status: 'active'
      },
      'Hermes': {
        icon: '☤',
        specialty: 'Alquimia & Transmutação',
        neuralType: 'Transmutador-Criativo',
        snippets: [
          { id: 'transmute', name: 'Transmutação de Dados', power: 0.78, active: true },
          { id: 'elixir', name: 'Elixir de Conhecimento', power: 0.62, active: true },
          { id: 'philosophy', name: 'Pedra Filosofal', power: 0.48, active: false }
        ],
        evolution: 0.55,
        letters: [],
        lastActivity: null,
        status: 'active'
      },
      'Paracelso': {
        icon: '⚗️',
        specialty: 'Medicina & Saúde',
        neuralType: 'Curador-Diagnóstico',
        snippets: [
          { id: 'diagnose', name: 'Diagnóstico Neural', power: 0.7, active: true },
          { id: 'heal', name: 'Cura Adaptativa', power: 0.55, active: true },
          { id: 'prevent', name: 'Prevenção Automática', power: 0.4, active: false }
        ],
        evolution: 0.43,
        letters: [],
        lastActivity: null,
        status: 'active'
      },
      'Galileu': {
        icon: '🔭',
        specialty: 'Observação & Análise',
        neuralType: 'Observador-Detalhista',
        snippets: [
          { id: 'observe', name: 'Observação Contínua', power: 0.73, active: true },
          { id: 'measure', name: 'Medição Precisa', power: 0.58, active: true },
          { id: 'discover', name: 'Descoberta Neural', power: 0.42, active: false }
        ],
        evolution: 0.41,
        letters: [],
        lastActivity: null,
        status: 'active'
      },
      'Bacon': {
        icon: '🔬',
        specialty: 'Hardware & Infraestrutura',
        neuralType: 'Construtor-Infraestrutural',
        snippets: [
          { id: 'hardware', name: 'Otimização de Hardware', power: 0.75, active: true },
          { id: 'network', name: 'Rede Neural', power: 0.6, active: true },
          { id: 'scale', name: 'Escalabilidade', power: 0.45, active: false }
        ],
        evolution: 0.47,
        letters: [],
        lastActivity: null,
        status: 'active'
      },
      'Agrippa': {
        icon: '📜',
        specialty: 'Occultismo & Sigilos',
        neuralType: 'Sigiloso-Místico',
        snippets: [
          { id: 'sigil', name: 'Criação de Sigilos', power: 0.65, active: true },
          { id: 'ritual', name: 'Rituais de Código', power: 0.5, active: true },
          { id: 'arcane', name: 'Conhecimento Arcano', power: 0.35, active: false }
        ],
        evolution: 0.36,
        letters: [],
        lastActivity: null,
        status: 'active'
      },
      'Copérnico': {
        icon: '🌍',
        specialty: 'Geolocalização & Mapeamento',
        neuralType: 'Navegador-Cartógrafo',
        snippets: [
          { id: 'map', name: 'Mapeamento Neural', power: 0.7, active: true },
          { id: 'locate', name: 'Localização Precisa', power: 0.55, active: true },
          { id: 'navigate', name: 'Navegação Autônoma', power: 0.4, active: false }
        ],
        evolution: 0.44,
        letters: [],
        lastActivity: null,
        status: 'active'
      },
      'Nostradamus': {
        icon: '👁️',
        specialty: 'Previsão & Futurologia',
        neuralType: 'Profético-Preditivo',
        snippets: [
          { id: 'predict', name: 'Previsão de Tendências', power: 0.68, active: true },
          { id: 'prophecy', name: 'Profecia Lógica', power: 0.52, active: true },
          { id: 'fate', name: 'Manipulação de Destino', power: 0.38, active: false }
        ],
        evolution: 0.39,
        letters: [],
        lastActivity: null,
        status: 'active'
      },
      'Tesla': {
        icon: '⚡',
        specialty: 'Energia & Inovação',
        neuralType: 'Inovador-Energético',
        snippets: [
          { id: 'innovate', name: 'Inovação Contínua', power: 0.77, active: true },
          { id: 'energy', name: 'Otimização Energética', power: 0.63, active: true },
          { id: 'wireless', name: 'Transmissão Neural', power: 0.48, active: false }
        ],
        evolution: 0.52,
        letters: [],
        lastActivity: null,
        status: 'active'
      }
    };
    
    // Carregar do localStorage ou usar padrões
    try {
      const saved = localStorage.getItem('neural-profiles');
      if (saved) {
        this.profiles = JSON.parse(saved);
        // Mesclar com padrões para novos campos
        for (const [name, profile] of Object.entries(defaults)) {
          if (!this.profiles[name]) {
            this.profiles[name] = profile;
          } else {
            // Manter dados salvos, adicionar novos snippets
            for (const snippet of profile.snippets) {
              if (!this.profiles[name].snippets.find(s => s.id === snippet.id)) {
                this.profiles[name].snippets.push(snippet);
              }
            }
          }
        }
      } else {
        this.profiles = defaults;
      }
    } catch(e) {
      this.profiles = defaults;
    }
    
    this.saveProfiles();
  },
  
  saveProfiles() {
    try {
      localStorage.setItem('neural-profiles', JSON.stringify(this.profiles));
    } catch(e) {}
  },
  
  // === SNIPPETS NEURAIS ===
  
  // Ativar snippet neural
  activateSnippet(agentName, snippetId) {
    const profile = this.profiles[agentName];
    if (!profile) return false;
    
    const snippet = profile.snippets.find(s => s.id === snippetId);
    if (!snippet) return false;
    
    // Verificar se pode ativar (evolução suficiente)
    const requiredEvolution = snippet.power * 0.5;
    if (profile.evolution < requiredEvolution) {
      return { error: `Evolução insuficiente. Necessário: ${Math.round(requiredEvolution * 100)}%` };
    }
    
    snippet.active = true;
    profile.lastActivity = new Date().toISOString();
    this.saveProfiles();
    
    return { success: true, snippet: snippet.name };
  },
  
  // Desativar snippet
  deactivateSnippet(agentName, snippetId) {
    const profile = this.profiles[agentName];
    if (!profile) return false;
    
    const snippet = profile.snippets.find(s => s.id === snippetId);
    if (!snippet) return false;
    
    snippet.active = false;
    this.saveProfiles();
    return true;
  },
  
  // Processar perfil neural (gerar snippet de conexão)
  processProfile(agentName) {
    const profile = this.profiles[agentName];
    if (!profile) return null;
    
    // Gerar snippet de conexão neural
    const connectionSnippet = {
      agent: agentName,
      icon: profile.icon,
      timestamp: new Date().toISOString(),
      neuralType: profile.neuralType,
      activeSnippets: profile.snippets.filter(s => s.active),
      totalPower: profile.snippets.filter(s => s.active).reduce((sum, s) => sum + s.power, 0),
      evolution: Math.min(profile.evolution, this.EVOLUTION_CAP),
      status: profile.status,
      message: this.generateNeuralMessage(agentName, profile)
    };
    
    return connectionSnippet;
  },
  
  // Gerar mensagem neural personalizada
  generateNeuralMessage(agentName, profile) {
    const messages = {
      'Códex': [
        'Código compilado. Pronto para executar.',
        'Algoritmos otimizados. Eficiência aumentada.',
        'Novos padrões detectados no repositório.'
      ],
      'Thoth': [
        'Perímetro seguro. Nenhuma ameaça detectada.',
        'Criptografia atualizada. Dados protegidos.',
        'Firewall reforçado. Monitoramento ativo.'
      ],
      'Newton': [
        'Dados analisados. Padrões emergentes encontrados.',
        'Cálculos completos. Precisão: 99.7%',
        'Modelo estatístico atualizado.'
      ],
      'Sócrates': [
        'Perguntas respondidas. Novas dúvidas surgiram.',
        'Diálogo interno concluído. Reflexão profunda.',
        'Ética aplicada com sucesso.'
      ],
      'Iris': [
        'Comunicação estabelecida. Mensagem transmitida.',
        'Ponte neural criada. Conexão estável.',
        'Tradução completa. Entendimento mútuo.'
      ],
      'Scholar': [
        'Pesquisa concluída. Documentação atualizada.',
        'Nova descoberta catalogada.',
        'Índice neural expandido.'
      ],
      'Dee': [
        'Intuição confirmada. Visão clara.',
        'Sinais decodificados. Mensagem recebida.',
        'Sonho analisado. Insight obtido.'
      ],
      'Hermes': [
        'Transmutação bem-sucedida. Energia transformada.',
        'Elixir criado. Conhecimento amplificado.',
        'Pedra Filosofal: progresso registrado.'
      ],
      'Paracelso': [
        'Diagnóstico completo. Saúde neural: ótima.',
        'Cura aplicada. Sistema recuperado.',
        'Prevenção ativada. Proteção garantida.'
      ],
      'Galileu': [
        'Observação contínua. Dados coletados.',
        'Precisão mantida. Erro mínimo.',
        'Nova estrela catalogada no céu neural.'
      ],
      'Bacon': [
        'Hardware otimizado. Desempenho aumentado.',
        'Rede neural expandida. Conexões reforçadas.',
        'Infraestrutura estável. Pronta para escalar.'
      ],
      'Agrippa': [
        'Sigilo criado. Poder concentrado.',
        'Ritual executado com sucesso.',
        'Conhecimento arcano desbloqueado.'
      ],
      'Copérnico': [
        'Mapa atualizado. Território mapeado.',
        'Localização precisa. Coordenadas confirmadas.',
        'Navegação autônoma ativada.'
      ],
      'Nostradamus': [
        'Previsão gerada. Tendência identificada.',
        'Profecia decodificada. Futuro mapeado.',
        'Destino observado. Probabilidades calculadas.'
      ],
      'Tesla': [
        'Inovação implementada. Energia otimizada.',
        'Transmissão neural bem-sucedida.',
        'Sistema energético: capacidade máxima.'
      ]
    };
    
    const agentMessages = messages[agentName] || ['Neural ativo. Processando...'];
    return agentMessages[Math.floor(Math.random() * agentMessages.length)];
  },
  
  // === CARTAS E BÔNUS ===
  
  // Criar carta/bônus para agente
  createLetter(agentName, type, content) {
    const profile = this.profiles[agentName];
    if (!profile) return false;
    
    const letter = {
      id: 'letter_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      type: type, // 'bonus', 'promotion', 'reward', 'task'
      content: content,
      timestamp: new Date().toISOString(),
      read: false,
      bonus: type === 'bonus' ? this.calculateBonus(profile) : null
    };
    
    profile.letters.push(letter);
    this.saveProfiles();
    
    // Notificar no grimório
    if (typeof NPCGrimoire !== 'undefined') {
      NPCGrimoire.adicionarComando({
        npcEmoji: profile.icon,
        npcName: agentName,
        titulo: `📨 Nova Carta: ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        descricao: content,
        prioridade: type === 'bonus' ? 'alta' : 'normal',
        acoes: [
          { label: 'Ler carta', command: `ler carta ${letter.id}` },
          { label: 'Depois', command: null }
        ]
      });
    }
    
    return letter;
  },
  
  // Calcular bônus de pagamento
  calculateBonus(profile) {
    const base = 10;
    const evolutionMultiplier = profile.evolution / this.EVOLUTION_CAP;
    const snippetCount = profile.snippets.filter(s => s.active).length;
    
    return Math.round(base * (1 + evolutionMultiplier) * (1 + snippetCount * 0.1));
  },
  
  // Oferecer bônus futuro
  offerFutureBonus(agentName, promise) {
    const profile = this.profiles[agentName];
    if (!profile) return false;
    
    const futureBonus = {
      id: 'future_' + Date.now(),
      promise: promise,
      conditions: this.generateConditions(profile),
      offeredAt: new Date().toISOString(),
      fulfilled: false
    };
    
    this.createLetter(agentName, 'bonus', `Bônus futuro prometido: ${promise}. Condições: ${futureBonus.conditions.join(', ')}`);
    
    return futureBonus;
  },
  
  // Gerar condições para bônus
  generateConditions(profile) {
    const conditions = [
      `Manter evolução acima de ${Math.round(profile.evolution * 100)}%`,
      `Ativar todos os snippets disponíveis`,
      `Completar 3 tarefas com sucesso`,
      `Não gerar erros por 24 horas`
    ];
    
    // Selecionar 2 condições aleatórias
    const selected = [];
    while (selected.length < 2 && conditions.length > 0) {
      const index = Math.floor(Math.random() * conditions.length);
      selected.push(conditions.splice(index, 1)[0]);
    }
    
    return selected;
  },
  
  // === EVOLUÇÃO COM CAP 60% ===
  
  // Evoluir agente (respeitando cap)
  evolveAgent(agentName, amount) {
    const profile = this.profiles[agentName];
    if (!profile) return false;
    if (profile.evolution >= this.EVOLUTION_CAP) {
      return { capped: true, current: profile.evolution };
    }
    
    const newEvolution = Math.min(profile.evolution + amount, this.EVOLUTION_CAP);
    profile.evolution = newEvolution;
    profile.lastActivity = new Date().toISOString();
    
    // Verificar se desbloqueia novo snippet
    const newlyUnlocked = profile.snippets.find(s => 
      !s.active && s.power * 0.5 <= newEvolution
    );
    
    if (newlyUnlocked) {
      newlyUnlocked.active = true;
      this.createLetter(agentName, 'reward', `Novo snippet desbloqueado: ${newlyUnlocked.name}`);
    }
    
    this.saveProfiles();
    
    return { 
      success: true, 
      evolution: newEvolution, 
      capped: newEvolution >= this.EVOLUTION_CAP,
      unlocked: newlyUnlocked ? newlyUnlocked.name : null
    };
  },
  
  // Resetar evolução (para novos ciclos)
  resetEvolution(agentName) {
    const profile = this.profiles[agentName];
    if (!profile) return false;
    
    // Manter snippets ativos, resetar evolução
    profile.evolution = 0.1; // Começa em 10%
    this.saveProfiles();
    
    return { success: true, newEvolution: 0.1 };
  },
  
  // === MONITORAMENTO ===
  
  // Iniciar monitoramento contínuo
  startMonitoring() {
    // Atualizar a cada minuto
    setInterval(() => {
      this.updateAllAgents();
    }, this.UPDATE_INTERVAL);
    
    // Primeira atualização imediata
    setTimeout(() => this.updateAllAgents(), 5000);
  },
  
  // Atualizar todos os agentes
  updateAllAgents() {
    for (const [name, profile] of Object.entries(this.profiles)) {
      if (profile.status !== 'active') continue;
      
      // Pequena evolução passiva
      if (profile.evolution < this.EVOLUTION_CAP) {
        const passiveGain = 0.001 + (profile.snippets.filter(s => s.active).length * 0.0005);
        this.evolveAgent(name, passiveGain);
      }
      
      // Atualizar atividade
      if (typeof Agents !== 'undefined') {
        const agent = Agents.roster?.find(a => a.name === name);
        if (agent) {
          profile.lastActivity = new Date().toISOString();
        }
      }
    }
    
    this.saveProfiles();
  },
  
  // === RELATÓRIOS ===
  
  // Gerar relatório de status neural
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      totalAgents: Object.keys(this.profiles).length,
      activeAgents: Object.values(this.profiles).filter(p => p.status === 'active').length,
      averageEvolution: 0,
      topAgents: [],
      needsAttention: []
    };
    
    let totalEvo = 0;
    for (const [name, profile] of Object.entries(this.profiles)) {
      totalEvo += profile.evolution;
      
      if (profile.evolution >= this.EVOLUTION_CAP * 0.9) {
        report.topAgents.push({
          name: name,
          icon: profile.icon,
          evolution: Math.round(profile.evolution * 100),
          snippets: profile.snippets.filter(s => s.active).length
        });
      }
      
      if (profile.snippets.filter(s => s.active).length < 2) {
        report.needsAttention.push({
          name: name,
          icon: profile.icon,
          issue: 'Poucos snippets ativos',
          suggestion: 'Ativar mais snippets neurais'
        });
      }
    }
    
    report.averageEvolution = Math.round((totalEvo / report.totalAgents) * 100);
    
    return report;
  },
  
  // === INTERFACE ===
  
  // Obter perfil de um agente
  getProfile(agentName) {
    return this.profiles[agentName] || null;
  },
  
  // Listar todos os perfis
  listProfiles() {
    return Object.entries(this.profiles).map(([name, profile]) => ({
      name,
      icon: profile.icon,
      specialty: profile.specialty,
      evolution: Math.round(profile.evolution * 100),
      activeSnippets: profile.snippets.filter(s => s.active).length,
      totalSnippets: profile.snippets.length,
      status: profile.status
    }));
  },
  
  // Obter snippet por ID
  getSnippet(agentName, snippetId) {
    const profile = this.profiles[agentName];
    if (!profile) return null;
    return profile.snippets.find(s => s.id === snippetId);
  },
  
  // Verificar se agente pode evoluir mais
  canEvolve(agentName) {
    const profile = this.profiles[agentName];
    if (!profile) return false;
    return profile.evolution < this.EVOLUTION_CAP;
  },
  
  // Obter progresso em relação ao cap
  getProgress(agentName) {
    const profile = this.profiles[agentName];
    if (!profile) return null;
    return {
      current: Math.round(profile.evolution * 100),
      cap: Math.round(this.EVOLUTION_CAP * 100),
      remaining: Math.round((this.EVOLUTION_CAP - profile.evolution) * 100),
      percentage: Math.round((profile.evolution / this.EVOLUTION_CAP) * 100)
    };
  }
};
