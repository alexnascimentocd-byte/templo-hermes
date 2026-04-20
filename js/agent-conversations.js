/* ===== AGENT CONVERSATIONS.JS =====
   Sistema de Conversação e Síntese entre Agentes
   - Pares de agentes conversam sobre temas
   - Geram sínteses após cada conversa
   - Registram resultados para evolução contínua
   - Começa com Criatividade, evolui para mais temas
*/

const AgentConversations = {
  // Estado
  active: false,
  currentPair: null,
  currentRound: 0,
  maxRoundsPerPair: 3,
  conversationLog: [],
  syntheses: [],
  evolutionTracker: {},
  currentTheme: 'criatividade',

  // Temas de conversação (começando com criatividade)
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
      nextTheme: 'criatividade' // Ciclo volta ao início
    }
  },

  // Pares já conversaram neste ciclo
  usedPairs: new Set(),
  
  // Histórico completo por par
  pairHistory: {},

  // Inicializar
  init() {
    this.loadState();
    console.log('[AgentConversations] Sistema inicializado. Tema atual:', this.currentTheme);
    return this;
  },

  // Carregar estado do localStorage
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

  // Salvar estado no localStorage
  saveState() {
    try {
      const state = {
        log: this.conversationLog.slice(-200), // Manter últimas 200 conversas
        syntheses: this.syntheses.slice(-50),   // Manter últimas 50 sínteses
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

  // Selecionar par de agentes para conversar
  selectPair() {
    const active = Agents.active.filter(a => a.level >= 1);
    if (active.length < 2) {
      // Se poucos ativos, usar roster
      const roster = Agents.roster.filter(a => a.level >= 1);
      if (roster.length < 2) return null;
      
      // Tentar encontrar par não usado
      for (let i = 0; i < roster.length; i++) {
        for (let j = i + 1; j < roster.length; j++) {
          const key = `${roster[i].type}-${roster[j].type}`;
          if (!this.usedPairs.has(key)) {
            this.usedPairs.add(key);
            return [roster[i], roster[j]];
          }
        }
      }
      // Se todos usados, resetar e usar qualquer par
      this.usedPairs.clear();
      return [roster[0], roster[1]];
    }

    // Selecionar par não usado dos ativos
    for (let i = 0; i < active.length; i++) {
      for (let j = i + 1; j < active.length; j++) {
        const key = `${active[i].type}-${active[j].type}`;
        if (!this.usedPairs.has(key)) {
          this.usedPairs.add(key);
          return [active[i], active[j]];
        }
      }
    }

    // Reset e usar primeiro par disponível
    this.usedPairs.clear();
    const key = `${active[0].type}-${active[1].type}`;
    this.usedPairs.add(key);
    return [active[0], active[1]];
  },

  // Gerar resposta de um agente sobre um tema
  generateResponse(agent, theme, prompt, isSecondSpeaker = false) {
    const profiles = (typeof ParallelEngine !== 'undefined' && ParallelEngine.profiles) ? ParallelEngine.profiles : {};
    const profile = profiles[agent.type] || {};
    const themeData = this.themes[theme];
    
    // Base de respostas por personalidade
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
    
    // Selecionar resposta baseada no contexto
    let idx = 0;
    if (isSecondSpeaker) {
      idx = 1;
    } else {
      idx = Math.floor(Math.random() * responses.length);
    }
    
    let response = responses[idx % responses.length];
    
    // Adicionar variação contextual
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

  // Executar uma conversa entre dois agentes
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

    // Agente 1 fala primeiro
    const response1 = this.generateResponse(agent1, this.currentTheme, prompt, false);
    conversation.messages.push({
      speaker: agent1.type,
      name: agent1.name,
      text: response1,
      order: 1
    });

    // Agente 2 responde
    const response2 = this.generateResponse(agent2, this.currentTheme, prompt, true);
    conversation.messages.push({
      speaker: agent2.type,
      name: agent2.name,
      text: response2,
      order: 2
    });

    // Agente 1 complementa (se houver rodadas extras)
    if (this.currentRound < this.maxRoundsPerPair) {
      const complement = this.generateResponse(agent1, this.currentTheme, response2, false);
      conversation.messages.push({
        speaker: agent1.type,
        name: agent1.name,
        text: complement,
        order: 3
      });
    }

    // Gerar síntese
    conversation.synthesis = this.generateSynthesis(conversation);

    // Registrar ganhos de evolução
    conversation.evolutionGains = this.recordEvolution(agent1, agent2, conversation);

    // Salvar no log
    this.conversationLog.push(conversation);

    // Atualizar histórico do par
    const pairKey = `${agent1.type}-${agent2.type}`;
    if (!this.pairHistory[pairKey]) this.pairHistory[pairKey] = [];
    this.pairHistory[pairKey].push({
      timestamp: conversation.timestamp,
      theme: this.currentTheme,
      synthesis: conversation.synthesis.summary
    });

    // Salvar estado
    this.saveState();

    // Notificar
    this.notifyConversation(conversation);

    return conversation;
  },

  // Gerar síntese da conversa
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

  // Extrair aprendizado da conversa
  extractLearning(conversation) {
    const learnings = [];
    const { messages, theme } = conversation;

    messages.forEach(msg => {
      const text = msg.text.toLowerCase();
      
      // Detectar insights
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

  // Avaliar qualidade da conversa
  assessQuality(conversation) {
    let score = 50; // Base

    const { messages } = conversation;
    
    // Diversidade de perspectivas
    const uniqueTypes = new Set(messages.map(m => m.speaker));
    score += uniqueTypes.size * 10;

    // Comprimento das respostas (mais elaborado = melhor)
    const avgLength = messages.reduce((sum, m) => sum + m.text.length, 0) / messages.length;
    if (avgLength > 100) score += 15;
    if (avgLength > 150) score += 10;

    // Uso de vocabulário específico do tema
    const themeWords = this.themes[conversation.theme].prompts.join(' ').toLowerCase();
    messages.forEach(m => {
      const words = m.text.toLowerCase().split(' ');
      words.forEach(w => {
        if (themeWords.includes(w) && w.length > 4) score += 1;
      });
    });

    return Math.min(100, Math.max(0, score));
  },

  // Registrar evolução dos agentes
  recordEvolution(agent1, agent2, conversation) {
    const gains = {};
    
    // XP base por conversa
    const baseXP = 15;
    
    // Bônus por qualidade
    const qualityBonus = Math.floor(conversation.synthesis.quality / 25);
    
    // Bônus por tema novo (exploração)
    const themeBonus = !this.pairHistory[`${agent1.type}-${agent2.type}`]?.some(
      h => h.theme === this.currentTheme
    ) ? 10 : 0;

    const totalXP = baseXP + qualityBonus + themeBonus;

    // Aplicar XP
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

      // Dar XP ao agente real se existir
      if (typeof agent.gainXP === 'function') {
        agent.gainXP(totalXP);
      } else if (agent.xp !== undefined) {
        agent.xp = (agent.xp || 0) + totalXP;
      }
    });

    return gains;
  },

  // Notificar sobre conversa
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

    // Log no console se disponível
    if (typeof Console !== 'undefined' && Console.log) {
      Console.log(`${theme.icon} [Conversa] ${names} debateram: "${conversation.prompt.substring(0, 40)}..."`, 'info');
      Console.log(`  📝 Síntese: ${conversation.synthesis.summary.substring(0, 100)}...`, 'dim');
      conversation.synthesis.learning.forEach(l => {
        Console.log(`  • ${l}`, 'dim');
      });
    }
  },

  // Executar sequência completa de conversas (todos os pares sobre o tema atual)
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
      // Verificar rate limit (pausa entre conversas)
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

      // Delay entre conversas para leitura
      await this.delay(1500);
    }

    // Gerar síntese final do tema
    const finalSynthesis = this.generateThemeSynthesis(results);
    
    if (typeof Console !== 'undefined' && Console.log) {
      Console.log(`\n${this.themes[this.currentTheme].icon} ═══ SÍNTESE FINAL: ${this.themes[this.currentTheme].name} ═══`, 'sucesso');
      Console.log(finalSynthesis.summary, 'info');
      Console.log(`Conversas realizadas: ${results.length}`, 'dim');
      Console.log(`Próximo tema: ${this.themes[this.currentTheme].nextTheme}`, 'dim');
    }

    // Avançar para próximo tema
    this.currentTheme = this.themes[this.currentTheme].nextTheme;
    this.currentRound = 0;
    this.usedPairs.clear();
    this.active = false;
    this.saveState();

    return { conversations: results, finalSynthesis };
  },

  // Gerar síntese de todo um tema
  generateThemeSynthesis(conversations) {
    if (conversations.length === 0) return { summary: 'Nenhuma conversa realizada.' };

    const theme = this.themes[conversations[0].theme];
    const allLearnings = conversations.flatMap(c => c.synthesis.learning);
    const uniqueLearnings = [...new Set(allLearnings)];
    const avgQuality = conversations.reduce((sum, c) => sum + c.synthesis.quality, 0) / conversations.length;

    // Contar participações
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

    // Salvar síntese do tema
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

    // Adicionar ao Inbox se disponível
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

  // Obter estatísticas
  getStats() {
    const themesExplored = new Set(this.conversationLog.map(c => c.theme));
    const totalConversations = this.conversationLog.length;
    const totalSyntheses = this.syntheses.length;
    
    // Agentes mais ativos
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

  // Listar últimas conversas
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

  // Listar sínteses
  getSyntheses() {
    return this.syntheses.map(s => ({
      theme: s.themeName,
      summary: s.summary.substring(0, 120) + '...',
      conversations: s.conversations,
      quality: s.avgQuality,
      timestamp: s.timestamp
    }));
  },

  // Utilitário: delay
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  // Resetar (para testes)
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
    console.log('[AgentConversations] Estado resetado');
  }
};

// Auto-inicializar quando o DOM estiver pronto
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      AgentConversations.init();
    }, 2000);
  });
}
