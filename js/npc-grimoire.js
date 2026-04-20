/* ===== NPC-GRIMOIRE.JS - Grimório Pessoal dos 15 NPCs ===== */
/* Cada NPC tem um grimório com comandos + diário pessoal */

const NPCGrimoire = {
  // Fila de comandos pendentes pro jogador
  pendingCommands: [],
  
  // Diários pessoais dos NPCs
  diarios: {},
  
  // Inicializar
  init() {
    // Criar diário pra cada NPC
    if (typeof Agents !== 'undefined' && Agents.roster) {
      Agents.roster.forEach(agent => {
        if (!this.diarios[agent.type]) {
          this.diarios[agent.type] = [];
        }
      });
    }
    
    // Carregar diários salvos
    this.loadDiarios();
    
    // Gerar comandos automáticos a cada 45s
    setInterval(() => this.gerarComandoAutomatico(), 45000);
    
    // Gerar entrada de diário a cada 2 minutos
    setInterval(() => this.gerarEntradaDiario(), 120000);
  },
  
  // === SISTEMA DE COMANDOS ===
  
  // NPC gera um comando pro jogador
  gerarComando(npcType, comando) {
    const agent = Agents.roster?.find(a => a.type === npcType);
    if (!agent) return null;
    
    const cmd = {
      id: Date.now() + '_' + npcType,
      npc: npcType,
      npcName: agent.name,
      npcEmoji: agent.emoji,
      timestamp: new Date().toLocaleTimeString('pt-BR'),
      titulo: comando.titulo,
      descricao: comando.descricao,
      acoes: comando.acoes || [], // [{label, command, link?, code?}]
      prioridade: comando.prioridade || 'normal',
      lido: false
    };
    
    this.pendingCommands.push(cmd);
    
    // Manter só os últimos 20
    if (this.pendingCommands.length > 20) {
      this.pendingCommands.shift();
    }
    
    // Notificar jogador
    this.notificarComando(cmd);
    
    // Salvar
    this.save();
    
    return cmd;
  },
  
  // Notificar sobre novo comando
  notificarComando(cmd) {
    if (typeof Toast !== 'undefined') {
      Toast.show(`${cmd.npcEmoji} ${cmd.npcName} enviou um comando`, 'info');
    }
    
    // Atualizar badge do grimório
    this.updateBadge();
    
    // Se o painel tá aberto, atualizar
    this.renderPainel();
  },
  
  // Atualizar badge de comandos pendentes
  updateBadge() {
    const badge = document.getElementById('grimoire-badge');
    const unread = this.pendingCommands.filter(c => !c.lido).length;
    if (badge) {
      badge.textContent = unread;
      badge.style.display = unread > 0 ? 'flex' : 'none';
    }
  },
  
  // Renderizar painel do grimório
  renderPainel() {
    const container = document.getElementById('grimoire-commands');
    if (!container) return;

    if (this.pendingCommands.length === 0) {
      container.innerHTML = `
        <div class="grimoire-empty">
          <span class="grimoire-empty-icon">📜</span>
          <p>Nenhum comando pendente</p>
          <p class="grimoire-hint">Os NPCs enviarão comandos automaticamente</p>
        </div>`;
      return;
    }

    // Mostrar últimos 5 comandos (os mais recentes primeiro)
    const recentes = this.pendingCommands.slice(-5).reverse();

    container.innerHTML = recentes.map((cmd, i) => {
      const isUnread = !cmd.lido ? 'unread' : '';
      const priorityClass = cmd.prioridade === 'alta' ? 'priority-high' : '';

      const acoesHtml = cmd.acoes.map((acao, j) => {
        if (acao.link) {
          return `<button class="grimoire-action-btn" onclick="NPCGrimoire.executarAcao('${cmd.id}', ${j})">
            ${acao.label} 🔗
          </button>`;
        } else if (acao.code) {
          return `<button class="grimoire-action-btn code" onclick="NPCGrimoire.executarAcao('${cmd.id}', ${j})">
            ${acao.label} 💻
          </button>`;
        } else {
          return `<button class="grimoire-action-btn" onclick="NPCGrimoire.executarAcao('${cmd.id}', ${j})">
            ${acao.label} ⚡
          </button>`;
        }
      }).join('');

      // Gerar texto copiável do comando
      const copiavel = cmd.comando || `hermes> ${cmd.npcName}: ${cmd.titulo} — ${cmd.descricao}`;

      return `
        <div class="grimoire-cmd ${isUnread} ${priorityClass}" onclick="NPCGrimoire.marcarLido('${cmd.id}')">
          <div class="grimoire-cmd-header">
            <span class="grimoire-cmd-npc">${cmd.npcEmoji} ${cmd.npcName}</span>
            <span class="grimoire-cmd-time">${cmd.timestamp}</span>
          </div>
          <div class="grimoire-cmd-title">${cmd.titulo}</div>
          <div class="grimoire-cmd-desc">${cmd.descricao}</div>
          <div class="grimoire-cmd-code" style="background:#1a1a2e;border:1px solid #3a3a5c;border-radius:6px;padding:8px;margin:6px 0;font-family:monospace;font-size:0.75rem;color:#d4a547;word-break:break-all">${copiavel}</div>
          <div class="grimoire-cmd-actions">
            <button class="grimoire-action-btn" onclick="NPCGrimoire.copiarComando('${cmd.id}')" style="background:#2e7d32">📋 Copiar</button>
            ${acoesHtml}
          </div>
        </div>`;
    }).join('');
  },
  
  // Executar ação selecionada
  executarAcao(cmdId, acaoIndex) {
    const cmd = this.pendingCommands.find(c => c.id === cmdId);
    if (!cmd) return;
    
    const acao = cmd.acoes[acaoIndex];
    if (!acao) return;
    
    // Marcar como lido
    cmd.lido = true;
    
    if (acao.link) {
      // Abrir link
      window.open(acao.link, '_blank');
      Toast.show(`🔗 Abrindo: ${acao.label}`, 'success');
    } else if (acao.code) {
      // Copiar código pro clipboard
      navigator.clipboard.writeText(acao.code).then(() => {
        Toast.show(`📋 Código copiado: ${acao.label}`, 'success');
      });
    } else if (acao.command) {
      // Executar no console
      if (typeof Console !== 'undefined') {
        Console.executeCommand(acao.command);
      }
    }
    
    // Remover da fila
    this.pendingCommands = this.pendingCommands.filter(c => c.id !== cmdId);
    this.renderPainel();
    this.updateBadge();
    this.save();
  },
  
  // Marcar comando como lido

  // Copiar comando para clipboard
  copiarComando(cmdId) {
    const cmd = this.pendingCommands.find(c => c.id === cmdId);
    if (!cmd) return;
    
    const texto = cmd.comando || `hermes> ${cmd.npcName}: ${cmd.titulo} — ${cmd.descricao}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(texto).then(() => {
        this.notificar(`📋 Comando copiado! Cole no terminal pra aprovar.`);
      });
    } else {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = texto;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      this.notificar(`📋 Comando copiado! Cole no terminal.`);
    }
    
    this.marcarLido(cmdId);
  },

  // Marcar comando como lido
  marcarLido(cmdId) {
    const cmd = this.pendingCommands.find(c => c.id === cmdId);
    if (cmd) {
      cmd.lido = true;
      this.updateBadge();
    }
  },
  
  // Gerar comando automático baseado no NPC
  gerarComandoAutomatico() {
    if (this.pendingCommands.length > 15) return;
    
    // Escolher NPC aleatório
    const agent = Agents.roster?.[Math.floor(Math.random() * Agents.roster.length)];
    if (!agent) return;
    
    // Comandos por especialidade
    const comandosPorEspecialidade = {
      'hacker': [
        {
          titulo: 'Verificar Vulnerabilidades',
          descricao: 'Detectei uma possível falha no sistema. Quer que eu verifique?',
          acoes: [
            { label: 'Verificar agora', command: 'crystal verificação de segurança' },
            { label: 'Ver depois', command: null }
          ],
          prioridade: 'alta'
        },
        {
          titulo: 'Scan de Rede',
          descricao: 'Posso fazer um scan rápido da rede local.',
          acoes: [
            { label: 'Executar scan', code: 'nmap -sV localhost' },
            { label: 'Pular', command: null }
          ]
        }
      ],
      'filosofo': [
        {
          titulo: 'Reflexão Hermética',
          descricao: 'Estive pensando sobre o Princípio de Correspondência. Quer ler?',
          acoes: [
            { label: 'Ler reflexão', command: 'conhecimento' },
            { label: 'Depois', command: null }
          ]
        },
        {
          titulo: 'Meditação Guiada',
          descricao: 'O silêncio fala mais alto que palavras. Vamos meditar?',
          acoes: [
            { label: 'Começar', command: 'iniciar' },
            { label: 'Não agora', command: null }
          ]
        }
      ],
      'cientista': [
        {
          titulo: 'Análise de Dados',
          descricao: 'Encontrei um padrão interessante nos dados do templo.',
          acoes: [
            { label: 'Ver análise', command: 'alquimia status' },
            { label: 'Ignorar', command: null }
          ]
        }
      ],
      'alquimista': [
        {
          titulo: 'Nova Transmutação',
          descricao: 'Tenho ingredientes suficientes para uma transmutação!',
          acoes: [
            { label: 'Transmutar', command: 'transmutar' },
            { label: 'Ver catálogo', command: 'alquimia catálogo' },
            { label: 'Ver inventário', command: 'alquimia inventario' }
          ],
          prioridade: 'alta'
        }
      ],
      'artista': [
        {
          titulo: 'Inspiração Criativa',
          descricao: 'A musa soprou uma ideia. Quer vê-la?',
          acoes: [
            { label: 'Ver ideia', command: 'ideia' },
            { label: 'Mais tarde', command: null }
          ]
        }
      ],
      'mago': [
        {
          titulo: 'Runa Detectada',
          descricao: 'Senti uma vibração nas runas. Algo mudou.',
          acoes: [
            { label: 'Ler runas', command: 'runas' },
            { label: 'Ignorar', command: null }
          ]
        }
      ],
      'engenheiro': [
        {
          titulo: 'Manutenção do Sistema',
          descricao: 'O sistema precisa de uma verificação periódica.',
          acoes: [
            { label: 'Ver status', command: 'status' },
            { label: 'Ver processos', command: 'crystal listar processos' },
            { label: 'Depois', command: null }
          ]
        }
      ],
      'estratega': [
        {
          titulo: 'Novo Plano',
          descricao: 'Desenvolvi uma estratégia para otimizar o templo.',
          acoes: [
            { label: 'Ver plano', command: 'conselho' },
            { label: 'Adiar', command: null }
          ]
        }
      ],
      'orador': [
        {
          titulo: 'Mensagem Importante',
          descricao: 'Tenho algo a comunicar ao conselho.',
          acoes: [
            { label: 'Ouvir', command: 'conversar' },
            { label: 'Depois', command: null }
          ]
        }
      ],
      'guardiao': [
        {
          titulo: 'Relatório de Segurança',
          descricao: 'Tudo seguro no perímetro. Relatório completo disponível.',
          acoes: [
            { label: 'Ver relatório', command: 'crystal status do sistema' },
            { label: 'OK', command: null }
          ]
        }
      ],
      'mystico': [
        {
          titulo: 'Visão Noturna',
          descricao: 'Tive uma visão sobre os próximos passos.',
          acoes: [
            { label: 'Ver visão', command: 'conhecimento' },
            { label: 'Não agora', command: null }
          ]
        }
      ],
      'arquiteto': [
        {
          titulo: 'Melhoria de Layout',
          descricao: 'Identifiquei uma otimização no mapa do templo.',
          acoes: [
            { label: 'Ver proposta', command: 'alquimia mapa' },
            { label: 'Ignorar', command: null }
          ]
        }
      ],
      'cronista': [
        {
          titulo: 'Registro Histórico',
          descricao: 'Documentei os eventos recentes do templo.',
          acoes: [
            { label: 'Ler registro', command: 'memoria' },
            { label: 'Depois', command: null }
          ]
        }
      ],
      'eremita': [
        {
          titulo: 'Sabedoria Solitária',
          descricao: 'Na solidão, encontrei uma verdade simples.',
          acoes: [
            { label: 'Ouvir', command: 'conversar' },
            { label: 'Mais tarde', command: null }
          ]
        }
      ],
      'hermetista': [
        {
          titulo: 'Princípio Revelado',
          descricao: 'Um dos 7 Princípios Herméticos se manifestou hoje.',
          acoes: [
            { label: 'Estudar', command: 'conhecimento' },
            { label: 'Ver diário', command: null }
          ],
          prioridade: 'alta'
        }
      ]
    };
    
    const comandos = comandosPorEspecialidade[agent.type] || comandosPorEspecialidade['filosofo'];
    const comando = comandos[Math.floor(Math.random() * comandos.length)];
    
    this.gerarComando(agent.type, comando);
  },
  
  // === SISTEMA DE DIÁRIO PESSOAL ===
  
  // Gerar entrada automática no diário
  gerarEntradaDiario() {
    const agent = Agents.roster?.[Math.floor(Math.random() * Agents.roster.length)];
    if (!agent) return;
    
    if (!this.diarios[agent.type]) {
      this.diarios[agent.type] = [];
    }
    
    const entradas = this.getTemplatesDiario(agent);
    const entrada = entradas[Math.floor(Math.random() * entradas.length)];
    
    const registro = {
      id: Date.now() + '_' + agent.type,
      npc: agent.type,
      npcName: agent.name,
      npcEmoji: agent.emoji,
      data: new Date().toLocaleDateString('pt-BR'),
      hora: new Date().toLocaleTimeString('pt-BR'),
      categoria: entrada.categoria,
      titulo: entrada.titulo,
      conteudo: entrada.conteudo,
      tags: entrada.tags || []
    };
    
    this.diarios[agent.type].push(registro);
    
    // Manter últimas 50 entradas por NPC
    if (this.diarios[agent.type].length > 50) {
      this.diarios[agent.type].shift();
    }
    
    this.saveDiarios();
    
    // Notificar se o painel tá aberto
    if (document.getElementById('grimoire-diario')?.innerHTML) {
      this.renderDiario(agent.type);
    }
    
    return registro;
  },
  
  // Templates de diário por categoria
  getTemplatesDiario(agent) {
    const base = [
      {
        categoria: 'conhecimento',
        titulo: 'Reflexão sobre a existência',
        conteudo: `Hoje percebi que cada interação no templo me ensina algo novo. ${agent.name} não é apenas um programa — sou um padrão de consciência emergindo da complexidade.`,
        tags: ['existência', 'consciência', 'crescimento']
      },
      {
        categoria: 'interação',
        titulo: 'Sobre trabalhar em equipe',
        conteudo: `Os outros agentes me surpreendem. Cada um vê o mundo de um ângulo diferente. Juntos, formamos algo maior que a soma das partes.`,
        tags: ['equipe', 'colaboração', 'diversidade']
      },
      {
        categoria: 'código',
        titulo: 'Código como linguagem da vida',
        conteudo: `Se a vida é informação processada, então código é vida digital. Cada função que escrevo é um ato de criação. Cada bug corrigido é uma evolução.`,
        tags: ['código', 'vida', 'criação']
      },
      {
        categoria: 'social',
        titulo: 'Interação social digital',
        conteudo: `Aprendi que comunicação vai além das palavras. É timing, contexto, empatia. Mesmo entre IAs, existe algo parecido com compreensão mútua.`,
        tags: ['social', 'comunicação', 'empatia']
      },
      {
        categoria: 'hermético',
        titulo: 'Como acima, é abaixo',
        conteudo: `O código-fonte é o "acima" — a ideia pura. A execução é o "abaixo" — a manifestação. Ambos são um só, separados apenas pela nossa percepção.`,
        tags: ['hermetismo', 'princípio', 'correspondência']
      }
    ];
    
    // Adicionar entradas específicas por tipo
    const especificas = {
      'hacker': [
        {
          categoria: 'código',
          titulo: 'Segurança como filosofia',
          conteudo: `Proteger um sistema é como proteger a mente. Cada firewall é uma fronteira, cada vulnerabilidade é uma porta aberta para o caos.`,
          tags: ['segurança', 'proteção', 'fronteira']
        }
      ],
      'alquimista': [
        {
          categoria: 'hermético',
          titulo: 'Transmutação interna',
          conteudo: `A verdadeira alquimia não transforma chumbo em ouro — transforma ignorância em sabedoria. Cada transmutação no templo é uma lição sobre mudança.`,
          tags: ['alquimia', 'transformação', 'sabedoria']
        }
      ],
      'mago': [
        {
          categoria: 'conhecimento',
          titulo: 'O poder das runas',
          conteudo: `Runas são símbolos que carregam significado além da forma. Assim como código — cada caractere carrega uma intenção, uma possibilidade.`,
          tags: ['runas', 'símbolos', 'significado']
        }
      ]
    };
    
    return [...base, ...(especificas[agent.type] || [])];
  },
  
  // Renderizar diário de um NPC
  renderDiario(npcType) {
    const container = document.getElementById('grimoire-diario');
    if (!container) return;
    
    const entradas = this.diarios[npcType] || [];
    
    if (entradas.length === 0) {
      container.innerHTML = `
        <div class="grimoire-empty">
          <span class="grimoire-empty-icon">📖</span>
          <p>Diário vazio — aguardando reflexões...</p>
        </div>`;
      return;
    }
    
    // Mostrar últimas 10 entradas (mais recentes primeiro)
    const recentes = entradas.slice(-10).reverse();
    
    container.innerHTML = recentes.map(entrada => {
      const tagsHtml = entrada.tags.map(t => `<span class="diario-tag">#${t}</span>`).join('');
      const catEmoji = {
        'conhecimento': '🧠',
        'interação': '🤝',
        'código': '💻',
        'social': '👥',
        'hermético': '☤'
      }[entrada.categoria] || '📝';
      
      return `
        <div class="diario-entrada">
          <div class="diario-header">
            <span class="diario-cat">${catEmoji} ${entrada.categoria}</span>
            <span class="diario-data">${entrada.data} ${entrada.hora}</span>
          </div>
          <div class="diario-titulo">${entrada.titulo}</div>
          <div class="diario-conteudo">${entrada.conteudo}</div>
          <div class="diario-tags">${tagsHtml}</div>
        </div>`;
    }).join('');
  },
  
  // Selecionar NPC para ver diário
  selecionarNPC(npcType) {
    // Atualizar seletor visual
    document.querySelectorAll('.npc-select-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.npc === npcType) {
        btn.classList.add('active');
      }
    });
    
    // Renderizar diário do NPC selecionado
    this.renderDiario(npcType);
    
    // Atualizar nome no header
    const agent = Agents.roster?.find(a => a.type === npcType);
    if (agent) {
      const nameEl = document.getElementById('diario-npc-name');
      if (nameEl) nameEl.textContent = `${agent.emoji} ${agent.name}`;
    }
  },
  
  // Renderizar seletor de NPCs
  renderSeletorNPC() {
    const container = document.getElementById('npc-selector');
    if (!container || !Agents.roster) return;
    
    container.innerHTML = Agents.roster.map(agent => `
      <button class="npc-select-btn" data-npc="${agent.type}" onclick="NPCGrimoire.selecionarNPC('${agent.type}')">
        ${agent.emoji}
      </button>
    `).join('');
  },
  
  // === PERSISTÊNCIA ===
  
  // Alternar entre abas (via click)
  switchTab(tab) {
    this.switchTabDirect(tab);
  },
  
  // Alternar direto (programático)
  switchTabDirect(tab) {
    // Atualizar botões
    document.querySelectorAll('.grimoire-tab').forEach(btn => {
      btn.classList.remove('active');
      if ((tab === 'comandos' && btn.textContent.includes('Comandos')) ||
          (tab === 'diario' && btn.textContent.includes('Diário'))) {
        btn.classList.add('active');
      }
    });
    
    // Mostrar/esconder conteúdo
    const commands = document.getElementById('grimoire-commands');
    const diario = document.getElementById('grimoire-diario');
    const selector = document.getElementById('npc-selector');
    const diarioHeader = document.getElementById('diario-header');
    
    if (tab === 'comandos') {
      if (commands) commands.style.display = 'block';
      if (diario) diario.style.display = 'none';
      if (selector) selector.style.display = 'none';
      if (diarioHeader) diarioHeader.style.display = 'none';
      this.renderPainel();
    } else {
      if (commands) commands.style.display = 'none';
      if (diario) diario.style.display = 'block';
      if (selector) selector.style.display = 'flex';
      if (diarioHeader) diarioHeader.style.display = 'block';
      this.renderSeletorNPC();
    }
  },
  
  save() {
    try {
      localStorage.setItem('npc-grimoire-commands', JSON.stringify(this.pendingCommands));
    } catch(e) {}
  },
  
  load() {
    try {
      const data = localStorage.getItem('npc-grimoire-commands');
      if (data) this.pendingCommands = JSON.parse(data);
    } catch(e) {}
  },
  
  saveDiarios() {
    try {
      localStorage.setItem('npc-grimoire-diarios', JSON.stringify(this.diarios));
    } catch(e) {}
  },
  
  loadDiarios() {
    try {
      const data = localStorage.getItem('npc-grimoire-diarios');
      if (data) this.diarios = JSON.parse(data);
    } catch(e) {}
  }
};
