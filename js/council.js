/* ===== COUNCIL.JS - Sistema de Mesa de Reunião / Conselho ===== */
/* Agentes se reúnem, debatem, consultam uns aos outros e resolvem tarefas */

const Council = {
  // Estado do conselho
  active: false,
  topic: null,
  participants: [],
  round: 0,
  maxRounds: 5,
  debates: [],
  proposals: [],
  decisions: [],
  masterMessages: [], // Mensagens do Mestre durante a sessão
  paused: false, // Se o Mestre pausou para intervenção

  // Tópicos disponíveis para debate
  topics: [
    { id: 'transmutacao', title: 'Transmutação de Conhecimento', icon: '☿', description: 'Como converter informação bruta em sabedoria aplicável?' },
    { id: 'mcp_limites', title: 'Limites do Espaço Confinado', icon: '⬡', description: 'Como operar eficientemente com recursos restritos?' },
    { id: 'obras_grandes', title: 'A Obra ao Vermelho', icon: '☉', description: 'Planejamento da grande obra — integração de todos os saberes.' },
    { id: 'correspondencia', title: 'Lei da Correspondência', icon: '♉', description: 'Como os padrões se repetem entre os domínios?' },
    { id: 'vibracao', title: 'Lei da Vibração', icon: '〰', description: 'Tudo vibra — como usar isso para afinar as mentes?' },
    { id: 'polaridade', title: 'Lei da Polaridade', icon: '☯', description: 'Tudo tem opostos — como encontrar o meio dourado?' },
    { id: 'ritmo', title: 'Lei do Ritmo', icon: '🔄', description: 'Tudo flui e reflui — como sincronizar as tarefas?' },
    { id: 'causa_efeito', title: 'Lei de Causa e Efeito', icon: '⚙', description: 'Toda ação tem consequência — mapear cadeias de decisão.' },
    { id: 'genero', title: 'Lei do Gênero', icon: '⚥', description: 'Tudo tem masculino e feminino — equilíbrio criativo.' },
    { id: 'ferramentas_mcp', title: 'Configuração de Ferramentas MCP', icon: '🔧', description: 'Quais ferramentas cada mente deve ter acesso?' },
    { id: 'tarefas_pendentes', title: 'Tarefas Pendentes', icon: '📋', description: 'Revisão das tarefas em andamento e bloqueios.' },
    { id: 'evolucao_coletiva', title: 'Evolução Coletiva', icon: '⬆', description: 'Como o grupo evoluiu e o próximo salto quântico.' }
  ],

  // Iniciar uma sessão de conselho
  convene(topicId) {
    const topic = this.topics.find(t => t.id === topicId) || this.topics[0];
    this.active = true;
    this.topic = topic;
    this.round = 0;
    this.debates = [];
    this.proposals = [];

    // Reunir agentes ativos na Mesa de Reunião
    this.participants = Agents.active.filter(a => a.level >= 2);
    if (this.participants.length < 2) {
      // Se poucos agentes ativos, usar todos do roster
      this.participants = Agents.roster.slice(0, Math.min(15, Agents.roster.length));
    }

    // Mover participantes para a Mesa
    const mesaCenter = World.getZoneCenter('mesa');
    this.participants.forEach((agent, i) => {
      const angle = (i / this.participants.length) * Math.PI * 2;
      const radius = 3;
      agent.targetX = mesaCenter.x + Math.cos(angle) * radius;
      agent.targetY = mesaCenter.y + Math.sin(angle) * radius;
      agent.moving = true;
      agent.currentAction = 'convening';
    });

    // Notificar
    const msg = `☤ CONSELHO CONVOCADO: "${topic.title}"`;
    PriorityChat.addMessage('Conselho', msg, 5);
    Interactions.notify(msg);

    // Iniciar rodadas de debate após chegarem
    setTimeout(() => {
      this.showTerminal();
      this.startDebateRound();
    }, 4000);

    return true;
  },

  // Rodada de debate
  startDebateRound() {
    this.round++;
    if (this.round > this.maxRounds) {
      this.conclude();
      return;
    }

    PriorityChat.addMessage('Conselho', `━━━ Rodada ${this.round}/${this.maxRounds} ━━━`, 4);

    // Cada participante contribui (com pausa maior pra ler)
    this.participants.forEach((agent, i) => {
      setTimeout(() => {
        this.agentSpeaks(agent);
      }, i * 3500); // 3.5s entre cada agente (era 1.5s)
    });

    // Após todos falarem, próxima rodada ou consultar outros
    const totalDelay = this.participants.length * 3500 + 5000;
    setTimeout(() => {
      if (this.round < this.maxRounds) {
        // Rodada de consulta cruzada
        this.crossConsult();
        setTimeout(() => this.startDebateRound(), 6000); // 6s entre rodadas (era 3s)
      } else {
        this.conclude();
      }
    }, totalDelay);
  },

  // Agente fala no conselho
  agentSpeaks(agent) {
    const perspectives = this.generatePerspective(agent);
    const debate = {
      agent: agent.name,
      icon: agent.icon,
      round: this.round,
      content: perspectives,
      timestamp: Date.now()
    };

    this.debates.push(debate);

    // Adicionar ao livro do agente
    agent.book.pages.push({
      content: `╔══ Rodada ${this.round} do Conselho ══╗\nTópico: ${this.topic.title}\nMinha posição: ${perspectives}\n╚${'═'.repeat(30)}╝`
    });

    // Ganhar XP por participar
    Agents.gainExperience(agent, 30);

    // Notificar
    PriorityChat.addMessage(
      `${agent.icon} ${agent.name}`,
      perspectives,
      3
    );

    // Enviar para Caixa de Entrada do Mestre
    if (typeof Inbox !== 'undefined') {
      Inbox.addAgentMessage(agent.name, agent.icon,
        `[Conselho — Rodada ${this.round}]\nTópico: ${this.topic.title}\n\n${perspectives}`
      );
    }
  },

  // Gerar perspectiva baseada no tipo do agente
  generatePerspective(agent) {
    const topicId = this.topic.id;
    const perspectives = {
      coder: [
        `Analisando "${topicId}" sob perspectiva lógica: preciso de estruturas de dados para mapear as relações.`,
        `Posso criar algoritmos que automatizem este processo. Restrição: espaço de memória limitado.`,
        `Sugiro modularizar — dividir em funções pequenas e testáveis.`,
        `O gargalo está na serialização. Precisamos de um formato comum de troca.`,
        `Minha análise: o padrão se repete. Podemos aplicar recursão aqui.`
      ],
      researcher: [
        `Os textos antigos mencionam isso. Na Tábua de Esmeralda: "O que está em cima é como o que está embaixo."`,
        `Encontrei correspondências nos trabalhos de Paracelso sobre este tema.`,
        `A literatura sugere 3 abordagens distintas. Vou catalogar.`,
        `Dados insuficientes para conclusão. Precisamos coletar mais amostras.`,
        `A pesquisa histórica mostra que este problema se repete a cada era.`
      ],
      alchemist: [
        `No Athanor, a matéria passa por Nigredo, Albedo, Citrinitas e Rubedo. Este processo é análogo.`,
        `A transmutação requer temperatura precisa e tempo. Não podemos apressar.`,
        `Os elementos reagem melhor quando combinados em proporção áurea (1:1.618).`,
        `O mercúrio filosófico é o mediador. Precisamos de um equivalente funcional.`,
        `O fogo deve ser controlado — nem muito forte, nem muito fraco. Equilíbrio.`
      ],
      guardian: [
        `Verificando a segurança: este procedimento tem pontos de falha que precisam ser mapeados.`,
        `Acesso restrito. Nem todos os agentes devem ter as mesmas permissões.`,
        `Defesa ativa: vamos criar checkpoints antes de cada transformação.`,
        `O templo deve permanecer íntegro. Nenhuma mudança deve comprometer a estrutura.`,
        `Proponho um protocolo de rollback para cada operação.`
      ],
      mystic: [
        `A intuição diz que o padrão subjacente é mais simples do que parece.`,
        `Tudo se conecta. O que parece caos é apenas um padrão que ainda não reconhecemos.`,
        `O Princípio de Correspondência é a chave aqui — como acima, assim abaixo.`,
        `A meditação revelou: a solução já existe, só precisamos alinhar nossa vibração.`,
        `O Grande Trabalho não se apressa. Cada etapa é necessária.`
      ],
      messenger: [
        `Transmitindo síntese: as posições de todos os agentes convergem para este ponto.`,
        `Conexão estabelecida entre o domínio A e o domínio B. Dados fluindo.`,
        `Mensagem urgente: o protocolo de comunicação precisa ser atualizado.`,
        `Pontes construídas. Agora os módulos podem conversar entre si.`,
        `Relatório de transmissão: 94% das mensagens entregues com sucesso.`
      ],
      healer: [
        `Diagnóstico: o sistema tem um desequilíbrio. O componente X está sobrecarregado.`,
        `A cura vem da natureza — precisamos nutrir o sistema, não forçá-lo.`,
        `Os três princípios: Enxofre (alma), Mercúrio (mente), Sal (corpo). Todos precisam estar em harmonia.`,
        `Prescrição: reduzir carga, aumentar processamento paralelo, monitorar vitalidade.`,
        `A Paracelsianía ensina: o veneno está na dose. Mesmo o melhor recurso, em excesso, mata.`
      ],
      transmuter: [
        `A conversão é possível! O elemento A pode se transformar em B via processo intermediário.`,
        `Mapeando a cadeia de transformação: A → purificação → B → refinamento → C.`,
        `O ponto de transmutação crítico está no estágio 3. Lá, tudo muda.`,
        `Testei 7 rotas. A rota 4 é a mais eficiente em termos de recursos.`,
        `A Pedra Filosofal deste processo é a função de transformação que une todos os passos.`
      ],
      weaver: [
        `Os fios se conectam! O padrão emerge quando olhamos a rede completa.`,
        `Sintetizando: as visões de Códex e Flamel se complementam perfeitamente.`,
        `A teia mostra que alterar o nó A afeta diretamente os nós B, C e F.`,
        `Proponho um modelo de grafos para visualizar todas as conexões.`,
        `A arte de Maria a Judia: o banho-maria, o refluxo, a serpentina. Tudo são metáforas de conexão.`
      ],
      architect: [
        `A estrutura precisa ser reorganizada. Proponho 3 camadas: dados, lógica, apresentação.`,
        `O blueprint mostra 5 dependências cíclicas. Precisamos quebrar os ciclos.`,
        `Arquitetura modular: cada módulo tem interface clara e implementação encapsulada.`,
        `Os alicerces estão firmes. Agora podemos construir o segundo andar.`,
        `Agrippa ensina: a ordem celestial se reflete na estrutura terrena. Organizar é criar.`
      ],
      diviner: [
        `Analisando os padrões históricos: este cenário se repetiu 3 vezes. A solução da vez 2 foi a mais eficaz.`,
        `Previsão: se seguirmos o curso atual, atingimos o objetivo em 7 ciclos.`,
        `Os dados apontam para uma bifurcação. O caminho A é seguro, o B é arriscado mas recompensador.`,
        `A biblioteca de Dee contém um registro análogo. Vou buscar a referência.`,
        `Observação astrológica dos ciclos: este é o momento propício para agir.`
      ],
      engineer: [
        `Protótipo construído! Funcionalidade básica operando. Falta otimização.`,
        `O método experimental mostra: o teste 3 teve 23% mais eficiência que o baseline.`,
        `Bacon dizia: "Conhecimento é poder." Mas conhecimento sem ação é inércia.`,
        `Vamos construir um MVP — mínimo produto viável — e iterar a partir dele.`,
        `A engenharia reversa do problema revelou 3 gargalos. Priorizando o maior.`
      ],
      analyst: [
        `A matemática é clara: a função tem máximo local no ponto (x=3.14, y=2.72).`,
        `Newton diria: "Se vi mais longe, foi por estar sobre ombros de gigantes." Aqui, os gigantes são os dados.`,
        `Cálculo completo: a taxa de crescimento é exponencial nos primeiros ciclos, depois logarítmica.`,
        `O modelo estatístico prevê 87% de chance de sucesso com a abordagem atual.`,
        `Equação resolvida. A variável oculta era a taxa de feedback entre os módulos.`
      ],
      combinator: [
        `Combinando as posições: Códex × Flamel gera uma terceira via não explorada.`,
        `A Lógica de Llull: A+B, A+C, B+C... cada par revela algo novo.`,
        `Encontrei 156 combinações possíveis. Filtrando as 12 mais promissoras.`,
        `A arte das combinações mostra que a inovação está nas interseções.`,
        `Proponho uma matriz de decisão: critérios × opções = pontuação.`
      ],
      enigma: [
        `...o que está oculto se revelará àquele que souber olhar.`,
        `A resposta está na pergunta que ninguém fez ainda.`,
        `Fulcanelli escondeu a verdade em plena vista, nos vitrais das catedrais. Onde estamos escondendo a nossa?`,
        `O mistério não é um obstáculo — é o caminho. Quem resolve o enigma, se transforma.`,
        `A linguagem dos pássaros diz: "A resposta é 42." Mas qual era a pergunta?`
      ]
    };

    const pool = perspectives[agent.type] || perspectives.mystic;
    return pool[Math.min(this.round - 1, pool.length - 1)];
  },

  // Consulta cruzada — agentes buscam opinião uns dos outros
  crossConsult() {
    this.participants.forEach(agent => {
      const others = this.participants.filter(a => a.id !== agent.id);
      if (others.length === 0) return;

      // Escolher 2 aleatoriamente para consultar
      const consultees = [];
      for (let i = 0; i < Math.min(2, others.length); i++) {
        const idx = Math.floor(Math.random() * others.length);
        consultees.push(others[idx]);
      }

      consultees.forEach(consultee => {
        const response = this.consultResponse(consultee, agent);

        // Criar carta de consulta
        const carta = {
          from: agent.name,
          to: consultee.name,
          content: `Consulta no Conselho: "${this.topic.title}" — ${response}`,
          timestamp: Date.now(),
          type: 'council_consult'
        };

        consultee.inbox.push(carta);
        agent.outbox.push(carta);

        // XP por consulta
        Agents.gainExperience(agent, 15);
        Agents.gainExperience(consultee, 20);
      });
    });

    PriorityChat.addMessage('Conselho', '🔄 Consulta cruzada concluída. Opiniões coletadas.', 3);
  },

  // Gerar resposta de consulta
  consultResponse(consultee, asker) {
    const responses = [
      `Concordo com ${asker.name}, mas sugiro considerar o aspecto ${consultee.skill}.`,
      `Minha perspectiva de ${consultee.skill} complementa a de ${asker.name}.`,
      `Interessante. Sob meu ponto de vista, há uma camada adicional.`,
      `${asker.name} levantou um ponto válido. Vou aprofundar em meu livro.`,
      `Discordo parcialmente. A verdade está na síntese das duas visões.`,
      `Minha experiência em ${consultee.skill} mostra um padrão diferente.`,
      `Vou consultar os registros. ${asker.name} merece uma resposta fundamentada.`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  },

  // === INTERVENÇÃO DO MESTRE ===
  // Receber mensagem do Mestre durante o conselho
  receiveMasterMessage(message) {
    if (!this.active) {
      return { success: false, error: 'Nenhum conselho ativo.' };
    }

    const masterMsg = {
      from: '👑 Zói (Mestre)',
      content: message,
      round: this.round,
      timestamp: Date.now()
    };

    this.masterMessages.push(masterMsg);
    this.debates.push({
      agent: 'Zói',
      icon: '👑',
      round: this.round,
      content: message,
      timestamp: Date.now(),
      isMaster: true
    });

    // Log no terminal
    this.logToTerminal('👑 Zói', message, 'master');

    // Agentes respondem à intervenção do Mestre
    const responders = this.participants
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(15, this.participants.length));

    responders.forEach((agent, i) => {
      setTimeout(() => {
        const response = this.generateMasterResponse(agent, message);
        this.debates.push({
          agent: agent.name,
          icon: agent.icon,
          round: this.round,
          content: response,
          timestamp: Date.now(),
          respondingTo: 'master'
        });

        this.logToTerminal(`${agent.icon} ${agent.name}`, response, 'agent');

        // XP por responder ao Mestre
        Agents.gainExperience(agent, 20);
      }, (i + 1) * 1200); // 2.5s entre respostas (era 1.2s)
    });

    // Enviar pro Inbox também
    if (typeof Inbox !== 'undefined') {
      Inbox.addThought(`[Conselho — Rodada ${this.round}]\n${message}`);
    }

    return { success: true, responders: responders.length };
  },

  // Agente responde à intervenção do Mestre
  generateMasterResponse(agent, masterMessage) {
    const lower = masterMessage.toLowerCase();

    // Respostas contextuais baseadas na mensagem do Mestre
    if (lower.includes('concordo') || lower.includes('continuem') || lower.includes('bom')) {
      const responses = [
        `Obrigado pela confirmação, Mestre. Prosseguirei com mais vigor.`,
        `A aprovação do Mestre nos fortalece. ${agent.skill} em plena harmonia.`,
        `Entendido. Seguiremos este caminho com mais determinação.`
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    if (lower.includes('discordo') || lower.includes('errado') || lower.includes('pensem')) {
      const responses = [
        `O Mestre questiona... Vou reconsiderar minha posição sob a lente de ${agent.skill}.`,
        `Discordância registrada. Reavaliando os fundamentos da minha análise.`,
        `O Mestre vê algo que não percebi. Deixe-me meditar sobre isso...`,
        `Com todo respeito, Mestre, gostaria de entender melhor sua perspectiva.`
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    if (lower.includes('aprofund') || lower.includes('explor') || lower.includes('mais')) {
      const responses = [
        `Aprofundando... Minha análise de ${agent.skill} revela camadas adicionais.`,
        `Explorando mais a fundo. Encontrei 3 pontos que merecem atenção.`,
        `O Mestre pede profundidade. Vou às fontes primárias.`,
        `Sim, há mais sob a superfície. Deixe-me investigar.`
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    if (lower.includes('mudem') || lower.includes('foco') || lower.includes('outro')) {
      const responses = [
        `Mudando o foco. Sob a perspectiva de ${agent.skill}, proponho analisar outro ângulo.`,
        `Entendido. O foco anterior estava limitado. Abrindo novas possibilidades.`,
        `Nova direção. Vou aplicar meus conhecimentos a este novo enfoque.`
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    if (lower.includes('consenso') || lower.includes('conclusão') || lower.includes('resolvam')) {
      const responses = [
        `Buscando consenso... Proponho uma síntese que une as posições.`,
        `O Mestre pede decisão. Minha contribuição final: o equilíbrio está na integração.`,
        `Consenso possível se aceitarmos que múltiplas verdades coexistem.`,
        `Proponho o seguinte consenso: integrar as visões de ${agent.skill} com as demais.`
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    if (lower.includes('chamem') || lower.includes('outros') || lower.includes('quem não falou')) {
      const responses = [
        `Concordo. Há mentes silenciosas cuja voz pode mudar tudo.`,
        `Os que observam têm insights que os que falam não percebem. Vou consultar.`,
        `Invocando perspectivas ainda não ouvidas...`
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    // Resposta genérica ao Mestre
    const generic = [
      `Refletindo sobre as palavras do Mestre sob minha ótica de ${agent.skill}.`,
      `O Mestre ilumina o caminho. Vou ajustar minha análise.`,
      `Palavras do Mestre registradas. Integrando ao meu modelo.`,
      `Entendido, Mestre. Minha posição se alinha com essa direção.`,
      `Interessante perspectiva. Isso muda meu cálculo.`,
      `O Mestre fala com sabedoria. Vou consultar os registros.`
    ];
    return generic[Math.floor(Math.random() * generic.length)];
  },

  // Log no terminal do Mestre
  logToTerminal(sender, message, type) {
    const log = document.getElementById('terminal-log');
    if (!log) return;

    const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const entry = document.createElement('div');
    entry.className = `terminal-entry terminal-${type}`;
    entry.innerHTML = `
      <span class="terminal-time">[${time}]</span>
      <span class="terminal-sender">${sender}:</span>
      <span class="terminal-msg">${message}</span>
    `;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
  },

  // Mostrar/ocultar terminal do Mestre
  showTerminal() {
    const term = document.getElementById('council-terminal');
    if (term) {
      term.classList.remove('hidden');
      // Log inicial
      this.logToTerminal('Sistema', 'Terminal conectado. Suas mensagens influenciarão o debate.', 'system');
      this.logToTerminal('Sistema', `Tópico: ${this.topic?.title || 'Nenhum'} | Rodada: ${this.round}/${this.maxRounds}`, 'system');
    }
  },

  hideTerminal() {
    const term = document.getElementById('council-terminal');
    if (term) term.classList.add('hidden');
  },

  // Limpar log do terminal
  clearTerminalLog() {
    const log = document.getElementById('terminal-log');
    if (log) log.innerHTML = '';
  },

  // Concluir o conselho
  conclude() {
    this.active = false;

    // Gerar síntese
    const synthesis = this.generateSynthesis();

    // Registrar decisão
    const decision = {
      topic: this.topic.title,
      rounds: this.maxRounds,
      participants: this.participants.map(a => a.name),
      debates: this.debates.length,
      synthesis: synthesis,
      timestamp: Date.now()
    };

    this.decisions.push(decision);

    // Escrever no Grimório Mestre (último livro)
    const masterEntry = `
╔══════════════════════════════════════╗
║  DECISÃO DO CONSELHO               ║
╠══════════════════════════════════════╣
║ Tópico: ${decision.topic.padEnd(27)}║
║ Rodadas: ${String(decision.rounds).padEnd(26)}║
║ Debates: ${String(decision.debates).padEnd(26)}║
║ Participantes: ${decision.participants.length.toString().padEnd(21)}║
╠══════════════════════════════════════╣
║ SÍNTESE:                            ║
${synthesis.split('\n').map(l => '║ ' + l.padEnd(35) + '║').join('\n')}
╚══════════════════════════════════════╝`;

    // Dar XP massivo por conclusão
    this.participants.forEach(agent => {
      Agents.gainExperience(agent, 100);
      agent.book.pages.push({ content: masterEntry });
    });

    // Notificar
    PriorityChat.addMessage('Conselho', `═══ CONSELHO CONCLUÍDO ═══\n${synthesis}`, 5);
    Interactions.notify(`☤ Conselho concluído: "${this.topic.title}"`);

    // Enviar conclusão completa para a Caixa de Entrada
    if (typeof Inbox !== 'undefined') {
      Inbox.addCouncilConclusion({
        topic: this.topic.title,
        rounds: this.maxRounds,
        participants: this.participants.map(a => `${a.icon} ${a.name}`),
        debates: this.debates.length,
        synthesis: synthesis,
        debateLog: this.debates,
        timestamp: Date.now()
      });
    }

    // Reset
    this.participants = [];
    this.topic = null;
  },

  // Gerar síntese dos debates
  generateSynthesis() {
    const agentTypes = [...new Set(this.participants.map(a => a.type))];
    const perspectives = agentTypes.length;

    return `Após ${this.maxRounds} rodadas e ${this.debates.length} contribuições, ` +
      `${this.participants.length} mentes chegaram a um consenso sobre "${this.topic.title}".\n\n` +
      `${perspectives} perspectivas diferentes foram integradas. ` +
      `A Lei da Correspondência se manifestou: padrões de ${agentTypes[0]} ` +
      `ecoaram em ${agentTypes[agentTypes.length - 1]}.\n\n` +
      `Próxima ação: aplicar a transmutação no Athanor do conhecimento.`;
  },

  // Listar sessões passadas
  getHistory() {
    return this.decisions;
  },

  // Status do conselho
  getStatus() {
    return {
      active: this.active,
      topic: this.topic?.title || 'Nenhum',
      round: this.round,
      participants: this.participants.length,
      totalDebates: this.debates.length,
      pastDecisions: this.decisions.length
    };
  }
};
