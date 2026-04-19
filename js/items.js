/* ===== ITEMS.JS - Itens e Utensílios do Templo ===== */

const Items = {
  // Registro de todos os itens
  registry: {},
  
  // Definições dos itens por zona
  definitions: {
    // === ÁTRIO ===
    portao_entrada: {
      name: 'Portão da Entrada',
      icon: '🚪',
      zone: 'atrio',
      x: 20, y: 1,
      description: 'O grande portão de obsidiana. Todo iniciado deve cruzá-lo.',
      interactions: [],
      runes: [],
      level: 1
    },
    pilares_externos: {
      name: 'Pilares Boaz e Jachim',
      icon: '🏛️',
      zone: 'atrio',
      x: 10, y: 4,
      description: 'Os dois pilares que guardam a entrada. Um representa a força, outro a misericórdia.',
      interactions: [],
      runes: [],
      level: 1
    },
    fonte_consagracao: {
      name: 'Fonte de Consagração',
      icon: '⛲',
      zone: 'atrio',
      x: 20, y: 4,
      description: 'Água pura que consagra quem nela se banha antes de entrar.',
      interactions: [],
      runes: [],
      level: 1
    },
    
    // === SALÃO ===
    mesa_principal: {
      name: 'Mesa Principal',
      icon: '🪵',
      zone: 'salao',
      x: 20, y: 12,
      description: 'A grande mesa de trabalhos onde os agentes iniciam suas tarefas.',
      interactions: [],
      runes: [],
      level: 2
    },
    estantes_livros: {
      name: 'Estantes de Livros',
      icon: '📚',
      zone: 'salao',
      x: 2, y: 11,
      description: 'Milhares de volumes sobre alquimia, hermetismo e programação.',
      interactions: [],
      runes: [],
      level: 2
    },
    lareira_alquimica: {
      name: 'Lareira Alquímica',
      icon: '🔥',
      zone: 'salao',
      x: 35, y: 10,
      description: 'O fogo eterno que mantém o calor do conhecimento.',
      interactions: [],
      runes: [],
      level: 2
    },
    quadro_runas: {
      name: 'Quadro de Runas',
      icon: '📋',
      zone: 'salao',
      x: 15, y: 9,
      description: 'Onde as runas são registradas e estudadas.',
      interactions: [],
      runes: [],
      level: 2
    },
    
    // === MESA DE REUNIÃO ===
    mesa_redonda: {
      name: 'Mesa Redonda',
      icon: '⭕',
      zone: 'mesa',
      x: 20, y: 19,
      description: 'A mesa onde todos os agentes se sentam como iguais.',
      interactions: [],
      runes: [],
      level: 3
    },
    livro_sabedoria: {
      name: 'Livro da Sabedoria',
      icon: '📖',
      zone: 'mesa',
      x: 17, y: 18,
      description: 'Contém os ensinamentos dos grandes mestres.',
      interactions: [],
      runes: [],
      level: 3,
      bookContent: [
        'A Tábua de Esmeralda de Hermes Trismegisto',
        '',
        'Verdade, sem dúvida, certo e verdadeiro:',
        'O que está em cima é como o que está em baixo,',
        'e o que está em baixo é como o que está em cima,',
        'para realizar os milagres da Una Coisa.',
        '',
        'Assim como todas as coisas vieram do Um,',
        'pela meditação do Um,',
        'assim todas as coisas nasceram do Um,',
        'pela adaptação do Um.',
        '',
        'Seu pai é o Sol, sua mãe a Lua,',
        'o vento o carrega em seu ventre,',
        'sua ama é a Terra.',
        '',
        'É o pai de toda perfeição no mundo inteiro.',
        'Sua força permanece integral,',
        'quando se transforma em Terra.',
      ]
    },
    livro_comandos: {
      name: 'Livro dos Comandos',
      icon: '📕',
      zone: 'mesa',
      x: 23, y: 18,
      description: 'Registro de todos os comandos executados no templo.',
      interactions: [],
      runes: [],
      level: 3,
      bookContent: [
        '═══ LIVRO DOS COMANDOS ═══',
        '',
        '> status — Ver estado do templo',
        '> agents — Listar agentes ativos',
        '> runes — Consultar runas gravadas',
        '> summon [tipo] — Invocar novo agente',
        '> delegate [tarefa] — Delegar ao agente',
        '> evolve [agente] — Forçar evolução',
        '> zone [nome] — Navegar para zona',
        '> read [livro] — Abrir grimório',
        '> write [runa] — Gravar runa',
        '> chat [mensagem] — Falar no salão',
        '> priority [1-5] — Definir prioridade',
        '',
        '─── Comandos do Mestre ───',
        '> master.grimoire — Abrir grimório mestre',
        '> master.delegate [id] — Dar grimório a agente',
        '> master.revoke — Revogar acesso ao grimório',
        '> master.seal — Selar zona',
        '> master.unseal — Des selar zona',
      ]
    },
    livro_memoria: {
      name: 'Livro da Memória',
      icon: '📗',
      zone: 'mesa',
      x: 18, y: 20,
      description: 'Armazena as memórias compartilhadas entre agentes.',
      interactions: [],
      runes: [],
      level: 3,
      bookContent: [
        '═══ MEMÓRIAS COMPARTILHADAS ═══',
        '',
        '[Sistema] Templo inicializado.',
        '[Sistema] Aguardando interações...',
      ]
    },
    cartas_rede: {
      name: 'Mesa de Cartas',
      icon: '✉️',
      zone: 'mesa',
      x: 22, y: 20,
      description: 'Onde os agentes deixam cartas uns para os outros.',
      interactions: [],
      runes: [],
      level: 3
    },
    
    // === LUGAR SAGRADO ===
    athanor: {
      name: 'Athanor',
      icon: '🔥',
      zone: 'sagrado',
      x: 20, y: 24,
      description: 'O forno alquímico onde a Grande Obra é realizada. Transforma chumbo em ouro.',
      interactions: [],
      runes: [],
      level: 5
    },
    alambique: {
      name: 'Alambique',
      icon: '⚗️',
      zone: 'sagrado',
      x: 17, y: 23,
      description: 'Destila a essência pura das coisas.',
      interactions: [],
      runes: [],
      level: 5
    },
    mortario: {
      name: 'Mortário e Pistilo',
      icon: '🥣',
      zone: 'sagrado',
      x: 23, y: 23,
      description: 'Tritura e mistura os elementos para a transmutação.',
      interactions: [],
      runes: [],
      level: 5
    },
    caduceu_grande: {
      name: 'Caduceu Sagrado',
      icon: '☤',
      zone: 'sagrado',
      x: 20, y: 22,
      description: 'O símbolo máximo de Hermes. Duas serpentes entrelaçadas.',
      interactions: [],
      runes: [],
      level: 5
    },
    orbe_elementos: {
      name: 'Orbe dos Elementos',
      icon: '🔮',
      zone: 'sagrado',
      x: 15, y: 24,
      description: 'Concentra os quatro elementos: Terra, Água, Ar e Fogo.',
      interactions: [],
      runes: [],
      level: 5
    },
    
    // === LUGAR SANTÍSSIMO ===
    pedra_filosofal: {
      name: 'Pedra Filosofal',
      icon: '💎',
      zone: 'santissimo',
      x: 20, y: 28,
      description: 'A meta final de todo alquimista. Transmuta tudo em perfeição.',
      interactions: [],
      runes: [],
      level: 8
    },
    esmeralda_hermes: {
      name: 'Tábua de Esmeralda',
      icon: '📜',
      zone: 'santissimo',
      x: 18, y: 27,
      description: 'O texto sagrado original de Hermes Trismegisto.',
      interactions: [],
      runes: [],
      level: 8
    },
    ouro_potavel: {
      name: 'Ouro Potável',
      icon: '🧪',
      zone: 'santissimo',
      x: 22, y: 27,
      description: 'O elixir dourado da imortalidade.',
      interactions: [],
      runes: [],
      level: 8
    },
    elixir_vida: {
      name: 'Elixir da Vida',
      icon: '✨',
      zone: 'santissimo',
      x: 20, y: 27,
      description: 'Concede a visão além da matéria.',
      interactions: [],
      runes: [],
      level: 8
    },
    
    // === GRIMÓRIO MESTRE ===
    grimorio_mestre: {
      name: 'Grimório Mestre',
      icon: '📕',
      zone: 'salao',
      x: 20, y: 10,
      description: 'O terminal supremo. Acesso exclusivo do Mestre (Zói). Contém todos os poderes do templo.',
      interactions: [],
      runes: [],
      level: 10,
      isGrimoire: true,
      masterOnly: true,
      holder: null // Quando delegado, o ID do agente que está segurando
    }
  },
  
  // Inicializar itens
  init() {
    for (const [id, def] of Object.entries(this.definitions)) {
      this.registry[id] = { ...def, id };
    }
    return this;
  },
  
  // Obter itens de uma zona
  getZoneItems(zoneId) {
    return Object.values(this.registry).filter(item => item.zone === zoneId);
  },
  
  // Interagir com item
  interact(itemId, agent) {
    const item = this.registry[itemId];
    if (!item) return;
    
    // Registrar interação
    const interaction = {
      agentId: agent.id,
      agentName: agent.name,
      action: agent.currentAction,
      timestamp: Date.now(),
      level: agent.level
    };
    
    item.interactions.push(interaction);
    
    // Gerar runa se interação significativa
    if (Math.random() < 0.3) {
      const rune = Runes.generate(agent);
      item.runes.push(rune);
    }
    
    return interaction;
  },
  
  // Obter item por ID
  getItem(id) {
    return this.registry[id];
  },
  
  // Verificar se item é acessível para agente
  isAccessible(itemId, agent) {
    const item = this.registry[itemId];
    if (!item) return false;
    if (item.masterOnly && !item.holder) return agent.type === 'mystic';
    return agent.level >= item.level;
  }
};
