/* ===== AGENTS.JS - Sistema de 15 Mentalidades (Agentes) ===== */
/* Baseadas em mestres herméticos/alquímicos + funções práticas */

const Agents = {
  // Lista de agentes disponíveis
  roster: [],
  
  // Agentes ativos no templo
  active: [],
  
  // 15 tipos de agente (mentalidades)
  types: {
    // === ORIGINAIS (6) ===
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

    // === NOVAS MENTALIDADES (9) ===
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
      icon: '🗝️',
      skill: 'mystery',
      color: '#9c27b0',
      description: 'Mente oculta. Revela o que está escondido, decifra enigmas.',
      preferredZone: 'santissimo',
      hermetic: 'Vênus ♀ — Beleza oculta na verdade'
    }
  },
  
  // Criar um novo agente
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
      
      // Estado
      x: 20,
      y: 5,
      targetX: 20,
      targetY: 5,
      direction: 'down',
      moving: false,
      
      // Progressão
      level: 1,
      experience: 0,
      expToNext: 100,
      
      // Livro pessoal (console do agente)
      book: {
        title: `Livro de ${name || typeData.name}`,
        pages: [
          { content: `╔══════════════════════════════╗\n║  ${typeData.icon} ${(name || typeData.name).toUpperCase().padEnd(24)}║\n╠══════════════════════════════╣\n║ Nível: 1                     ║\n║ Habilidade: ${typeData.skill.padEnd(17)}║\n║ ${typeData.hermetic.padEnd(29)}║\n║                              ║\n║ "${typeData.description.substring(0, 28)}" ║\n╚══════════════════════════════╝` }
        ],
        currentPage: 0
      },
      
      // Inventário de cartas/mensagens
      inbox: [],
      outbox: [],
      
      // Runas coletadas
      runes: [],

      // Ferramentas MCP disponíveis
      mcpTools: [],
      
      // Atividade
      currentAction: 'idle',
      actionTimer: 0,
      lastActivity: Date.now(),
      
      // Visual
      frame: 0,
      animTimer: 0
    };
    
    this.roster.push(agent);
    return agent;
  },
  
  // Spawnar agente no templo
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
  
  // Remover agente do templo
  despawn(agentId) {
    this.active = this.active.filter(a => a.id !== agentId);
    this.updateAgentCount();
  },
  
  // Atualizar todos os agentes
  update(deltaTime) {
    this.active.forEach(agent => {
      this.updateAgent(agent, deltaTime);
    });
  },
  
  // Atualizar um agente individual
  updateAgent(agent, dt) {
    // Animação
    agent.animTimer += dt;
    if (agent.animTimer > 200) {
      agent.animTimer = 0;
      agent.frame = (agent.frame + 1) % 4;
    }
    
    // Movimento
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
        
        // Direção
        if (Math.abs(dx) > Math.abs(dy)) {
          agent.direction = dx > 0 ? 'right' : 'left';
        } else {
          agent.direction = dy > 0 ? 'down' : 'up';
        }
      }
    }
    
    // Comportamento autônomo
    agent.actionTimer += dt;
    if (agent.actionTimer > 3000 && !agent.moving) {
      agent.actionTimer = 0;
      this.autonomousBehavior(agent);
    }
  },
  
  // Comportamento autônomo do agente
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
    
    // Ajustar pesos por tipo
    if (agent.type === 'coder') weights.read_book = 5;
    if (agent.type === 'alchemist') weights.visit_item = 6;
    if (agent.type === 'mystic') weights.write_book = 4;
    if (agent.type === 'engineer') weights.use_tool = 5;
    if (agent.type === 'weaver') weights.consult = 4;
    if (agent.type === 'diviner') weights.read_book = 4;
    
    // Escolher ação ponderada
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
  
  // Andar aleatoriamente
  wander(agent) {
    const zone = World.getZoneAt(Math.floor(agent.x), Math.floor(agent.y));
    if (!zone) return;
    
    const b = zone.bounds;
    let attempts = 0;
    let tx, ty;
    
    do {
      tx = b.x + 2 + Math.floor(Math.random() * (b.w - 4));
      ty = b.y + 2 + Math.floor(Math.random() * (b.h - 4));
      attempts++;
    } while (!World.isWalkable(tx, ty) && attempts < 20);
    
    if (attempts < 20) {
      agent.targetX = tx;
      agent.targetY = ty;
      agent.moving = true;
      agent.currentAction = 'wandering';
    }
  },
  
  // Visitar um item na zona
  visitItem(agent) {
    const zone = World.getZoneAt(Math.floor(agent.x), Math.floor(agent.y));
    if (!zone) return;
    
    const items = Items.getZoneItems(zone.id);
    if (items.length === 0) return;
    
    const item = items[Math.floor(Math.random() * items.length)];
    
    // Mover para o item
    agent.targetX = item.x;
    agent.targetY = item.y + 1;
    agent.moving = true;
    agent.currentAction = 'visiting';
    
    // Registrar interação
    setTimeout(() => {
      if (!agent.moving) {
        Items.interact(item.id, agent);
        this.gainExperience(agent, 15);
      }
    }, 2000);
  },
  
  // Ler livro
  readBook(agent) {
    agent.currentAction = 'reading';
    agent.book.pages.push({
      content: `[${new Date().toLocaleTimeString()}] Consultei os registros do templo.\nConhecimento absorvido na zona: ${World.getZoneAt(Math.floor(agent.x), Math.floor(agent.y))?.name || 'Desconhecida'}`
    });
    this.gainExperience(agent, 10);
  },
  
  // Escrever no livro
  writeInBook(agent) {
    agent.currentAction = 'writing';
    const runes = Runes.generate();
    agent.runes.push(runes);
    agent.book.pages.push({
      content: `[${new Date().toLocaleTimeString()}] Gravei uma runa: ${runes.symbol}\n${runes.meaning}`
    });
    this.gainExperience(agent, 20);
  },
  
  // Trocar informação com outro agente
  exchangeWithAgent(agent) {
    const others = this.active.filter(a => a.id !== agent.id);
    if (others.length === 0) return;
    
    const partner = others[Math.floor(Math.random() * others.length)];
    
    // Criar carta
    const carta = {
      from: agent.name,
      to: partner.name,
      content: `Informação compartilhada: ${agent.skill} nível ${agent.level}`,
      timestamp: Date.now()
    };
    
    partner.inbox.push(carta);
    agent.outbox.push(carta);
    
    // Mover um em direção ao outro
    agent.targetX = (agent.x + partner.x) / 2;
    agent.targetY = (agent.y + partner.y) / 2;
    agent.moving = true;
    agent.currentAction = 'exchanging';
    
    this.gainExperience(agent, 25);
    this.gainExperience(partner, 15);
  },

  // Usar ferramenta MCP
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

  // Consultar par (busca opinião mesmo sabendo)
  consultPeer(agent) {
    const others = this.active.filter(a => a.id !== agent.id);
    if (others.length === 0) return;

    const peer = others[Math.floor(Math.random() * others.length)];

    // Consultar via MCP
    const result = MCPTools.execute(agent, 'consult_peer', { peer_id: peer.id });

    if (result.success) {
      agent.currentAction = 'consulting';

      // Mover em direção ao par
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
  
  // Ganhar experiência
  gainExperience(agent, amount) {
    agent.experience += amount;
    
    // Verificar level up
    while (agent.experience >= agent.expToNext) {
      agent.experience -= agent.expToNext;
      agent.level++;
      agent.expToNext = Math.floor(agent.expToNext * 1.5);
      
      // Adicionar entrada no livro
      agent.book.pages.push({
        content: `═══════════════════════\n★ EVOLUÇÃO! ★\nNível ${agent.level} alcançado!\nHabilidade ${agent.skill} aprimorada.\n═══════════════════════`
      });
      
      // Notificar
      if (typeof Interactions !== 'undefined') {
        Interactions.notify(`${agent.icon} ${agent.name} evoluiu para Nível ${agent.level}!`);
      }
    }
    
    // Auto-save após ganhar XP (debounced)
    if (typeof this._saveTimeout) clearTimeout(this._saveTimeout);
    this._saveTimeout = setTimeout(() => this.saveAll(), 2000);
  },
  
  // Verificar se agente pode acessar zona
  canAccessZone(agent, zoneId) {
    const zone = World.zones[zoneId];
    if (!zone) return false;
    return agent.level >= zone.requiredLevel;
  },
  
  // Contar agentes ativos
  updateAgentCount() {
    const el = document.getElementById('agent-count');
    if (el) el.textContent = this.active.length;
  },
  
  // Obter agente por ID
  getAgent(id) {
    return this.active.find(a => a.id === id) || this.roster.find(a => a.id === id);
  },
  
  // Inicializar as 15 mentalidades
  initDefaults() {
    // Criar as 15 mentalidades
    const mentalidades = [
      'coder', 'researcher', 'alchemist', 'guardian', 'mystic', 'messenger',
      'healer', 'transmuter', 'weaver', 'architect', 'diviner',
      'engineer', 'analyst', 'combinator', 'enigma'
    ];

    mentalidades.forEach(type => {
      this.create(type);
    });

    // Carregar estado salvo (XP, níveis)
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
        console.log(`📚 ${saved.length} agentes restaurados do cache`);
      }
    }

    // Spawnar os primeiros 6 no templo
    const spawnCount = Math.min(6, this.roster.length);
    for (let i = 0; i < spawnCount; i++) {
      this.spawn(this.roster[i].id);
    }

    // Os outros ficam no roster, disponíveis para convocação
    return this.roster.length;
  },

  // Salvar estado de todos os agentes
  saveAll() {
    if (typeof Persistence !== 'undefined') {
      Persistence.saveAgents(this.roster);
      console.log('💾 Agentes salvos');
    }
  }
};
