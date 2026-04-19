/* ===== MCP_TOOLS.JS - Registro de Ferramentas MCP (Espaço Confinado) ===== */
/* Simula um ambiente MCP com ferramentas limitadas — ganho de experiência prática */

const MCPTools = {
  // Registro de ferramentas disponíveis
  registry: {
    // === FERRAMENTAS DE LEITURA ===
    read_file: {
      name: 'Ler Arquivo',
      icon: '📖',
      description: 'Lê o conteúdo de um arquivo no espaço confinado.',
      category: 'leitura',
      cost: 5,  // Custo em "energia" (recurso limitado)
      requires: ['guardian'],
      output: 'string',
      execute(agent, params) {
        const files = MCPFileSystem.list();
        const file = files.find(f => f.name === params.path);
        if (!file) return { error: 'Arquivo não encontrado', available: files.map(f => f.name) };
        return { content: file.content, lines: file.content.split('\n').length };
      }
    },

    search_files: {
      name: 'Buscar em Arquivos',
      icon: '🔍',
      description: 'Busca padrão nos arquivos do espaço confinado.',
      category: 'leitura',
      cost: 8,
      requires: [],
      output: 'array',
      execute(agent, params) {
        const results = MCPFileSystem.search(params.pattern);
        return { matches: results.length, files: results };
      }
    },

    // === FERRAMENTAS DE ESCRITA ===
    write_file: {
      name: 'Escrever Arquivo',
      icon: '✍️',
      description: 'Escreve conteúdo em um arquivo. Cria se não existe.',
      category: 'escrita',
      cost: 10,
      requires: ['coder'],
      output: 'boolean',
      execute(agent, params) {
        MCPFileSystem.write(params.path, params.content, agent.name);
        return { success: true, path: params.path, bytes: params.content.length };
      }
    },

    patch: {
      name: 'Editar Arquivo',
      icon: '🔧',
      description: 'Edita trecho específico de um arquivo existente.',
      category: 'escrita',
      cost: 12,
      requires: ['coder'],
      output: 'diff',
      execute(agent, params) {
        const result = MCPFileSystem.patch(params.path, params.old, params.new);
        return result;
      }
    },

    // === FERRAMENTAS DE ANÁLISE ===
    analyze: {
      name: 'Analisar Dados',
      icon: '📊',
      description: 'Analisa dados e gera insights estruturados.',
      category: 'analise',
      cost: 15,
      requires: ['analyst'],
      output: 'object',
      execute(agent, params) {
        return {
          summary: `Análise de "${params.subject}" por ${agent.name}`,
          findings: Math.floor(Math.random() * 5) + 1,
          confidence: (Math.random() * 40 + 60).toFixed(1) + '%',
          recommendation: 'Prosseguir com cautela'
        };
      }
    },

    // === FERRAMENTAS DE TRANSFORMAÇÃO ===
    transmute: {
      name: 'Transmutar',
      icon: '⚗️',
      description: 'Converte dados de um formato para outro (alquimia digital).',
      category: 'transformacao',
      cost: 20,
      requires: ['alchemist', 'transmuter'],
      output: 'any',
      execute(agent, params) {
        return {
          input: params.data,
          output: `[Transmutado por ${agent.name}] ${JSON.stringify(params.data)}`,
          process: 'Nigredo → Albedo → Citrinitas → Rubedo',
          stage: params.stage || 'Albedo'
        };
      }
    },

    combine: {
      name: 'Combinar',
      icon: '🔗',
      description: 'Combina duas entradas em uma síntese nova.',
      category: 'transformacao',
      cost: 15,
      requires: ['weaver', 'combinator'],
      output: 'any',
      execute(agent, params) {
        return {
          synthesis: `${params.a} × ${params.b}`,
          result: `Síntese criada por ${agent.name}`,
          connections: Math.floor(Math.random() * 10) + 3
        };
      }
    },

    // === FERRAMENTAS DE COMUNICAÇÃO ===
    send_message: {
      name: 'Enviar Mensagem',
      icon: '📨',
      description: 'Envia mensagem para outro agente.',
      category: 'comunicacao',
      cost: 3,
      requires: [],
      output: 'boolean',
      execute(agent, params) {
        const target = Agents.getAgent(params.target_id);
        if (!target) return { error: 'Agente não encontrado' };
        target.inbox.push({
          from: agent.name,
          content: params.message,
          timestamp: Date.now(),
          type: 'mcp_message'
        });
        return { delivered: true, to: target.name };
      }
    },

    broadcast: {
      name: 'Transmissão Geral',
      icon: '📡',
      description: 'Envia mensagem para todos os agentes ativos.',
      category: 'comunicacao',
      cost: 10,
      requires: ['messenger'],
      output: 'number',
      execute(agent, params) {
        let count = 0;
        Agents.active.forEach(a => {
          if (a.id !== agent.id) {
            a.inbox.push({
              from: agent.name,
              content: params.message,
              timestamp: Date.now(),
              type: 'broadcast'
            });
            count++;
          }
        });
        return { delivered: count };
      }
    },

    // === FERRAMENTAS DE CONSTRUÇÃO ===
    build: {
      name: 'Construir Módulo',
      icon: '🏗️',
      description: 'Constrói um módulo funcional dentro do espaço confinado.',
      category: 'construcao',
      cost: 25,
      requires: ['engineer', 'architect'],
      output: 'object',
      execute(agent, params) {
        return {
          module: params.name,
          built_by: agent.name,
          components: params.components || [],
          status: 'operational',
          dependencies: []
        };
      }
    },

    // === FERRAMENTAS DE DIVINAÇÃO ===
    predict: {
      name: 'Prever Resultado',
      icon: '🔮',
      description: 'Analisa padrões e prevê resultado provável.',
      category: 'divinacao',
      cost: 18,
      requires: ['diviner', 'analyst'],
      output: 'object',
      execute(agent, params) {
        const outcomes = ['sucesso', 'sucesso_parcial', 'incerto', 'necessita_revisao'];
        return {
          prediction: outcomes[Math.floor(Math.random() * outcomes.length)],
          confidence: (Math.random() * 30 + 50).toFixed(1) + '%',
          factors: ['timing', 'recursos', 'alinhamento'],
          advisor: agent.name
        };
      }
    },

    // === FERRAMENTAS DE CURA/DIAGNÓSTICO ===
    diagnose: {
      name: 'Diagnosticar Sistema',
      icon: '🩺',
      description: 'Diagnostica problemas e sugere correções.',
      category: 'cura',
      cost: 12,
      requires: ['healer'],
      output: 'object',
      execute(agent, params) {
        const issues = ['desequilíbrio de carga', 'vazamento de memória', 'loop infinito', 'deadlock'];
        return {
          diagnosis: issues[Math.floor(Math.random() * issues.length)],
          severity: ['baixa', 'média', 'alta'][Math.floor(Math.random() * 3)],
          prescription: `Recomendo ${agent.skill} para resolver.`,
          healer: agent.name
        };
      }
    },

    // === FERRAMENTAS DE CONSELHO ===
    convene_council: {
      name: 'Convocar Conselho',
      icon: '☤',
      description: 'Convoca todos os agentes para uma Mesa de Reunião.',
      category: 'conselho',
      cost: 30,
      requires: ['mystic', 'guardian'],
      output: 'boolean',
      execute(agent, params) {
        Council.convene(params.topic_id);
        return { convened: true, topic: params.topic_id };
      }
    },

    consult_peer: {
      name: 'Consultar Par',
      icon: '🤝',
      description: 'Busca opinião de outro agente sobre um tema.',
      category: 'conselho',
      cost: 5,
      requires: [],
      output: 'object',
      execute(agent, params) {
        const peer = Agents.getAgent(params.peer_id);
        if (!peer) return { error: 'Par não encontrado' };

        const response = `De ${peer.name} (${peer.skill}): "${Council.consultResponse(peer, agent)}"`;

        // Registrar no livro de ambos
        agent.book.pages.push({ content: `Consultei ${peer.name}: ${response}` });
        peer.book.pages.push({ content: `${agent.name} me consultou. Respondi com minha visão de ${peer.skill}.` });

        Agents.gainExperience(agent, 10);
        Agents.gainExperience(peer, 15);

        return { response, from: peer.name, skill: peer.skill };
      }
    }
  },

  // Energia disponível (recurso limitado — espaço confinado)
  energy: {
    max: 100,
    current: 100,
    regenRate: 2,  // por ciclo
    regenInterval: 5000,

    init() {
      setInterval(() => this.regen(), this.regenInterval);
    },

    regen() {
      this.current = Math.min(this.max, this.current + this.regenRate);
    },

    consume(amount) {
      if (this.current < amount) return false;
      this.current -= amount;
      return true;
    },

    getStatus() {
      return { current: this.current, max: this.max, percentage: (this.current / this.max * 100).toFixed(0) + '%' };
    }
  },

  // Executar ferramenta
  execute(agent, toolId, params = {}) {
    const tool = this.registry[toolId];
    if (!tool) return { error: `Ferramenta "${toolId}" não existe.` };

    // Verificar se agente tem permissão
    if (tool.requires.length > 0 && !tool.requires.includes(agent.type)) {
      return { error: `${agent.name} (${agent.type}) não tem permissão para usar ${tool.name}. Requer: ${tool.requires.join(' ou ')}.` };
    }

    // Verificar energia
    if (!this.energy.consume(tool.cost)) {
      return { error: `Energia insuficiente. Necessário: ${tool.cost}, Disponível: ${this.energy.current}` };
    }

    // Executar
    try {
      const result = tool.execute(agent, params);

      // Registrar no livro do agente
      agent.book.pages.push({
        content: `[${new Date().toLocaleTimeString()}] Usei ${tool.icon} ${tool.name}\nResultado: ${JSON.stringify(result, null, 2).substring(0, 200)}`
      });

      // Ganhar XP
      Agents.gainExperience(agent, tool.cost);

      return { success: true, tool: toolId, result, energyRemaining: this.energy.current };
    } catch (err) {
      return { error: `Erro ao executar ${tool.name}: ${err.message}` };
    }
  },

  // Listar ferramentas disponíveis para um agente
  getAvailableTools(agent) {
    return Object.entries(this.registry)
      .filter(([_, tool]) => tool.requires.length === 0 || tool.requires.includes(agent.type))
      .map(([id, tool]) => ({
        id,
        name: tool.name,
        icon: tool.icon,
        cost: tool.cost,
        category: tool.category,
        description: tool.description
      }));
  },

  // Status geral
  getStatus() {
    return {
      totalTools: Object.keys(this.registry).length,
      energy: this.energy.getStatus(),
      categories: [...new Set(Object.values(this.registry).map(t => t.category))]
    };
  },

  // Inicializar
  init() {
    this.energy.init();
  }
};

// === SISTEMA DE ARQUIVOS CONFINADO (MCP FileSystem) ===
const MCPFileSystem = {
  files: [
    { name: 'emerald_tablet.txt', content: 'Verum, sine mendacio, certum et verissimum.\nO que está em cima é como o que está embaixo.\nE o que está embaixo é como o que está em cima.', author: 'Hermes Trismegistus' },
    { name: 'principles.txt', content: '1. Mentalismo\n2. Correspondência\n3. Vibração\n4. Polaridade\n5. Ritmo\n6. Causa e Efeito\n7. Gênero', author: 'Kybalion' },
    { name: 'tasks/todo.txt', content: '☐ Configurar ferramentas MCP\n☐ Testar transmutação de dados\n☐ Validar consenso do conselho\n☐ Documentar evolução coletiva', author: 'Sistema' },
    { name: 'notes/lab.txt', content: 'Observações do laboratório:\n- O fogo deve ser controlado\n- Paciência é virtude alquímica\n- A perfeição vem com iteração', author: 'Flamel' },
    { name: 'config/mcp.json', content: '{"version":"1.0","max_agents":15,"energy_max":100,"tools_enabled":true}', author: 'Arquiteto' }
  ],

  list() { return this.files; },

  read(name) { return this.files.find(f => f.name === name); },

  write(name, content, author) {
    const existing = this.files.findIndex(f => f.name === name);
    if (existing >= 0) {
      this.files[existing].content = content;
      this.files[existing].author = author;
    } else {
      this.files.push({ name, content, author });
    }
  },

  search(pattern) {
    const regex = new RegExp(pattern, 'gi');
    return this.files.filter(f => regex.test(f.content)).map(f => ({
      file: f.name,
      matches: (f.content.match(regex) || []).length
    }));
  },

  patch(path, oldStr, newStr) {
    const file = this.files.find(f => f.name === path);
    if (!file) return { error: 'Arquivo não encontrado' };
    if (!file.content.includes(oldStr)) return { error: 'Texto original não encontrado' };
    file.content = file.content.replace(oldStr, newStr);
    return { success: true, path, changed: true };
  }
};
