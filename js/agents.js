/* ===== AGENTS.JS - Sistema de Agentes (Skills) ===== */
/* Agentes visitam o templo, interagem com itens e evoluem */

const Agents = {
  // Lista de agentes disponíveis
  roster: [],
  
  // Agentes ativos no templo
  active: [],
  
  // Tipos de agente (skills do Hermes)
  types: {
    coder: {
      name: 'Códex',
      icon: '🤖',
      skill: 'coding',
      color: '#4a8aff',
      description: 'Agente de programação. Domina os livros de código.',
      preferredZone: 'mesa'
    },
    researcher: {
      name: 'Scholar',
      icon: '📚',
      skill: 'research',
      color: '#8a4aff',
      description: 'Agente de pesquisa. Consulta os textos antigos.',
      preferredZone: 'salao'
    },
    alchemist: {
      name: 'Flamel',
      icon: '⚗️',
      skill: 'alchemy',
      color: '#ff8a4a',
      description: 'Agente alquímico. Trabalha no Athanor.',
      preferredZone: 'sagrado'
    },
    guardian: {
      name: 'Thoth',
      icon: '🛡️',
      skill: 'guardian',
      color: '#4aff8a',
      description: 'Guardião do templo. Protege o conhecimento.',
      preferredZone: 'atrio'
    },
    mystic: {
      name: 'Hermes',
      icon: '✨',
      skill: 'mystic',
      color: '#ffcc00',
      description: 'O mestre. Acessa o Lugar Santíssimo.',
      preferredZone: 'santissimo'
    },
    messenger: {
      name: 'Iris',
      icon: '🌈',
      skill: 'messenger',
      color: '#ff4a8a',
      description: 'Mensageira. Conecta todos os agentes.',
      preferredZone: 'salao'
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
          { content: `Início dos registros de ${name || typeData.name}.\nNível: 1\nHabilidade: ${typeData.skill}` }
        ],
        currentPage: 0
      },
      
      // Inventário de cartas/mensagens
      inbox: [],
      outbox: [],
      
      // Runas coletadas
      runes: [],
      
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
    const actions = ['wander', 'visit_item', 'read_book', 'write_book', 'exchange'];
    const weights = {
      wander: 3,
      visit_item: 4,
      read_book: 2,
      write_book: 1,
      exchange: 2
    };
    
    // Escolher ação baseada no tipo do agente
    if (agent.type === 'coder') weights.read_book = 5;
    if (agent.type === 'alchemist') weights.visit_item = 6;
    if (agent.type === 'mystic') weights.write_book = 4;
    
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
  
  // Inicializar agentes padrão
  initDefaults() {
    // Criar agentes iniciais
    this.create('coder', 'Códex');
    this.create('researcher', 'Scholar');
    this.create('alchemist', 'Flamel');
    this.create('guardian', 'Thoth');
    
    // Spawnar os dois primeiros
    if (this.roster.length >= 2) {
      this.spawn(this.roster[0].id);
      this.spawn(this.roster[1].id);
    }
  }
};
