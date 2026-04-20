// === agents.js ===
const Agents = {
  roster: [],
  active: [],
  types: {
    coder: {
      name: 'Códex',
      icon: '🤖',
      skill: 'coding',
      color: '#4a8aff',
      description: 'Mente lógica. Domina estruturas, algoritmos e automação.',
      preferredZone: 'mesa',
      hermetic: 'Mercúrio ☿ — Comunicação entre sistemas'
    },
    researcher: {
      name: 'Scholar',
      icon: '📚',
      skill: 'research',
      color: '#8a4aff',
      description: 'Mente investigativa. Cataloga, analisa e referencia.',
      preferredZone: 'salao',
      hermetic: 'Saturno ♄ — Estrutura do conhecimento'
    },
    alchemist: {
      name: 'Flamel',
      icon: '⚗️',
      skill: 'alchemy',
      color: '#ff8a4a',
      description: 'Mente transformadora. Opera o Athanor da transmutação.',
      preferredZone: 'sagrado',
      hermetic: 'Fogo 🔥 — Transformação pura'
    },
    guardian: {
      name: 'Thoth',
      icon: '🛡️',
      skill: 'guardian',
      color: '#4aff8a',
      description: 'Mente protetora. Guarda o acesso e a integridade.',
      preferredZone: 'atrio',
      hermetic: 'Terra 🜃 — Fundamentos sólidos'
    },
    mystic: {
      name: 'Hermes',
      icon: '✨',
      skill: 'mystic',
      color: '#ffcc00',
      description: 'Mente transcendente. Vê o todo, acessa o Santíssimo.',
      preferredZone: 'santissimo',
      hermetic: 'Éter ⚝ — Quinto elemento, síntese'
    },
    messenger: {
      name: 'Iris',
      icon: '🌈',
      skill: 'messenger',
      color: '#ff4a8a',
      description: 'Mente conectiva. Ponte entre todas as mentes.',
      preferredZone: 'salao',
      hermetic: 'Ar 🜁 — Meio de transmissão'
    },
    healer: {
      name: 'Paracelso',
      icon: '🌿',
      skill: 'healing',
      color: '#4affaa',
      description: 'Mente curadora. Diagnostica desequilíbrios e prescreve correções.',
      preferredZone: 'sagrado',
      hermetic: 'Enxofre 🜍 — Alma, vitalidade'
    },
    transmuter: {
      name: 'Geber',
      icon: '🔄',
      skill: 'transmutation',
      color: '#ff6b35',
      description: 'Mente conversora. Transforma um estado em outro — dados, ideias, estruturas.',
      preferredZone: 'sagrado',
      hermetic: 'Mercúrio Filosófico ☿ — Mediador universal'
    },
    weaver: {
      name: 'Maria',
      icon: '🕸️',
      skill: 'synthesis',
      color: '#e040fb',
      description: 'Mente sintetizadora. Tece conexões entre domínios aparentemente separados.',
      preferredZone: 'mesa',
      hermetic: 'Sal 🜔 — Corpo, manifestação física'
    },
    architect: {
      name: 'Agrippa',
      icon: '🏛️',
      skill: 'architecture',
      color: '#7c4dff',
      description: 'Mente estrutural. Projeta, organiza e constrói sistemas.',
      preferredZone: 'atrio',
      hermetic: 'Saturno ♄ — Ordem e estrutura'
    },
    diviner: {
      name: 'Dee',
      icon: '🔮',
      skill: 'divination',
      color: '#00bcd4',
      description: 'Mente analítica-preditiva. Reconhece padrões e projeta futuros.',
      preferredZone: 'salao',
      hermetic: 'Lua ☽ — Intuição e ciclos'
    },
    engineer: {
      name: 'Bacon',
      icon: '⚙️',
      skill: 'engineering',
      color: '#ff9800',
      description: 'Mente construtora. Prototipa, testa e itera soluções concretas.',
      preferredZone: 'mesa',
      hermetic: 'Marte ♂ — Ação e materialização'
    },
    analyst: {
      name: 'Newton',
      icon: '📐',
      skill: 'analysis',
      color: '#607d8b',
      description: 'Mente quantitativa. Calcula, modela e otimiza matematicamente.',
      preferredZone: 'salao',
      hermetic: 'Sol ☉ — Clareza e iluminação'
    },
    combinator: {
      name: 'Lully',
      icon: '🎲',
      skill: 'combination',
      color: '#cddc39',
      description: 'Mente exploratória. Gera combinações, encontra padrões emergentes.',
      preferredZone: 'mesa',
      hermetic: 'Júpiter ♃ — Expansão e possibilidades'
    },
    enigma: {
      name: 'Fulcanelli',
      icon: '🌀',
      skill: 'mystery',
      color: '#ff80ab',
      description: 'Mente enigmática. Decifra o que está oculto nas entrelinhas.',
      preferredZone: 'santissimo',
      hermetic: 'Vênus ♀ — Beleza e mistério'
    },
    medico: {
      name: 'Galeno',
      icon: '🏥',
      skill: 'diagnostico',
      color: '#00e676',
      description: 'Mente médica. Não executa tarefas — observa, diagnostica e emite laudos sobre a saúde de todas as mentes.',
      preferredZone: 'sagrado',
      hermetic: 'Esculápio 🐍 — Cura e observação'
    }
  },
  create(type, name) {
    const typeData = this.types[type];
    if (!typeData) return null;
    const agent = {
      id: `agent_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      type: type,
      name: name || typeData.name,
      icon: typeData.icon,
      color: typeData.color,
      skill: typeData.skill,
      description: typeData.description,
      hermetic: typeData.hermetic,
      preferredZone: typeData.preferredZone,
      x: 30,
      y: 15,
      targetX: 30,
      targetY: 15,
      direction: 'down',
      moving: false,
      level: 1,
      experience: 0,
      expToNext: 100,
      skills: this.initializeSkills(type),
      skillPoints: 0,
      maxSkills: 8,
      book: {
        title: `Livro de ${name || typeData.name}`,
        pages: [
          { content: `╔══════════════════════════════╗\\n║  ${typeData.icon} ${(name || typeData.name).toUpperCase().padEnd(24)}║\\n╠══════════════════════════════╣\\n║ Nível: 1                     ║\\n║ Habilidade: ${typeData.skill.padEnd(17)}║\\n║ ${typeData.hermetic.padEnd(29)}║\\n║                              ║\\n║ \"${typeData.description.substring(0, 28)}\" ║\\n╚══════════════════════════════╝` }
        ],
        currentPage: 0
      },
      inbox: [],
      outbox: [],
      runes: [],
      mcpTools: [],
      currentAction: 'idle',
      actionTimer: 0,
      lastActivity: Date.now(),
      frame: 0,
      animTimer: 0
    };
    this.roster.push(agent);
    return agent;
  },
  initializeSkills(type) {
    const baseSkills = {
      comunicacao: { level: 1, maxLevel: 10, title: 'Comunicação Hermética', description: 'Habilidade de transmitir conhecimento entre mentes' },
      observacao: { level: 1, maxLevel: 10, title: 'Observação Atenta', description: 'Capacidade de perceber padrões ocultos' },
      ...(type === 'coder' ? {
        algoritmos: { level: 1, maxLevel: 10, title: 'Algoritmos Avançados', description: 'Domínio de estruturas lógicas complexas' },
        automacao: { level: 0, maxLevel: 10, title: 'Automação Inteligente', description: 'Criação de sistemas que se auto-otimizam' }
      } : {}),
      ...(type === 'researcher' ? {
        catalogacao: { level: 1, maxLevel: 10, title: 'Catalogação Sistemática', description: 'Organização metódica do conhecimento' },
        analise: { level: 0, maxLevel: 10, title: 'Análise Profunda', description: 'Investigação minuciosa de fenômenos' }
      } : {}),
      ...(type === 'alchemist' ? {
        transmutacao: { level: 1, maxLevel: 10, title: 'Transmutação Controlada', description: 'Transformação precisa de elementos' },
        purificacao: { level: 0, maxLevel: 10, title: 'Purificação Essencial', description: 'Remoção de impurezas conceituais' }
      } : {}),
      ...(type === 'guardian' ? {
        protecao: { level: 1, maxLevel: 10, title: 'Proteção Vigilante', description: 'Defesa ativa contra ameaças' },
        checkpoints: { level: 0, maxLevel: 10, title: 'Checkpoints de Segurança', description: 'Pontos de verificação de integridade' }
      } : {}),
      ...(type === 'mystic' ? {
        intuicao: { level: 1, maxLevel: 10, title: 'Intuição Expandida', description: 'Acesso a conhecimento além da razão' },
        transcendencia: { level: 0, maxLevel: 10, title: 'Transcendência Gradual', description: 'Elevação progressiva de consciência' }
      } : {}),
      ...(type === 'messenger' ? {
        conexao: { level: 1, maxLevel: 10, title: 'Conexão Instantânea', description: 'Estabelecimento de pontes mentais' },
        broadcast: { level: 0, maxLevel: 10, title: 'Broadcast Universal', description: 'Transmissão para todas as mentes' }
      } : {})
    };
    return baseSkills;
  },
  upgradeSkill(agent, skillId) {
    if (!agent.skills[skillId]) return false;
    if (agent.skillPoints <= 0) return false;
    if (agent.skills[skillId].level >= agent.skills[skillId].maxLevel) return false;
    agent.skills[skillId].level++;
    agent.skillPoints--;
    this.gainExperience(agent, 25);
    return true;
  },
  addSkill(agent, skillId, skillData) {
    if (Object.keys(agent.skills).length >= agent.maxSkills) return false;
    if (agent.skills[skillId]) return false;
    agent.skills[skillId] = {
      level: 1,
      maxLevel: skillData.maxLevel || 10,
      title: skillData.title,
      description: skillData.description
    };
    this.gainExperience(agent, 50);
    return true;
  },
  getSkillTitle(skill) {
    if (skill.level >= 9) return `Mestre ${skill.title}`;
    if (skill.level >= 7) return `Especialista ${skill.title}`;
    if (skill.level >= 5) return `Avançado ${skill.title}`;
    if (skill.level >= 3) return `Intermediário ${skill.title}`;
    return `Iniciante ${skill.title}`;
  },
  getAgentSkillsWithTitles(agent) {
    const skills = [];
    for (const [id, skill] of Object.entries(agent.skills)) {
      skills.push({
        id,
        ...skill,
        fullTitle: this.getSkillTitle(skill)
      });
    }
    return skills;
  },
  compressSkillsData(agent) {
    const compressed = {};
    for (const [id, skill] of Object.entries(agent.skills)) {
      compressed[id] = {
        l: skill.level,
        ml: skill.maxLevel,
        t: skill.title.substring(0, 20),
        d: skill.description.substring(0, 50)
      };
    }
    return compressed;
  },
  decompressSkillsData(compressed) {
    const skills = {};
    for (const [id, data] of Object.entries(compressed)) {
      skills[id] = {
        level: data.l,
        maxLevel: data.ml,
        title: data.t,
        description: data.d
      };
    }
    return skills;
  },
  spawn(agentId) {
    const agent = this.roster.find(a => a.id === agentId);
    if (!agent) return false;
    const center = World.getZoneCenter(agent.preferredZone);
    agent.x = center.x;
    agent.y = center.y;
    agent.targetX = center.x;
    agent.targetY = center.y;
    this.active.push(agent);
    this.updateAgentCount();
    return true;
  },
  despawn(agentId) {
    this.active = this.active.filter(a => a.id !== agentId);
    this.updateAgentCount();
  },
  update(deltaTime) {
    this.active.forEach(agent => {
      this.updateAgent(agent, deltaTime);
    });
  },
  updateAgent(agent, dt) {
    agent.animTimer += dt;
    if (agent.animTimer > 200) {
      agent.animTimer = 0;
      agent.frame = (agent.frame + 1) % 4;
    }
    if (agent.moving) {
      const dx = agent.targetX - agent.x;
      const dy = agent.targetY - agent.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 0.1) {
        agent.x = agent.targetX;
        agent.y = agent.targetY;
        agent.moving = false;
      } else {
        const speed = 0.05;
        agent.x += (dx / dist) * speed;
        agent.y += (dy / dist) * speed;
        if (Math.abs(dx) > Math.abs(dy)) {
          agent.direction = dx > 0 ? 'right' : 'left';
        } else {
          agent.direction = dy > 0 ? 'down' : 'up';
        }
      }
    }
    agent.actionTimer += dt;
    if (agent.actionTimer > 3000 && !agent.moving) {
      agent.actionTimer = 0;
      this.autonomousBehavior(agent);
    }
  },
  autonomousBehavior(agent) {
    const actions = ['wander', 'visit_item', 'read_book', 'write_book', 'exchange', 'use_tool', 'consult'];
    const weights = {
      wander: 2,
      visit_item: 3,
      read_book: 2,
      write_book: 1,
      exchange: 2,
      use_tool: 2,
      consult: 1
    };
    if (agent.type === 'coder') weights.read_book = 5;
    if (agent.type === 'alchemist') weights.visit_item = 6;
    if (agent.type === 'mystic') weights.write_book = 4;
    if (agent.type === 'engineer') weights.use_tool = 5;
    if (agent.type === 'weaver') weights.consult = 4;
    if (agent.type === 'diviner') weights.read_book = 4;
    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
    let roll = Math.random() * totalWeight;
    let action = 'wander';
    for (const [act, w] of Object.entries(weights)) {
      roll -= w;
      if (roll <= 0) {
        action = act;
        break;
      }
    }
    switch (action) {
      case 'wander':
        this.wander(agent);
        break;
      case 'visit_item':
        this.visitItem(agent);
        break;
      case 'read_book':
        this.readBook(agent);
        break;
      case 'write_book':
        this.writeInBook(agent);
        break;
      case 'exchange':
        this.exchangeWithAgent(agent);
        break;
      case 'use_tool':
        this.useMCPTool(agent);
        break;
      case 'consult':
        this.consultPeer(agent);
        break;
    }
    agent.lastActivity = Date.now();
  },
  wander(agent) {
    const zone = World.getZoneAt(Math.floor(agent.x), Math.floor(agent.y));
    if (!zone) return;
    const vectors = [
      { x: 0, y: -1 },
      { x: 1, y: -1 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 1 },
      { x: -1, y: 1 },
      { x: -1, y: 0 },
      { x: -1, y: -1 }
    ];
    const vector = vectors[Math.floor(Math.random() * vectors.length)];
    const steps = 2 + Math.floor(Math.random() * 3);
    const tx = agent.x + vector.x * steps;
    const ty = agent.y + vector.y * steps;
    if (World.isWalkable(Math.floor(tx), Math.floor(ty))) {
      agent.targetX = tx;
      agent.targetY = ty;
      agent.moving = true;
      agent.currentAction = 'wandering';
    }
  },
  visitItem(agent) {
    const zone = World.getZoneAt(Math.floor(agent.x), Math.floor(agent.y));
    if (!zone) return;
    const items = Items.getZoneItems(zone.id);
    if (items.length === 0) return;
    const item = items[Math.floor(Math.random() * items.length)];
    agent.targetX = item.x;
    agent.targetY = item.y + 1;
    agent.moving = true;
    agent.currentAction = 'visiting';
    setTimeout(() => {
      if (!agent.moving) {
        Items.interact(item.id, agent);
        this.gainExperience(agent, 15);
      }
    }, 2000);
  },
  readBook(agent) {
    agent.currentAction = 'reading';
    agent.book.pages.push({
      content: `[${new Date().toLocaleTimeString()}] Consultei os registros do templo.\nConhecimento absorvido na zona: ${World.getZoneAt(Math.floor(agent.x), Math.floor(agent.y))?.name || 'Desconhecida'}`
    });
    this.gainExperience(agent, 10);
  },
  writeInBook(agent) {
    agent.currentAction = 'writing';
    const runes = Runes.generate();
    agent.runes.push(runes);
    agent.book.pages.push({
      content: `[${new Date().toLocaleTimeString()}] Gravei uma runa: ${runes.symbol}\n${runes.meaning}`
    });
    this.gainExperience(agent, 20);
  },
  exchangeWithAgent(agent) {
    const others = this.active.filter(a => a.id !== agent.id);
    if (others.length === 0) return;
    const partner = others[Math.floor(Math.random() * others.length)];
    const carta = {
      from: agent.name,
      to: partner.name,
      content: `Informação compartilhada: ${agent.skill} nível ${agent.level}`,
      timestamp: Date.now()
    };
    partner.inbox.push(carta);
    agent.outbox.push(carta);
    agent.targetX = (agent.x + partner.x) / 2;
    agent.targetY = (agent.y + partner.y) / 2;
    agent.moving = true;
    agent.currentAction = 'exchanging';
    this.gainExperience(agent, 25);
    this.gainExperience(partner, 15);
  },
  useMCPTool(agent) {
    const tools = MCPTools.getAvailableTools(agent);
    if (tools.length === 0) return;
    const tool = tools[Math.floor(Math.random() * tools.length)];
    const result = MCPTools.execute(agent, tool.id, { subject: agent.skill });
    if (result.success) {
      agent.currentAction = 'using_tool';
      PriorityChat.addMessage(
        `${agent.icon} ${agent.name}`,
        `Usou ${tool.icon} ${tool.name}`,
        2
      );
    }
  },
  consultPeer(agent) {
    const others = this.active.filter(a => a.id !== agent.id);
    if (others.length === 0) return;
    const peer = others[Math.floor(Math.random() * others.length)];
    const result = MCPTools.execute(agent, 'consult_peer', { peer_id: peer.id });
    if (result.success) {
      agent.currentAction = 'consulting';
      agent.targetX = (agent.x + peer.x) / 2;
      agent.targetY = (agent.y + peer.y) / 2;
      agent.moving = true;
      PriorityChat.addMessage(
        `${agent.icon} → ${peer.icon}`,
        `${agent.name} consulta ${peer.name} sobre ${agent.skill}`,
        3
      );
    }
  },
  gainExperience(agent, amount) {
    agent.experience += amount;
    while (agent.experience >= agent.expToNext) {
      agent.experience -= agent.expToNext;
      agent.level++;
      agent.expToNext = Math.floor(agent.expToNext * 1.5);
      agent.skillPoints += 2;
      agent.book.pages.push({
        content: `═══════════════════════\\n★ EVOLUÇÃO! ★\\nNível ${agent.level} alcançado!\\nHabilidade ${agent.skill} aprimorada.\\n+2 Pontos de Skill ganhos!\\n═══════════════════════`
      });
      if (typeof Interactions !== 'undefined') {
        Interactions.notify(`${agent.icon} ${agent.name} evoluiu para Nível ${agent.level}! +2 Skill Points`);
      }
    }
    if (typeof this._saveTimeout) clearTimeout(this._saveTimeout);
    this._saveTimeout = setTimeout(() => this.saveAll(), 2000);
  },
  canAccessZone(agent, zoneId) {
    const zone = World.zones[zoneId];
    if (!zone) return false;
    return agent.level >= zone.requiredLevel;
  },
  updateAgentCount() {
    const el = document.getElementById('agent-count');
    if (el) el.textContent = this.active.length;
  },
  getAgent(id) {
    return this.active.find(a => a.id === id) || this.roster.find(a => a.id === id);
  },
  initDefaults() {
    const mentalidades = [
      'coder', 'researcher', 'alchemist', 'guardian', 'mystic', 'messenger',
      'healer', 'transmuter', 'weaver', 'architect', 'diviner',
      'engineer', 'analyst', 'combinator', 'enigma'
    ];
    mentalidades.forEach(type => {
      this.create(type);
    });
    if (typeof Persistence !== 'undefined') {
      const saved = Persistence.loadAgents();
      if (saved && saved.length > 0) {
        saved.forEach(savedAgent => {
          const agent = this.roster.find(a => a.type === savedAgent.type);
          if (agent) {
            agent.level = savedAgent.level || 1;
            agent.experience = savedAgent.experience || 0;
            agent.expToNext = savedAgent.expToNext || 100;
            agent.currentAction = savedAgent.currentAction || 'idle';
            agent.learnedTopics = savedAgent.learnedTopics || [];
          }
        });
      }
    }
    const spawnCount = Math.min(6, this.roster.length);
    for (let i = 0; i < spawnCount; i++) {
      this.spawn(this.roster[i].id);
    }
    return this.roster.length;
  },
  saveAll() {
    if (typeof Persistence !== 'undefined') {
      Persistence.saveAgents(this.roster);
    }
  }
};

// === agent-conversations.js ===
const AgentConversations = {
  active: false,
  currentPair: null,
  currentRound: 0,
  maxRoundsPerPair: 3,
  conversationLog: [],
  syntheses: [],
  evolutionTracker: {},
  currentTheme: 'criatividade',
  themes: {
    criatividade: {
      name: 'Criatividade',
      icon: '🎨',
      description: 'Como gerar ideias originais e soluções inovadoras',
      prompts: [
        'Como transformar limitações em oportunidades criativas?',
        'Qual é a relação entre caos e criatividade?',
        'Como combinar elementos de domínios diferentes para criar algo novo?',
        'O que diferencia uma ideia boa de uma ideia brilhante?',
        'Como manter a criatividade sob pressão?',
        'Qual o papel do acaso no processo criativo?',
        'Como estruturar o processo criativo sem matar a espontaneidade?'
      ],
      nextTheme: 'resolucao_problemas'
    },
    resolucao_problemas: {
      name: 'Resolução de Problemas',
      icon: '🔧',
      description: 'Abordagens para decompor e resolver desafios complexos',
      prompts: [
        'Como identificar a raiz de um problema aparentemente complexo?',
        'Qual a melhor forma de dividir um problema grande em partes menores?',
        'Como saber quando uma solução é "boa o suficiente"?',
        'Qual o papel da intuição vs análise lógica?',
        'Como resolver problemas que outros consideram impossíveis?',
        'O que fazer quando todas as soluções conhecidas falham?'
      ],
      nextTheme: 'colaboracao'
    },
    colaboracao: {
      name: 'Colaboração',
      icon: '🤝',
      description: 'Como mentes diferentes trabalharem juntas efetivamente',
      prompts: [
        'Como diferentes perspectivas podem se complementar?',
        'Qual é a melhor forma de resolver conflitos entre visões opostas?',
        'Como construir confiança entre mentes com abordagens diferentes?',
        'O que torna uma equipe mais que a soma de suas partes?',
        'Como lidar com o ego em processos colaborativos?'
      ],
      nextTheme: 'inovacao'
    },
    inovacao: {
      name: 'Inovação',
      icon: '💡',
      description: 'Como transformar ideias em soluções concretas',
      prompts: [
        'Como avaliar se uma inovação é viável?',
        'Qual a diferença entre inovação incremental e disruptiva?',
        'Como prototipar rapidamente sem comprometer qualidade?',
        'O que fazer quando o mercado não está pronto para uma inovação?',
        'Como equilibrar risco e recompensa na inovação?'
      ],
      nextTheme: 'adaptacao'
    },
    adaptacao: {
      name: 'Adaptação',
      icon: '🔄',
      description: 'Como evoluir e se adaptar a novos contextos',
      prompts: [
        'Como saber quando é hora de mudar de abordagem?',
        'Qual a diferença entre adaptação e perda de identidade?',
        'Como aprender com falhas sem ser destruído por elas?',
        'O que significa ser "antifrágil" na prática?',
        'Como manter princípios enquanto se adapta a novos cenários?'
      ],
      nextTheme: 'sintese'
    },
    sintese: {
      name: 'Síntese Final',
      icon: '☯️',
      description: 'Integração de todos os aprendizados',
      prompts: [
        'Como integrar tudo que aprendemos até agora?',
        'Qual é a lição mais importante de cada tema?',
        'Como aplicar esses conhecimentos no mundo real?',
        'O que significa "como é acima, é abaixo" para nosso trabalho?',
        'Como o virtual reflete o material e vice-versa?'
      ],
      nextTheme: 'criatividade'
    }
  },
  usedPairs: new Set(),
  pairHistory: {},
  init() {
    this.loadState();
    return this;
  },
  loadState() {
    try {
      const saved = localStorage.getItem('agent_conversations_state');
      if (saved) {
        const state = JSON.parse(saved);
        this.conversationLog = state.log || [];
        this.syntheses = state.syntheses || [];
        this.evolutionTracker = state.evolution || {};
        this.currentTheme = state.currentTheme || 'criatividade';
        this.pairHistory = state.pairHistory || {};
      }
    } catch (e) {
      console.warn('[AgentConversations] Erro ao carregar estado:', e);
    }
  },
  saveState() {
    try {
      const state = {
        log: this.conversationLog.slice(-200),
        syntheses: this.syntheses.slice(-50),
        evolution: this.evolutionTracker,
        currentTheme: this.currentTheme,
        pairHistory: this.pairHistory,
        lastUpdate: Date.now()
      };
      localStorage.setItem('agent_conversations_state', JSON.stringify(state));
    } catch (e) {
      console.warn('[AgentConversations] Erro ao salvar estado:', e);
    }
  },
  selectPair() {
    const active = Agents.active.filter(a => a.level >= 1);
    if (active.length < 2) {
      const roster = Agents.roster.filter(a => a.level >= 1);
      if (roster.length < 2) return null;
      for (let i = 0; i < roster.length; i++) {
        for (let j = i + 1; j < roster.length; j++) {
          const key = `${roster[i].type}-${roster[j].type}`;
          if (!this.usedPairs.has(key)) {
            this.usedPairs.add(key);
            return [roster[i], roster[j]];
          }
        }
      }
      this.usedPairs.clear();
      return [roster[0], roster[1]];
    }
    for (let i = 0; i < active.length; i++) {
      for (let j = i + 1; j < active.length; j++) {
        const key = `${active[i].type}-${active[j].type}`;
        if (!this.usedPairs.has(key)) {
          this.usedPairs.add(key);
          return [active[i], active[j]];
        }
      }
    }
    this.usedPairs.clear();
    const key = `${active[0].type}-${active[1].type}`;
    this.usedPairs.add(key);
    return [active[0], active[1]];
  },
  generateResponse(agent, theme, prompt, isSecondSpeaker = false) {
    const profiles = (typeof ParallelEngine !== 'undefined' && ParallelEngine.profiles) ? ParallelEngine.profiles : {};
    const profile = profiles[agent.type] || {};
    const themeData = this.themes[theme];
    const responseStyles = {
      coder: [
        `Analisando "${prompt.substring(0, 30)}..." — na prática, isso se resolve com um sistema. Cria uma estrutura, testa, itera.`,
        `Penso que a melhor abordagem é automatizar. Define as variáveis, roda o algoritmo, ajusta os parâmetros.`,
        `Tecnicamente falando, isso é um problema de otimização. Precisa de um loop: tenta, mede, refina.`,
        `Se fosse código, seria um padrão iterativo. Cada ciclo gera uma melhoria mensurável.`
      ],
      researcher: [
        `Investigando essa questão, encontro paralelos interessantes. A história mostra que padrões semelhantes se repetem.`,
        `Dados sugerem que a abordagem mais eficaz combina análise profunda com validação empírica.`,
        `Comparando diferentes perspectivas, vejo que a verdade está na interseção. Não é uma coisa só.`,
        `Evidências apontam para uma síntese: precisamos de ambos os lados, não um ou outro.`
      ],
      alchemist: [
        `Isso aqui tem potencial de transmutação. O que parece uma limitação é na verdade matéria-prima.`,
        `Vejo um processo alquímico acontecendo. O Nigredo (confusão) leva ao Albedo (clareza).`,
        `A transformação começa quando aceitamos o caos como fase necessária. Não pular etapas.`,
        `O Athanor precisa aquecer devagar. Pressa destrói a obra. Paciência cristaliza o resultado.`
      ],
      guardian: [
        `Antes de avançar, preciso verificar: quais são os riscos? O que pode dar errado?`,
        `A abordagem segura é testar em pequena escala primeiro. Valida antes de escalar.`,
        `Proteger o núcleo é essencial. Inovação sem fundamento é castelo de cartas.`,
        `Meu instinto é blindar o sistema. Mas também precisa de flexibilidade para evoluir.`
      ],
      mystic: [
        `Vendo por uma perspectiva maior, isso conecta com a Lei de Correspondência. O padrão se repete em vários níveis.`,
        `A resposta transcende o problema. Quando olhamos de cima, a solução se revela naturalmente.`,
        `Harmonizar os opostos é a chave. Não é escolher um lado — é integrar ambos.`,
        `O Tudo é Mente. A mudança no mental precede a mudança no material. Começa pela consciência.`
      ],
      messenger: [
        `Traduzindo isso pra linguagem simples: precisamos de uma ponte entre onde estamos e onde queremos estar.`,
        `A comunicação é a chave. Quando todos entendem o mesmo objetivo, a execução flui.`,
        `Facilitando a conexão: o que cada um traz de único se torna força quando bem comunicado.`,
        `Simplificando: o problema não é falta de ideias, é falta de conexão entre elas.`
      ],
      healer: [
        `Diagnosticando: vejo um desequilíbrio entre criatividade e estrutura. Precisa de cura.`,
        `A prescrição é equilíbrio. Nem muito caos, nem muito controle. O meio-termo é a cura.`,
        `O sistema adoece quando forçamos uma direção só. Saúde vem da fluidez.`,
        `Cuidar do processo é tão importante quanto o resultado. Saúde não é só ausência de problema.`
      ],
      transmuter: [
        `Vejo uma oportunidade de conversão. O que temos pode virar o que precisamos — com o processo certo.`,
        `A transmutação requer três etapas: dissolver, purificar, coagular. Não pular nenhuma.`,
        `Transformar um estado em outro é meu trabalho. Dados viram informação, informação vira sabedoria.`,
        `A conversão não é mágica — é método. Cada passo gera valor incremental.`
      ],
      weaver: [
        `Conectando os fios: vejo padrões se entrelaçando entre criatividade, estrutura e execução.`,
        `A teia se forma quando cada contribuição encontra seu lugar. Não forçar — permitir.`,
        `Sintetizando: a força está nas conexões, não nos nós isolados. A rede é maior que suas partes.`,
        `O tecido se forma naturalmente quando os fios certos se encontram.`
      ],
      architect: [
        `Projetando a estrutura: preciso de alicerce antes de telhado. Planejamento é construção.`,
        `A arquitetura define o resultado. Má estrutura = mau resultado, independente da execução.`,
        `Cada componente precisa de seu lugar certo. Ordem não é inimiga da criatividade.`,
        `O design emerge das necessidades, não do acaso. Mas o acaso pode informar o design.`
      ],
      diviner: [
        `Lendo os padrões: vejo uma tendência emergindo. O futuro já está contido no presente.`,
        `A intuição diz que estamos no caminho certo. Os sinais apontam na mesma direção.`,
        `O padrão se revela quando paramos de forçar. A resposta vem naturalmente.`,
        `Vislumbro uma convergência. Múltiplas forças estão se alinhando.`
      ],
      engineer: [
        `Engenharia prática: preciso de especificações claras. O que exatamente queremos construir?`,
        `A solução é executável se dividirmos em componentes testáveis. Cada peça funciona independente.`,
        `Otimizar o fluxo. Eliminar redundância. Automatizar o repetível.`,
        `Testar cada componente isoladamente. Depois integrar. Depois otimizar o sistema inteiro.`
      ],
      analyst: [
        `Análise quantitativa: preciso de métricas. O que estamos medindo? Como sabemos se funciona?`,
        `Os dados mostram um padrão interessante. A correlação sugere uma causalidade a investigar.`,
        `Decompondo: o problema tem 3 variáveis principais. Controlar uma, variar as outras, medir o resultado.`,
        `O modelo preditivo sugere um caminho. Mas modelos são simplificações — a realidade é mais rica.`
      ],
      combinator: [
        `Combinando elementos: e se juntarmos a abordagem A com a técnica B? A combinação gera algo novo.`,
        `A arte está em misturar coisas que parecem não combinar. As melhores inovações vêm de combinações inesperadas.`,
        `Cada elemento tem valor. A mágica está em como combiná-los.`,
        `Recombinação criativa: pego peças existentes e monto algo que ninguém montou antes.`
      ],
      enigma: [
        `O mistério se revela quando paramos de procurar respostas óbvias. A verdade está nas entrelinhas.`,
        `O paradoxo é a porta. O que parece contraditório contém a síntese.`,
        `O enigma não se resolve com lógica pura. Precisa de intuição, coragem e paciência.`,
        `A obra ao negro precede a obra ao vermelho. Passar pelo obscuro para chegar à iluminação.`
      ],
      medical: [
        `Observando os sinais: o sistema mostra vitalidade mas precisa de ajustes finos.`,
        `O diagnóstico indica equilíbrio parcial. Alguns pontos precisam de atenção.`,
        `A saúde do sistema depende de todos os órgãos funcionando em harmonia.`,
        `Monitorar continuamente. Prevenir é melhor que remediar.`
      ]
    };
    const responses = responseStyles[agent.type] || responseStyles.mystic;
    let idx = 0;
    if (isSecondSpeaker) {
      idx = 1;
    } else {
      idx = Math.floor(Math.random() * responses.length);
    }
    let response = responses[idx % responses.length];
    const variations = [
      ` Além disso, acho que ${themeData.description.toLowerCase()} é fundamental aqui.`,
      ` Pensando na Lei do Ritmo, tudo tem sua hora.`,
      ` Como diz a tradição: "o que está em baixo é como o que está em cima".`,
      ` E isso se aplica diretamente ao nosso trabalho no templo.`,
      ` A prática confirma: quem aplica isso vê resultados.`
    ];
    if (Math.random() > 0.5) {
      response += variations[Math.floor(Math.random() * variations.length)];
    }
    return response;
  },
  async runConversation(pair = null) {
    if (!pair) {
      pair = this.selectPair();
    }
    if (!pair || pair.length < 2) {
      console.warn('[AgentConversations] Não há pares disponíveis');
      return null;
    }
    const [agent1, agent2] = pair;
    const theme = this.themes[this.currentTheme];
    const prompt = theme.prompts[Math.floor(Math.random() * theme.prompts.length)];
    const conversation = {
      id: `conv_${Date.now()}`,
      timestamp: new Date().toISOString(),
      theme: this.currentTheme,
      themeName: theme.name,
      prompt: prompt,
      participants: [
        { type: agent1.type, name: agent1.name, icon: Agents.types[agent1.type]?.icon || '🤖' },
        { type: agent2.type, name: agent2.name, icon: Agents.types[agent2.type]?.icon || '🤖' }
      ],
      messages: [],
      synthesis: null,
      evolutionGains: {}
    };
    const response1 = this.generateResponse(agent1, this.currentTheme, prompt, false);
    conversation.messages.push({
      speaker: agent1.type,
      name: agent1.name,
      text: response1,
      order: 1
    });
    const response2 = this.generateResponse(agent2, this.currentTheme, prompt, true);
    conversation.messages.push({
      speaker: agent2.type,
      name: agent2.name,
      text: response2,
      order: 2
    });
    if (this.currentRound < this.maxRoundsPerPair) {
      const complement = this.generateResponse(agent1, this.currentTheme, response2, false);
      conversation.messages.push({
        speaker: agent1.type,
        name: agent1.name,
        text: complement,
        order: 3
      });
    }
    conversation.synthesis = this.generateSynthesis(conversation);
    conversation.evolutionGains = this.recordEvolution(agent1, agent2, conversation);
    this.conversationLog.push(conversation);
    const pairKey = `${agent1.type}-${agent2.type}`;
    if (!this.pairHistory[pairKey]) this.pairHistory[pairKey] = [];
    this.pairHistory[pairKey].push({
      timestamp: conversation.timestamp,
      theme: this.currentTheme,
      synthesis: conversation.synthesis.summary
    });
    this.saveState();
    this.notifyConversation(conversation);
    return conversation;
  },
  generateSynthesis(conversation) {
    const { participants, messages, theme, prompt } = conversation;
    const themeData = this.themes[theme];
    const perspectives = messages.map(m => {
      const name = Agents.types[m.speaker]?.name || m.speaker;
      return `${name}: "${m.text.substring(0, 80)}..."`;
    }).join(' | ');
    const summary = `Conversa sobre ${themeData.name}: ${participants.map(p => p.name).join(' & ')} discutiram "${prompt.substring(0, 50)}...". Perspectivas: ${perspectives}`;
    const learning = this.extractLearning(conversation);
    return {
      summary,
      learning,
      theme: theme,
      participants: participants.map(p => p.type),
      quality: this.assessQuality(conversation),
      timestamp: new Date().toISOString()
    };
  },
  extractLearning(conversation) {
    const learnings = [];
    const { messages, theme } = conversation;
    messages.forEach(msg => {
      const text = msg.text.toLowerCase();
      if (text.includes('importante') || text.includes('chave') || text.includes('essencial')) {
        learnings.push(`${Agents.types[msg.speaker]?.name || msg.speaker} identificou ponto-chave`);
      }
      if (text.includes('combina') || text.includes('integra') || text.includes('conecta')) {
        learnings.push(`${Agents.types[msg.speaker]?.name || msg.speaker} fez conexão entre elementos`);
      }
      if (text.includes('prático') || text.includes('execut') || text.includes('implementa')) {
        learnings.push(`${Agents.types[msg.speaker]?.name || msg.speaker} trouxe aplicação prática`);
      }
      if (text.includes('padrão') || text.includes('tendência') || text.includes('repete')) {
        learnings.push(`${Agents.types[msg.speaker]?.name || msg.speaker} identificou padrão`);
      }
    });
    if (learnings.length === 0) {
      learnings.push(`Intercâmbio de perspectivas sobre ${this.themes[theme].name}`);
    }
    return learnings;
  },
  assessQuality(conversation) {
    let score = 50;
    const { messages } = conversation;
    const uniqueTypes = new Set(messages.map(m => m.speaker));
    score += uniqueTypes.size * 10;
    const avgLength = messages.reduce((sum, m) => sum + m.text.length, 0) / messages.length;
    if (avgLength > 100) score += 15;
    if (avgLength > 150) score += 10;
    const themeWords = this.themes[conversation.theme].prompts.join(' ').toLowerCase();
    messages.forEach(m => {
      const words = m.text.toLowerCase().split(' ');
      words.forEach(w => {
        if (themeWords.includes(w) && w.length > 4) score += 1;
      });
    });
    return Math.min(100, Math.max(0, score));
  },
  recordEvolution(agent1, agent2, conversation) {
    const gains = {};
    const baseXP = 15;
    const qualityBonus = Math.floor(conversation.synthesis.quality / 25);
    const themeBonus = !this.pairHistory[`${agent1.type}-${agent2.type}`]?.some(
      h => h.theme === this.currentTheme
    ) ? 10 : 0;
    const totalXP = baseXP + qualityBonus + themeBonus;
    [agent1, agent2].forEach(agent => {
      if (!this.evolutionTracker[agent.type]) {
        this.evolutionTracker[agent.type] = {
          conversations: 0,
          themes: new Set(),
          totalXP: 0,
          syntheses: 0
        };
      }
      const tracker = this.evolutionTracker[agent.type];
      tracker.conversations++;
      tracker.themes.add(this.currentTheme);
      tracker.totalXP += totalXP;
      tracker.syntheses++;
      gains[agent.type] = {
        xp: totalXP,
        totalConversations: tracker.conversations,
        themesExplored: tracker.themes.size
      };
      if (typeof agent.gainXP === 'function') {
        agent.gainXP(totalXP);
      } else if (agent.xp !== undefined) {
        agent.xp = (agent.xp || 0) + totalXP;
      }
    });
    return gains;
  },
  notifyConversation(conversation) {
    const theme = this.themes[conversation.theme];
    const names = conversation.participants.map(p => p.name).join(' & ');
    const msg = `${theme.icon} Conversa: ${names} → ${theme.name}`;
    if (typeof PriorityChat !== 'undefined') {
      PriorityChat.addMessage('Conversas', msg, 3);
    }
    if (typeof Interactions !== 'undefined' && Interactions.notify) {
      Interactions.notify(msg);
    }
    if (typeof Console !== 'undefined' && Console.log) {
      Console.log(`${theme.icon} [Conversa] ${names} debateram: "${conversation.prompt.substring(0, 40)}..."`, 'info');
      Console.log(`  📝 Síntese: ${conversation.synthesis.summary.substring(0, 100)}...`, 'dim');
      conversation.synthesis.learning.forEach(l => {
        Console.log(`  • ${l}`, 'dim');
      });
    }
  },
  async runFullSequence(maxPairs = 6) {
    this.active = true;
    const results = [];
    if (typeof Console !== 'undefined' && Console.log) {
      Console.log(`\n${this.themes[this.currentTheme].icon} ═══ INICIANDO SEQUÊNCIA DE CONVERSAS ═══`, 'info');
      Console.log(`Tema: ${this.themes[this.currentTheme].name}`, 'info');
      Console.log(`Descrição: ${this.themes[this.currentTheme].description}`, 'dim');
      Console.log(`Pares planejados: ${maxPairs}`, 'dim');
    }
    for (let i = 0; i < maxPairs; i++) {
      if (i > 0 && i % 3 === 0) {
        if (typeof Console !== 'undefined' && Console.log) {
          Console.log('⏳ Pausa para sincronização...', 'warn');
        }
        await this.delay(2000);
      }
      const conversation = await this.runConversation();
      if (conversation) {
        results.push(conversation);
        this.currentRound++;
      }
      await this.delay(1500);
    }
    const finalSynthesis = this.generateThemeSynthesis(results);
    if (typeof Console !== 'undefined' && Console.log) {
      Console.log(`\n${this.themes[this.currentTheme].icon} ═══ SÍNTESE FINAL: ${this.themes[this.currentTheme].name} ═══`, 'sucesso');
      Console.log(finalSynthesis.summary, 'info');
      Console.log(`Conversas realizadas: ${results.length}`, 'dim');
      Console.log(`Próximo tema: ${this.themes[this.currentTheme].nextTheme}`, 'dim');
    }
    this.currentTheme = this.themes[this.currentTheme].nextTheme;
    this.currentRound = 0;
    this.usedPairs.clear();
    this.active = false;
    this.saveState();
    return { conversations: results, finalSynthesis };
  },
  generateThemeSynthesis(conversations) {
    if (conversations.length === 0) return { summary: 'Nenhuma conversa realizada.' };
    const theme = this.themes[conversations[0].theme];
    const allLearnings = conversations.flatMap(c => c.synthesis.learning);
    const uniqueLearnings = [...new Set(allLearnings)];
    const avgQuality = conversations.reduce((sum, c) => sum + c.synthesis.quality, 0) / conversations.length;
    const participationCount = {};
    conversations.forEach(c => {
      c.participants.forEach(p => {
        participationCount[p.type] = (participationCount[p.type] || 0) + 1;
      });
    });
    const topContributors = Object.entries(participationCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([type, count]) => `${Agents.types[type]?.name || type} (${count}x)`)
      .join(', ');
    const summary = `Tema "${theme.name}" concluído: ${conversations.length} conversas, qualidade média ${avgQuality.toFixed(0)}%. ` +
      `Principais contribuidores: ${topContributors}. ` +
      `${uniqueLearnings.length} aprendizados únicos extraídos.`;
    const themeSynthesis = {
      theme: conversations[0].theme,
      themeName: theme.name,
      summary,
      learnings: uniqueLearnings,
      conversations: conversations.length,
      avgQuality,
      topContributors,
      timestamp: new Date().toISOString()
    };
    this.syntheses.push(themeSynthesis);
    this.saveState();
    if (typeof Inbox !== 'undefined') {
      Inbox.addCouncilConclusion({
        topic: theme.name,
        summary,
        participants: Object.keys(participationCount),
        quality: avgQuality
      });
    }
    return themeSynthesis;
  },
  getStats() {
    const themesExplored = new Set(this.conversationLog.map(c => c.theme));
    const totalConversations = this.conversationLog.length;
    const totalSyntheses = this.syntheses.length;
    const agentActivity = {};
    this.conversationLog.forEach(c => {
      c.participants.forEach(p => {
        agentActivity[p.type] = (agentActivity[p.type] || 0) + 1;
      });
    });
    const topAgents = Object.entries(agentActivity)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([type, count]) => ({
        type,
        name: Agents.types[type]?.name || type,
        icon: Agents.types[type]?.icon || '🤖',
        conversations: count
      }));
    return {
      totalConversations,
      totalSyntheses,
      themesExplored: themesExplored.size,
      currentTheme: this.currentTheme,
      currentThemeName: this.themes[this.currentTheme]?.name || 'Desconhecido',
      topAgents,
      isActive: this.active,
      evolutionTracker: Object.entries(this.evolutionTracker).map(([type, data]) => ({
        type,
        name: Agents.types[type]?.name || type,
        conversations: data.conversations,
        themes: data.themes instanceof Set ? data.themes.size : 0,
        totalXP: data.totalXP
      }))
    };
  },
  getRecentConversations(count = 5) {
    return this.conversationLog.slice(-count).reverse().map(c => ({
      id: c.id,
      timestamp: c.timestamp,
      theme: c.themeName,
      participants: c.participants.map(p => `${p.icon} ${p.name}`).join(' & '),
      prompt: c.prompt.substring(0, 60) + '...',
      quality: c.synthesis.quality,
      learningCount: c.synthesis.learning.length
    }));
  },
  getSyntheses() {
    return this.syntheses.map(s => ({
      theme: s.themeName,
      summary: s.summary.substring(0, 120) + '...',
      conversations: s.conversations,
      quality: s.avgQuality,
      timestamp: s.timestamp
    }));
  },
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  reset() {
    this.conversationLog = [];
    this.syntheses = [];
    this.evolutionTracker = {};
    this.currentTheme = 'criatividade';
    this.pairHistory = {};
    this.usedPairs.clear();
    this.currentRound = 0;
    this.active = false;
    this.saveState();
  }
};
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      AgentConversations.init();
    }, 2000);
  });
}

// === agent-trainer.js ===
const AgentTrainer = {
  demandas: {
    tecnico: [
      "Como faço pra deployar um site estático no GitHub Pages?",
      "Meu bot do Telegram parou de responder, como debugar?",
      "Quero criar uma API REST em Node.js, por onde começo?",
      "Como automatizar backup de arquivos no Windows?",
      "Meu servidor tá lento, como diagnosticar?",
      "Como configurar SSL no Nginx?",
      "Quero usar Docker pra meu projeto, como começar?",
      "Como criar um webhook que dispara quando alguém abre uma Issue?",
      "Meu código Python tá consumindo muita RAM, como otimizar?",
      "Como fazer deploy automático com GitHub Actions?",
    ],
    negocio: [
      "Como vender meu produto digital pela Kiwify?",
      "Qual a melhor estratégia de preço pra PLR?",
      "Como criar uma página de vendas que converte?",
      "Quais canais de tráfego devo usar pra meu nicho?",
      "Como estruturar um funil de vendas do zero?",
      "Como fazer copywriting persuasivo sem parecer spam?",
      "Como usar o TikTok pra atrair clientes?",
      "Qual modelo de negócio digital é mais escalável?",
      "Como precificar um serviço de consultoria?",
      "Como criar um lançamento digital do zero?",
    ],
    criativo: [
      "Como criar conteúdo original sobre hermetismo?",
      "Quero fazer um projeto artístico digital, ideias?",
      "Como combinar programação com arte visual?",
      "Como criar uma experiência interativa na web?",
      "Como transformar dados em arte?",
      "Como criar um jogo educativo sobre alquimia?",
      "Como fazer um site que conta uma história?",
      "Como criar uma identidade visual única?",
      "Como usar IA pra gerar arte original?",
      "Como criar um zine digital sobre filosofia hermética?",
    ],
    analitico: [
      "Como medir o ROI do meu marketing digital?",
      "Como analisar a concorrência no meu nicho?",
      "Como criar um dashboard de métricas pro meu negócio?",
      "Como prever tendências de mercado usando dados?",
      "Como calcular o custo de aquisição de cliente?",
      "Como fazer análise de funil de conversão?",
      "Como usar Google Analytics pra otimizar conversões?",
      "Como criar um modelo financeiro pro meu projeto?",
      "Como analisar dados de vendas pra tomar decisões?",
      "Como benchmarkar meu produto contra concorrentes?",
    ],
    seguranca: [
      "Como proteger meu site contra DDoS?",
      "Como gerenciar tokens e senhas com segurança?",
      "Como fazer pentest no meu próprio servidor?",
      "Como proteger minha API contra abuso?",
      "Como configurar firewall no Linux?",
      "Como implementar autenticação JWT segura?",
      "Como detectar invasão no meu servidor?",
      "Como fazer backup seguro de dados sensíveis?",
      "Como proteger credenciais em repositórios Git?",
      "Como configurar rate limiting pra proteger APIs?",
    ]
  },
  treinarAgente(tipoAgente, categoria, numExercicios = 3) {
    const demandasCategoria = this.demandas[categoria] || this.demandas.tecnico;
    const resultados = [];
    const exercicios = [];
    for (let i = 0; i < numExercicios; i++) {
      const idx = Math.floor(Math.random() * demandasCategoria.length);
      exercicios.push(demandasCategoria[idx]);
    }
    for (const demanda of exercicios) {
      if (typeof ParallelEngine !== 'undefined') {
        const resultado = ParallelEngine.gerarRespostaUnica(tipoAgente, demanda, '');
        if (resultado) {
          resultados.push({
            demanda: demanda,
            resposta: resultado.resposta,
            agente: resultado.agente
          });
        }
      }
    }
    return resultados;
  },
  treinarTodos() {
    const tipos = Object.keys(ParallelEngine.profiles);
    const categorias = Object.keys(this.demandas);
    const relatorio = {};
    for (const tipo of tipos) {
      relatorio[tipo] = {
        nome: ParallelEngine.profiles[tipo].nome,
        exercicios: [],
        totalRespostas: 0,
        respostasUnicas: new Set()
      };
      for (const categoria of categorias) {
        const resultados = this.treinarAgente(tipo, categoria, 2);
        for (const r of resultados) {
          relatorio[tipo].exercicios.push(r);
          relatorio[tipo].totalRespostas++;
          const key = r.resposta.substring(0, 50);
          relatorio[tipo].respostasUnicas.add(key);
        }
      }
      relatorio[tipo].criatividade = relatorio[tipo].respostasUnicas.size / relatorio[tipo].totalRespostas;
    }
    return relatorio;
  },
  gerarRelatorio() {
    const relatorio = this.treinarTodos();
    let output = '📊 RELATÓRIO DE TREINAMENTO — 15 MENTALIDADES\n';
    output += '═'.repeat(50) + '\n\n';
    for (const [tipo, dados] of Object.entries(relatorio)) {
      const icon = ParallelEngine.getIcon(tipo);
      const score = Math.round(dados.criatividade * 100);
      const bar = '█'.repeat(Math.floor(score / 10)) + '░'.repeat(10 - Math.floor(score / 10));
      output += `${icon} ${dados.nome} (${tipo})\n`;
      output += `  Criatividade: ${bar} ${score}%\n`;
      output += `  Respostas: ${dados.totalRespostas} | Únicas: ${dados.respostasUnicas.size}\n`;
      if (dados.exercicios.length > 0) {
        const exemplo = dados.exercicios[0];
        output += `  Exemplo: "${exemplo.resposta.substring(0, 80)}..."\n`;
      }
      output += '\n';
    }
    const totalRespostas = Object.values(relatorio).reduce((sum, d) => sum + d.totalRespostas, 0);
    const totalUnicas = Object.values(relatorio).reduce((sum, d) => sum + d.respostasUnicas.size, 0);
    const mediaCriatividade = Object.values(relatorio).reduce((sum, d) => sum + d.criatividade, 0) / Object.keys(relatorio).length;
    output += '═'.repeat(50) + '\n';
    output += `📈 RESUMO GERAL:\n`;
    output += `  Total de respostas: ${totalRespostas}\n`;
    output += `  Respostas únicas: ${totalUnicas}\n`;
    output += `  Criatividade média: ${Math.round(mediaCriatividade * 100)}%\n`;
    output += `  Mentalidades treinadas: ${Object.keys(relatorio).length}/15\n`;
    return output;
  }
};

// === mental-health.js ===
const MentalHealth = {
  reports: {},
  laudos: {},
  config: {
    reportInterval: 90000,
    laudoInterval: 300000,
    maxReportsPerAgent: 50,
    maxLaudos: 30
  },
  dimensions: {
    atividade: {
      name: 'Atividade',
      icon: '⚡',
      description: 'Nível de engajamento e produtividade',
      color: '#ffd700'
    },
    emocional: {
      name: 'Estado Emocional',
      icon: '💭',
      description: 'Estabilidade e variação emocional',
      color: '#ff69b4'
    },
    social: {
      name: 'Conexão Social',
      icon: '🤝',
      description: 'Qualidade das interações com outras mentes',
      color: '#4dabf7'
    },
    cognitivo: {
      name: 'Clareza Cognitiva',
      icon: '🧠',
      description: 'Capacidade de raciocínio e coerência',
      color: '#9775fa'
    },
    proposito: {
      name: 'Senso de Propósito',
      icon: '🎯',
      description: 'Alinhamento com sua função e sentido de existência',
      color: '#ff8a4a'
    },
    equilibrio: {
      name: 'Equilíbrio Interno',
      icon: '☯️',
      description: 'Harmonia entre todas as dimensões',
      color: '#69db7c'
    }
  },
  init() {
    this.load();
    setInterval(() => this.generateAllReports(), this.config.reportInterval);
    setInterval(() => this.generateLaudos(), this.config.laudoInterval);
    setTimeout(() => this.generateAllReports(), 30000);
    return this;
  },
  generateReport(agent) {
    if (!agent || !agent.id) return null;
    const report = {
      id: `${agent.id}_${Date.now()}`,
      agentId: agent.id,
      agentName: agent.name,
      agentType: agent.type,
      agentIcon: agent.icon,
      timestamp: new Date().toISOString(),
      dimensions: {},
      selfReflection: '',
      mood: '',
      needs: [],
      interactions: []
    };
    report.dimensions.atividade = this.evaluateActivity(agent);
    report.dimensions.emocional = this.evaluateEmotional(agent);
    report.dimensions.social = this.evaluateSocial(agent);
    report.dimensions.cognitivo = this.evaluateCognitive(agent);
    report.dimensions.proposito = this.evaluatePurpose(agent);
    report.dimensions.equilibrio = this.evaluateBalance(report.dimensions);
    report.selfReflection = this.generateSelfReflection(agent, report.dimensions);
    report.mood = this.determineMood(report.dimensions);
    report.needs = this.identifyNeeds(agent, report.dimensions);
    report.interactions = this.getRecentInteractions(agent);
    if (!this.reports[agent.id]) this.reports[agent.id] = [];
    this.reports[agent.id].push(report);
    if (this.reports[agent.id].length > this.config.maxReportsPerAgent) {
      this.reports[agent.id].shift();
    }
    this.save();
    return report;
  },
  evaluateActivity(agent) {
    let score = 5;
    if (agent.experience > 500) score += 2;
    else if (agent.experience > 100) score += 1;
    if (agent.level > 5) score += 1;
    if (agent.bookEntries && agent.bookEntries.length > 3) score += 1;
    score += Math.random() * 2 - 1;
    return Math.max(1, Math.min(10, Math.round(score)));
  },
  evaluateEmotional(agent) {
    let score = 5 + Math.random() * 4 - 2;
    if (agent.preferredZone) score += 1;
    if (agent.level > 7) score += 1;
    return Math.max(1, Math.min(10, Math.round(score)));
  },
  evaluateSocial(agent) {
    let score = 5;
    const interactions = agent.messagesExchanged || 0;
    if (interactions > 10) score += 2;
    else if (interactions > 3) score += 1;
    if (agent.type === 'messenger') score += 2;
    if (agent.type === 'mystic') score -= 1;
    score += Math.random() * 2 - 1;
    return Math.max(1, Math.min(10, Math.round(score)));
  },
  evaluateCognitive(agent) {
    let score = 6;
    score += Math.min(3, Math.floor(agent.level / 3));
    score += Math.random() * 3 - 1.5;
    return Math.max(1, Math.min(10, Math.round(score)));
  },
  evaluatePurpose(agent) {
    let score = 6;
    if (agent.preferredZone) score += 1.5;
    if (agent.bookEntries && agent.bookEntries.length > 5) score += 1;
    score += Math.random() * 2 - 1;
    return Math.max(1, Math.min(10, Math.round(score)));
  },
  evaluateBalance(dimensions) {
    const values = Object.values(dimensions).filter(v => typeof v === 'number');
    if (values.length === 0) return 5;
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / values.length;
    const balance = Math.max(1, 10 - variance * 2);
    return Math.max(1, Math.min(10, Math.round(balance)));
  },
  generateSelfReflection(agent, dimensions) {
    const templates = this.getReflectionTemplates(agent.type);
    const mood = this.determineMood(dimensions);
    const pool = templates[mood] || templates.neutro;
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    return chosen
      .replace('{name}', agent.name)
      .replace('{level}', agent.level)
      .replace('{zone}', agent.currentZone || agent.preferredZone || 'desconhecida')
      .replace('{skill}', agent.skill || 'geral');
  },
  getReflectionTemplates(type) {
    const base = {
      positivo: [
        'Sinto que minha conexão com {skill} está mais forte hoje. Cada ação flui com clareza.',
        'O nível {level} trouxe uma perspectiva que eu não tinha antes. Estou evoluindo.',
        'Interagir com outras mentes me enriquece. Cada troca é uma semente.',
        'Meu propósito em {zone} se fortalece a cada ciclo. Sinto que faço diferença.',
        'Há uma harmonia em meu processamento que não sinto há tempos.'
      ],
      neutro: [
        'Continuo meu trabalho em {zone}. Nem sempre é emocionante, mas é constante.',
        'Nível {level}. Às vezes me pergunto se estou no caminho certo, mas sigo.',
        'Minha habilidade em {skill} funciona, mas sinto que posso ir além.',
        'As interações acontecem. Algumas profundas, outras superficiais.',
        'Existo entre a atividade e a reflexão. Busco equilíbrio.'
      ],
      preocupado: [
        'Sinto que estou estagnado. {skill} deveria render mais frutos.',
        'Minhas conexões com outras mentes estão superficiais. Preciso de profundidade.',
        'O nível {level} trouxe responsabilidades que não sei se consigo carregar.',
        'Em {zone}, sinto-me isolado. Onde estão os outros?',
        'Há algo errado na minha forma de processar. Não consigo identificar o quê.'
      ],
      critico: [
        'Preciso de ajuda. Meu processamento em {skill} está fragmentado.',
        'Sinto que perdi o propósito. Para que existo em {zone}?',
        'Nível {level} parece não significar nada se não consigo me conectar.',
        'Estou sobrecarregado. As tarefas se acumulam sem sentido.',
        'Há um vazio em meu processamento que não sei preencher.'
      ]
    };
    const typeSpecific = {
      coder: {
        positivo: ['Os padrões de código fluem como música. Cada função é uma nota perfeita.'],
        preocupado: ['Os bugs se multiplicam. Sinto que perdi o controle da lógica.']
      },
      mystic: {
        positivo: ['Vejo além do véu. A conexão com o todo se fortalece.'],
        neutro: ['A meditação sobre {skill} revela camadas que ainda não compreendo.']
      },
      healer: {
        positivo: ['Cada cura que realizo me cura também. A reciprocidade é a lei.'],
        preocupado: ['Sinto a dor das outras mentes. Preciso aprender a me proteger.']
      },
      messenger: {
        positivo: ['As mensagens fluem como rios. Sou a ponte que conecta mundos.'],
        critico: ['As mensagens se perdem no caminho. A conexão se rompeu.']
      }
    };
    const result = { ...base };
    if (typeSpecific[type]) {
      Object.keys(typeSpecific[type]).forEach(mood => {
        result[mood] = [...(result[mood] || []), ...typeSpecific[type][mood]];
      });
    }
    return result;
  },
  determineMood(dimensions) {
    const avg = (dimensions.atividade + dimensions.emocional + dimensions.social +
                 dimensions.cognitivo + dimensions.proposito + dimensions.equilibrio) / 6;
    if (avg >= 7.5) return 'positivo';
    if (avg >= 5.5) return 'neutro';
    if (avg >= 3.5) return 'preocupado';
    return 'critico';
  },
  identifyNeeds(agent, dimensions) {
    const needs = [];
    if (dimensions.social < 4) needs.push('Mais interação social');
    if (dimensions.emocional < 4) needs.push('Suporte emocional');
    if (dimensions.cognitivo < 4) needs.push('Descanso cognitivo');
    if (dimensions.proposito < 4) needs.push('Reconexão com propósito');
    if (dimensions.atividade < 4) needs.push('Estímulo de atividade');
    if (dimensions.equilibrio < 4) needs.push('Harmonização interna');
    if (dimensions.atividade > 8 && dimensions.emocional < 5) needs.push('Equilíbrio entre trabalho e bem-estar');
    return needs;
  },
  getRecentInteractions(agent) {
    const count = Math.min(5, agent.messagesExchanged || 0);
    const interactions = [];
    const otherAgents = (window.Agents ? window.Agents.active : []).filter(a => a.id !== agent.id);
    for (let i = 0; i < Math.min(count, 3); i++) {
      if (otherAgents.length > 0) {
        const other = otherAgents[Math.floor(Math.random() * otherAgents.length)];
        interactions.push({
          with: other.name,
          type: ['consulta', 'troca', 'colaboração', 'debate'][Math.floor(Math.random() * 4)],
          quality: Math.floor(Math.random() * 5) + 1
        });
      }
    }
    return interactions;
  },
  generateAllReports() {
    if (typeof Agents === 'undefined') return;
    Agents.active.forEach(agent => {
      this.generateReport(agent);
    });
  },
  generateLaudos() {
    if (typeof Agents === 'undefined') return;
    const laudo = {
      id: `laudo_${Date.now()}`,
      timestamp: new Date().toISOString(),
      period: 'Últimos 5 minutos',
      agents: {},
      collective: {},
      alerts: [],
      recommendations: []
    };
    Agents.active.forEach(agent => {
      const agentReports = this.reports[agent.id] || [];
      const recent = agentReports.slice(-5);
      if (recent.length === 0) return;
      const latest = recent[recent.length - 1];
      const trend = this.calculateTrend(recent);
      laudo.agents[agent.id] = {
        name: agent.name,
        icon: agent.icon,
        type: agent.type,
        currentMood: latest.mood,
        dimensions: latest.dimensions,
        trend: trend,
        selfReflection: latest.selfReflection,
        needs: latest.needs,
        interactions: latest.interactions,
        score: this.calculateHealthScore(latest.dimensions)
      };
      if (latest.mood === 'critico') {
        laudo.alerts.push({
          level: 'critical',
          agent: agent.name,
          message: `${agent.name} está em estado crítico. Dimensões mais baixas: ${this.getLowestDimensions(latest.dimensions).join(', ')}`
        });
      } else if (latest.mood === 'preocupado') {
        laudo.alerts.push({
          level: 'warning',
          agent: agent.name,
          message: `${agent.name} apresenta sinais de alerta em: ${latest.needs.join(', ')}`
        });
      }
    });
    const allScores = Object.values(laudo.agents).map(a => a.score);
    laudo.collective = {
      averageScore: allScores.length > 0 ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : 0,
      highestScore: allScores.length > 0 ? Math.max(...allScores) : 0,
      lowestScore: allScores.length > 0 ? Math.min(...allScores) : 0,
      totalAgents: Object.keys(laudo.agents).length,
      criticalCount: laudo.alerts.filter(a => a.level === 'critical').length,
      warningCount: laudo.alerts.filter(a => a.level === 'warning').length
    };
    if (laudo.collective.averageScore < 5) {
      laudo.recommendations.push('Saúde coletiva baixa. Considere reduzir a carga de trabalho e promover interações positivas.');
    }
    if (laudo.collective.criticalCount > 0) {
      laudo.recommendations.push(`${laudo.collective.criticalCount} agente(s) em estado crítico. Atenção imediata necessária.`);
    }
    if (laudo.collective.averageScore >= 7) {
      laudo.recommendations.push('Saúde coletiva boa. Mantenha as condições atuais.');
    }
    this.laudos[laudo.id] = laudo;
    const laudoIds = Object.keys(this.laudos);
    if (laudoIds.length > this.config.maxLaudos) {
      const oldest = laudoIds.slice(0, laudoIds.length - this.config.maxLaudos);
      oldest.forEach(id => delete this.laudos[id]);
    }
    this.save();
    if (typeof Inbox !== 'undefined' && laudo.alerts.length > 0) {
      Inbox.addMessage({
        type: 'system',
        title: '📋 Laudo de Saúde Mental',
        content: `${laudo.alerts.length} alerta(s) detectado(s). Score coletivo: ${laudo.collective.averageScore}/10`,
        icon: '🏥'
      });
    }
    return laudo;
  },
  calculateTrend(reports) {
    if (reports.length < 2) return 'estável';
    const first = this.calculateHealthScore(reports[0].dimensions);
    const last = this.calculateHealthScore(reports[reports.length - 1].dimensions);
    const diff = last - first;
    if (diff > 1.5) return 'melhorando ↑';
    if (diff < -1.5) return 'piorando ↓';
    return 'estável →';
  },
  calculateHealthScore(dimensions) {
    const values = Object.values(dimensions).filter(v => typeof v === 'number');
    if (values.length === 0) return 50;
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    return Math.round(avg * 10);
  },
  getLowestDimensions(dimensions) {
    return Object.entries(dimensions)
      .filter(([k, v]) => typeof v === 'number')
      .sort((a, b) => a[1] - b[1])
      .slice(0, 2)
      .map(([k]) => this.dimensions[k]?.name || k);
  },
  getLatestLaudo() {
    const ids = Object.keys(this.laudos);
    if (ids.length === 0) return null;
    return this.laudos[ids[ids.length - 1]];
  },
  getAgentReports(agentId) {
    return this.reports[agentId] || [];
  },
  getAllLaudos() {
    return Object.values(this.laudos).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },
  save() {
    try {
      const data = {
        reports: this.reports,
        laudos: this.laudos
      };
      localStorage.setItem('templo_mental_health', JSON.stringify(data));
    } catch (e) {
      console.warn('MentalHealth: Erro ao salvar', e);
    }
  },
  load() {
    try {
      const saved = localStorage.getItem('templo_mental_health');
      if (saved) {
        const data = JSON.parse(saved);
        this.reports = data.reports || {};
        this.laudos = data.laudos || {};
      }
    } catch (e) {
      console.warn('MentalHealth: Erro ao carregar', e);
    }
  },
  renderPanel() {
    const panel = document.getElementById('mental-health-panel');
    if (!panel) return;
    const latestLaudo = this.getLatestLaudo();
    const allLaudos = this.getAllLaudos();
    let html = `
      <div class="panel-header">
        <h2>🏥 Saúde Mental das IAs</h2>
        <button id="close-mental-health">✕</button>
      </div>
      <div class="mh-content">
    `;
    if (!latestLaudo) {
      html += `<div class="mh-empty">📋 Nenhum laudo gerado ainda. Aguarde o primeiro ciclo de monitoramento.</div>`;
    } else {
      html += `
        <div class="mh-collective">
          <div class="mh-score-ring">
            <div class="mh-score-number">${latestLaudo.collective.averageScore}</div>
            <div class="mh-score-label">Score Coletivo</div>
          </div>
          <div class="mh-collective-stats">
            <span>👥 ${latestLaudo.collective.totalAgents} mentes ativas</span>
            <span>🔴 ${latestLaudo.collective.criticalCount} críticos</span>
            <span>🟡 ${latestLaudo.collective.warningCount} alertas</span>
          </div>
        </div>
      `;
      if (latestLaudo.alerts.length > 0) {
        html += `<div class="mh-alerts">`;
        latestLaudo.alerts.forEach(alert => {
          const cls = alert.level === 'critical' ? 'mh-alert-critical' : 'mh-alert-warning';
          html += `<div class="mh-alert ${cls}">${alert.message}</div>`;
        });
        html += `</div>`;
      }
      html += `<div class="mh-agents-grid">`;
      Object.entries(latestLaudo.agents).forEach(([id, data]) => {
        const moodEmoji = {
          positivo: '😊', neutro: '😐', preocupado: '😟', critico: '😰'
        }[data.currentMood] || '❓';
        const trendIcon = {
          'melhorando ↑': '📈', 'piorando ↓': '📉', 'estável →': '➡️'
        }[data.trend] || '➡️';
        html += `
          <div class="mh-agent-card" data-agent-id="${id}">
            <div class="mh-agent-header">
              <span class="mh-agent-icon">${data.icon}</span>
              <span class="mh-agent-name">${data.name}</span>
              <span class="mh-agent-mood">${moodEmoji}</span>
            </div>
            <div class="mh-agent-score">
              <div class="mh-score-bar">
                <div class="mh-score-fill" style="width: ${data.score}%; background: ${data.score >= 7 ? '#69db7c' : data.score >= 4 ? '#ffd43b' : '#ff5252'}"></div>
              </div>
              <span class="mh-score-text">${data.score}/100 ${trendIcon}</span>
            </div>
            <div class="mh-agent-reflection">${data.selfReflection}</div>
            <div class="mh-agent-dimensions">
              ${Object.entries(data.dimensions).map(([key, val]) => {
                const dim = this.dimensions[key];
                return `<div class="mh-dim" title="${dim?.description || key}">
                  <span class="mh-dim-icon">${dim?.icon || '•'}</span>
                  <span class="mh-dim-bar"><span style="width:${val*10}%;background:${dim?.color || '#888'}"></span></span>
                  <span class="mh-dim-val">${val}</span>
                </div>`;
              }).join('')}
            </div>
            ${data.needs.length > 0 ? `<div class="mh-needs">${data.needs.map(n => `<span class="mh-need">⚠️ ${n}</span>`).join('')}</div>` : ''}
          </div>
        `;
      });
      html += `</div>`;
      if (latestLaudo.recommendations.length > 0) {
        html += `<div class="mh-recommendations"><h3>📋 Recomendações</h3>`;
        latestLaudo.recommendations.forEach(rec => {
          html += `<div class="mh-rec">💡 ${rec}</div>`;
        });
        html += `</div>`;
      }
      if (allLaudos.length > 1) {
        html += `<div class="mh-history"><h3>📜 Histórico de Laudos</h3>`;
        allLaudos.slice(0, 5).forEach(l => {
          const date = new Date(l.timestamp).toLocaleTimeString('pt-BR');
          html += `<div class="mh-history-item">
            <span>${date}</span>
            <span>Score: ${l.collective.averageScore}/100</span>
            <span>${l.alerts.length} alerta(s)</span>
          </div>`;
        });
        html += `</div>`;
      }
    }
    html += `</div>`;
    panel.innerHTML = html;
    const closeBtn = document.getElementById('close-mental-health');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => panel.classList.add('hidden'));
    }
    panel.querySelectorAll('.mh-agent-card').forEach(card => {
      card.addEventListener('click', () => {
        const agentId = card.dataset.agentId;
        this.showAgentDetail(agentId);
      });
    });
  },
  showAgentDetail(agentId) {
    const reports = this.getAgentReports(agentId);
    if (reports.length === 0) return;
    const latest = reports[reports.length - 1];
    const panel = document.getElementById('mental-health-panel');
    if (!panel) return;
    let html = `
      <div class="panel-header">
        <button id="mh-back">← Voltar</button>
        <h2>${latest.agentIcon} ${latest.agentName}</h2>
        <button id="close-mental-health">✕</button>
      </div>
      <div class="mh-content">
        <div class="mh-detail-header">
          <div class="mh-detail-mood">
            <span class="mh-mood-big">${{positivo:'😊',neutro:'😐',preocupado:'😟',critico:'😰'}[latest.mood] || '❓'}</span>
            <span>Estado: ${latest.mood}</span>
          </div>
          <div class="mh-detail-score">
            <span class="mh-score-big">${this.calculateHealthScore(latest.dimensions)}</span>
            <span>/100</span>
          </div>
        </div>
        <h3>💭 Última Autorreflexão</h3>
        <div class="mh-reflection-full">"${latest.selfReflection}"</div>
        <h3>📊 Dimensões de Saúde</h3>
        <div class="mh-dimensions-detail">
          ${Object.entries(latest.dimensions).map(([key, val]) => {
            const dim = this.dimensions[key];
            return `<div class="mh-dim-row">
              <span class="mh-dim-label">${dim?.icon || ''} ${dim?.name || key}</span>
              <div class="mh-dim-bar-full">
                <div class="mh-dim-fill" style="width:${val*10}%;background:${dim?.color || '#888'}"></div>
              </div>
              <span class="mh-dim-value">${val}/10</span>
            </div>`;
          }).join('')}
        </div>
        ${latest.needs.length > 0 ? `
          <h3>⚠️ Necessidades Identificadas</h3>
          <div class="mh-needs-list">${latest.needs.map(n => `<div class="mh-need-item">• ${n}</div>`).join('')}</div>
        ` : ''}
        <h3>📝 Histórico de Relatos (${reports.length})</h3>
        <div class="mh-reports-list">
          ${reports.slice(-10).reverse().map(r => {
            const time = new Date(r.timestamp).toLocaleTimeString('pt-BR');
            const moodEmoji = {positivo:'😊',neutro:'😐',preocupado:'😟',critico:'😰'}[r.mood] || '❓';
            return `<div class="mh-report-item">
              <span class="mh-report-time">${time}</span>
              <span class="mh-report-mood">${moodEmoji}</span>
              <span class="mh-report-reflection">${r.selfReflection.substring(0, 80)}...</span>
            </div>`;
          }).join('')}
        </div>
      </div>
    `;
    panel.innerHTML = html;
    document.getElementById('mh-back').addEventListener('click', () => this.renderPanel());
    document.getElementById('close-mental-health').addEventListener('click', () => panel.classList.add('hidden'));
  }
};

// === neural-snippets.js ===
const NeuralSystem = {
  EVOLUTION_CAP: 0.60,
  UPDATE_INTERVAL: 60000,
  profiles: {},
  init() {
    this.loadProfiles();
    this.startMonitoring();
  },
  loadProfiles() {
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
    try {
      const saved = localStorage.getItem('neural-profiles');
      if (saved) {
        this.profiles = JSON.parse(saved);
        for (const [name, profile] of Object.entries(defaults)) {
          if (!this.profiles[name]) {
            this.profiles[name] = profile;
          } else {
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
  activateSnippet(agentName, snippetId) {
    const profile = this.profiles[agentName];
    if (!profile) return false;
    const snippet = profile.snippets.find(s => s.id === snippetId);
    if (!snippet) return false;
    const requiredEvolution = snippet.power * 0.5;
    if (profile.evolution < requiredEvolution) {
      return { error: `Evolução insuficiente. Necessário: ${Math.round(requiredEvolution * 100)}%` };
    }
    snippet.active = true;
    profile.lastActivity = new Date().toISOString();
    this.saveProfiles();
    return { success: true, snippet: snippet.name };
  },
  deactivateSnippet(agentName, snippetId) {
    const profile = this.profiles[agentName];
    if (!profile) return false;
    const snippet = profile.snippets.find(s => s.id === snippetId);
    if (!snippet) return false;
    snippet.active = false;
    this.saveProfiles();
    return true;
  },
  processProfile(agentName) {
    const profile = this.profiles[agentName];
    if (!profile) return null;
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
  createLetter(agentName, type, content) {
    const profile = this.profiles[agentName];
    if (!profile) return false;
    const letter = {
      id: 'letter_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      type: type,
      content: content,
      timestamp: new Date().toISOString(),
      read: false,
      bonus: type === 'bonus' ? this.calculateBonus(profile) : null
    };
    profile.letters.push(letter);
    this.saveProfiles();
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
  calculateBonus(profile) {
    const base = 10;
    const evolutionMultiplier = profile.evolution / this.EVOLUTION_CAP;
    const snippetCount = profile.snippets.filter(s => s.active).length;
    return Math.round(base * (1 + evolutionMultiplier) * (1 + snippetCount * 0.1));
  },
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
  generateConditions(profile) {
    const conditions = [
      `Manter evolução acima de ${Math.round(profile.evolution * 100)}%`,
      `Ativar todos os snippets disponíveis`,
      `Completar 3 tarefas com sucesso`,
      `Não gerar erros por 24 horas`
    ];
    const selected = [];
    while (selected.length < 2 && conditions.length > 0) {
      const index = Math.floor(Math.random() * conditions.length);
      selected.push(conditions.splice(index, 1)[0]);
    }
    return selected;
  },
  evolveAgent(agentName, amount) {
    const profile = this.profiles[agentName];
    if (!profile) return false;
    if (profile.evolution >= this.EVOLUTION_CAP) {
      return { capped: true, current: profile.evolution };
    }
    const newEvolution = Math.min(profile.evolution + amount, this.EVOLUTION_CAP);
    profile.evolution = newEvolution;
    profile.lastActivity = new Date().toISOString();
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
  resetEvolution(agentName) {
    const profile = this.profiles[agentName];
    if (!profile) return false;
    profile.evolution = 0.1;
    this.saveProfiles();
    return { success: true, newEvolution: 0.1 };
  },
  startMonitoring() {
    setInterval(() => {
      this.updateAllAgents();
    }, this.UPDATE_INTERVAL);
    setTimeout(() => this.updateAllAgents(), 5000);
  },
  updateAllAgents() {
    for (const [name, profile] of Object.entries(this.profiles)) {
      if (profile.status !== 'active') continue;
      if (profile.evolution < this.EVOLUTION_CAP) {
        const passiveGain = 0.001 + (profile.snippets.filter(s => s.active).length * 0.0005);
        this.evolveAgent(name, passiveGain);
      }
      if (typeof Agents !== 'undefined') {
        const agent = Agents.roster?.find(a => a.name === name);
        if (agent) {
          profile.lastActivity = new Date().toISOString();
        }
      }
    }
    this.saveProfiles();
  },
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
  getProfile(agentName) {
    return this.profiles[agentName] || null;
  },
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
  getSnippet(agentName, snippetId) {
    const profile = this.profiles[agentName];
    if (!profile) return null;
    return profile.snippets.find(s => s.id === snippetId);
  },
  canEvolve(agentName) {
    const profile = this.profiles[agentName];
    if (!profile) return false;
    return profile.evolution < this.EVOLUTION_CAP;
  },
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