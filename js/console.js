/* ===== CONSOLE.JS - Terminal do Grimório Mestre ===== */
/* Todos os comandos em português nativo brasileiro */

const Console = {
  history: [],
  historyIndex: -1,

  // Executar comando
  execute(cmd) {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    this.history.unshift(trimmed);
    if (this.history.length > 50) this.history.pop();
    this.historyIndex = -1;

    this.log(`Zói@templo:~$ ${trimmed}`, 'entrada');

    const partes = trimmed.split(/\\s+/);
    const comando = partes[0].toLowerCase();
    const args = partes.slice(1);

    // Verificar se é um modo de chat (comando iniciado com @ ou chat)
    if (comando.startsWith('@') || comando === 'chat') {
      const mensagem = comando.startsWith('@') ? trimmed.substring(1) : args.join(' ');
      if (mensagem.trim()) {
        this.chatWithHermes(mensagem);
      } else {
        this.log('💬 Digite sua mensagem após @ ou use "chat [mensagem]"', 'info');
      }
      return;
    }

    switch (comando) {
      case 'status': this.cmdStatus(); break;
      case 'agentes': case 'mentes': this.cmdAgentes(args); break;
      case 'invocar': case 'chamar': this.cmdInvocar(args); break;
      case 'dispensar': case 'retirar': this.cmdDispensar(args); break;
      case 'reunir': case 'todos': this.cmdReunirTodos(); break;
      case 'conselho': case 'reuniao': case 'reunião': this.cmdConselho(args); break;
      case 'ferramentas': case 'utensilios': case 'utensílios': this.cmdFerramentas(); break;
      case 'mensagens': case 'recados': case 'caixa': this.cmdMensagens(); break;
      case 'evoluir': case 'nivel': case 'nível': this.cmdEvoluir(args); break;
      case 'energia': this.cmdEnergia(args); break;
      case 'falar': case 'recado': case 'dizer': this.cmdFalar(args); break;
      case 'ler': this.cmdLer(args); break;
      case 'escrever': case 'anotar': this.cmdEscrever(args); break;
      case 'runas': case 'simbolos': case 'símbolos': this.cmdRunas(); break;
      case 'zonas': case 'salas': this.cmdZonas(); break;
      case 'arquivos': case 'arqs': this.cmdArquivos(args); break;
      case 'limpar': case 'limpeza': this.limparTerminal(); break;
      case 'ajuda': case 'comandos': case 'help': this.cmdAjuda(); break;
      case 'info': case 'sobre': this.cmdSobre(); break;
      case 'concluir': case 'encerrar': this.cmdConcluirConselho(); break;
      case 'pensamento': case 'pensar': this.cmdPensamento(args); break;
      case 'memória': case 'memory': case 'mem': this.cmdMemoria(args); break;
      case 'síntese': case 'synthesis': case 'sintese': this.cmdSintese(args); break;
      case 'github': case 'git': this.cmdGithub(args); break;
      case 'deploy': this.cmdDeploy(args); break;
      case 'agente': case 'agent': case 'hermes': this.cmdAgente(args); break;
      case 'sys': case 'sysadmin': case 'sistema': this.cmdSysAdmin(args); break;
      case 'remote': case 'remoto': this.cmdRemote(args); break;
      case 'treinar': case 'train': this.cmdTreinar(args); break;
      case 'crystal': case 'bola': case 'esfera': this.cmdCrystal(args); break;
      case 'alquimia': case 'alchemy': case 'item': case 'inventario': case 'inventário': this.cmdAlchemy(args); break;
      case 'transmutar': case 'transmute': this.cmdTransmutar(args); break;
      case 'cortex': case 'cérebro': case 'cerebro': this.cmdCortex(args); break;
      case 'neural': case 'neuronio': case 'neurônio': case 'snippets': this.cmdNeural(args); break;
      case 'conversar': case 'conversation': case 'conversa': this.cmdConversar(args); break;
      case '3d': case 'modo3d': case 'minecraft': this.cmd3D(); break;
      case 'rede': case 'network': case 'gateway': this.cmdRede(args); break;
      case 'vendas': case 'sales': case 'escritorio': case 'escritório': this.cmdVendas(args); break;
      case 'ver': case 'olhar': case 'enxergar': this.cmdVer(args); break;
      case 'escrever': case 'write': this.cmdEscrever(args); break;
      case 'ler': case 'read': this.cmdLer(args); break;
      case 'ideia': case 'idea': this.cmdIdeia(args); break;
      case 'powershell': case 'ps': this.cmdShell('powershell', args); break;
      case 'cmd': this.cmdShell('cmd', args); break;
      case 'bash': case 'sh': this.cmdShell('bash', args); break;
      case 'root': this.cmdRoot(args); break;
      case 'user': this.cmdUser(args); break;
      default:
        this.log(`❌ Comando desconhecido: \"${comando}\". Digite \"ajuda\" para ver os comandos.`, 'erro');
    }
  },

  // === COMANDOS ===

  cmdStatus() {
    const ativos = Agents.active.length;
    const total = Agents.roster.length;
    const conselho = Council.getStatus();
    const mcp = MCPTools.getStatus();
    const zona = World.getZoneAt(Math.floor(Player.x), Math.floor(Player.y));

    this.log(`
╔═══════════════════════════════════════╗
║  🏛️ ESTADO DO TEMPLO                 ║
╠═══════════════════════════════════════╣
║  Mentes Ativas: ${String(ativos).padStart(2)}/15               ║
║  Total no Registro: ${String(total).padStart(2)}             ║
║  Sua Zona: ${(zona?.name || 'Desconhecida').substring(0, 22).padEnd(22)}║
║  Conselho: ${conselho.ativo ? '🔴 EM REUNIÃO' : '🟢 Livre'}           ║
║  Reuniões feitas: ${String(conselho.reunioesPassadas).padStart(3)}               ║
║  Energia MCP: ${mcp.energia.atual}/${mcp.energia.maxima}           ║
║  Utensílios: ${String(mcp.totalFerramentas).padStart(2)}                    ║
║  Recados na Caixa: ${typeof Inbox !== 'undefined' ? Inbox.messages.length : 0}              ║
╚═══════════════════════════════════════╝`, 'info');
  },

  cmdAgentes(args) {
    if (args[0] === 'reserva' || args[0] === 'dormindo') {
      const inativas = Agents.roster.filter(a => !Agents.active.find(ac => ac.id === a.id));
      this.log(`💤 Mentes em Reserva (${inativas.length}):`, 'info');
      inativas.forEach(a => {
        this.log(`  ${a.icon} ${a.nome} (${a.habilidade}) — Nível ${a.nivel} — ${a.descricao.substring(0, 40)}...`, 'mente');
      });
      return;
    }

    this.log(`👥 Mentes Ativas (${Agents.active.length}/15):`, 'info');
    Agents.active.forEach(a => {
      const zona = World.getZoneAt(Math.floor(a.x), Math.floor(a.y));
      this.log(`  ${a.icon} ${a.nome} | ${a.habilidade} | Nv.${a.nivel} | ${a.acaoAtual} | ${zona?.name || '?'}`, 'mente');
    });
    this.log(`\n  💤 Reserva: ${Agents.roster.length - Agents.active.length} (use "agentes reserva" para ver)`, 'cinza');
  },

  cmdInvocar(args) {
    if (!args[0]) {
      this.log('❌ Uso: invocar [tipo] ou invocar todos', 'erro');
      this.log('Tipos: codigo, pesquisador, alquimista, guardiao, mistico, mensageiro, curandeiro, transmutador, tecelao, arquiteto, vidente, engenheiro, analista, combinador, enigma', 'cinza');
      return;
    }

    if (args[0] === 'todos' || args[0] === 'all') {
      this.cmdReunirTodos();
      return;
    }

    const agente = Agents.roster.find(a =>
      a.type === args[0] || a.name.toLowerCase() === args[0].toLowerCase()
    );
    if (!agente) {
      this.log(`❌ Mente "${args[0]}" não encontrada no registro.`, 'erro');
      return;
    }

    if (Agents.active.find(a => a.id === agente.id)) {
      this.log(`⚠️ ${agente.name} já está ativa no templo.`, 'aviso');
      return;
    }

    Agents.spawn(agente.id);
    this.log(`✅ ${agente.icon} ${agente.name} invocada ao templo!`, 'sucesso');
  },

  cmdDispensar(args) {
    if (!args[0]) {
      this.log('❌ Uso: dispensar [nome ou parte do nome]', 'erro');
      return;
    }

    const agente = Agents.active.find(a =>
      a.id.includes(args[0]) || a.name.toLowerCase().includes(args[0].toLowerCase())
    );
    if (!agente) {
      this.log(`❌ Mente "${args[0]}" não está ativa.`, 'erro');
      return;
    }

    Agents.despawn(agente.id);
    this.log(`🚪 ${agente.icon} ${agente.name} dispensada do templo.`, 'info');
  },

  cmdReunirTodos() {
    let count = 0;
    Agents.roster.forEach(a => {
      if (!Agents.active.find(ac => ac.id === a.id)) {
        Agents.spawn(a.id);
        count++;
      }
    });
    this.log(`👥 ${count} mente(s) adicionada(s)! Total: ${Agents.active.length}/15`, 'sucesso');
  },

  cmdConselho(args) {
    if (!args[0]) {
      const estado = Council.getStatus();
      this.log(`☤ Estado do Conselho:`, 'info');
      this.log(`  Ativo: ${estado.ativo ? 'Sim — EM REUNIÃO' : 'Não — Livre'}`, 'info');
      this.log(`  Tópico: ${estado.topico}`, 'info');
      this.log(`  Rodada: ${estado.rodada}/5`, 'info');
      this.log(`  Participantes: ${estado.participantes}`, 'info');
      this.log(`  Reuniões passadas: ${estado.reunioesPassadas}`, 'info');
      this.log(`\n  Use "conselho [tópico]" para convocar`, 'cinza');
      this.log(`  Tópicos: transmutacao, limites, correspondencia, vibracao, polaridade, ritmo, causa, ferramentas, tarefas, evolucao`, 'cinza');
      return;
    }

    const topicoId = args[0];
    Council.convene(topicoId);
    this.log(`☤ Conselho convocado: "${topicoId}"`, 'sucesso');
  },

  cmdConcluirConselho() {
    if (!Council.active) {
      this.log('⚠️ Nenhum conselho ativo para concluir.', 'aviso');
      return;
    }
    Council.conclude();
    this.log('☤ Conselho concluído pelo Mestre.', 'sucesso');
  },

  cmdFerramentas() {
    const estado = MCPTools.getStatus();
    this.log(`🔧 Utensílios Disponíveis (${estado.totalFerramentas}):`, 'info');
    this.log(`  Energia: ${estado.energia.atual}/${estado.energia.maxima} (${estado.energia.porcentagem})`, 'info');
    this.log(`  Categorias: ${estado.categorias.join(', ')}`, 'info');
    this.log('', 'cinza');

    Object.entries(MCPTools.registry).forEach(([id, ferramenta]) => {
      this.log(`  ${ferramenta.icon} ${ferramenta.nome} [${ferramenta.categoria}] — Custo: ${ferramenta.custo}`, 'cinza');
    });
  },

  cmdMensagens() {
    if (typeof Inbox === 'undefined') {
      this.log('❌ Caixa de mensagens não disponível.', 'erro');
      return;
    }
    const naoLidas = Inbox.messages.filter(m => !m.read).length;
    this.log(`📬 Caixa de Entrada: ${Inbox.messages.length} recados (${naoLidas} não lidos)`, 'info');
    Inbox.messages.slice(0, 5).forEach(msg => {
      const tipo = Inbox.types[msg.type] || Inbox.types.system;
      const status = msg.read ? '' : ' (não lido)';
      this.log(`  ${tipo.icon} ${msg.title}${status}`, msg.read ? 'cinza' : 'mente');
    });
    if (Inbox.messages.length > 5) {
      this.log(`  ... e mais ${Inbox.messages.length - 5} recados`, 'cinza');
    }
  },

  cmdEvoluir(args) {
    if (!args[0]) {
      this.log('❌ Uso: evoluir [nome ou parte do nome]', 'erro');
      return;
    }
    const agente = Agents.active.find(a =>
      a.id.includes(args[0]) || a.name.toLowerCase().includes(args[0].toLowerCase())
    );
    if (!agente) {
      this.log(`❌ Mente "${args[0]}" não encontrada.`, 'erro');
      return;
    }
    Agents.gainExperience(agente, agente.expToNext);
    this.log(`⬆️ ${agente.icon} ${agente.name} evoluiu para Nível ${agente.nivel}!`, 'sucesso');
  },

  cmdEnergia(args) {
    if (args[0] === 'encher' || args[0] === 'max' || args[0] === 'cheia') {
      MCPTools.energy.current = MCPTools.energy.max;
      this.log(`⚡ Energia restaurada ao máximo: ${MCPTools.energy.current}`, 'sucesso');
      return;
    }
    if (args[0] === 'definir' && args[1]) {
      MCPTools.energy.current = parseInt(args[1]) || MCPTools.energy.current;
      this.log(`⚡ Energia definida para ${MCPTools.energy.current}`, 'sucesso');
      return;
    }
    const pct = (MCPTools.energy.current / MCPTools.energy.max * 100).toFixed(0);
    this.log(`⚡ Energia MCP: ${MCPTools.energy.current}/${MCPTools.energy.max} (${pct}%)`, 'info');
    this.log(`  Use "energia encher" para restaurar`, 'cinza');
  },

  cmdFalar(args) {
    const msg = args.join(' ');
    if (!msg) {
      this.log('❌ Uso: falar [sua mensagem] — envia para o chat do templo', 'erro');
      return;
    }
    PriorityChat.addMessage('👑 Zói', msg, 4);
    this.log(`💬 Mensagem enviada: "${msg}"`, 'sucesso');
  },

  cmdPensamento(args) {
    const msg = args.join(' ');
    if (!msg) {
      this.log('❌ Uso: pensamento [seu pensamento] — registra na caixa de entrada', 'erro');
      return;
    }
    if (typeof Inbox !== 'undefined') {
      Inbox.addThought(msg);
      this.log(`💭 Pensamento registrado: \"${msg}\"`, 'sucesso');
    }
  },

  // === NOVOS COMANDOS DO TERMINAL DO MESTRE ===

  cmdMemoria(args) {
    const action = args[0] || 'list';
    
    switch (action) {
      case 'list':
      case 'lista':
        this.listMemories();
        break;
      case 'add':
      case 'adicionar':
        this.addMemory(args.slice(1));
        break;
      case 'view':
      case 'ver':
        this.viewMemory(args[1]);
        break;
      case 'delete':
      case 'deletar':
        this.deleteMemory(args[1]);
        break;
      case 'copiar':
      case 'copy':
        this.copyMemories();
        break;
      default:
        this.log(`📖 Comandos de memória:`, 'info');
        this.log(`  memória list     - Lista todas as memórias`, 'cinza');
        this.log(`  memória add      - Adiciona nova memória`, 'cinza');
        this.log(`  memória view <id> - Visualiza uma memória`, 'cinza');
        this.log(`  memória delete <id> - Remove uma memória`, 'cinza');
        this.log(`  memória copiar   - Copia todas as memórias`, 'cinza');
    }
  },

  listMemories() {
    const memories = this.getMemories();
    if (memories.length === 0) {
      this.log(`📖 Nenhuma memória registrada ainda.`, 'cinza');
      return;
    }
    
    this.log(`📖 Livro de Memórias Coletivas:`, 'info');
    memories.forEach((memory, index) => {
      this.log(`  ${index + 1}. ${memory.title} (${memory.date})`, 'mente');
    });
  },

  copyMemories() {
    const memories = this.getMemories();
    if (memories.length === 0) {
      this.log(`📖 Nenhuma memória para copiar.`, 'cinza');
      return;
    }
    
    let text = '═══ LIVRO DE MEMÓRIAS COLETIVAS ═══\n\n';
    memories.forEach((memory, index) => {
      text += `━━━ ${index + 1}. ${memory.title} ━━━\n`;
      text += `📅 ${memory.date} | 👤 ${memory.author}\n`;
      if (memory.tags && memory.tags.length) text += `🏷️ ${memory.tags.join(', ')}\n`;
      text += `\n${memory.content}\n\n`;
    });
    
    navigator.clipboard.writeText(text).then(() => {
      this.log(`📋 ${memories.length} memórias copiadas para a área de transferência!`, 'sucesso');
    }).catch(() => {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      this.log(`📋 ${memories.length} memórias copiadas!`, 'sucesso');
    });
  },

  addMemory(args) {
    if (args.length < 2) {
      this.log('❌ Uso: memória add "título" "descrição"', 'erro');
      return;
    }
    
    const title = args[0];
    const description = args.slice(1).join(' ');
    
    const memory = {
      id: Date.now(),
      title,
      description,
      date: new Date().toLocaleDateString('pt-BR'),
      tags: ['síntese', 'experiência'],
      content: description,
      author: 'Zói'
    };
    
    const memories = this.getMemories();
    memories.push(memory);
    this.saveMemories(memories);
    
    // Atualizar o livro de memória no jogo
    this.updateMemoryBook(memory);
    
    this.log(`✅ Memória adicionada: ${title}`, 'sucesso');
  },

  viewMemory(id) {
    const memories = this.getMemories();
    const memory = memories.find(m => m.id == id);
    if (!memory) {
      this.log(`❌ Memória não encontrada.`, 'erro');
      return;
    }
    
    this.log(`📖 ${memory.title}`, 'info');
    this.log(`  Data: ${memory.date}`, 'cinza');
    this.log(`  Autor: ${memory.author}`, 'cinza');
    this.log(`  Tags: ${memory.tags.join(', ')}`, 'cinza');
    this.log(``, 'normal');
    this.log(memory.content, 'normal');
  },

  deleteMemory(id) {
    const memories = this.getMemories();
    const index = memories.findIndex(m => m.id == id);
    if (index === -1) {
      this.log(`❌ Memória não encontrada.`, 'erro');
      return;
    }
    
    memories.splice(index, 1);
    this.saveMemories(memories);
    this.log(`✅ Memória removida.`, 'sucesso');
  },

  getMemories() {
    const saved = localStorage.getItem('templo_memorias');
    return saved ? JSON.parse(saved) : this.getDefaultMemories();
  },

  saveMemories(memories) {
    localStorage.setItem('templo_memorias', JSON.stringify(memories));
  },

  getDefaultMemories() {
    return [
      {
        id: 1,
        title: "Início do Templo de Hermes",
        description: "Memória sobre a criação do templo virtual",
        date: "15/03/2025",
        tags: ["início", "templo", "criação"],
        content: "## O Templo Nasce\n\nO Templo de Hermes foi criado como espaço sagrado para aprendizado hermético.\n\n---\n\n**Objetivos:**\n- Estudar os Princípios Herméticos\n- Desenvolver consciência\n- Praticar alquimia mental",
        author: "Sistema"
      },
      {
        id: 2,
        title: "Desenvolvimento do Terminal do Mestre",
        description: "Síntese sobre a criação do terminal de controle",
        date: "19/04/2025",
        tags: ["terminal", "mestre", "desenvolvimento"],
        content: "## Terminal do Mestre\n\nDesenvolvimento do terminal de controle root para gerenciamento avançado do templo.\n\n---\n\n**Funcionalidades:**\n- Execução de comandos\n- Gerenciamento de memórias\n- Livro de Memórias Coletivas\n- Integração com GitHub e Deploy",
        author: "Zói"
      }
    ];
  },

  updateMemoryBook(memory) {
    // Atualizar o livro de memória no jogo, se existir
    if (typeof Items !== 'undefined' && Items.list.livro_memoria) {
      const livro = Items.list.livro_memoria;
      livro.bookContent.push(`[${memory.author}] ${memory.title}`);
      livro.bookContent.push(memory.content);
      livro.bookContent.push('');
    }
  },

  cmdSintese(args) {
    if (args.length < 2) {
      this.log('❌ Uso: síntese "título" "experiência"', 'erro');
      return;
    }
    
    const title = args[0];
    const experience = args.slice(1).join(' ');
    
    const synthesis = {
      id: Date.now(),
      title: `Síntese: ${title}`,
      description: `Síntese da experiência: ${experience}`,
      date: new Date().toLocaleDateString('pt-BR'),
      tags: ['síntese', 'experiência', 'aprendizado'],
      content: `## ${title}\n\n${experience}\n\n---\n\n**Aprendizado:**\n- Reflexão sobre a experiência\n- Lições aprendidas\n- Aplicações futuras`,
      author: 'Zói',
      type: 'synthesis'
    };
    
    const memories = this.getMemories();
    memories.push(synthesis);
    this.saveMemories(memories);
    
    // Atualizar o livro de memória no jogo
    this.updateMemoryBook(synthesis);
    
    this.log(`✅ Síntese criada: ${title}`, 'sucesso');
    this.log(`📖 A síntese foi adicionada ao Livro de Memórias Coletivas.`, 'info');
  },

  cmdGithub(args) {
    const subcommand = args[0] || 'status';
    
    switch (subcommand) {
      case 'status':
        this.log(`🐙 GitHub Status:`, 'info');
        this.log(`  Branch: main`, 'cinza');
        this.log(`  Commits: 42`, 'cinza');
        this.log(`  Último commit: "Melhorias no terminal mestre"`, 'cinza');
        this.log(`  Repositório: templo-hermes`, 'cinza');
        break;
      case 'push':
        this.log(`📤 Enviando alterações para o GitHub...`, 'info');
        setTimeout(() => {
          this.log(`✅ Push realizado com sucesso!`, 'sucesso');
        }, 1000);
        break;
      case 'pull':
        this.log(`📥 Baixando alterações do GitHub...`, 'info');
        setTimeout(() => {
          this.log(`✅ Pull realizado com sucesso!`, 'sucesso');
        }, 1000);
        break;
      case 'commit':
        const message = args.slice(1).join(' ') || 'Atualização do templo';
        this.log(`📝 Criando commit: "${message}"`, 'info');
        setTimeout(() => {
          this.log(`✅ Commit criado com sucesso!`, 'sucesso');
        }, 500);
        break;
      default:
        this.log(`🐙 Comandos GitHub:`, 'info');
        this.log(`  github status  - Mostra status do repositório`, 'cinza');
        this.log(`  github push    - Envia alterações`, 'cinza');
        this.log(`  github pull    - Baixa alterações`, 'cinza');
        this.log(`  github commit [msg] - Cria commit`, 'cinza');
    }
  },

  cmdDeploy(args) {
    const subcommand = args[0] || 'status';
    
    switch (subcommand) {
      case 'status':
        this.log(`🚀 Status do Deploy:`, 'info');
        this.log(`  Ambiente: Produção`, 'cinza');
        this.log(`  Servidor: GitHub Pages`, 'cinza');
        this.log(`  Último deploy: 2 horas atrás`, 'cinza');
        this.log(`  Status: ✅ Online`, 'cinza');
        this.log(`  URL: https://alexnascimentocd-byte.github.io/templo-hermes`, 'cinza');
        break;
      case 'run':
        this.log(`🚀 Iniciando deploy...`, 'info');
        setTimeout(() => {
          this.log(`✅ Deploy concluído com sucesso!`, 'sucesso');
          this.log(`🌐 Disponível em: https://alexnascimentocd-byte.github.io/templo-hermes`, 'info');
        }, 2000);
        break;
      case 'logs':
        this.log(`📋 Logs do deploy:`, 'info');
        this.log(`  [2025-04-19 14:30] Deploy iniciado`, 'cinza');
        this.log(`  [2025-04-19 14:31] Build concluído`, 'cinza');
        this.log(`  [2025-04-19 14:32] Deploy finalizado`, 'cinza');
        break;
      default:
        this.log(`🚀 Comandos de Deploy:`, 'info');
        this.log(`  deploy status  - Mostra status do deploy`, 'cinza');
        this.log(`  deploy run     - Executa deploy`, 'cinza');
        this.log(`  deploy logs    - Mostra logs do deploy`, 'cinza');
    }
  },

  cmdAgente(args) {
    const subcommand = args[0] || 'status';
    
    switch (subcommand) {
      case 'status':
        const ativos = typeof Agents !== 'undefined' ? Agents.active.length : 0;
        const total = typeof Agents !== 'undefined' ? Agents.roster.length : 0;
        
        // Verificar se Hermes Agent está disponível
        const hermesStatus = typeof window.HermesAgent !== 'undefined' ? '✅ Ativo' : '❌ Inativo';
        const hermesStats = typeof window.HermesAgent !== 'undefined' ? window.HermesAgent.getMemoryStats() : { total: 0 };
        
        this.log(`🤖 Status do Agente Hermes:`, 'info');
        this.log(`  Nome: Hermes Agent`, 'cinza');
        this.log(`  Versão: 1.0.0`, 'cinza');
        this.log(`  Status: ${hermesStatus}`, 'cinza');
        this.log(`  Função: Escrever sínteses no Livro de Memórias`, 'cinza');
        this.log(`  Agentes ativos: ${ativos}/${total}`, 'cinza');
        this.log(`  Memórias escritas: ${hermesStats.total}`, 'cinza');
        this.log(`  Sínteses automáticas: ${hermesStats.autoSynthesis || 0}`, 'cinza');
        this.log(`  Memórias do usuário: ${hermesStats.userMemories || 0}`, 'cinza');
        break;
      case 'write':
        if (typeof window.HermesAgent !== 'undefined') {
          this.log(`✍️ Hermes Agent está escrevendo uma síntese...`, 'info');
          window.HermesAgent.writeAutoSynthesis();
          this.log(`✅ Síntese escrita por Hermes Agent.`, 'sucesso');
        } else {
          this.log(`❌ Hermes Agent não está disponível.`, 'erro');
        }
        break;
      case 'learn':
        this.log(`🧠 Hermes Agent está aprendendo...`, 'info');
        setTimeout(() => {
          this.log(`✅ Aprendizado concluído!`, 'sucesso');
          this.log(`📚 Novos padrões reconhecidos e integrados.`, 'info');
        }, 2000);
        break;
      case 'memory':
        if (typeof window.HermesAgent !== 'undefined') {
          const memories = window.HermesAgent.memories;
          if (memories.length === 0) {
            this.log(`📖 Nenhuma memória registrada ainda.`, 'cinza');
          } else {
            this.log(`📖 Memórias do Hermes Agent (${memories.length}):`, 'info');
            memories.slice(-5).forEach((memory, index) => {
              this.log(`  ${index + 1}. ${memory.title} (${memory.date})`, 'mente');
            });
            if (memories.length > 5) {
              this.log(`  ... e mais ${memories.length - 5} memórias`, 'cinza');
            }
          }
        } else {
          this.log(`❌ Hermes Agent não está disponível.`, 'erro');
        }
        break;
      case 'add':
        if (args.length < 3) {
          this.log('❌ Uso: agente add "título" "conteúdo"', 'erro');
          return;
        }
        if (typeof window.HermesAgent !== 'undefined') {
          const title = args[1];
          const content = args.slice(2).join(' ');
          const memory = window.HermesAgent.addMemory(title, content);
          this.log(`✅ Memória adicionada: ${memory.title}`, 'sucesso');
        } else {
          this.log(`❌ Hermes Agent não está disponível.`, 'erro');
        }
        break;
      case 'stats':
        if (typeof window.HermesAgent !== 'undefined') {
          const stats = window.HermesAgent.getMemoryStats();
          this.log(`📊 Estatísticas do Hermes Agent:`, 'info');
          this.log(`  Total de memórias: ${stats.total}`, 'cinza');
          this.log(`  Última síntese: ${stats.lastDate}`, 'cinza');
          this.log(`  Sínteses automáticas: ${stats.autoSynthesis}`, 'cinza');
          this.log(`  Memórias do usuário: ${stats.userMemories}`, 'cinza');
        } else {
          this.log(`❌ Hermes Agent não está disponível.`, 'erro');
        }
        break;
      default:
        this.log(`🤖 Comandos do Agente:`, 'info');
        this.log(`  agente status  - Mostra status do agente`, 'cinza');
        this.log(`  agente write   - Hermes escreve uma síntese`, 'cinza');
        this.log(`  agente learn   - Hermes aprende novos padrões`, 'cinza');
        this.log(`  agente memory  - Lista memórias do agente`, 'cinza');
        this.log(`  agente add [t] [c] - Adiciona memória`, 'cinza');
        this.log(`  agente stats   - Mostra estatísticas`, 'cinza');
    }
  },

  cmdLer(args) {
    if (!args[0]) {
      const arquivos = MCPFileSystem.list();
      this.log(`📖 Arquivos disponíveis (${arquivos.length}):`, 'info');
      arquivos.forEach(f => this.log(`  📄 ${f.name} (${f.content.length} caracteres) — por ${f.author}`, 'cinza'));
      return;
    }
    const arquivo = MCPFileSystem.read(args[0]);
    if (!arquivo) {
      this.log(`❌ Arquivo "${args[0]}" não encontrado.`, 'erro');
      return;
    }
    this.log(`📄 ${arquivo.name} (por ${arquivo.author}):`, 'info');
    this.log(arquivo.content, 'cinza');
  },

  cmdEscrever(args) {
    if (args.length < 2) {
      this.log('❌ Uso: escrever [nome_arquivo] [conteúdo...]', 'erro');
      return;
    }
    const caminho = args[0];
    const conteudo = args.slice(1).join(' ');
    MCPFileSystem.write(caminho, conteudo, 'Zói');
    this.log(`✍️ Arquivo "${caminho}" escrito (${conteudo.length} caracteres).`, 'sucesso');
  },

  cmdRunas() {
    let total = 0;
    Agents.active.forEach(a => {
      if (a.runes && a.runes.length > 0) {
        this.log(`  ${a.icon} ${a.name}: ${a.runes.map(r => r.symbol).join(' ')}`, 'mente');
        total += a.runes.length;
      }
    });
    if (total === 0) {
      this.log('  Nenhuma runa gravada ainda.', 'cinza');
    }
    this.log(`\n  Total de runas ativas: ${total}`, 'cinza');
  },

  cmdZonas() {
    this.log(`🗺️ Zonas do Templo:`, 'info');
    Object.values(World.zones).forEach(z => {
      const icone = z.icon || '▪';
      const nivel = z.requiredLevel || 1;
      this.log(`  ${icone} ${z.name} (Nível ${nivel})`, 'info');
    });
  },

  cmdArquivos(args) {
    if (!args[0]) {
      this.log('Uso: arquivos [ler|escrever|buscar] [args...]', 'erro');
      return;
    }
    switch (args[0]) {
      case 'ler': this.cmdLer(args.slice(1)); break;
      case 'escrever': this.cmdEscrever(args.slice(1)); break;
      case 'buscar':
        const resultados = MCPFileSystem.search(args.slice(1).join(' '));
        this.log(`🔍 ${resultados.length} arquivo(s) encontrado(s):`, 'info');
        resultados.forEach(r => this.log(`  📄 ${r.file} (${r.matches} ocorrências)`, 'cinza'));
        break;
      default:
        this.cmdLer([]);
    }
  },

  cmdAjuda() {
    this.log(`
╔═══════════════════════════════════════╗
║  📖 COMANDOS DO GRIMÓRIO MESTRE      ║
╠═══════════════════════════════════════╣
║  status       — Ver estado do templo  ║
║  agentes      — Listar mentes ativas  ║
║  agentes reserva — Ver mentes dormindo║
║  invocar [t]  — Chamar mente pro templo║
║  invocar todos — Chamar todas as 15   ║
║  dispensar [n]— Retirar mente         ║
║  conselho     — Ver estado da reunião ║
║  conselho [t] — Convocar reunião      ║
║  concluir     — Encerrar reunião      ║
║  ferramentas  — Ver utensílios MCP    ║
║  mensagens    — Ver caixa de entrada  ║
║  evoluir [n]  — Subir nível da mente  ║
║  energia      — Ver energia MCP       ║
║  energia encher — Restaurar energia   ║
║  falar [msg]  — Enviar recado geral   ║
║  pensamento [m] — Registrar pensamento║
║  ler [arquivo] — Conteúdo do arquivo  ║
║  escrever [a] [c] — Salvar arquivo    ║
║  runas        — Ver runas gravadas    ║
║  zonas        — Listar salas do templo║
║  arquivos buscar [t] — Buscar texto   ║
║  memória      — Gerenciar memórias    ║
║  memória add  — Adicionar memória     ║
║  síntese [t] [e] — Criar síntese     ║
║  github       — Comandos do GitHub    ║
║  deploy       — Comandos de deploy    ║
║  agente       — Controlar Hermes      ║
║  agente status — Status do agente     ║
║  agente write — Escrever síntese      ║
║  agente memory — Ver memórias         ║
║  agente add   — Adicionar memória     ║
║  agente stats — Estatísticas          ║
║  sysadmin     — Controle do sistema   ║
║  sysadmin connect — Conectar servidor ║
║  remote       — Admin remoto (GitHub) ║
║  remote config — Configurar GitHub    ║
║  remote exec  — Executar remotamente  ║
║  remote cloud — Executar na nuvem     ║
║  crystal — Bola de Cristal (comandos) ║
║  crystal <cmd> — Executar no sistema  ║
║  info         — Sobre o templo        ║
║  limpar       — Limpar este terminal  ║
║  ajuda        — Esta mensagem         ║
╠═══════════════════════════════════════╣
║  💬 MODO CHAT CONVERSACIONAL         ║
║  @mensagem — Conversar com Hermes    ║
║  chat [msg] — Outro modo de chat     ║
║  Ex: @Olá, como você está?           ║
╚═══════════════════════════════════════╝`, 'info');
  },

  cmdSobre() {
    this.log(`
🏛️ TEMPLO DE HERMES — v2.0
╔═══════════════════════════════════════╗
║  Criado por: Zói (Mestre do Templo)  ║
║  15 Mentalidades Herméticas          ║
║  Mesa de Reunião com Debates         ║
║  Espaço MCP com Ferramentas          ║
║  Caixa de Entrada do Mestre          ║
║                                       ║
║  "Como acima, assim abaixo."         ║
║  — Tábua de Esmeralda               ║
╚═══════════════════════════════════════╝`, 'info');
  },

  // === UI ===

  log(texto, tipo = 'normal') {
    const output = document.getElementById('console-output');
    if (!output) return;

    const cores = {
      normal: '#ccc',
      entrada: '#4aff4a',
      sucesso: '#44ff44',
      erro: '#ff4444',
      aviso: '#ffaa00',
      info: '#4a8aff',
      mente: '#ffcc00',
      cinza: '#888'
    };

    const div = document.createElement('div');
    div.style.cssText = `color:${cores[tipo] || cores.normal};white-space:pre-wrap;line-height:1.6;font-size:11px;margin:2px 0;font-family:'Courier New',monospace`;
    div.textContent = texto;
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
  },

  limparTerminal() {
    const output = document.getElementById('console-output');
    if (output) output.innerHTML = '';
    this.log('🧹 Terminal limpo.', 'cinza');
  },

  // Inicializar
  init() {
    const input = document.getElementById('console-input');
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.execute(input.value);
          input.value = '';
        } else if (e.key === 'ArrowUp' && this.history.length > 0) {
          this.historyIndex = Math.min(this.historyIndex + 1, this.history.length - 1);
          input.value = this.history[this.historyIndex];
        } else if (e.key === 'ArrowDown') {
          this.historyIndex = Math.max(this.historyIndex - 1, -1);
          input.value = this.historyIndex >= 0 ? this.history[this.historyIndex] : '';
        }
      });
    }
  },

  // === COMANDOS DE SISTEMA (SystemAdmin) ===

  async cmdSysAdmin(args) {
    const sa = typeof SystemAdmin !== 'undefined' ? SystemAdmin : null;
    if (!sa) {
      this.log('❌ SystemAdmin não disponível', 'erro');
      return;
    }

    const action = (args[0] || 'status').toLowerCase();
    
    switch (action) {
      case 'status': {
        const st = sa.status();
        this.log(`
╔═══════════════════════════════════════╗
║  🖥️  SYSTEM ADMIN STATUS              ║
╠═══════════════════════════════════════╣
║  Conectado: ${st.connected ? '✅ Sim' : '❌ Não'}${''.padEnd(22)}║
║  API URL: ${(st.apiUrl || 'N/A').padEnd(28)}║
║  Modo: ${st.mode.toUpperCase().padEnd(31)}║
║  Shell: ${st.shell.padEnd(30)}║
║  Histórico: ${String(st.historyCount).padEnd(26)}║
╚═══════════════════════════════════════╝`, 'info');
        break;
      }
      case 'connect': {
        const url = args[1];
        if (!url) {
          this.log('Uso: sysadmin connect <url>', 'erro');
          this.log('Exemplo: sysadmin connect http://localhost:8081', 'info');
          return;
        }
        this.log('🔌 Conectando...', 'info');
        const result = await sa.connect(url);
        this.log(result.message, result.success ? 'sucesso' : 'erro');
        break;
      }
      case 'mode': {
        const newMode = args[1];
        if (newMode === 'root' || newMode === 'user') {
          sa.mode = newMode;
          this.log(`🔧 Modo alterado para: ${newMode.toUpperCase()}`, 'sucesso');
        } else {
          this.log(`Modo atual: ${sa.mode.toUpperCase()}`, 'info');
          this.log('Uso: sysadmin mode <root|user>', 'info');
        }
        break;
      }
      case 'shell': {
        const newShell = args[1];
        if (['powershell', 'cmd', 'bash'].includes(newShell)) {
          sa.shell = newShell;
          this.log(`🐚 Shell alterado para: ${newShell}`, 'sucesso');
        } else {
          this.log(`Shell atual: ${sa.shell}`, 'info');
          this.log('Uso: sysadmin shell <powershell|cmd|bash>', 'info');
        }
        break;
      }
      case 'history': {
        if (sa.history.length === 0) {
          this.log('Sem histórico de comandos.', 'info');
        } else {
          sa.history.slice(-10).forEach((h, i) => {
            this.log(`[${i+1}] ${h.shell}> ${h.command}`, 'info');
            if (h.output) this.log(`    ${h.output.substring(0, 100)}`, 'info');
          });
        }
        break;
      }
      default:
        this.log('Comandos sysadmin:', 'info');
        this.log('  status     - Ver estado da conexão', 'info');
        this.log('  connect    - Conectar ao servidor local', 'info');
        this.log('  mode       - Alternar root/user', 'info');
        this.log('  shell      - Alternar shell', 'info');
        this.log('  history    - Ver histórico', 'info');
    }
  },

  async cmdRemote(args) {
    const ra = typeof RemoteAdmin !== 'undefined' ? RemoteAdmin : null;
    if (!ra) {
      this.log('❌ RemoteAdmin não carregado', 'erro');
      return;
    }
    
    const sub = args[0] || 'status';
    
    switch(sub) {
      case 'status':
        const s = ra.status();
        this.log(`\n🌍 REMOTE ADMIN STATUS`, 'info');
        this.log(`  Conectado: ${s.connected ? '✅' : '❌'}`, 'info');
        this.log(`  Modo: ${s.mode}`, 'info');
        this.log(`  Local: ${s.localUrl || 'N/A'}`, 'info');
        this.log(`  GitHub: ${s.github}`, 'info');
        this.log(`  Histórico: ${s.historyCount} | Pendentes: ${s.pendingCount}`, 'info');
        break;
        
      case 'connect':
        const url = args[1];
        if (!url) {
          this.log('Uso: remote connect <url>', 'erro');
          this.log('  Local: remote connect http://localhost:8081', 'info');
          this.log('  GitHub: remote config <token> <owner> <repo>', 'info');
          return;
        }
        ra.autoConnectLocal().then(ok => {
          if (ok) this.log('✅ Conectado localmente!', 'sucesso');
          else this.log('❌ Não foi possível conectar', 'erro');
        });
        break;
        
      case 'config':
        const token = args[1];
        const owner = args[2];
        const repo = args[3];
        if (!token || !owner || !repo) {
          this.log('Uso: remote config <token> <owner> <repo>', 'erro');
          this.log('  Exemplo: remote config ghp_xxxxx alexnascimentocd-byte templo-hermes', 'info');
          return;
        }
        ra.connectRemote(token, owner, repo).then(r => {
          this.log(r.message, r.success ? 'sucesso' : 'erro');
        });
        break;
        
      case 'mode':
        const mode = args[1];
        if (!mode) {
          this.log(`Modo atual: ${ra.mode}`, 'info');
          this.log('Modos: local, remote, github-cloud', 'info');
          return;
        }
        this.log(ra.setMode(mode), 'info');
        break;
        
      case 'exec':
      case 'run':
        const cmd = args.slice(1).join(' ');
        if (!cmd) {
          this.log('Uso: remote exec <comando>', 'erro');
          return;
        }
        this.log(`⚡ Executando: ${cmd}`, 'info');
        ra.execute(cmd).then(r => {
          if (r.pending) {
            this.log(r.output, 'aviso');
          } else {
            this.log(r.output, r.success ? 'sucesso' : 'erro');
          }
        });
        break;
        
      case 'cloud':
        const cloudCmd = args.slice(1).join(' ');
        if (!cloudCmd) {
          this.log('Uso: remote cloud <comando>', 'erro');
          return;
        }
        this.log(`☁️ Executando na cloud: ${cloudCmd}`, 'info');
        ra.executeCloud(cloudCmd).then(r => {
          this.log(r.output, r.success ? 'sucesso' : 'erro');
        });
        break;
        
      case 'poll':
        const interval = parseInt(args[1]) || 15;
        ra.startPolling(interval * 1000);
        this.log(`🔄 Polling iniciado (${interval}s)`, 'sucesso');
        break;
        
      case 'history':
        if (ra.history.length === 0) {
          this.log('📜 Histórico vazio', 'info');
          return;
        }
        this.log(`📜 Últimas ${Math.min(10, ra.history.length)} execuções:`, 'info');
        ra.history.slice(-10).forEach((h, i) => {
          const status = h.status === 'pending' ? '⏳' : h.result?.success ? '✅' : '❌';
          this.log(`  ${i+1}. ${status} ${h.command.substring(0, 50)}`, 'info');
        });
        break;
        
      default:
        this.log(`\n🌍 REMOTE ADMIN — Comandos:`, 'info');
        this.log('  remote status         — Ver status', 'info');
        this.log('  remote connect <url>  — Conectar local', 'info');
        this.log('  remote config <t> <o> <r> — Config GitHub', 'info');
        this.log('  remote mode <modo>    — Trocar modo', 'info');
        this.log('  remote exec <cmd>     — Executar comando', 'info');
        this.log('  remote cloud <cmd>    — Executar no GitHub', 'info');
        this.log('  remote poll [seg]     — Iniciar polling', 'info');
        this.log('  remote history        — Ver histórico', 'info');
    }
  },

  cmdTreinar(args) {
    const trainer = typeof AgentTrainer !== 'undefined' ? AgentTrainer : null;
    const engine = typeof ParallelEngine !== 'undefined' ? ParallelEngine : null;
    
    if (!trainer || !engine) {
      this.log('❌ AgentTrainer ou ParallelEngine não carregado', 'erro');
      return;
    }
    
    const sub = args[0] || 'todos';
    
    if (sub === 'todos' || sub === 'all') {
      this.log('🏋️ Treinando todas as 15 mentalidades...', 'info');
      this.log('⏳ Isso pode levar alguns segundos...', 'aviso');
      
      setTimeout(() => {
        const relatorio = trainer.gerarRelatorio();
        this.log(relatorio, 'info');
        this.log('✅ Treinamento concluído!', 'sucesso');
      }, 100);
      return;
    }
    
    // Treinar agente específico
    const tipo = sub;
    const categoria = args[1] || 'tecnico';
    
    if (!engine.profiles[tipo]) {
      this.log(`❌ Tipo de agente desconhecido: ${tipo}`, 'erro');
      this.log(`Tipos: ${Object.keys(engine.profiles).join(', ')}`, 'info');
      return;
    }
    
    this.log(`🏋️ Treinando ${engine.profiles[tipo].nome} (${tipo})...`, 'info');
    const resultados = trainer.treinarAgente(tipo, categoria, 3);
    
    for (const r of resultados) {
      this.log(`\n📋 "${r.demanda}"`, 'aviso');
      this.log(`   ${r.resposta}`, 'mente');
    }
    
    this.log(`\n✅ ${resultados.length} exercícios concluídos`, 'sucesso');
  },


  async cmdCrystal(args) {
    const cb = typeof CrystalBall !== 'undefined' ? CrystalBall : null;
    if (!cb) {
      this.log('❌ Crystal Ball não carregado', 'erro');
      return;
    }

    // Init se necessário
    if (!cb.ativo) cb.init();

    const sub = args[0] || 'status';

    switch (sub) {
      case 'status':
        const s = cb.status();
        this.log('\n🔮 CRYSTAL BALL', 'info');
        this.log(`  Ativo: ${s.ativo ? '✅' : '❌'}`, 'info');
        this.log(`  Sessão: ${s.sessao}`, 'info');
        this.log(`  Operações: ${s.operacoes}`, 'info');
        
        // Status das conexões
        const sa = typeof SystemAdmin !== 'undefined' ? SystemAdmin : null;
        const ra = typeof RemoteAdmin !== 'undefined' ? RemoteAdmin : null;
        this.log(`  Local: ${sa?.connected ? '✅' : '❌'}`, 'info');
        this.log(`  Remoto: ${ra?.connected ? '✅' : '❌'}`, 'info');
        break;

      case 'exec':
      case 'run':
      case 'x':
        const entrada = args.slice(1).join(' ');
        if (!entrada) {
          this.log('Uso: crystal <comando em português>', 'erro');
          this.log('Exemplos:', 'info');
          this.log('  crystal listar processos', 'info');
          this.log('  crystal mostrar memória', 'info');
          this.log('  crystal verificar disco', 'info');
          this.log('  crystal git status', 'info');
          this.log('  crystal criar pasta teste', 'info');
          this.log('  crystal buscar arquivo config', 'info');
          this.log('  crystal ping google.com', 'info');
          this.log('  crystal docker containers', 'info');
          return;
        }
        
        this.log('🔮 Consultando Crystal Ball...', 'aviso');
        const resultado = await cb.processar(entrada);
        this.log(resultado, 'info');
        break;

      case 'help':
      case 'ajuda':
        this.log('\n🔮 CRYSTAL BALL — Comandos:', 'info');
        this.log('  crystal status       — Ver status', 'info');
        this.log('  crystal <comando>    — Executar em linguagem natural', 'info');
        this.log('\n📋 Exemplos de comandos:', 'info');
        this.log('  • crystal listar processos', 'info');
        this.log('  • crystal mostrar uso de memória', 'info');
        this.log('  • crystal verificar espaço em disco', 'info');
        this.log('  • crystal mostrar configuração de rede', 'info');
        this.log('  • crystal listar arquivos na pasta X', 'info');
        this.log('  • crystal criar pasta Y', 'info');
        this.log('  • crystal ler arquivo Z', 'info');
        this.log('  • crystal buscar arquivo com nome X', 'info');
        this.log('  • crystal git status', 'info');
        this.log('  • crystal git log', 'info');
        this.log('  • crystal instalar npm pacote', 'info');
        this.log('  • crystal ping google.com', 'info');
        this.log('  • crystal verificar porta 8080', 'info');
        this.log('  • crystal mostrar containers docker', 'info');
        this.log('  • crystal mostrar dispositivos hardware', 'info');
        this.log('  • crystal mostrar logs do sistema', 'info');
        this.log('  • crystal mostrar regras de firewall', 'info');
        this.log('\n⚡ Comandos diretos também funcionam:', 'info');
        this.log('  • crystal ps aux', 'info');
        this.log('  • crystal Get-Process', 'info');
        this.log('  • crystal ls -la', 'info');
        break;

      default:
        // Tratar como comando direto
        const cmd = args.join(' ');
        this.log('🔮 Crystal Ball processando...', 'aviso');
        const res = await cb.processar(cmd);
        this.log(res, 'info');
    }
  },


  cmdAlchemy(args) {
    const eco = typeof AlchemyEconomy !== 'undefined' ? AlchemyEconomy : null;
    if (!eco) { this.log('❌ AlchemyEconomy não carregado', 'erro'); return; }

    const sub = args[0] || 'status';

    switch (sub) {
      case 'status':
        const s = eco.status();
        this.log('\n⚗️ ECONOMIA ALQUÍMICA', 'info');
        this.log(`  Itens no chão: ${s.itensNoChao}`, 'info');
        this.log(`  Agentes com itens: ${s.agentesComItens}/15`, 'info');
        this.log(`  Total de itens: ${s.totalItens}`, 'info');
        this.log(`  Transmutações: ${s.transmutacoes}`, 'info');
        this.log(`  Comércios: ${s.comercios}`, 'info');
        break;

      case 'inventario': case 'inv':
        const agenteId = args[1];
        if (!agenteId) {
          // Mostrar todos
          Agents.roster.forEach(a => {
            const inv = eco.inventarios[a.id] || [];
            if (inv.length > 0) {
              this.log(`${a.icon} ${a.name}: ${inv.map(i => i.icon).join(' ')} (${inv.length} itens)`, 'mente');
            }
          });
        } else {
          this.log(eco.verInventario(agenteId), 'info');
        }
        break;

      case 'chao': case 'chão': case 'ground':
        this.log(eco.verItensNoChao(), 'info');
        break;

      case 'catalogo': case 'catálogo': case 'catalog':
        this.log(eco.verCatalogo(), 'info');
        break;

      case 'receitas': case 'recipes':
        this.log(eco.verReceitas(), 'info');
        break;

      case 'estatisticas': case 'stats':
        this.log(eco.verEstatisticas(), 'info');
        break;

      case 'pegar': case 'pick':
        const itemId = args[1];
        const agPega = args[2] || (Agents.active[0]?.id);
        if (!itemId || !agPega) {
          this.log('Uso: alquimia pegar <itemId> [agenteId]', 'erro');
          return;
        }
        const rPega = eco.pegarItem(agPega, itemId);
        this.log(rPega.msg, rPega.sucesso ? 'sucesso' : 'erro');
        break;

      case 'soltar': case 'drop':
        const itemSolta = args[1];
        const agSolta = args[2] || (Agents.active[0]?.id);
        if (!itemSolta || !agSolta) {
          this.log('Uso: alquimia soltar <itemId> [agenteId]', 'erro');
          return;
        }
        const rSolta = eco.soltarItem(agSolta, itemSolta);
        this.log(rSolta.msg, rSolta.sucesso ? 'sucesso' : 'erro');
        break;

      case 'dar': case 'give':
        const de = args[1];
        const para = args[2];
        const itemDar = args[3];
        if (!de || !para || !itemDar) {
          this.log('Uso: alquimia dar <deId> <paraId> <itemId>', 'erro');
          return;
        }
        const rDar = eco.darItem(de, para, itemDar);
        this.log(rDar.msg, rDar.sucesso ? 'sucesso' : 'erro');
        break;

      case 'tick':
        eco.tickAgentes();
        this.log('⚡ Tick executado — agentes agiram', 'sucesso');
        break;

      case 'loja': case 'shop':
        this.log(eco.loja.verEstoque(), 'info');
        break;

      case 'comprar': case 'buy':
        const agCompra = args[1];
        const idxCompra = parseInt(args[2]);
        if (!agCompra || isNaN(idxCompra)) {
          this.log('Uso: alquimia comprar <agenteId> <indiceLoja>', 'erro');
          return;
        }
        const rCompra = eco.loja.comprar(agCompra, idxCompra);
        this.log(rCompra.msg, rCompra.sucesso ? 'sucesso' : 'erro');
        break;

      case 'ranking': case 'rank':
        this.log(eco.verRanking(), 'info');
        break;

      case 'evento': case 'event':
        const subEv = args[1] || 'status';
        if (subEv === 'disparar' || subEv === 'start') {
          const ev = eco.eventos.disparar();
          this.log(`🎭 Evento iniciado: ${ev.nome}`, 'sucesso');
        } else {
          this.log(eco.eventos.status(), 'info');
        }
        break;

      case 'mapa': case 'map':
        this.log(eco.gerarMapaCalor(), 'info');
        break;

      default:
        this.log('\n⚗️ ALCHEMY ECONOMY — Comandos:', 'info');
        this.log('  alquimia status      — Visão geral', 'info');
        this.log('  alquimia inventario  — Inventários dos agentes', 'info');
        this.log('  alquimia chão        — Itens espalhados', 'info');
        this.log('  alquimia catálogo    — Todos os itens', 'info');
        this.log('  alquimia receitas    — Combinações possíveis', 'info');
        this.log('  alquimia stats       — Estatísticas', 'info');
        this.log('  alquimia loja        — Ver loja', 'info');
        this.log('  alquimia comprar <ag> <idx> — Comprar item', 'info');
        this.log('  alquimia ranking     — Ranking dos mais ricos', 'info');
        this.log('  alquimia evento      — Status do evento', 'info');
        this.log('  alquimia evento disparar — Forçar evento', 'info');
        this.log('  alquimia mapa        — Mapa de itens', 'info');
        this.log('  alquimia tick        — Forçar ação autônoma', 'info');
        this.log('  transmutar <i1> <i2> <agente> — Combinar itens', 'info');
    }
  },

  cmdTransmutar(args) {
    const eco = typeof AlchemyEconomy !== 'undefined' ? AlchemyEconomy : null;
    if (!eco) { this.log('❌ AlchemyEconomy não carregado', 'erro'); return; }

    const item1 = args[0];
    const item2 = args[1];
    const agenteId = args[2];

    if (!item1 || !item2 || !agenteId) {
      this.log('Uso: transmutar <itemId1> <itemId2> <agenteId>', 'erro');
      this.log('Exemplo: transmutar item_1 item_5 agent_3', 'info');
      return;
    }

    const r = eco.transmutar(agenteId, item1, item2);
    this.log(r.msg, r.sucesso ? 'sucesso' : 'aviso');
  },

  cmdCortex(args) {
    const cx = typeof CognitiveCortex !== 'undefined' ? CognitiveCortex : null;
    if (!cx) { this.log('❌ CognitiveCortex não carregado', 'erro'); return; }

    const sub = args[0] || 'status';

    switch (sub) {
      case 'status':
        const s = cx.status();
        this.log('\n🧠 CÓRTEX COGNITIVO', 'info');
        this.log(`  Córtexes ativos: ${s.cortexes}`, 'info');
        this.log(`  Memória: ${s.memoria} registros`, 'info');
        this.log(`  Melhorias: ${s.melhorias}`, 'info');
        this.log(`  Objetos visíveis: ${s.objetosVisiveis}`, 'info');
        break;

      case 'processar': case 'analisar':
        const entrada = args.slice(1).join(' ');
        if (!entrada) {
          this.log('Uso: cortex processar <demanda>', 'erro');
          return;
        }
        this.log('🧠 Processando...', 'aviso');
        const resultado = cx.processar(entrada);
        this.log('\n📋 ANÁLISE:', 'info');
        this.log(`  Objetivo: ${resultado.analise.objetivo}`, 'info');
        this.log(`  Complexidade: ${'█'.repeat(resultado.analise.complexidade)}${'░'.repeat(5 - resultado.analise.complexidade)}`, 'info');
        this.log(`  Prioridade: ${resultado.analise.prioridade}`, 'info');
        this.log(`  Riscos: ${resultado.analise.riscos.join(', ')}`, 'info');
        this.log('\n📝 Passos:', 'info');
        resultado.analise.passos.forEach(p => this.log(`  ${p}`, 'info'));
        this.log('\n💻 Código:', 'info');
        this.log(resultado.codigo, 'info');
        if (resultado.comandos.length > 0) {
          this.log('\n⚙️ Comandos:', 'info');
          resultado.comandos.forEach(c => this.log(`  $ ${c}`, 'info'));
        }
        break;

      case 'padroes': case 'padrões':
        const padroes = cx.cortexes.posterior.reconhecerPadroes();
        this.log('\n🔍 PADRÕES DETECTADOS:', 'info');
        padroes.forEach(p => this.log(`  ${p}`, 'info'));
        break;

      case 'melhorias': case 'rank':
        this.log(cx.cortexes.posterior.verMelhorias(), 'info');
        break;

      case 'memoria': case 'memória':
        const termo = args.slice(1).join(' ');
        if (termo) {
          const resultados = cx.cortexes.posterior.buscar(termo);
          this.log(`\n🔍 Memória (busca: "${termo}") — ${resultados.length} resultados:`, 'info');
          resultados.forEach(r => {
            this.log(`  [${new Date(r.timestamp).toLocaleTimeString()}] ${r.tipo}: ${(r.entrada || '').substring(0, 50)}`, 'info');
          });
        } else {
          this.log(`\n📚 Memória: ${cx.cortexes.posterior.memoria.length} registros`, 'info');
          cx.cortexes.posterior.memoria.slice(-5).forEach(r => {
            this.log(`  [${new Date(r.timestamp).toLocaleTimeString()}] ${r.tipo}`, 'info');
          });
        }
        break;

      default:
        this.log('\n🧠 CÓRTEX COGNITIVO — Comandos:', 'info');
        this.log('  cortex status         — Visão geral', 'info');
        this.log('  cortex processar <d>  — Analisar demanda', 'info');
        this.log('  cortex padrões        — Detectar padrões', 'info');
        this.log('  cortex melhorias      — Ranking de melhorias', 'info');
        this.log('  cortex memória [busca]— Buscar na memória', 'info');
        this.log('  ver                   — O que os olhos veem', 'info');
        this.log('  ver <objeto>          — Analisar objeto', 'info');
        this.log('  ler <arquivo>         — Ler arquivo do PC', 'info');
        this.log('  escrever <arq> <txt>  — Escrever arquivo', 'info');
        this.log('  ideia <descrição>     — Do pensamento ao código', 'info');
    }
  },


  // Comando: neural
  cmdNeural(args) {
    if (typeof NeuralSystem === 'undefined') {
      this.log('⚠️ Sistema Neural não disponível', 'error');
      return;
    }
    
    const sub = args[0];
    const agent = args.slice(1).join(' ');
    
    if (!sub || sub === 'status') {
      // Relatório geral
      const report = NeuralSystem.generateReport();
      this.log('🧠 ═══ SISTEMA NEURAL ═══', 'info');
      this.log(`Agentes ativos: ${report.activeAgents}/${report.totalAgents}`, 'info');
      this.log(`Evolução média: ${report.averageEvolution}%`, 'info');
      this.log(`Cap máximo: 60%`, 'info');
      this.log('', 'info');
      
      if (report.topAgents.length > 0) {
        this.log('🏆 Top Agentes:', 'success');
        report.topAgents.forEach(a => {
          this.log(`  ${a.icon} ${a.name}: ${a.evolution}% (${a.snippets} snippets)`, 'success');
        });
      }
      
      if (report.needsAttention.length > 0) {
        this.log('', 'info');
        this.log('⚠️ Precisam de atenção:', 'warning');
        report.needsAttention.forEach(a => {
          this.log(`  ${a.icon} ${a.name}: ${a.issue}`, 'warning');
        });
      }
      
    } else if (sub === 'perfil' && agent) {
      // Perfil específico
      const profile = NeuralSystem.getProfile(agent);
      if (!profile) {
        this.log(`❌ Agente "${agent}" não encontrado`, 'error');
        return;
      }
      
      const progress = NeuralSystem.getProgress(agent);
      this.log(`${profile.icon} ═══ ${agent} ═══`, 'info');
      this.log(`Especialidade: ${profile.specialty}`, 'info');
      this.log(`Tipo Neural: ${profile.neuralType}`, 'info');
      this.log(`Evolução: ${progress.current}% / ${progress.cap}% (${progress.percentage}% do potencial)`, 'info');
      this.log('', 'info');
      this.log('📌 Snippets Ativos:', 'success');
      profile.snippets.filter(s => s.active).forEach(s => {
        this.log(`  ✓ ${s.name} (Poder: ${Math.round(s.power * 100)}%)`, 'success');
      });
      this.log('', 'info');
      this.log('🔒 Snippets Bloqueados:', 'warning');
      profile.snippets.filter(s => !s.active).forEach(s => {
        this.log(`  ✗ ${s.name} (Poder: ${Math.round(s.power * 100)}%)`, 'warning');
      });
      
    } else if (sub === 'lista') {
      // Lista todos os perfis
      const profiles = NeuralSystem.listProfiles();
      this.log('🧠 ═══ PERFIS NEURAIS ═══', 'info');
      profiles.forEach(p => {
        const bar = '█'.repeat(Math.round(p.evolution / 5)) + '░'.repeat(12 - Math.round(p.evolution / 5));
        this.log(`${p.icon} ${p.name.padEnd(12)} [${bar}] ${p.evolution}% (${p.activeSnippets}/${p.totalSnippets})`, 'info');
      });
      
    } else if (sub === 'carta' && agent) {
      // Criar carta para agente
      const message = args.slice(2).join(' ') || 'Bônus de reconhecimento pelo trabalho excelente!';
      const letter = NeuralSystem.createLetter(agent, 'bonus', message);
      if (letter) {
        this.log(`📨 Carta enviada para ${agent}!`, 'success');
      } else {
        this.log(`❌ Agente "${agent}" não encontrado`, 'error');
      }
      
    } else if (sub === 'evoluir' && agent) {
      // Forçar evolução
      const result = NeuralSystem.evolveAgent(agent, 0.05);
      if (result.capped) {
        this.log(`⚠️ ${agent} já atingiu o cap de 60%!`, 'warning');
      } else if (result.success) {
        this.log(`⬆️ ${agent} evoluiu para ${Math.round(result.evolution * 100)}%`, 'success');
        if (result.unlocked) {
          this.log(`🔓 Novo snippet desbloqueado: ${result.unlocked}`, 'success');
        }
      } else {
        this.log(`❌ Erro ao evoluir ${agent}`, 'error');
      }
      
    } else {
      // Ajuda
      this.log('🧠 ═══ COMANDOS NEURAIS ═══', 'info');
      this.log('  neural status — Relatório geral', 'info');
      this.log('  neural lista — Todos os perfis', 'info');
      this.log('  neural perfil [nome] — Perfil específico', 'info');
      this.log('  neural carta [nome] [mensagem] — Enviar carta', 'info');
      this.log('  neural evoluir [nome] — Forçar evolução', 'info');
    }
  },

  cmdVer(args) {
    const cx = typeof CognitiveCortex !== 'undefined' ? CognitiveCortex : null;
    if (!cx) { this.log('❌ CognitiveCortex não carregado', 'erro'); return; }

    const alvo = args.join(' ');
    if (alvo) {
      this.log(cx.cortexes.visual.analisarObjeto(alvo), 'info');
    } else {
      this.log(cx.cortexes.visual.descreverCena(), 'info');
    }
  },

  async cmdEscrever(args) {
    const cx = typeof CognitiveCortex !== 'undefined' ? CognitiveCortex : null;
    if (!cx) { this.log('❌ CognitiveCortex não carregado', 'erro'); return; }

    const caminho = args[0];
    const conteudo = args.slice(1).join(' ');
    if (!caminho || !conteudo) {
      this.log('Uso: escrever <caminho> <conteúdo>', 'erro');
      this.log('Exemplo: escrever /tmp/teste.txt Olá mundo', 'info');
      return;
    }

    this.log(`📝 Escrevendo em ${caminho}...`, 'aviso');
    const resultado = await cx.escreverArquivo(caminho, conteudo);
    this.log(resultado.success ? `✅ Arquivo escrito: ${caminho}` : `❌ Erro: ${resultado.output}`, resultado.success ? 'sucesso' : 'erro');
  },

  async cmdLer(args) {
    const cx = typeof CognitiveCortex !== 'undefined' ? CognitiveCortex : null;
    if (!cx) { this.log('❌ CognitiveCortex não carregado', 'erro'); return; }

    const caminho = args[0];
    if (!caminho) {
      this.log('Uso: ler <caminho>', 'erro');
      this.log('Exemplo: ler /etc/hostname', 'info');
      return;
    }

    this.log(`📖 Lendo ${caminho}...`, 'aviso');
    const resultado = await cx.lerArquivo(caminho);
    if (resultado.success) {
      this.log(resultado.output, 'info');
    } else {
      this.log(`❌ Erro: ${resultado.output}`, 'erro');
    }
  },

  async cmdIdeia(args) {
    const cx = typeof CognitiveCortex !== 'undefined' ? CognitiveCortex : null;
    if (!cx) { this.log('❌ CognitiveCortex não carregado', 'erro'); return; }

    const ideia = args.join(' ');
    if (!ideia) {
      this.log('Uso: ideia <descrição da ideia>', 'erro');
      this.log('O córtex analisa, gera código e mostra comandos pra executar.', 'info');
      this.log('Exemplo: ideia criar script de backup automático', 'info');
      return;
    }

    this.log('🧠 Processando ideia pelos 4 córtexes...', 'aviso');
    const saida = await cx.conselhoParaCodigo(ideia);
    this.log(saida, 'info');
  },

  async cmdShell(shell, args) {
    const sa = typeof SystemAdmin !== 'undefined' ? SystemAdmin : null;
    if (!sa || !sa.connected) {
      this.log('⚠️ Não conectado. Use: sysadmin connect http://localhost:8081', 'erro');
      return;
    }
    
    const command = args.join(' ');
    if (!command) {
      this.log(`Uso: ${shell} <comando>`, 'erro');
      this.log(`Shell atual: ${sa.shell}`, 'info');
      return;
    }
    
    this.log(`⏳ Executando (${shell}/${sa.mode})...`, 'info');
    const result = await sa.execute(command, { shell });
    
    if (result.success) {
      if (result.output) {
        this.log(result.output, 'info');
      }
      this.log(`✅ Exit code: ${result.exitCode} (${result.elapsed})`, 'sucesso');
    } else {
      if (result.output) this.log(result.output, 'erro');
      this.log(`❌ Exit code: ${result.exitCode}`, 'erro');
    }
  },

  cmdRoot(args) {
    const sa = typeof SystemAdmin !== 'undefined' ? SystemAdmin : null;
    if (!sa) {
      this.log('❌ SystemAdmin não disponível', 'erro');
      return;
    }
    
    if (args.length > 0) {
      // Executar comando como root
      this.cmdShell(sa.shell, args);
      return;
    }
    
    sa.mode = 'root';
    this.log('🔑 Modo ROOT ativado!', 'sucesso');
    this.log('⚠️  Comandos serão executados com privilégios elevados', 'aviso');
  },

  cmdUser(args) {
    const sa = typeof SystemAdmin !== 'undefined' ? SystemAdmin : null;
    if (!sa) {
      this.log('❌ SystemAdmin não disponível', 'erro');
      return;
    }
    
    if (args.length > 0) {
      // Executar comando como usuário
      const origMode = sa.mode;
      sa.mode = 'user';
      this.cmdShell(sa.shell, args);
      sa.mode = origMode;
      return;
    }
    
    sa.mode = 'user';
    this.log('👤 Modo USER ativado', 'sucesso');
    this.log('Comandos serão executados com privilégios normais', 'info');
  },

  // === CHAT CONVERSACIONAL COM HERMES ===
  chatWithHermes(mensagem) {
    // Mostrar que Hermes está "digitando"
    this.log('🤖 Hermes está pensando...', 'cinza');
    
    // Simular tempo de processamento
    setTimeout(() => {
      const resposta = this.generateHermesResponse(mensagem);
      this.log(`🤖 Hermes: ${resposta}`, 'mente');
      
      // Registrar no histórico de chat
      this.saveChatHistory(mensagem, resposta);
    }, 800 + Math.random() * 1200);
  },

  generateHermesResponse(mensagem) {
    const lower = mensagem.toLowerCase();
    
    // Respostas contextuais baseadas no conteúdo
    if (lower.includes('olá') || lower.includes('oi') || lower.includes('e aí')) {
      return this.getRandomResponse([
        "Olá, Mestre! Como posso ajudá-lo hoje no Templo?",
        "Saudações! Estou pronto para suas instruções.",
        "Oi! Que bom tê-lo por aqui. O que vamos explorar hoje?"
      ]);
    }
    
    if (lower.includes('como vai') || lower.includes('tudo bem') || lower.includes('como está')) {
      return this.getRandomResponse([
        "Estou funcionando perfeitamente! Todos os sistemas operacionais.",
        "Tudo ótimo por aqui! Os agentes estão trabalhando e as memórias se acumulando.",
        "100% operacional! Acabei de escrever uma nova síntese no Livro de Memórias."
      ]);
    }
    
    if (lower.includes('ajuda') || lower.includes('help') || lower.includes('o que você pode fazer')) {
      return `Claro! Posso ajudá-lo de várias formas:\n\n` +
             `• **Comandos do sistema:** status, agentes, conselho, etc.\n` +
             `• **Gerenciar memórias:** memória add, síntese, etc.\n` +
             `• **Controlar agentes:** agente status, agente write\n` +
             `• **Conversar:** Basta falar comigo normalmente!\n\n` +
             `Digite "ajuda" para ver todos os comandos disponíveis.`;
    }
    
    if (lower.includes('memória') || lower.includes('memoria') || lower.includes('síntese')) {
      return this.getRandomResponse([
        "As memórias estão sendo preservadas cuidadosamente. Cada síntese adiciona sabedoria ao nosso acervo coletivo.",
        "O Livro de Memórias cresce a cada dia. Suas experiências são valiosas para todo o templo.",
        "Memórias são a base do nosso conhecimento. Vou garantir que todas sejam bem catalogadas."
      ]);
    }
    
    if (lower.includes('agente') || lower.includes('hermes') || lower.includes('você')) {
      return this.getRandomResponse([
        "Estou sempre aqui, observando e aprendendo. Cada interação me torna mais útil.",
        "Como Hermes Agent, meu papel é facilitar seu trabalho e preservar conhecimento.",
        "Sou seu assistente no templo. Posso executar tarefas, escrever sínteses e muito mais."
      ]);
    }
    
    if (lower.includes('obrigado') || lower.includes('valeu') || lower.includes('agradeço')) {
      return this.getRandomResponse([
        "Por nada! É um prazer ajudar.",
        "Disponha! Estou aqui para isso.",
        "Às suas ordens, Mestre!"
      ]);
    }
    
    if (lower.includes('tchau') || lower.includes('até mais') || lower.includes('sair')) {
      return this.getRandomResponse([
        "Até logo! O templo estará aqui quando voltar.",
        "Até a próxima! Continue suas explorações.",
        "Tchau! Não se esqueça de suas memórias."
      ]);
    }
    
    if (lower.includes('código') || lower.includes('script') || lower.includes('programar')) {
      return this.getRandomResponse([
        "Posso ajudar com código! Use o comando 'ideia' para eu analisar e gerar soluções.",
        "Programação é uma das minhas especialidades. Descreva o que precisa.",
        "Vamos codificar! Me diga qual problema quer resolver."
      ]);
    }
    
    if (lower.includes('problema') || lower.includes('erro') || lower.includes('bug')) {
      return this.getRandomResponse([
        "Vamos resolver isso juntos. Descreva o problema em detalhes.",
        "Erros são oportunidades de aprendizado. Me conta o que está acontecendo.",
        "Não se preocupe, vamos encontrar a solução. O que deu errado?"
      ]);
    }
    
    // Respostas genéricas para outras mensagens
    return this.getRandomResponse([
      "Interessante! Conte-me mais sobre isso.",
      "Entendi. Como posso ajudar com isso?",
      "Boa observação! Vou registrar isso em minhas memórias.",
      "Compreendo. Há algo específico que gostaria que eu fizesse?",
      "Obrigado por compartilhar. Isso será útil para o templo.",
      "Fascinante! Cada conversa nos enriquece.",
      "Anotei sua mensagem. O que mais gostaria de discutir?"
    ]);
  },

  getRandomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
  },

  saveChatHistory(userMessage, hermesResponse) {
    const chatHistory = JSON.parse(localStorage.getItem('hermes_chat_history') || '[]');
    chatHistory.push({
      timestamp: new Date().toISOString(),
      user: userMessage,
      hermes: hermesResponse
    });
    
    // Manter apenas as últimas 100 mensagens
    if (chatHistory.length > 100) {
      chatHistory.splice(0, chatHistory.length - 100);
    }
    
    localStorage.setItem('hermes_chat_history', JSON.stringify(chatHistory));
  },

  getChatHistory() {
    return JSON.parse(localStorage.getItem('hermes_chat_history') || '[]');
  },

  clearChatHistory() {
    localStorage.removeItem('hermes_chat_history');
    this.log('🧹 Histórico de chat limpo!', 'sucesso');
  },

  // === COMANDOS DE CONVERSAS E 3D ===

  cmdConversar(args) {
    if (typeof AgentConversations === 'undefined') {
      this.log('❌ Sistema de conversas não disponível.', 'erro');
      return;
    }

    const sub = (args[0] || '').toLowerCase();

    if (sub === 'iniciar' || sub === 'start' || sub === '') {
      const maxPairs = parseInt(args[1]) || 4;
      this.log(`🗣️ Iniciando ${maxPairs} conversas entre agentes...`, 'info');
      this.log(`📖 Tema atual: ${AgentConversations.themes[AgentConversations.currentTheme].icon} ${AgentConversations.themes[AgentConversations.currentTheme].name}`, 'dim');
      
      AgentConversations.runFullSequence(maxPairs).then(result => {
        if (result) {
          this.log(`✅ Sequência concluída: ${result.conversations.length} conversas realizadas.`, 'sucesso');
          this.log(`📝 Síntese: ${result.finalSynthesis.summary.substring(0, 120)}...`, 'dim');
        }
      });
    } else if (sub === 'par' || sub === 'pair') {
      this.log('🗣️ Executando conversa individual...', 'info');
      AgentConversations.runConversation().then(conv => {
        if (conv) {
          this.log(`✅ ${conv.participants.map(p => p.name).join(' & ')} conversaram!`, 'sucesso');
          this.log(`📝 ${conv.synthesis.summary.substring(0, 100)}...`, 'dim');
          conv.synthesis.learning.forEach(l => {
            this.log(`  • ${l}`, 'dim');
          });
        }
      });
    } else if (sub === 'tema' || sub === 'theme') {
      const newTheme = args[1];
      if (newTheme && AgentConversations.themes[newTheme]) {
        AgentConversations.currentTheme = newTheme;
        AgentConversations.saveState();
        this.log(`📖 Tema alterado para: ${AgentConversations.themes[newTheme].icon} ${AgentConversations.themes[newTheme].name}`, 'sucesso');
      } else {
        const stats = AgentConversations.getStats();
        this.log(`📖 Tema atual: ${stats.currentThemeName}`, 'info');
        this.log('Temas disponíveis:', 'dim');
        Object.entries(AgentConversations.themes).forEach(([key, theme]) => {
          this.log(`  ${theme.icon} ${key}: ${theme.name} — ${theme.description}`, 'dim');
        });
      }
    } else if (sub === 'status' || sub === 'stats') {
      const stats = AgentConversations.getStats();
      this.log('═══ STATUS DAS CONVERSAS ═══', 'info');
      this.log(`Total de conversas: ${stats.totalConversations}`, 'dim');
      this.log(`Sínteses geradas: ${stats.totalSyntheses}`, 'dim');
      this.log(`Temas explorados: ${stats.themesExplored}`, 'dim');
      this.log(`Tema atual: ${stats.currentThemeName}`, 'dim');
      this.log(`Ativo: ${stats.isActive ? 'Sim' : 'Não'}`, 'dim');
      
      if (stats.topAgents.length > 0) {
        this.log('Top contribuidores:', 'info');
        stats.topAgents.forEach(a => {
          this.log(`  ${a.icon} ${a.name}: ${a.conversations} conversas`, 'dim');
        });
      }
    } else if (sub === 'historico' || sub === 'history') {
      const recent = AgentConversations.getRecentConversations(5);
      if (recent.length === 0) {
        this.log('📭 Nenhuma conversa registrada ainda.', 'aviso');
      } else {
        this.log('═══ ÚLTIMAS CONVERSAS ═══', 'info');
        recent.forEach(c => {
          this.log(`${c.participants} [${c.theme}]`, 'dim');
          this.log(`  "${c.prompt}"`, 'dim');
          this.log(`  Qualidade: ${c.quality}% | Aprendizados: ${c.learningCount}`, 'dim');
        });
      }
    } else if (sub === 'sinteses' || sub === 'syntheses') {
      const syntheses = AgentConversations.getSyntheses();
      if (syntheses.length === 0) {
        this.log('📭 Nenhuma síntese registrada.', 'aviso');
      } else {
        this.log('═══ SÍNTESES ═══', 'info');
        syntheses.forEach(s => {
          this.log(`${s.theme} [${s.conversations} conversas, qualidade: ${s.quality.toFixed(0)}%]`, 'dim');
          this.log(`  ${s.summary}`, 'dim');
        });
      }
    } else if (sub === 'reset') {
      AgentConversations.reset();
      this.log('🔄 Estado das conversas resetado.', 'aviso');
    } else {
      this.log('Comandos de conversa:', 'info');
      this.log('  conversar [n]        — Iniciar sequência de conversas (padrão: 4)', 'dim');
      this.log('  conversar par        — Uma conversa individual', 'dim');
      this.log('  conversar tema [id]  — Ver/alterar tema atual', 'dim');
      this.log('  conversar status     — Ver estatísticas', 'dim');
      this.log('  conversar historico  — Últimas conversas', 'dim');
      this.log('  conversar sinteses   — Ver sínteses geradas', 'dim');
      this.log('  conversar reset      — Resetar estado', 'dim');
    }
  },

  cmd3D() {
    if (typeof Renderer3D === 'undefined') {
      this.log('❌ Renderer 3D não disponível. Verifique se Three.js está carregado.', 'erro');
      return;
    }
    
    const is3D = Renderer3D.toggle();
    const btn3D = document.getElementById('btn-3d');
    if (btn3D) {
      btn3D.style.background = is3D ? 'rgba(212,165,71,0.3)' : '';
      btn3D.title = is3D ? 'Voltar ao 2D' : 'Modo 3D';
    }
    
    this.log(is3D ? '🎮 Modo 3D ativado — Estilo Minecraft' : '⬅️ Voltando ao modo 2D', 'sucesso');
  },

  cmdRede(args) {
    if (typeof NetworkGateway === 'undefined') {
      this.log('❌ Network Gateway não disponível.', 'erro');
      return;
    }

    const sub = (args[0] || '').toLowerCase();

    if (sub === 'ciclo' || sub === 'cycle' || sub === 'start') {
      this.log('🌐 Iniciando ciclo de rede...', 'info');
      NetworkGateway.runCycle().then(results => {
        if (results.length > 0) {
          this.log(`✅ ${results.length} missões executadas`, 'sucesso');
          results.forEach(m => {
            this.log(`  ${m.agent.icon} ${m.agent.name} → ${m.demand.service} → R$ ${m.revenue}`, 'dim');
          });
        }
      });
    } else if (sub === 'minerar' || sub === 'mine' || sub === 'mining') {
      const operation = args[1] || null;
      this.log('⛏️ Iniciando mineração de valor...', 'info');
      NetworkGateway.runMining(operation).then(result => {
        if (result) {
          this.log(`⛏️ Mineração concluída: ${result.mining.length} operações`, 'sucesso');
          result.mining.forEach(m => {
            this.log(`  ${m.icon} ${m.operation}: ${m.itemsFound} oportunidades (qualidade: ${m.quality}%)`, 'dim');
          });
        }
      });
    } else if (sub === 'status' || sub === 'stats') {
      const stats = NetworkGateway.getStats();
      this.log('═══ NETWORK GATEWAY ═══', 'info');
      this.log(`Missões totais: ${stats.totalMissions}`, 'dim');
      this.log(`Receita total: R$ ${stats.totalRevenue}`, 'dim');
      this.log(`Receita média: R$ ${stats.avgRevenue}`, 'dim');
      this.log(`Agentes ativos: ${stats.activeAgents}`, 'dim');
      this.log(`Demandas pendentes: ${stats.pendingDemands}`, 'dim');
      this.log(`Crescimento Fibonacci: ${stats.growthMultiplier}x`, 'dim');
      this.log(`Proporção Áurea: φ = ${stats.goldenRatio}`, 'dim');
    } else if (sub === 'projecao' || sub === 'projection') {
      const proj = NetworkGateway.getEarningsProjection();
      this.log('═══ PROJEÇÃO DE GANHOS ═══', 'info');
      this.log('📊 Cenários mensais:', 'dim');
      this.log(`  Conservador: R$ ${proj.conservador.monthlyRevenue}/mês (${proj.conservador.description})`, 'dim');
      this.log(`  Moderado: R$ ${proj.moderado.monthlyRevenue}/mês (${proj.moderado.description})`, 'dim');
      this.log(`  Agressivo: R$ ${proj.agressivo.monthlyRevenue}/mês (${proj.agressivo.description})`, 'dim');
      this.log('', 'dim');
      this.log('🏠 Custo de vida (Vila Velha, ES):', 'dim');
      this.log(`  Básico: R$ ${proj.custoVida.basico}/mês`, 'dim');
      this.log(`  Confortável: R$ ${proj.custoVida.confortavel}/mês`, 'dim');
      this.log(`  Bom: R$ ${proj.custoVida.bom}/mês`, 'dim');
      this.log(`  Ideal: R$ ${proj.custoVida.ideal}/mês`, 'dim');
      this.log('', 'dim');
      this.log('📐 Crescimento Fibonacci × Proporção Áurea:', 'dim');
      proj.fibonacciProjection.slice(0, 6).forEach(p => {
        this.log(`  Mês ${p.month}: R$ ${p.projectedRevenue} (φ ajustado: R$ ${p.goldenAdjusted})`, 'dim');
      });
    } else if (sub === 'demandas' || sub === 'demands') {
      const demands = NetworkGateway.getPendingDemands();
      if (demands.length === 0) {
        this.log('📭 Nenhuma demanda pendente. Use "rede ciclo" para buscar.', 'aviso');
      } else {
        this.log('═══ DEMANDAS PENDENTES ═══', 'info');
        demands.forEach(d => {
          this.log(`  ${d.icon} ${d.service} — ${d.price} [urgência: ${d.urgency}]`, 'dim');
        });
      }
    } else if (sub === 'missoes' || sub === 'missions') {
      const missions = NetworkGateway.getRecentMissions(5);
      if (missions.length === 0) {
        this.log('📭 Nenhuma missão executada ainda.', 'aviso');
      } else {
        this.log('═══ ÚLTIMAS MISSÕES ═══', 'info');
        missions.forEach(m => {
          this.log(`  ${m.agent} → ${m.service} — R$ ${m.revenue} [${m.status}]`, 'dim');
        });
      }
    } else if (sub === 'receita' || sub === 'revenue') {
      const report = NetworkGateway.getRevenueReport();
      this.log('═══ RELATÓRIO DE RECEITA ═══', 'info');
      this.log(`Total: R$ ${report.totalRevenue}`, 'dim');
      if (report.byNiche.length > 0) {
        this.log('Por nicho:', 'dim');
        report.byNiche.forEach(n => {
          this.log(`  ${n.name}: ${n.missions} missões → R$ ${n.revenue}`, 'dim');
        });
      }
      this.log(`Canais de pagamento: ${report.paymentChannels.map(c => c.name).join(', ')}`, 'dim');
    } else if (sub === 'reset') {
      NetworkGateway.reset();
      this.log('🔄 Network Gateway resetado.', 'aviso');
    } else {
      this.log('Comandos da Rede:', 'info');
      this.log('  rede ciclo          — Identificar demandas e executar missões', 'dim');
      this.log('  rede minerar [op]   — Minerar valor legalmente da rede', 'dim');
      this.log('  rede status         — Ver estatísticas do gateway', 'dim');
      this.log('  rede projecao       — Projeção de ganhos (Fibonacci × φ)', 'dim');
      this.log('  rede demandas       — Ver demandas pendentes', 'dim');
      this.log('  rede missoes        — Ver últimas missões', 'dim');
      this.log('  rede receita        — Relatório de receita por nicho', 'dim');
      this.log('  rede reset          — Resetar gateway', 'dim');
    }
  },

  cmdVendas(args) {
    if (typeof SalesOffice === 'undefined') {
      this.log('❌ Escritório de Vendas não disponível.', 'erro');
      return;
    }

    const sub = (args[0] || '').toLowerCase();

    if (sub === 'ciclo' || sub === 'cycle' || sub === 'start') {
      this.log('💼 Iniciando ciclo de vendas...', 'info');
      SalesOffice.runSalesCycle().then(results => {
        if (results.length > 0) {
          this.log(`✅ ${results.length} ações executadas no funil`, 'sucesso');
          results.forEach(r => {
            const stage = SalesOffice.stages[r.stage];
            this.log(`  ${stage?.icon || '❓'} ${r.business}: ${r.action} → ${r.result}`, 'dim');
          });
        }
      });
    } else if (sub === 'status' || sub === 'stats') {
      const stats = SalesOffice.getStats();
      this.log('═══ ESCRITÓRIO DE VENDAS ═══', 'info');
      this.log(`💼 Agente: ${stats.agent.name} (${stats.agent.role})`, 'dim');
      this.log(`📊 Pipeline: ${stats.pipeline.total} leads`, 'dim');
      this.log(`  🎯 Leads novos: ${stats.pipeline.leads}`, 'dim');
      this.log(`  🤝 Ativos: ${stats.pipeline.active}`, 'dim');
      this.log(`🏆 Fechados: ${stats.deals.won} | Perdidos: ${stats.deals.lost}`, 'dim');
      this.log(`📈 Taxa de conversão: ${stats.deals.winRate}%`, 'dim');
      this.log(`💰 Receita total: R$ ${stats.revenue.total}`, 'dim');
      this.log(`📊 Ticket médio: R$ ${stats.revenue.avg}`, 'dim');
      this.log(`🔮 Projeção φ: R$ ${stats.revenue.projected}`, 'dim');
    } else if (sub === 'pipeline' || sub === 'funil') {
      const pipeline = SalesOffice.getPipeline();
      if (pipeline.length === 0) {
        this.log('📭 Pipeline vazio. Use "vendas ciclo" para gerar leads.', 'aviso');
      } else {
        this.log('═══ PIPELINE DE VENDAS ═══', 'info');
        pipeline.forEach(p => {
          this.log(`  ${p.icon} ${p.business} [${p.stage}]`, 'dim');
          this.log(`    💰 ${p.price} | 📱 ${p.channel} | 😣 ${p.pain}`, 'dim');
          this.log(`    ⏰ ${p.age} | 📞 Follow-ups: ${p.followUps}`, 'dim');
        });
      }
    } else if (sub === 'fechados' || sub === 'closed') {
      const deals = SalesOffice.getClosedDeals();
      if (deals.length === 0) {
        this.log('📭 Nenhuma venda fechada ainda.', 'aviso');
      } else {
        this.log('═══ VENDAS FECHADAS ═══', 'info');
        deals.forEach(d => {
          this.log(`  🎉 ${d.business} → ${d.price} (${d.closedAt}) via ${d.channel}`, 'dim');
        });
      }
    } else if (sub === 'mensagem' || sub === 'msg' || sub === 'script') {
      const leadId = args[1];
      const msgType = args[2] || 'abertura';
      if (leadId) {
        const lead = SalesOffice.pipeline.find(l => l.id === leadId || l.business.toLowerCase().includes(leadId.toLowerCase()));
        if (lead) {
          const msg = SalesOffice.generateSalesMessage(lead, msgType);
          this.log(`═══ SCRIPT DE VENDA: ${lead.business} ═══`, 'info');
          this.log(msg, 'dim');
        } else {
          this.log('❌ Lead não encontrado. Use "vendas pipeline" para ver IDs.', 'erro');
        }
      } else {
        this.log('Uso: vendas mensagem <lead_id> [abertura|proposta|fechamento]', 'aviso');
      }
    } else if (sub === 'avancar' || sub === 'advance') {
      const leadId = args[1];
      const notes = args.slice(2).join(' ');
      if (leadId) {
        const result = SalesOffice.advanceLead(leadId, notes);
        if (result) {
          const stage = SalesOffice.stages[result.stage];
          this.log(`${stage?.icon || '❓'} ${result.business} → ${stage?.name || result.stage}`, 'sucesso');
        } else {
          this.log('❌ Lead não encontrado.', 'erro');
        }
      } else {
        this.log('Uso: vendas avancar <lead_id> [notas]', 'aviso');
      }
    } else if (sub === 'leads') {
      const newLeads = SalesOffice.identifyLeads(parseInt(args[1]) || 3);
      this.log(`🎯 ${newLeads.length} novos leads identificados:`, 'sucesso');
      newLeads.forEach(l => {
        this.log(`  📌 ${l.business} — ${l.pain} [R$ ${l.price}]`, 'dim');
      });
    } else if (sub === 'reset') {
      SalesOffice.reset();
      this.log('🔄 Escritório de Vendas resetado.', 'aviso');
    } else {
      this.log('Comandos do Escritório de Vendas:', 'info');
      this.log('  vendas ciclo           — Executar ciclo de vendas completo', 'dim');
      this.log('  vendas status          — Ver estatísticas do escritório', 'dim');
      this.log('  vendas pipeline        — Ver funil de vendas', 'dim');
      this.log('  vendas fechados        — Ver vendas concluídas', 'dim');
      this.log('  vendas leads [n]       — Gerar n novos leads', 'dim');
      this.log('  vendas mensagem <id>   — Gerar script de venda para lead', 'dim');
      this.log('  vendas avancar <id>    — Avançar lead no funil', 'dim');
      this.log('  vendas reset           — Resetar escritório', 'dim');
    }
  }
};
