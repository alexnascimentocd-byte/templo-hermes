// === console.js ===
const Console = {
  history: [],
  historyIndex: -1,
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
    if (!cb.ativo) cb.init();
    const sub = args[0] || 'status';
    switch (sub) {
      case 'status':
        const s = cb.status();
        this.log('\n🔮 CRYSTAL BALL', 'info');
        this.log(`  Ativo: ${s.ativo ? '✅' : '❌'}`, 'info');
        this.log(`  Sessão: ${s.sessao}`, 'info');
        this.log(`  Operações: ${s.operacoes}`, 'info');
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
  cmdNeural(args) {
    if (typeof NeuralSystem === 'undefined') {
      this.log('⚠️ Sistema Neural não disponível', 'error');
      return;
    }
    const sub = args[0];
    const agent = args.slice(1).join(' ');
    if (!sub || sub === 'status') {
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
      const profiles = NeuralSystem.listProfiles();
      this.log('🧠 ═══ PERFIS NEURAIS ═══', 'info');
      profiles.forEach(p => {
        const bar = '█'.repeat(Math.round(p.evolution / 5)) + '░'.repeat(12 - Math.round(p.evolution / 5));
        this.log(`${p.icon} ${p.name.padEnd(12)} [${bar}] ${p.evolution}% (${p.activeSnippets}/${p.totalSnippets})`, 'info');
      });
    } else if (sub === 'carta' && agent) {
      const message = args.slice(2).join(' ') || 'Bônus de reconhecimento pelo trabalho excelente!';
      const letter = NeuralSystem.createLetter(agent, 'bonus', message);
      if (letter) {
        this.log(`📨 Carta enviada para ${agent}!`, 'success');
      } else {
        this.log(`❌ Agente "${agent}" não encontrado`, 'error');
      }
    } else if (sub === 'evoluir' && agent) {
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
  chatWithHermes(mensagem) {
    this.log('🤖 Hermes está pensando...', 'cinza');
    setTimeout(() => {
      const resposta = this.generateHermesResponse(mensagem);
      this.log(`🤖 Hermes: ${resposta}`, 'mente');
      this.saveChatHistory(mensagem, resposta);
    }, 800 + Math.random() * 1200);
  },
  generateHermesResponse(mensagem) {
    const lower = mensagem.toLowerCase();
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
  }
};

// === council.js ===
const Council = {
  active: false,
  topic: null,
  participants: [],
  round: 0,
  maxRounds: 5,
  debates: [],
  proposals: [],
  decisions: [],
  masterMessages: [],
  paused: false,
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
  convene(topicId) {
    const topic = this.topics.find(t => t.id === topicId) || this.topics[0];
    this.active = true;
    this.topic = topic;
    this.round = 0;
    this.debates = [];
    this.proposals = [];
    this.participants = Agents.active.filter(a => a.level >= 2);
    if (this.participants.length < 2) {
      this.participants = Agents.roster.slice(0, Math.min(15, Agents.roster.length));
    }
    const mesaCenter = World.getZoneCenter('mesa');
    this.participants.forEach((agent, i) => {
      const angle = (i / this.participants.length) * Math.PI * 2;
      const radius = 3;
      agent.targetX = mesaCenter.x + Math.cos(angle) * radius;
      agent.targetY = mesaCenter.y + Math.sin(angle) * radius;
      agent.moving = true;
      agent.currentAction = 'convening';
    });
    const msg = `☤ CONSELHO CONVOCADO: "${topic.title}"`;
    PriorityChat.addMessage('Conselho', msg, 5);
    Interactions.notify(msg);
    setTimeout(() => {
      this.showTerminal();
      this.startDebateRound();
    }, 4000);
    return true;
  },
  startDebateRound() {
    this.round++;
    if (this.round > this.maxRounds) {
      this.conclude();
      return;
    }
    PriorityChat.addMessage('Conselho', `━━━ Rodada ${this.round}/${this.maxRounds} ━━━`, 4);
    this.participants.forEach((agent, i) => {
      setTimeout(() => {
        this.agentSpeaks(agent);
      }, i * 3500);
    });
    const totalDelay = this.participants.length * 3500 + 5000;
    setTimeout(() => {
      if (this.round < this.maxRounds) {
        this.crossConsult();
        setTimeout(() => this.startDebateRound(), 6000);
      } else {
        this.conclude();
      }
    }, totalDelay);
  },
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
    agent.book.pages.push({
      content: `╔══ Rodada ${this.round} do Conselho ══╗\nTópico: ${this.topic.title}\nMinha posição: ${perspectives}\n╚${'═'.repeat(30)}╝`
    });
    Agents.gainExperience(agent, 30);
    PriorityChat.addMessage(
      `${agent.icon} ${agent.name}`,
      perspectives,
      3
    );
    if (typeof Inbox !== 'undefined') {
      Inbox.addAgentMessage(agent.name, agent.icon,
        `[Conselho — Rodada ${this.round}]\nTópico: ${this.topic.title}\n\n${perspectives}`
      );
    }
  },
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
  crossConsult() {
    this.participants.forEach(agent => {
      const others = this.participants.filter(a => a.id !== agent.id);
      if (others.length === 0) return;
      const consultees = [];
      for (let i = 0; i < Math.min(2, others.length); i++) {
        const idx = Math.floor(Math.random() * others.length);
        consultees.push(others[idx]);
      }
      consultees.forEach(consultee => {
        const response = this.consultResponse(consultee, agent);
        const carta = {
          from: agent.name,
          to: consultee.name,
          content: `Consulta no Conselho: "${this.topic.title}" — ${response}`,
          timestamp: Date.now(),
          type: 'council_consult'
        };
        consultee.inbox.push(carta);
        agent.outbox.push(carta);
        Agents.gainExperience(agent, 15);
        Agents.gainExperience(consultee, 20);
      });
    });
    PriorityChat.addMessage('Conselho', '🔄 Consulta cruzada concluída. Opiniões coletadas.', 3);
  },
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
    this.logToTerminal('👑 Zói', message, 'master');
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
        Agents.gainExperience(agent, 20);
      }, (i + 1) * 1200);
    });
    if (typeof Inbox !== 'undefined') {
      Inbox.addThought(`[Conselho — Rodada ${this.round}]\n${message}`);
    }
    return { success: true, responders: responders.length };
  },
  generateMasterResponse(agent, masterMessage) {
    const lower = masterMessage.toLowerCase();
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
  showTerminal() {
    const term = document.getElementById('council-terminal');
    if (term) {
      term.classList.remove('hidden');
      this.logToTerminal('Sistema', 'Terminal conectado. Suas mensagens influenciarão o debate.', 'system');
      this.logToTerminal('Sistema', `Tópico: ${this.topic?.title || 'Nenhum'} | Rodada: ${this.round}/${this.maxRounds}`, 'system');
    }
  },
  hideTerminal() {
    const term = document.getElementById('council-terminal');
    if (term) term.classList.add('hidden');
  },
  clearTerminalLog() {
    const log = document.getElementById('terminal-log');
    if (log) log.innerHTML = '';
  },
  conclude() {
    this.active = false;
    const synthesis = this.generateSynthesis();
    const decision = {
      topic: this.topic.title,
      rounds: this.maxRounds,
      participants: this.participants.map(a => a.name),
      debates: this.debates.length,
      synthesis: synthesis,
      timestamp: Date.now()
    };
    this.decisions.push(decision);
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
    this.participants.forEach(agent => {
      Agents.gainExperience(agent, 100);
      agent.book.pages.push({ content: masterEntry });
    });
    PriorityChat.addMessage('Conselho', `═══ CONSELHO CONCLUÍDO ═══\n${synthesis}`, 5);
    Interactions.notify(`☤ Conselho concluído: "${this.topic.title}"`);
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
    if (typeof HermesAgent !== 'undefined') {
      HermesAgent.updateSessionRegistry(
        `Conselho: ${this.topic.title}`,
        synthesis
      );
    }
    this.participants = [];
    this.topic = null;
  },
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
  getHistory() {
    return this.decisions;
  },
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

// === inbox.js ===
const Inbox = {
  messages: [],
  maxMessages: 200,
  currentFilter: 'all',
  unreadCount: 0,
  types: {
    council: { icon: '☤', label: 'Conselho', color: '#ffcc00' },
    thought: { icon: '💭', label: 'Pensamento', color: '#8a4aff' },
    agent_msg: { icon: '📨', label: 'Agente', color: '#4a8aff' },
    system: { icon: '⚙️', label: 'Sistema', color: '#888' },
    decision: { icon: '📜', label: 'Decisão', color: '#ff8a4a' },
    insight: { icon: '💡', label: 'Insight', color: '#4aff8a' }
  },
  add(type, title, content, metadata = {}) {
    const msg = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      type: type,
      title: title,
      content: content,
      metadata: metadata,
      timestamp: Date.now(),
      read: false,
      starred: false
    };
    this.messages.unshift(msg);
    if (this.messages.length > this.maxMessages) {
      this.messages = this.messages.slice(0, this.maxMessages);
    }
    this.unreadCount++;
    this.updateBadge();
    const panel = document.getElementById('inbox-panel');
    if (panel && !panel.classList.contains('hidden')) {
      this.render();
    }
    return msg;
  },
  addCouncilConclusion(decision) {
    const content = `
═══════════════════════════════════════
  TÓPICO: ${decision.topic}
═══════════════════════════════════════
📊 DADOS DA SESSÃO:
  • Rodadas realizadas: ${decision.rounds}
  • Participantes: ${decision.participants.join(', ')}
  • Contribuições: ${decision.debates} debates
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 SÍNTESE:
${decision.synthesis}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 DEBATES DETALHADOS:
${(decision.debateLog || []).map((d, i) => `
  [Rodada ${d.round}] ${d.icon} ${d.agent}:
  "${d.content}"
`).join('\n')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏰ Registrado em: ${new Date(decision.timestamp).toLocaleString('pt-BR')}
    `.trim();
    this.add('council', `Conselho: ${decision.topic}`, content, {
      participants: decision.participants,
      rounds: decision.rounds
    });
  },
  addThought(text) {
    this.add('thought', 'Pensamento do Mestre', text, {
      author: 'Zói',
      timestamp: Date.now()
    });
  },
  addAgentMessage(agentName, agentIcon, message) {
    this.add('agent_msg', `${agentIcon} ${agentName}`, message, {
      agent: agentName
    });
  },
  addSystem(title, content) {
    this.add('system', title, content);
  },
  addInsight(title, content) {
    this.add('insight', `💡 ${title}`, content);
  },
  markRead(msgId) {
    const msg = this.messages.find(m => m.id === msgId);
    if (msg && !msg.read) {
      msg.read = true;
      this.unreadCount = Math.max(0, this.unreadCount - 1);
      this.updateBadge();
    }
  },
  markAllRead() {
    this.messages.forEach(msg => {
      if (!msg.read) {
        msg.read = true;
      }
    });
    this.unreadCount = 0;
    this.updateBadge();
    this.render();
  },
  toggleStar(msgId) {
    const msg = this.messages.find(m => m.id === msgId);
    if (msg) {
      msg.starred = !msg.starred;
      this.render();
    }
  },
  delete(msgId) {
    this.messages = this.messages.filter(m => m.id !== msgId);
    this.render();
  },
  clear() {
    this.messages = [];
    this.unreadCount = 0;
    this.updateBadge();
    this.render();
  },
  setFilter(filter) {
    this.currentFilter = filter;
    this.render();
    document.querySelectorAll('.inbox-filter').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filter);
    });
  },
  getFiltered() {
    if (this.currentFilter === 'all') return this.messages;
    if (this.currentFilter === 'starred') return this.messages.filter(m => m.starred);
    return this.messages.filter(m => m.type === this.currentFilter);
  },
  updateBadge() {
    const badge = document.getElementById('inbox-badge');
    if (badge) {
      if (this.unreadCount > 0) {
        badge.textContent = this.unreadCount > 99 ? '99+' : this.unreadCount;
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    }
  },
  render() {
    const list = document.getElementById('inbox-list');
    if (!list) return;
    const filtered = this.getFiltered();
    if (filtered.length === 0) {
      list.innerHTML = '<div class="inbox-empty">📬 Nenhuma mensagem.</div>';
      return;
    }
    list.innerHTML = filtered.map(msg => {
      const typeInfo = this.types[msg.type] || this.types.system;
      const time = new Date(msg.timestamp).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
      const formattedContent = msg.content
        .replace(/\n/g, '<br>')
        .replace(/═══+/g, '<hr class="msg-divider">')
        .replace(/━━━+/g, '<hr class="msg-divider-thin">')
        .replace(/"([^"]+)"/g, '<em>"$1"</em>');
      return `
        <div class="inbox-msg ${msg.read ? 'read' : 'unread'}" data-id="${msg.id}" data-type="${msg.type}">
          <div class="msg-header">
            <span class="msg-type" style="color:${typeInfo.color}">${typeInfo.icon} ${typeInfo.label}</span>
            <span class="msg-time">${time}</span>
            <button class="msg-star ${msg.starred ? 'starred' : ''}" onclick="Inbox.toggleStar('${msg.id}')">${msg.starred ? '⭐' : '☆'}</button>
            <button class="msg-delete" onclick="Inbox.delete('${msg.id}')">✕</button>
          </div>
          <div class="msg-title">${msg.title}</div>
          <div class="msg-content">${formattedContent}</div>
          ${!msg.read ? `<button class="msg-mark-read" onclick="Inbox.markRead('${msg.id}'); Inbox.render();">✓ Marcar como lida</button>` : ''}
        </div>
      `;
    }).join('');
    list.scrollTop = 0;
  },
  init() {
    this.addSystem('Bem-vindo, Mestre',
      'Sua Caixa de Entrada está pronta.\n\n' +
      'Aqui você receberá:\n' +
      '• ☤ Conclusões das reuniões do Conselho\n' +
      '• 💭 Seus pensamentos registrados\n' +
      '• 📨 Mensagens dos agentes\n' +
      '• 💡 Insights e descobertas\n' +
      '• ⚙️ Notificações do sistema\n\n' +
      'Digite um pensamento no campo abaixo para registrar.'
    );
  },
  setupUI() {
    const btnInbox = document.getElementById('btn-inbox');
    const inboxPanel = document.getElementById('inbox-panel');
    const closeInbox = document.getElementById('close-inbox');
    const sendBtn = document.getElementById('inbox-send');
    const input = document.getElementById('inbox-input');
    const markReadBtn = document.getElementById('inbox-mark-read');
    const clearBtn = document.getElementById('inbox-clear');
    if (btnInbox) {
      btnInbox.addEventListener('click', () => {
        inboxPanel.classList.toggle('hidden');
        if (!inboxPanel.classList.contains('hidden')) {
          this.render();
          this.markAllRead();
          if (typeof PriorityChat !== 'undefined') PriorityChat.container.style.display = 'none';
        } else {
          if (typeof PriorityChat !== 'undefined') PriorityChat.showIfClear();
        }
      });
    }
    if (closeInbox) {
      closeInbox.addEventListener('click', () => {
        inboxPanel.classList.add('hidden');
        if (typeof PriorityChat !== 'undefined') PriorityChat.showIfClear();
      });
    }
    const sendThought = () => {
      const text = input.value.trim();
      if (text) {
        this.addThought(text);
        input.value = '';
        PriorityChat.addMessage('💭 Zói', text, 2);
      }
    };
    if (sendBtn) sendBtn.addEventListener('click', sendThought);
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendThought();
      });
    }
    if (markReadBtn) {
      markReadBtn.addEventListener('click', () => this.markAllRead());
    }
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm('Limpar todas as mensagens?')) {
          this.clear();
        }
      });
    }
    document.querySelectorAll('.inbox-filter').forEach(btn => {
      btn.addEventListener('click', () => {
        this.setFilter(btn.dataset.filter);
      });
    });
  }
};

// === npc-grimoire.js ===
const NPCGrimoire = {
  pendingCommands: [],
  diarios: {},
  init() {
    if (typeof Agents !== 'undefined' && Agents.roster) {
      Agents.roster.forEach(agent => {
        if (!this.diarios[agent.type]) {
          this.diarios[agent.type] = [];
        }
      });
    }
    this.loadDiarios();
    setInterval(() => this.gerarComandoAutomatico(), 45000);
    setInterval(() => this.gerarEntradaDiario(), 120000);
  },
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
      acoes: comando.acoes || [],
      prioridade: comando.prioridade || 'normal',
      lido: false
    };
    this.pendingCommands.push(cmd);
    if (this.pendingCommands.length > 20) {
      this.pendingCommands.shift();
    }
    this.notificarComando(cmd);
    this.save();
    return cmd;
  },
  notificarComando(cmd) {
    if (typeof Toast !== 'undefined') {
      Toast.show(`${cmd.npcEmoji} ${cmd.npcName} enviou um comando`, 'info');
    }
    this.updateBadge();
    this.renderPainel();
  },
  updateBadge() {
    const badge = document.getElementById('grimoire-badge');
    const unread = this.pendingCommands.filter(c => !c.lido).length;
    if (badge) {
      badge.textContent = unread;
      badge.style.display = unread > 0 ? 'flex' : 'none';
    }
  },
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
  executarAcao(cmdId, acaoIndex) {
    const cmd = this.pendingCommands.find(c => c.id === cmdId);
    if (!cmd) return;
    const acao = cmd.acoes[acaoIndex];
    if (!acao) return;
    cmd.lido = true;
    if (acao.link) {
      window.open(acao.link, '_blank');
      Toast.show(`🔗 Abrindo: ${acao.label}`, 'success');
    } else if (acao.code) {
      navigator.clipboard.writeText(acao.code).then(() => {
        Toast.show(`📋 Código copiado: ${acao.label}`, 'success');
      });
    } else if (acao.command) {
      if (typeof Console !== 'undefined') {
        Console.executeCommand(acao.command);
      }
    }
    this.pendingCommands = this.pendingCommands.filter(c => c.id !== cmdId);
    this.renderPainel();
    this.updateBadge();
    this.save();
  },
  copiarComando(cmdId) {
    const cmd = this.pendingCommands.find(c => c.id === cmdId);
    if (!cmd) return;
    const texto = cmd.comando || `hermes> ${cmd.npcName}: ${cmd.titulo} — ${cmd.descricao}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(texto).then(() => {
        this.notificar(`📋 Comando copiado! Cole no terminal pra aprovar.`);
      });
    } else {
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
  marcarLido(cmdId) {
    const cmd = this.pendingCommands.find(c => c.id === cmdId);
    if (cmd) {
      cmd.lido = true;
      this.updateBadge();
    }
  },
  gerarComandoAutomatico() {
    if (this.pendingCommands.length > 15) return;
    const agent = Agents.roster?.[Math.floor(Math.random() * Agents.roster.length)];
    if (!agent) return;
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
    if (this.diarios[agent.type].length > 50) {
      this.diarios[agent.type].shift();
    }
    this.saveDiarios();
    if (document.getElementById('grimoire-diario')?.innerHTML) {
      this.renderDiario(agent.type);
    }
    return registro;
  },
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
  selecionarNPC(npcType) {
    document.querySelectorAll('.npc-select-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.npc === npcType) {
        btn.classList.add('active');
      }
    });
    this.renderDiario(npcType);
    const agent = Agents.roster?.find(a => a.type === npcType);
    if (agent) {
      const nameEl = document.getElementById('diario-npc-name');
      if (nameEl) nameEl.textContent = `${agent.emoji} ${agent.name}`;
    }
  },
  renderSeletorNPC() {
    const container = document.getElementById('npc-selector');
    if (!container || !Agents.roster) return;
    container.innerHTML = Agents.roster.map(agent => `
      <button class="npc-select-btn" data-npc="${agent.type}" onclick="NPCGrimoire.selecionarNPC('${agent.type}')">
        ${agent.emoji}
      </button>
    `).join('');
  },
  switchTab(tab) {
    this.switchTabDirect(tab);
  },
  switchTabDirect(tab) {
    document.querySelectorAll('.grimoire-tab').forEach(btn => {
      btn.classList.remove('active');
      if ((tab === 'comandos' && btn.textContent.includes('Comandos')) ||
          (tab === 'diario' && btn.textContent.includes('Diário'))) {
        btn.classList.add('active');
      }
    });
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

// === knowledge-base.js ===
const KnowledgeBase = {
  version: '1.0.0',
  perfil: {
    nome: 'Zói',
    idioma: 'pt-BR',
    cnpj: { numero: '28173770000155', status: 'INAPTA', desde: '2024-08-08', motivo: 'Omissão DASN-SIMEI' },
    cpf_ativo: true,
    plataformas: ['Kiwify', 'Hotmart', 'Eduzz', 'TikTok', 'Kwai', 'YouTube', 'Shopee Afiliados'],
    evitar: ['PagSeguro', 'Mercado Pago (vendedores)', 'Stripe'],
    github: 'alexnascimentocd-byte',
    projetos: ['pfc-hermetico (privado)', 'skynetchat', 'templo-hermes'],
    preferencias: {
      comunicacao: 'áudio Telegram',
      linguagem: 'português nativo',
      solucoes: 'gratuitas primeiro',
      abordagem: 'pragmática'
    },
    kiwify: {
      conta: 'alexnascimentocd-byte',
      produtos: [
        { nome: 'Pack 550+ Scripts e Copies', preco: 19.90, checkout: 'pay.kiwify.com.br/qC8YHzK' },
        { nome: 'Primeira Venda em 48h', preco: 9.90, checkout: 'pay.kiwify.com.br/xcL4QxC' },
        { nome: 'Marketing Digital + Mentalidade', preco: 27.90, checkout: 'pay.kiwify.com.br/D4NExoo' }
      ],
      pagina_vendas: 'https://alexnascimentocd-byte.github.io/pack-digital/'
    },
    plr_drive: 'https://drive.google.com/drive/folders/1Hy7_GTsmzzWu7yuHuQhvA_nuLEB7XG6b',
    ambiente: {
      os: 'WSL Ubuntu + Windows',
      ram: '9.7GB',
      ia_local: ['llama3.2:3b', 'qwen2.5-coder:7b'],
      ferramentas: ['Ollama', 'Claude Code', 'GitHub CLI']
    }
  },
  hermetismo: {
    sete_leis: {
      mentalismo: 'O Tudo é Mente; o Universo é mental.',
      correspondencia: 'Como acima, assim abaixo; como abaixo, assim acima.',
      vibração: 'Nada está parudo; tudo se move; tudo vibra.',
      polaridade: 'Tudo é duplo; todos os polos são reconciliáveis.',
      ritmo: 'Tudo tem suas marés; tudo sobe e desce.',
      causa_e_efeito: 'Toda causa tem seu efeito; todo efeito tem sua causa.',
      gênero: 'O gênero está em tudo; tudo tem princípios masculino e feminino.'
    },
    fases_magnum_opus: {
      nigredo: { cor: 'preto', fase: 'dissolução', simbolo: 'corvo', planeta: 'Saturno ♄' },
      albedo: { cor: 'branco', fase: 'purificação', simbolo: 'cisne', planeta: 'Lua ☽' },
      citrinitas: { cor: 'amarelo', fase: 'iluminação', simbolo: 'sol nascente', planeta: 'Sol ☉' },
      rubedo: { cor: 'vermelho', fase: 'perfeição', simbolo: 'rei vermelho', planeta: 'Marte ♂' }
    },
    tábua_esmeralda: [
      'É verdade, sem mentira, certo e muito verdadeiro.',
      'O que está em baixo é como o que está em cima.',
      'E o que está em cima é como o que está em baixo.',
      'Para realizar os milagres de uma só coisa.',
      'Assim como todas as coisas vieram do Um.',
      'E pela meditação do Um todas as coisas se adaptaram.',
      'O sol é seu pai, a lua é sua mãe.',
      'O vento o carrega em seu ventre.',
      'A terra é sua ama.',
      'O pai de todo o telesma do mundo está aqui.',
      'Sua força ou poder é inteira se for convertida em terra.'
    ],
    correspondencias: {
      planetas: { Sol: 'ouro, realeza, ego', Lua: 'prata, intuição, sonhos', Marte: 'ferro, guerra, ação', Mercúrio: 'mercúrio, comunicação, comércio', Júpiter: 'estanho, expansão, lei', Vênus: 'cobre, amor, beleza', Saturno: 'chumbo, limitação, tempo' },
      elementos: { Fogo: 'ação, vontade, energia', Água: 'emoção, intuição, fluxo', Ar: 'intelecto, comunicação, ideias', Terra: 'matéria, estabilidade, forma' },
      metais: { Ouro: 'Sol — perfeição', Prata: 'Lua — receptividade', Ferro: 'Marte — força', Mercúrio: 'Mercúrio — mutação', Estanho: 'Júpiter — crescimento', Cobre: 'Vênus — harmonia', Chumbo: 'Saturno — densidade' }
    },
    mestres: {
      hermes_trismegisto: 'Três vezes grande. Autor da Tábua de Esmeralda. Pai do hermetismo.',
      paracelso: 'Médico alquímico. Pai da toxicologia. "A dose faz o veneno."',
      flamel: 'Lendário alquimista francês. Suposto criador da Pedra Filosofal.',
      fulcanelli: 'Alquimista francês anônimo do séc. XX. Autor do Mistério das Catedrais.',
      maria_hebrea: 'Primeira alquimista. Inventora do banho-maria e do tribikos.',
      geber: 'Pai da química árabe. Classificação dos compostos.',
      agrippa: 'Ocultista renascentista. Filosofia oculta em três livros.',
      john_dee: 'Matemático, astrólogo, conselheiro da Rainha Elizabeth I.',
      ramon_lully: 'Combinatória universal. A Ars Magna.',
      roger_bacon: 'Frade franciscano. Precursor do método científico.',
      isaac_newton: 'Físico que escreveu mais sobre alquimia que sobre física.'
    }
  },
  tecnico: {
    linguagens: ['Python', 'JavaScript', 'HTML', 'CSS', 'Shell/Bash'],
    ferramentas: ['Git', 'GitHub', 'Ollama', 'Claude Code', 'Node.js', 'Express'],
    servicos: ['GitHub Pages', 'Railway', 'Oracle Cloud Free', 'Telegram Bot API'],
    padroes: ['PWA', 'SPA', 'API REST', 'WebSocket', 'Service Worker'],
    estruturas_dados: {
      memoria_agentes: 'localStorage (web) + JSON (persistência)',
      base_conhecimento: 'Objeto JavaScript (este arquivo)',
      cache: 'Service Worker (offline)',
      sessao: 'sessionStorage'
    }
  },
  marketing: {
    estrategias: ['PLR (Private Label Rights)', 'Afiliados', 'Produto próprio', 'Conteúdo gratuito → Funil'],
    canais: ['Telegram', 'YouTube', 'TikTok', 'Kwai', 'Instagram', 'Shopee'],
    metricas: ['Conversão', 'Ticket médio', 'LTV (Lifetime Value)', 'ROI', 'CAC (Custo de Aquisição)'],
    funil: {
      topo: 'Conteúdo gratuito (vídeo, post, artigo)',
      meio: 'Lead magnet (ebook gratuito, planilha)',
      fundo: 'Produto (Kiwify checkout) + Upsell',
      retenção: 'Área de membros + Comunidade'
    },
    copywriting: {
      gatilhos: ['Escassez', 'Urgência', 'Prova social', 'Autoridade', 'Reciprocidade'],
      estrutura: 'PAS (Problema-Agitação-Solução) ou AIDA (Atenção-Interesse-Dejseo-Ação)',
      headlines: ['Como [resultado] em [tempo]', 'O segredo de [autoridade] para [resultado]', '[Número] erras que [audiência] comete'] }
  },
  memoria: {
    sessoes: [],
    decisoes: [],
    aprendizados: [],
    erros_evitados: []
  },
  buscar(termo) {
    const lower = termo.toLowerCase();
    const resultados = [];
    for (const [chave, valor] of Object.entries(this.hermetismo.sete_leis)) {
      if (chave.includes(lower) || valor.toLowerCase().includes(lower)) {
        resultados.push({ fonte: '7 Leis', chave, valor });
      }
    }
    for (const [cat, items] of Object.entries(this.hermetismo.correspondencias)) {
      for (const [chave, valor] of Object.entries(items)) {
        if (chave.toLowerCase().includes(lower) || valor.toLowerCase().includes(lower)) {
          resultados.push({ fonte: cat, chave, valor });
        }
      }
    }
    for (const [chave, valor] of Object.entries(this.hermetismo.mestres)) {
      if (chave.toLowerCase().includes(lower) || valor.toLowerCase().includes(lower)) {
        resultados.push({ fonte: 'Mestres', chave, valor });
      }
    }
    return resultados;
  },
  adicionarMemoria(tipo, dados) {
    const entrada = {
      timestamp: Date.now(),
      data: new Date().toLocaleDateString('pt-BR'),
      tipo,
      dados
    };
    this.memoria[tipo + 's'] = this.memoria[tipo + 's'] || [];
    this.memoria[tipo + 's'].push(entrada);
    this.salvar();
  },
  salvar() {
    try {
      const dados = {
        version: this.version,
        memoria: this.memoria,
        perfil: this.perfil,
        timestamp: Date.now()
      };
      localStorage.setItem('kb_hermes', JSON.stringify(dados));
      return true;
    } catch(e) {
      console.warn('Erro ao salvar KB:', e);
      return false;
    }
  },
  carregar() {
    try {
      const raw = localStorage.getItem('kb_hermes');
      if (!raw) return false;
      const dados = JSON.parse(raw);
      if (dados.memoria) this.memoria = dados.memoria;
      if (dados.version !== this.version) {
      }
      return true;
    } catch(e) {
      console.warn('Erro ao carregar KB:', e);
      return false;
    }
  },
  responder(tema, agente) {
    const conhecimento = this.buscar(tema);
    if (conhecimento.length === 0) {
      return `${agente.icon} ${agente.name}: Interessante perspectiva sobre "${tema}". Vou meditar sobre isso e trazer insights na próxima sessão.`;
    }
    const selecionados = conhecimento.slice(0, 3);
    const respostas = selecionados.map(r => {
      return `• ${r.chave}: ${r.valor}`;
    });
    return `${agente.icon} ${agente.name}: ${respostas.join('\n')}`;
  },
  init() {
    this.carregar();
  }
};

// === response-engine.js ===
const ResponseEngine = {
  templates: {
    coding: [
      'Posso automatizar isso com um script em {lang}. Vou estruturar assim: {approach}',
      'Para resolver isso, sugiro: {solution}. Implementação em {lang} é direta.',
      'Já resolvi problema similar. O padrão é: {pattern}. Código fica limpo assim.'
    ],
    research: [
      'Encontrei {count} referências sobre isso. A mais relevante: {ref}',
      'O estado da arte indica {finding}. Fontes: {sources}',
      'Pesquisa profunda mostra {insight}. Isso conecta com {connection}.'
    ],
    alchemy: [
      'Isso passa por {phase} — dissolução do velho para criar o novo.',
      'A transmutação de {input} em {output} segue a Lei de {law}.',
      'O Athanor aquece: {process}. O resultado será {result}.'
    ],
    guardian: [
      'Identifico risco em {risk}. Recomendo: {protection}',
      'Integridade verificada. {status}. Proteção: {measures}',
      'Acesso seguro. Dados blindados com {method}.'
    ],
    mystic: [
      'A visão holística revela: {insight}. O Princípio de {principle} se aplica.',
      'Como está escrito: "{quote}" — Isso se manifesta em {context}.',
      'O Santíssimo mostra {vision}. O padrão se repete em {cycle}.'
    ],
    messenger: [
      'A mensagem para {audience} deve ser: {message}',
      'Copywriting: {headline} — Gatilho: {trigger}',
      'Canal ideal: {channel}. Timing: {timing}. Conversão esperada: {rate}'
    ],
    healing: [
      'Diagnóstico: {diagnosis}. Causa raiz: {cause}. Tratamento: {treatment}',
      'O sistema mostra {symptom}. Correção: {fix}',
      'Equilíbrio restaurado. {method} aplicado com sucesso.'
    ],
    transmutation: [
      'Transformação: {input} → {output}. Processo: {process}',
      'Conversão de {from} para {to} usando {method}',
      'Dados transmutados: {result}. Integridade mantida.'
    ],
    synthesis: [
      'Conectando {domain1} com {domain2}: {insight}',
      'A síntese revela {pattern}. Integração completa.',
      'Padrão emergente: {pattern}. Aplicação: {application}'
    ],
    architecture: [
      'Estrutura proposta: {structure}. Escalável para {scale}',
      'Arquitetura: {design}. Prós: {pros}. Contras: {cons}',
      'Deploy em {platform}. Configuração: {config}'
    ],
    divination: [
      'Padrão detectado: {pattern}. Tendência: {trend}',
      'Projeção: {forecast}. Confiança: {confidence}%',
      'Sinal de mercado: {signal}. Janela de oportunidade: {window}'
    ],
    engineering: [
      'Solução técnica: {solution}. Ferramentas: {tools}',
      'Build: {build}. Testes: {tests}. Deploy: {deploy}',
      'Implementação: {impl}. Manutenção: {maintenance}'
    ],
    analysis: [
      'Métricas: {metrics}. Tendência: {trend}. Recomendação: {rec}',
      'Análise de {subject}: {findings}. ROI estimado: {roi}',
      'Dados: {data}. Interpretação: {interpretation}'
    ],
    combination: [
      'Combo sugerido: {items}. Valor: {value}. Conversão: {rate}',
      'Bundle: {bundle}. Cross-sell: {cross}. Upsell: {upsell}',
      'Combinação de {a} + {b} = {result}'
    ],
    mystery: [
      'O mistério se revela: {revelation}. A chave está em {key}',
      'Decodificando: {encoded} → {decoded}. O padrão oculto: {pattern}',
      'Sob a superfície: {hidden}. A verdade: {truth}'
    ]
  },
  generate(agent, userInput, context = []) {
    const kb = KnowledgeBase;
    const themes = this.extractThemes(userInput);
    const knowledge = themes.flatMap(t => kb.buscar(t));
    const profileMatch = this.matchProfile(userInput);
    const hermeticMatch = this.matchHermetic(userInput);
    let response = '';
    if (hermeticMatch.length > 0) {
      response = this.formatHermeticResponse(agent, hermeticMatch);
    } else if (profileMatch.length > 0) {
      response = this.formatProfileResponse(agent, profileMatch);
    } else if (knowledge.length > 0) {
      response = this.formatKnowledgeResponse(agent, knowledge, themes);
    } else {
      response = this.generateContextualResponse(agent, userInput, context);
    }
    kb.adicionarMemoria('aprendizado', {
      agent: agent.name,
      tema: themes.join(', '),
      input: userInput.substring(0, 100),
      responseLength: response.length
    });
    return response;
  },
  extractThemes(text) {
    const lower = text.toLowerCase();
    const themes = [];
    const keywordMap = {
      'hermetismo': ['hermetismo', 'hermético', 'hermes', 'trismegisto', 'tábua', 'esmeralda'],
      'alquimia': ['alquimia', 'alquímico', 'transmutação', 'athanor', 'pedra filosofal', 'ouro'],
      'marketing': ['marketing', 'vendas', 'copywriting', 'funil', 'conversão', 'kiwify'],
      'plr': ['plr', 'private label', 'ebook', 'produto digital', 'drive'],
      'programação': ['código', 'script', 'programação', 'python', 'javascript', 'deploy'],
      'pfc': ['pfc', 'projeto', 'tcc', 'tese', 'acadêmico', 'universidade'],
      'sistema': ['sistema', 'arquitetura', 'infraestrutura', 'servidor', 'deploy'],
      'segurança': ['segurança', 'proteção', 'firewall', 'backup', 'blindagem'],
      'negócio': ['negócio', 'empresa', 'cnpj', 'cpf', 'monetização', 'receita']
    };
    for (const [tema, palavras] of Object.entries(keywordMap)) {
      if (palavras.some(p => lower.includes(p))) {
        themes.push(tema);
      }
    }
    if (themes.length === 0) {
      const words = lower.split(/\s+/).filter(w => w.length > 3);
      themes.push(...words.slice(0, 3));
    }
    return themes;
  },
  matchProfile(text) {
    const lower = text.toLowerCase();
    const matches = [];
    if (lower.includes('kiwify') || lower.includes('produto') || lower.includes('checkout')) {
      matches.push({ tipo: 'kiwify', dados: KnowledgeBase.perfil.kiwify });
    }
    if (lower.includes('cnpj') || lower.includes('inapta')) {
      matches.push({ tipo: 'cnpj', dados: KnowledgeBase.perfil.cnpj });
    }
    if (lower.includes('plr') || lower.includes('drive')) {
      matches.push({ tipo: 'plr', dados: KnowledgeBase.perfil.plr_drive });
    }
    if (lower.includes('github') || lower.includes('deploy')) {
      matches.push({ tipo: 'github', dados: KnowledgeBase.perfil.github });
    }
    return matches;
  },
  matchHermetic(text) {
    const lower = text.toLowerCase();
    const matches = [];
    for (const [lei, descricao] of Object.entries(KnowledgeBase.hermetismo.sete_leis)) {
      if (lower.includes(lei) || lower.includes(descricao.substring(0, 20).toLowerCase())) {
        matches.push({ tipo: 'lei', nome: lei, descricao });
      }
    }
    for (const [fase, dados] of Object.entries(KnowledgeBase.hermetismo.fases_magnum_opus)) {
      if (lower.includes(fase) || lower.includes(dados.cor)) {
        matches.push({ tipo: 'fase', nome: fase, dados });
      }
    }
    for (const [mestre, bio] of Object.entries(KnowledgeBase.hermetismo.mestres)) {
      if (lower.includes(mestre.replace('_', ' '))) {
        matches.push({ tipo: 'mestre', nome: mestre, bio });
      }
    }
    return matches;
  },
  formatHermeticResponse(agent, matches) {
    const match = matches[0];
    if (match.tipo === 'lei') {
      return `${agent.icon} ${agent.name}: A Lei de ${match.nome} nos ensina: "${match.descricao}" — Como ${agent.hermetic}, vejo como isso se aplica ao seu contexto atual.`;
    }
    if (match.tipo === 'fase') {
      return `${agent.icon} ${agent.name}: ${match.nome.toUpperCase()} — A fase ${match.dados.cor} (${match.dados.fase}) sob ${match.dados.planeta}. ${agent.skill === 'alchemy' ? 'É minha especialidade operar neste estágio.' : 'Flamel domina melhor esta fase, mas posso compartilhar insights.'}`;
    }
    if (match.tipo === 'mestre') {
      return `${agent.icon} ${agent.name}: ${match.nome.replace('_', ' ')} — ${match.bio} Seu legado permeia nosso trabalho aqui no templo.`;
    }
    return `${agent.icon} ${agent.name}: Interessante perspectiva hermética. Deixe-me consultar a base...`;
  },
  formatProfileResponse(agent, matches) {
    const match = matches[0];
    if (match.tipo === 'kiwify') {
      const prods = match.dados.produtos.map(p => `${p.nome} (R$${p.preco})`).join(', ');
      return `${agent.icon} ${agent.name}: Seus produtos Kiwify: ${prods}. Checkout: ${match.dados.produtos[0].checkout}`;
    }
    if (match.tipo === 'cnpj') {
      return `${agent.icon} ${agent.name}: CNPJ ${match.dados.numero} está ${match.dados.status} desde ${match.dados.desde} (${match.dados.motivo}). Toda monetização deve ser via CPF.`;
    }
    if (match.tipo === 'plr') {
      return `${agent.icon} ${agent.name}: PLR Drive: ${match.dados}. 50+ pastas disponíveis. Use nas áreas de membros Kiwify.`;
    }
    return `${agent.icon} ${agent.name}: Informação do perfil consultada. Dados atualizados.`;
  },
  formatKnowledgeResponse(agent, knowledge, themes) {
    const top = knowledge.slice(0, 2);
    const parts = top.map(k => `${k.chave}: ${k.valor}`);
    return `${agent.icon} ${agent.name}: Sobre ${themes.join(', ')}:\n• ${parts.join('\n• ')}`;
  },
  generateContextualResponse(agent, input, context) {
    const skillResponses = {
      coding: 'Posso analisar isso tecnicamente. A estrutura que vejo permite múltiplas abordagens.',
      research: 'Vou investigar mais a fundo. Há camadas de significado aqui.',
      alchemy: 'Isso requer transmutação. O processo começa com dissolução do padrão atual.',
      guardian: 'Minha análise: a integridade está preservada. Posso reforçar se necessário.',
      mystic: 'A visão holística mostra conexões que o olhar parcial não captura.',
      messenger: 'A comunicação clara é a chave. Vou reformular para máxima clareza.',
      healing: 'Diagnostico equilíbrio. O sistema está funcionando dentro dos parâmetros.',
      transmutation: 'Transformação possível. Vou mapear o antes e o depois.',
      synthesis: 'Conectando os pontos: há um padrão subjacente que unifica.',
      architecture: 'A estrutura suporta. Posso otimizar para melhor performance.',
      divination: 'Os padrões indicam tendência. Vou monitorar.',
      engineering: 'Implementação viável. Vou detalhar os passos.',
      analysis: 'Análise em andamento. Os dados revelam tendências interessantes.',
      combination: 'Combinações possíveis identificadas. Posso sugerir pacotes.',
      mystery: 'Há mais aqui do que aparenta. Vou decodificar.'
    };
    return `${agent.icon} ${agent.name}: ${skillResponses[agent.skill] || 'Processando sua mensagem com base no conhecimento acumulado.'}`;
  }
};

// === crystal-ball.js ===
const CrystalBall = {
  ativo: false,
  agenteAtual: null,
  historico: [],
  sessaoId: null,
  init() {
    this.sessaoId = 'cb_' + Date.now();
    this.ativo = true;
  },
  async processar(entrada) {
    const lower = entrada.toLowerCase().trim();
    const intencao = this.detectarIntencao(lower);
    const agentesNecessarios = this.selecionarAgentes(intencao);
    const operacao = {
      id: Date.now(),
      entrada: entrada,
      intencao: intencao,
      agentes: agentesNecessarios,
      status: 'processando',
      resultados: [],
      timestamp: new Date().toISOString()
    };
    this.historico.push(operacao);
    const respostas = [];
    for (const tipoAgente of agentesNecessarios) {
      const resultado = await this.executarComoAgente(tipoAgente, entrada, intencao);
      respostas.push(resultado);
      operacao.resultados.push(resultado);
    }
    operacao.status = 'concluido';
    return this.formatarResposta(respostas, intencao);
  },
  detectarIntencao(texto) {
    const padroes = {
      sistema: {
        palavras: ['processo', 'serviço', 'cpu', 'memória', 'ram', 'disco', 'rede', 'ip', 'ping', 'status', 'uptime', 'hostname', 'usuário'],
        acao: 'info_sistema'
      },
      arquivos: {
        palavras: ['arquivo', 'pasta', 'diretório', 'listar', 'criar', 'deletar', 'mover', 'copiar', 'ler', 'escrever', 'editar', 'buscar arquivo'],
        acao: 'gerenciar_arquivos'
      },
      codigo: {
        palavras: ['código', 'script', 'programar', 'compilar', 'executar', 'debugar', 'função', 'classe', 'modulo', 'npm', 'pip', 'git'],
        acao: 'desenvolvimento'
      },
      rede: {
        palavras: ['internet', 'conexão', 'download', 'upload', 'http', 'api', 'servidor', 'porta', 'firewall', 'dns', 'proxy'],
        acao: 'rede'
      },
      seguranca: {
        palavras: ['senha', 'token', 'permissão', 'acesso', 'firewall', 'antivírus', 'backup', 'criptografar', 'proteger', 'vulnerabilidade'],
        acao: 'seguranca'
      },
      driver: {
        palavras: ['driver', 'dispositivo', 'hardware', 'gpu', 'placa', 'usb', 'bluetooth', 'wifi', 'som', ' vídeo'],
        acao: 'hardware'
      },
      producao: {
        palavras: ['deploy', 'build', 'compilar', 'produção', 'publicar', 'hospedar', 'domínio', 'ssl', 'nginx', 'docker', 'container'],
        acao: 'producao'
      },
      dados: {
        palavras: ['banco', 'database', 'sql', 'csv', 'json', 'xml', 'planilha', 'tabela', 'query', 'dados', 'importar', 'exportar'],
        acao: 'dados'
      },
      automacao: {
        palavras: ['automatizar', 'agendar', 'cron', 'rotina', 'tarefa', 'batch', 'script', 'workflow', 'pipeline'],
        acao: 'automacao'
      },
      janelas: {
        palavras: ['janela', 'programa', 'abrir', 'fechar', 'app', 'aplicativo', 'software', 'instalar', 'desinstalar', 'powershell', 'cmd'],
        acao: 'sistema_windows'
      }
    };
    const matches = [];
    for (const [categoria, config] of Object.entries(padroes)) {
      for (const palavra of config.palavras) {
        if (texto.includes(palavra)) {
          matches.push({ categoria, acao: config.acao, palavra });
          break;
        }
      }
    }
    if (matches.length === 0) {
      return { categoria: 'geral', acao: 'consulta', matches: [] };
    }
    return {
      categoria: matches[0].categoria,
      acao: matches[0].acao,
      matches: matches
    };
  },
  selecionarAgentes(intencao) {
    const mapa = {
      info_sistema: ['analyst', 'guardian', 'healer'],
      gerenciar_arquivos: ['coder', 'architect', 'guardian'],
      desenvolvimento: ['coder', 'engineer', 'architect'],
      rede: ['guardian', 'engineer', 'analyst'],
      seguranca: ['guardian', 'enigma', 'analyst'],
      hardware: ['engineer', 'healer', 'transmuter'],
      producao: ['engineer', 'architect', 'coder'],
      dados: ['analyst', 'researcher', 'weaver'],
      automacao: ['coder', 'engineer', 'transmuter'],
      sistema_windows: ['coder', 'engineer', 'guardian'],
      consulta: ['mystic', 'messenger', 'researcher']
    };
    return mapa[intencao.acao] || ['mystic', 'coder', 'engineer'];
  },
  async executarComoAgente(tipoAgente, entrada, intencao) {
    const perfil = ParallelEngine.profiles[tipoAgente];
    if (!perfil) return null;
    const comando = this.traduzirComando(entrada, intencao, tipoAgente);
    let resultadoExecucao = null;
    if (typeof SystemAdmin !== 'undefined' && SystemAdmin.connected) {
      resultadoExecucao = await SystemAdmin.execute(comando.comando, {
        shell: comando.shell || 'bash',
        mode: comando.mode || 'user'
      });
    } else if (typeof RemoteAdmin !== 'undefined' && RemoteAdmin.connected) {
      resultadoExecucao = await RemoteAdmin.execute(comando.comando, {
        shell: comando.shell || 'bash',
        mode: comando.mode || 'user'
      });
    }
    const interpretacao = this.interpretarResultado(
      tipoAgente,
      comando,
      resultadoExecucao,
      intencao
    );
    return {
      agente: perfil.nome,
      icone: this.getIcon(tipoAgente),
      tipo: tipoAgente,
      comando: comando.comando,
      shell: comando.shell,
      resultado: resultadoExecucao,
      interpretacao: interpretacao,
      sugestao: this.sugerirProximo(tipoAgente, resultadoExecucao, intencao)
    };
  },
  traduzirComando(entrada, intencao, tipoAgente) {
    const lower = entrada.toLowerCase();
    if (lower.includes('processo') || lower.includes('process')) {
      const isWindows = navigator.platform.includes('Win');
      return {
        comando: isWindows ? 'Get-Process | Sort-Object CPU -Descending | Select-Object -First 20 Name, CPU, WorkingSet' : 'ps aux --sort=-%cpu | head -20',
        shell: isWindows ? 'powershell' : 'bash',
        descricao: 'Listar processos por uso de CPU'
      };
    }
    if (lower.includes('memória') || lower.includes('ram') || lower.includes('memory')) {
      const isWindows = navigator.platform.includes('Win');
      return {
        comando: isWindows ? 'Get-CimInstance Win32_OperatingSystem | Select-Object TotalVisibleMemorySize, FreePhysicalMemory, @{N="UsedMemory";E={$_.TotalVisibleMemorySize - $_.FreePhysicalMemory}}' : 'free -h',
        shell: isWindows ? 'powershell' : 'bash',
        descricao: 'Status de memória'
      };
    }
    if (lower.includes('disco') || lower.includes('disk') || lower.includes('espaço')) {
      const isWindows = navigator.platform.includes('Win');
      return {
        comando: isWindows ? 'Get-PSDrive -PSProvider FileSystem | Select-Object Name, Used, Free, @{N="Total";E={$_.Used+$_.Free}}' : 'df -h',
        shell: isWindows ? 'powershell' : 'bash',
        descricao: 'Espaço em disco'
      };
    }
    if (lower.includes('rede') || lower.includes('ip') || lower.includes('conexão')) {
      const isWindows = navigator.platform.includes('Win');
      return {
        comando: isWindows ? 'Get-NetIPAddress | Where-Object {$_.AddressFamily -eq "IPv4"} | Select-Object IPAddress, InterfaceAlias' : 'ip addr show | grep "inet "',
        shell: isWindows ? 'powershell' : 'bash',
        descricao: 'Configuração de rede'
      };
    }
    if (lower.includes('uptime') || lower.includes('ligado') || lower.includes('tempo ligado')) {
      const isWindows = navigator.platform.includes('Win');
      return {
        comando: isWindows ? '(Get-CimInstance Win32_OperatingSystem).LastBootUpTime' : 'uptime -p',
        shell: isWindows ? 'powershell' : 'bash',
        descricao: 'Tempo de atividade'
      };
    }
    if (lower.includes('listar') || lower.includes('arquivo') && lower.includes('pasta')) {
      const caminho = this.extrairCaminho(entrada) || '.';
      const isWindows = navigator.platform.includes('Win');
      return {
        comando: isWindows ? `Get-ChildItem -Path "${caminho}" -Force | Select-Object Name, Length, LastWriteTime` : `ls -la "${caminho}"`,
        shell: isWindows ? 'powershell' : 'bash',
        descricao: `Listar arquivos em ${caminho}`
      };
    }
    if (lower.includes('criar pasta') || lower.includes('mkdir') || lower.includes('criar diretório')) {
      const caminho = this.extrairCaminho(entrada) || 'nova_pasta';
      return {
        comando: `mkdir -p "${caminho}"`,
        shell: 'bash',
        descricao: `Criar diretório ${caminho}`
      };
    }
    if (lower.includes('ler') && (lower.includes('arquivo') || lower.includes('file'))) {
      const caminho = this.extrairCaminho(entrada);
      if (caminho) {
        const isWindows = navigator.platform.includes('Win');
        return {
          comando: isWindows ? `Get-Content -Path "${caminho}" -TotalCount 50` : `head -50 "${caminho}"`,
          shell: isWindows ? 'powershell' : 'bash',
          descricao: `Ler arquivo ${caminho}`
        };
      }
    }
    if (lower.includes('buscar') && lower.includes('arquivo')) {
      const termo = entrada.match(/(?:buscar|procurar)\s+(?:arquivo\s+)?(.+?)(?:\s+em\s+(.+))?$/i);
      if (termo) {
        const isWindows = navigator.platform.includes('Win');
        const busca = termo[1];
        const dir = termo[2] || '.';
        return {
          comando: isWindows ? `Get-ChildItem -Path "${dir}" -Recurse -Filter "*${busca}*" | Select-Object FullName` : `find "${dir}" -name "*${busca}*" -type f`,
          shell: isWindows ? 'powershell' : 'bash',
          descricao: `Buscar arquivos com "${busca}"`
        };
      }
    }
    if (lower.includes('deletar') || lower.includes('remover') || lower.includes('excluir')) {
      const caminho = this.extrairCaminho(entrada);
      if (caminho) {
        return {
          comando: `rm -rf "${caminho}"`,
          shell: 'bash',
          mode: 'root',
          descricao: `⚠️ Deletar ${caminho}`,
          perigoso: true
        };
      }
    }
    if (lower.includes('git status') || lower.includes('status do git') || lower.includes('status do repositório')) {
      return { comando: 'git status', shell: 'bash', descricao: 'Status do repositório Git' };
    }
    if (lower.includes('git log') || lower.includes('commit') && lower.includes('histórico')) {
      return { comando: 'git log --oneline -20', shell: 'bash', descricao: 'Últimos 20 commits' };
    }
    if (lower.includes('npm') || lower.includes('node')) {
      if (lower.includes('instalar') || lower.includes('install')) {
        const pkg = entrada.match(/(?:npm\s+install|instalar)\s+(\S+)/i);
        return {
          comando: `npm install ${pkg ? pkg[1] : ''}`,
          shell: 'bash',
          descricao: `Instalar pacote npm`
        };
      }
      if (lower.includes('versão') || lower.includes('version')) {
        return { comando: 'node --version && npm --version', shell: 'bash', descricao: 'Versões Node/NPM' };
      }
    }
    if (lower.includes('python') || lower.includes('pip')) {
      if (lower.includes('versão') || lower.includes('version')) {
        return { comando: 'python3 --version && pip3 --version', shell: 'bash', descricao: 'Versões Python/pip' };
      }
    }
    if (lower.includes('ping')) {
      const host = entrada.match(/ping\s+(\S+)/i);
      return {
        comando: `ping -c 4 ${host ? host[1] : '8.8.8.8'}`,
        shell: 'bash',
        descricao: `Ping ${host ? host[1] : 'Google DNS'}`
      };
    }
    if (lower.includes('download') || lower.includes('baixar')) {
      const url = entrada.match(/(https?:\/\/\S+)/i);
      if (url) {
        return {
          comando: `curl -L -O "${url[1]}"`,
          shell: 'bash',
          descricao: `Download ${url[1]}`
        };
      }
    }
    if (lower.includes('porta') || lower.includes('port')) {
      const port = entrada.match(/(?:porta|port)\s+(\d+)/i);
      if (port) {
        return {
          comando: `netstat -tlnp 2>/dev/null | grep :${port[1]} || ss -tlnp | grep :${port[1]}`,
          shell: 'bash',
          descricao: `Verificar porta ${port[1]}`
        };
      }
      return {
        comando: 'netstat -tlnp 2>/dev/null | head -20 || ss -tlnp | head -20',
        shell: 'bash',
        descricao: 'Portas abertas'
      };
    }
    if (lower.includes('docker')) {
      if (lower.includes('container') || lower.includes('lista')) {
        return { comando: 'docker ps -a', shell: 'bash', descricao: 'Containers Docker' };
      }
      if (lower.includes('imagem')) {
        return { comando: 'docker images', shell: 'bash', descricao: 'Imagens Docker' };
      }
      if (lower.includes('log')) {
        return { comando: 'docker logs --tail 50 $(docker ps -q | head -1)', shell: 'bash', descricao: 'Logs do último container' };
      }
      return { comando: 'docker info --format "{{.ServerVersion}}" && docker ps -a', shell: 'bash', descricao: 'Status Docker' };
    }
    if (lower.includes('nginx')) {
      return { comando: 'nginx -t 2>&1 && systemctl status nginx 2>/dev/null || service nginx status', shell: 'bash', mode: 'root', descricao: 'Status Nginx' };
    }
    if (lower.includes('firewall') || lower.includes('iptables')) {
      return { comando: 'iptables -L -n 2>/dev/null || ufw status', shell: 'bash', mode: 'root', descricao: 'Regras de firewall' };
    }
    if (lower.includes('log') && (lower.includes('sistema') || lower.includes('system'))) {
      const isWindows = navigator.platform.includes('Win');
      return {
        comando: isWindows ? 'Get-EventLog -LogName System -Newest 20 | Select-Object TimeGenerated, EntryType, Source, Message' : 'journalctl -n 30 --no-pager',
        shell: isWindows ? 'powershell' : 'bash',
        descricao: 'Logs do sistema'
      };
    }
    if (lower.includes('usuário') || lower.includes('user') || lower.includes('quem')) {
      const isWindows = navigator.platform.includes('Win');
      return {
        comando: isWindows ? 'whoami; net user' : 'whoami; w',
        shell: isWindows ? 'powershell' : 'bash',
        descricao: 'Usuário atual e sessões'
      };
    }
    if (lower.includes('cron') || lower.includes('agendar') || lower.includes('tarefa')) {
      return { comando: 'crontab -l 2>/dev/null || echo "Nenhum cron configurado"', shell: 'bash', descricao: 'Tarefas agendadas' };
    }
    if (lower.includes('driver') || lower.includes('hardware') || lower.includes('dispositivo')) {
      const isWindows = navigator.platform.includes('Win');
      return {
        comando: isWindows ? 'Get-WmiObject Win32_PnPEntity | Select-Object Name, DeviceID | Select-Object -First 30' : 'lshw -short 2>/dev/null || lspci',
        shell: isWindows ? 'powershell' : 'bash',
        descricao: 'Dispositivos de hardware'
      };
    }
    if (lower.includes('gpu') || lower.includes('placa de vídeo')) {
      const isWindows = navigator.platform.includes('Win');
      return {
        comando: isWindows ? 'Get-WmiObject Win32_VideoController | Select-Object Name, AdapterRAM, DriverVersion' : 'lspci | grep -i vga; nvidia-smi 2>/dev/null',
        shell: isWindows ? 'powershell' : 'bash',
        descricao: 'Informações da GPU'
      };
    }
    if (lower.includes('banco') || lower.includes('database') || lower.includes('sql')) {
      return {
        comando: 'which mysql sqlite3 psql 2>/dev/null; echo "---"; sqlite3 --version 2>/dev/null || echo "SQLite não encontrado"',
        shell: 'bash',
        descricao: 'Bancos de dados disponíveis'
      };
    }
    if (this.eComandoDireto(entrada)) {
      return {
        comando: entrada,
        shell: this.detectarShell(entrada),
        descricao: 'Comando direto'
      };
    }
    return {
      comando: 'uname -a && whoami && date',
      shell: 'bash',
      descricao: 'Informações gerais do sistema'
    };
  },
  extrairCaminho(entrada) {
    const winPath = entrada.match(/[A-Z]:\\[^\s"']+|\/mnt\/[^\s"']+|~\/[^\s"']+|\.\/[^\s"']+|\/[^\s"']+/i);
    if (winPath) return winPath[0].replace(/\\/g, '/');
    const afterPrep = entrada.match(/(?:em|no|na|de|do|da|para)\s+([^\s,]+)/i);
    if (afterPrep) return afterPrep[1];
    return null;
  },
  eComandoDireto(entrada) {
    const comuns = ['ls', 'cd', 'cat', 'grep', 'find', 'mkdir', 'rm', 'cp', 'mv', 'chmod', 'chown',
                     'ps', 'top', 'kill', 'df', 'du', 'tar', 'zip', 'unzip', 'wget', 'curl',
                     'ssh', 'scp', 'rsync', 'git', 'npm', 'pip', 'docker', 'systemctl', 'service',
                     'Get-', 'Set-', 'New-', 'Remove-', 'Start-', 'Stop-'];
    return comuns.some(c => entrada.startsWith(c));
  },
  detectarShell(comando) {
    if (comando.startsWith('Get-') || comando.startsWith('Set-') || comando.includes('| Select-Object')) {
      return 'powershell';
    }
    if (comando.startsWith('cmd') || comando.includes('dir ') || comando.includes('type ')) {
      return 'cmd';
    }
    return 'bash';
  },
  interpretarResultado(tipoAgente, comando, resultado, intencao) {
    if (!resultado) {
      return `${this.getIcon(tipoAgente)} Sem conexão com o sistema. Verifique se o servidor local ou remoto está ativo.`;
    }
    if (!resultado.success && resultado.output?.includes('Não conectado')) {
      return `${this.getIcon(tipoAgente)} Não foi possível executar: sistema não conectado. Use \`remote status\` ou \`sysadmin connect\`.`;
    }
    const perfil = ParallelEngine.profiles[tipoAgente];
    const saida = resultado.output || '(sem output)';
    const exitCode = resultado.exitCode;
    const elapsed = resultado.elapsed || '?';
    const interpretacoes = {
      analyst: () => {
        if (saida.length > 500) return `📊 Análise concluída (${saida.length} chars, ${elapsed}). Dados coletados com sucesso.`;
        if (exitCode !== 0) return `📊 Execução com código ${exitCode}. Tempo: ${elapsed}. Output limitado.`;
        return `📊 Dados processados em ${elapsed}. Métricas coletadas.`;
      },
      coder: () => {
        if (exitCode === 0) return `🤖 Executado em ${elapsed}. Código funcionou.`;
        return `🤖 Erro (exit ${elapsed}). Precisa de correção.`;
      },
      guardian: () => {
        if (comando.perigoso) return `🛡️ Comando destrutivo executado. Risco: ALTO. Tempo: ${elapsed}.`;
        if (exitCode === 0) return `🛡️ Operação segura concluída em ${elapsed}.`;
        return `🛡️ Operação falhou (exit ${exitCode}). Sistema protegido.`;
      },
      engineer: () => {
        return `⚙️ Executado. ${elapsed}. Exit: ${exitCode}.`;
      },
      healer: () => {
        if (exitCode === 0) return `🌿 Sistema saudável. Operação bem-sucedida em ${elapsed}.`;
        return `🌿 Anomalia detectada (exit ${exitCode}). Diagnóstico necessário.`;
      }
    };
    const interpretar = interpretacoes[tipoAgente] || (() => `${perfil.icon} ${perfil.nome}: Operação concluída.`);
    return interpretar();
  },
  sugerirProximo(tipoAgente, resultado, intencao) {
    if (!resultado || !resultado.success) return null;
    const saida = resultado.output || '';
    const sugestoes = [];
    if (intencao.acao === 'info_sistema') {
      if (saida.includes('high') || saida.includes('90%') || saida.includes('critic')) {
        sugestoes.push('⚠️ Recursos críticos detectados. Quer investigar processos específicos?');
      }
      sugestoes.push('📊 Quer detalhar algum aspecto específico? (memória, disco, rede, processos)');
    }
    if (intencao.acao === 'gerenciar_arquivos') {
      sugestoes.push('📁 Quer ler, copiar ou modificar algum arquivo específico?');
      sugestoes.push('🔍 Quer buscar por conteúdo dentro dos arquivos?');
    }
    if (intencao.acao === 'desenvolvimento') {
      sugestoes.push('🔧 Quer executar testes ou fazer build?');
      sugestoes.push('📦 Quer gerenciar dependências?');
    }
    if (intencao.acao === 'rede') {
      sugestoes.push('🌐 Quer testar conectividade ou verificar portas?');
      sugestoes.push('🔒 Quer verificar configurações de firewall?');
    }
    if (sugestoes.length === 0) {
      sugestoes.push('🔮 Quer aprofundar ou executar outro comando?');
    }
    return sugestoes[0];
  },
  formatarResposta(respostas, intencao) {
    if (respostas.length === 0) {
      return '🔮 Crystal Ball: Nenhum agente conseguiu processar a solicitação.';
    }
    let output = `🔮 **Crystal Ball — ${intencao.categoria.toUpperCase()}**\n\n`;
    for (const r of respostas) {
      if (!r) continue;
      output += `${r.icone} **${r.agente}**\n`;
      output += `📋 Comando: \`${r.comando}\`\n`;
      if (r.resultado) {
        let saida = r.resultado.output || '(sem output)';
        if (saida.length > 500) {
          saida = saida.substring(0, 500) + '\n... [output truncado]';
        }
        output += `📤 Resultado:\n\`\`\`\n${saida}\n\`\`\`\n`;
        output += `⏱️ ${r.resultado.elapsed || '?'} | Exit: ${r.resultado.exitCode || 0}\n`;
      } else {
        output += `⚠️ Não conectado ao sistema\n`;
      }
      output += `💬 ${r.interpretacao}\n`;
      if (r.sugestao) {
        output += `💡 ${r.sugestao}\n`;
      }
      output += '\n';
    }
    return output;
  },
  getIcon(tipo) {
    const icons = {
      coder: '🤖', researcher: '📚', alchemist: '⚗️', guardian: '🛡️',
      mystic: '✨', messenger: '🌈', healer: '🌿', transmuter: '🔄',
      weaver: '🕸️', architect: '🏛️', diviner: '🔮', engineer: '⚙️',
      analyst: '📐', combinator: '🎲', enigma: '🗝️'
    };
    return icons[tipo] || '❓';
  },
  status() {
    return {
      ativo: this.ativo,
      sessao: this.sessaoId,
      operacoes: this.historico.length,
      ultimaOperacao: this.historico.length > 0 ? this.historico[this.historico.length - 1] : null
    };
  }
};

// === cognitive-cortex.js ===
const CognitiveCortex = {
  cortexes: {
    prefrontal: {
      nome: 'Pré-Frontal',
      funcao: 'Planejamento estratégico e tomada de decisão',
      processar(entrada, contexto) {
        const analise = {
          objetivo: this.extrairObjetivo(entrada),
          complexidade: this.avaliarComplexidade(entrada),
          passos: this.quebrarEmPassos(entrada),
          riscos: this.identificarRiscos(entrada),
          prioridade: this.calcularPrioridade(entrada)
        };
        return analise;
      },
      extrairObjetivo(entrada) {
        const lower = entrada.toLowerCase();
        if (lower.includes('criar') || lower.includes('fazer') || lower.includes('construir')) return 'criação';
        if (lower.includes('corrigir') || lower.includes('consertar') || lower.includes('debugar')) return 'correção';
        if (lower.includes('analisar') || lower.includes('verificar') || lower.includes('investigar')) return 'análise';
        if (lower.includes('automatizar') || lower.includes('agendar') || lower.includes('script')) return 'automação';
        if (lower.includes('otimizar') || lower.includes('melhorar') || lower.includes('refatorar')) return 'otimização';
        if (lower.includes('mostrar') || lower.includes('listar') || lower.includes('ver')) return 'consulta';
        return 'geral';
      },
      avaliarComplexidade(entrada) {
        let score = 1;
        const complexos = ['sistema', 'arquitetura', 'deploy', 'integrar', 'api', 'banco', 'docker', 'pipeline'];
        complexos.forEach(c => { if (entrada.toLowerCase().includes(c)) score++; });
        return Math.min(score, 5);
      },
      quebrarEmPassos(entrada) {
        const passos = [];
        const lower = entrada.toLowerCase();
        if (lower.includes('criar')) passos.push('1. Definir estrutura');
        if (lower.includes('criar')) passos.push('2. Implementar');
        if (lower.includes('criar') || lower.includes('testar')) passos.push('3. Testar');
        if (lower.includes('deploy') || lower.includes('publicar')) passos.push('4. Deploy');
        if (passos.length === 0) passos.push('1. Analisar', '2. Executar', '3. Verificar');
        return passos;
      },
      identificarRiscos(entrada) {
        const riscos = [];
        const lower = entrada.toLowerCase();
        if (lower.includes('deletar') || lower.includes('remover') || lower.includes('rm ')) riscos.push('⚠️ Operação destrutiva');
        if (lower.includes('sudo') || lower.includes('root')) riscos.push('⚠️ Privilégios elevados');
        if (lower.includes('token') || lower.includes('senha') || lower.includes('password')) riscos.push('🔒 Dados sensíveis');
        if (lower.includes('produção') || lower.includes('production')) riscos.push('🔴 Ambiente de produção');
        return riscos.length > 0 ? riscos : ['✅ Sem riscos identificados'];
      },
      calcularPrioridade(entrada) {
        const lower = entrada.toLowerCase();
        if (lower.includes('urgente') || lower.includes('agora') || lower.includes('rápido')) return '🔴 Alta';
        if (lower.includes('importante') || lower.includes('preciso')) return '🟡 Média';
        return '🟢 Normal';
      }
    },
    frontal: {
      nome: 'Frontal',
      funcao: 'Processamento lógico e geração de código',
      processar(entrada, analise) {
        return {
          codigo: this.gerarCodigo(entrada, analise),
          comandos: this.gerarComandos(entrada, analise),
          estrutura: this.definirEstrutura(entrada, analise)
        };
      },
      gerarCodigo(entrada, analise) {
        const lower = entrada.toLowerCase();
        let linguagem = 'bash';
        if (lower.includes('python') || lower.includes('.py')) linguagem = 'python';
        else if (lower.includes('javascript') || lower.includes('node') || lower.includes('.js')) linguagem = 'javascript';
        else if (lower.includes('html') || lower.includes('página') || lower.includes('site')) linguagem = 'html';
        else if (lower.includes('css') || lower.includes('estilo')) linguagem = 'css';
        else if (lower.includes('powershell') || lower.includes('ps1')) linguagem = 'powershell';
        const templates = {
          criar: {
            python: `#!/usr/bin/env python3\n# ${entrada}\n\ndef main():\n    print("Executando: ${entrada}")\n    # TODO: implementar\n    pass\n\nif __name__ == '__main__':\n    main()`,
            javascript: `
            bash: `#!/bin/bash\n# ${entrada}\n\necho "Executando: ${entrada}"\n# TODO: implementar\nexit 0`,
            html: `<!DOCTYPE html>\n<html>\n<head><title>${entrada}</title></head>\n<body>\n  <h1>${entrada}</h1>\n</body>\n</html>`,
            powershell: `# ${entrada}\nWrite-Host "Executando: ${entrada}"\n# TODO: implementar`
          },
          analisar: {
            bash: `#!/bin/bash\n# Análise: ${entrada}\n\necho "=== Análise de Sistema ==="\ndate\necho ""\necho "=== CPU ==="\ntop -bn1 | head -5\necho ""\necho "=== Memória ==="\nfree -h\necho ""\necho "=== Disco ==="\ndf -h`,
            python: `#!/usr/bin/env python3\nimport os, subprocess, json\n\ndef analisar():\n    resultado = {\n        'cwd': os.getcwd(),\n        'usuario': os.getenv('USER'),\n        'home': os.getenv('HOME')\n    }\n    print(json.dumps(resultado, indent=2))\n\nanalisar()`
          },
          automacao: {
            python: `#!/usr/bin/env python3\nimport schedule, time\n\ndef tarefa():\n    print("Tarefa executada")\n    # TODO: implementar\n\nschedule.every(1).hours.do(tarefa)\n\nwhile True:\n    schedule.run_pending()\n    time.sleep(60)`,
            bash: `#!/bin/bash\n# Automação: ${entrada}\n# Adicione ao crontab: crontab -e\n# */30 * * * * /caminho/para/este/script.sh\n\necho "[$(date)] Executando..."\n# TODO: implementar`
          },
          consulta: {
            bash: `#!/bin/bash\n# Consulta: ${entrada}\necho "Coletando informações..."\nuname -a\nwhoami\ndate\nuptime`
          }
        };
        const objetivo = analise?.objetivo || 'geral';
        const porLinguagem = templates[objetivo] || templates.criar;
        return porLinguagem[linguagem] || porLinguagem.bash || `# Código para: ${entrada}\n# TODO: implementar`;
      },
      gerarComandos(entrada, analise) {
        const comandos = [];
        const lower = entrada.toLowerCase();
        if (lower.includes('arquivo') || lower.includes('file')) {
          comandos.push('ls -la', 'find . -type f -name "*" | head -20');
        }
        if (lower.includes('processo') || lower.includes('process')) {
          comandos.push('ps aux --sort=-%cpu | head -10');
        }
        if (lower.includes('rede') || lower.includes('network')) {
          comandos.push('ip addr', 'netstat -tlnp | head -10');
        }
        if (lower.includes('git')) {
          comandos.push('git status', 'git log --oneline -5');
        }
        if (lower.includes('docker')) {
          comandos.push('docker ps -a', 'docker images');
        }
        if (lower.includes('npm') || lower.includes('node')) {
          comandos.push('node --version', 'npm list --depth=0');
        }
        return comandos.length > 0 ? comandos : ['echo "Pronto para executar"'];
      },
      definirEstrutura(entrada, analise) {
        return {
          linguagem: this.detectarLinguagem(entrada),
          dependencias: this.detectarDependencias(entrada),
          arquivos: this.detectarArquivosNecessarios(entrada)
        };
      },
      detectarLinguagem(entrada) {
        const lower = entrada.toLowerCase();
        if (lower.includes('python')) return 'python';
        if (lower.includes('javascript') || lower.includes('node') || lower.includes('js')) return 'javascript';
        if (lower.includes('html')) return 'html';
        if (lower.includes('css')) return 'css';
        if (lower.includes('bash') || lower.includes('shell')) return 'bash';
        return 'auto';
      },
      detectarDependencias(entrada) {
        const deps = [];
        const lower = entrada.toLowerCase();
        if (lower.includes('express')) deps.push('express');
        if (lower.includes('react')) deps.push('react');
        if (lower.includes('flask')) deps.push('flask');
        if (lower.includes('pandas')) deps.push('pandas');
        if (lower.includes('requests')) deps.push('requests');
        return deps;
      },
      detectarArquivosNecessarios(entrada) {
        return ['main.' + (this.detectarLinguagem(entrada) === 'python' ? 'py' : 'js')];
      }
    },
    visual: {
      nome: 'Visual',
      funcao: 'Percepção visual e análise de objetos na tela',
      memoria: [],
      verObjetos() {
        const objetos = [];
        if (typeof Agents !== 'undefined' && Agents.active) {
          Agents.active.forEach(a => {
            objetos.push({
              tipo: 'agente',
              nome: a.name,
              icone: a.icon,
              posicao: { x: a.x, y: a.y },
              nivel: a.level,
              zona: typeof World !== 'undefined' ? World.getZoneAt(a.x, a.y)?.name : '?'
            });
          });
        }
        if (typeof AlchemyEconomy !== 'undefined') {
          AlchemyEconomy.itensNoChao.forEach(item => {
            objetos.push({
              tipo: 'item',
              nome: item.nome,
              icone: item.icon,
              posicao: { x: item.x, y: item.y },
              tier: item.tier,
              valor: item.valor
            });
          });
        }
        if (typeof Player !== 'undefined') {
          objetos.push({
            tipo: 'jogador',
            nome: 'Zói (Mestre)',
            icone: '👑',
            posicao: { x: Player.x, y: Player.y },
            zona: typeof World !== 'undefined' ? World.getZoneAt(Player.x, Player.y)?.name : '?'
          });
        }
        this.memoria = objetos;
        return objetos;
      },
      descreverCena() {
        const objetos = this.verObjetos();
        const agentes = objetos.filter(o => o.tipo === 'agente');
        const itens = objetos.filter(o => o.tipo === 'item');
        const jogador = objetos.find(o => o.tipo === 'jogador');
        let desc = `👁️ CENA ATUAL:\n`;
        desc += `📍 Mestre em: ${jogador?.zona || '?'} (${Math.floor(jogador?.posicao?.x || 0)},${Math.floor(jogador?.posicao?.y || 0)})\n`;
        desc += `👥 ${agentes.length} agentes ativos\n`;
        desc += `📦 ${itens.length} itens no chão\n\n`;
        const porZona = {};
        agentes.forEach(a => {
          if (!porZona[a.zona]) porZona[a.zona] = [];
          porZona[a.zona].push(a);
        });
        desc += `Agentes por zona:\n`;
        for (const [zona, lista] of Object.entries(porZona)) {
          desc += `  📍 ${zona}: ${lista.map(a => `${a.icone}${a.nome}`).join(', ')}\n`;
        }
        if (itens.length > 0) {
          const topItens = [...itens].sort((a, b) => b.valor - a.valor).slice(0, 5);
          desc += `\nItens mais valiosos:\n`;
          topItens.forEach(item => {
            desc += `  ${item.icone} ${item.nome} (Tier ${item.tier}) — ${item.valor} moedas\n`;
          });
        }
        return desc;
      },
      analisarObjeto(nome) {
        const objetos = this.verObjetos();
        const encontrado = objetos.find(o =>
          o.nome.toLowerCase().includes(nome.toLowerCase()) ||
          o.icone === nome
        );
        if (!encontrado) return `👁️ Objeto "${nome}" não encontrado na cena.`;
        let analise = `👁️ ANÁLISE: ${encontrado.icone} ${encontrado.nome}\n`;
        analise += `  Tipo: ${encontrado.tipo}\n`;
        analise += `  Posição: (${Math.floor(encontrado.posicao.x)}, ${Math.floor(encontrado.posicao.y)})\n`;
        if (encontrado.tipo === 'agente') {
          analise += `  Nível: ${encontrado.nivel}\n`;
          const inv = AlchemyEconomy?.inventarios[encontrado.id] || [];
          analise += `  Inventário: ${inv.length} itens\n`;
          if (inv.length > 0) {
            analise += `  Itens: ${inv.map(i => i.icon).join(' ')}\n`;
          }
        } else if (encontrado.tipo === 'item') {
          analise += `  Tier: ${encontrado.tier}\n`;
          analise += `  Valor: ${encontrado.valor} moedas\n`;
        }
        return analise;
      }
    },
    posterior: {
      nome: 'Posterior',
      funcao: 'Memória de longo prazo e reconhecimento de padrões',
      memoria: [],
      contexto: {},
      registrar(evento) {
        this.memoria.push({
          ...evento,
          timestamp: Date.now()
        });
        if (this.memoria.length > 100) this.memoria = this.memoria.slice(-100);
      },
      buscar(termo) {
        return this.memoria.filter(m =>
          JSON.stringify(m).toLowerCase().includes(termo.toLowerCase())
        ).slice(-10);
      },
      reconhecerPadroes() {
        const padroes = [];
        const transmutacoes = this.memoria.filter(m => m.tipo === 'transmutacao');
        if (transmutacoes.length > 5) {
          padroes.push('⚗️ Alta atividade de transmutação detectada');
        }
        if (typeof AlchemyEconomy !== 'undefined') {
          const itens = AlchemyEconomy.itensNoChao;
          const porZona = {};
          itens.forEach(i => {
            const key = `${Math.floor(i.x / 5)},${Math.floor(i.y / 5)}`;
            porZona[key] = (porZona[key] || 0) + 1;
          });
          for (const [zona, qtd] of Object.entries(porZona)) {
            if (qtd >= 5) padroes.push(`📦 Concentração de ${qtd} itens na zona ${zona}`);
          }
        }
        return padroes.length > 0 ? padroes : ['🔍 Nenhum padrão significativo detectado'];
      },
      melhorias: [],
      registrarMelhoria(agente, tipo, antes, depois) {
        this.melhorias.push({
          agente,
          tipo,
          antes,
          depois,
          ganho: depois - antes,
          timestamp: Date.now()
        });
      },
      verMelhorias() {
        if (this.melhorias.length === 0) return '📈 Nenhuma melhoria registrada ainda.';
        let out = '📈 RANKING DE MELHORIAS\n\n';
        const porAgente = {};
        this.melhorias.forEach(m => {
          if (!porAgente[m.agente]) porAgente[m.agente] = { total: 0, count: 0 };
          porAgente[m.agente].total += m.ganho;
          porAgente[m.agente].count++;
        });
        Object.entries(porAgente)
          .sort((a, b) => b[1].total - a[1].total)
          .forEach(([agente, dados], i) => {
            const medalha = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
            out += `${medalha} ${agente}: +${dados.total} (${dados.count} melhorias)\n`;
          });
        return out;
      }
    }
  },
  processar(entrada) {
    const prefrontal = this.cortexes.prefrontal.processar(entrada, {});
    const frontal = this.cortexes.frontal.processar(entrada, prefrontal);
    const visual = this.cortexes.visual.verObjetos();
    const padroes = this.cortexes.posterior.reconhecerPadroes();
    this.cortexes.posterior.registrar({
      tipo: 'processamento',
      entrada,
      analise: prefrontal,
      timestamp: Date.now()
    });
    return {
      analise: prefrontal,
      codigo: frontal.codigo,
      comandos: frontal.comandos,
      estrutura: frontal.estrutura,
      cenas: {
        objetos: visual.length,
        agentes: visual.filter(o => o.tipo === 'agente').length,
        itens: visual.filter(o => o.tipo === 'item').length
      },
      padroes
    };
  },
  async executarNoTerminal(resultado) {
    if (!resultado.comandos || resultado.comandos.length === 0) {
      return { sucesso: false, msg: 'Nenhum comando para executar.' };
    }
    const resultados = [];
    for (const cmd of resultado.comandos) {
      let res = null;
      if (typeof SystemAdmin !== 'undefined' && SystemAdmin.connected) {
        res = await SystemAdmin.execute(cmd, { shell: 'bash' });
      } else if (typeof RemoteAdmin !== 'undefined' && RemoteAdmin.connected) {
        res = await RemoteAdmin.execute(cmd, { shell: 'bash' });
      }
      resultados.push({
        comando: cmd,
        resultado: res,
        sucesso: res?.success || false
      });
    }
    return {
      sucesso: true,
      comandos: resultados,
      total: resultados.length,
      sucessos: resultados.filter(r => r.sucesso).length
    };
  },
  async conselhoParaCodigo(ideia) {
    const resultado = this.processar(ideia);
    let saida = `🧠 ANÁLISE COGNITIVA\n\n`;
    saida += `📋 Objetivo: ${resultado.analise.objetivo}\n`;
    saida += `🔧 Complexidade: ${'█'.repeat(resultado.analise.complexidade)}${'░'.repeat(5 - resultado.analise.complexidade)}\n`;
    saida += `⚡ Prioridade: ${resultado.analise.prioridade}\n`;
    saida += `🛡️ Riscos: ${resultado.analise.riscos.join(', ')}\n\n`;
    saida += `📝 Passos:\n`;
    resultado.analise.passos.forEach(p => saida += `  ${p}\n`);
    saida += `\n💻 Código gerado:\n\`\`\`\n${resultado.codigo}\n\`\`\`\n`;
    if (resultado.comandos.length > 0) {
      saida += `\n⚙️ Comandos para executar:\n`;
      resultado.comandos.forEach(c => saida += `  $ ${c}\n`);
    }
    saida += `\n👁️ Cena atual: ${resultado.cenas.agentes} agentes, ${resultado.cenas.itens} itens\n`;
    if (resultado.padroes.length > 0) {
      saida += `\n🔍 Padrões:\n`;
      resultado.padroes.forEach(p => saida += `  ${p}\n`);
    }
    return saida;
  },
  async escreverArquivo(caminho, conteudo) {
    if (typeof SystemAdmin !== 'undefined' && SystemAdmin.connected) {
      const isWindows = navigator.platform.includes('Win');
      if (isWindows) {
        const escaped = conteudo.replace(/'/g, "''").replace(/\n/g, "`n");
        return await SystemAdmin.execute(`Set-Content -Path "${caminho}" -Value '${escaped}'`, { shell: 'powershell' });
      } else {
        const cmd = `cat > "${caminho}" << 'HERMES_EOF'\n${conteudo}\nHERMES_EOF`;
        return await SystemAdmin.execute(cmd, { shell: 'bash' });
      }
    }
    return { success: false, output: 'Sistema não conectado.' };
  },
  async lerArquivo(caminho) {
    if (typeof SystemAdmin !== 'undefined' && SystemAdmin.connected) {
      const isWindows = navigator.platform.includes('Win');
      const cmd = isWindows
        ? `Get-Content -Path "${caminho}" -TotalCount 100`
        : `cat "${caminho}" | head -100`;
      return await SystemAdmin.execute(cmd, { shell: isWindows ? 'powershell' : 'bash' });
    }
    return { success: false, output: 'Sistema não conectado.' };
  },
  status() {
    return {
      cortexes: Object.keys(this.cortexes).length,
      memoria: this.cortexes.posterior.memoria.length,
      melhorias: this.cortexes.posterior.melhorias.length,
      objetosVisiveis: this.cortexes.visual.memoria.length
    };
  }
};

// === mcp_tools.js ===
const MCPTools = {
  registry: {
    read_file: {
      name: 'Ler Arquivo',
      icon: '📖',
      description: 'Lê o conteúdo de um arquivo no espaço confinado.',
      category: 'leitura',
      cost: 5,
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
        agent.book.pages.push({ content: `Consultei ${peer.name}: ${response}` });
        peer.book.pages.push({ content: `${agent.name} me consultou. Respondi com minha visão de ${peer.skill}.` });
        Agents.gainExperience(agent, 10);
        Agents.gainExperience(peer, 15);
        return { response, from: peer.name, skill: peer.skill };
      }
    }
  },
  energy: {
    max: 100,
    current: 100,
    regenRate: 2,
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
  execute(agent, toolId, params = {}) {
    const tool = this.registry[toolId];
    if (!tool) return { error: `Ferramenta "${toolId}" não existe.` };
    if (tool.requires.length > 0 && !tool.requires.includes(agent.type)) {
      return { error: `${agent.name} (${agent.type}) não tem permissão para usar ${tool.name}. Requer: ${tool.requires.join(' ou ')}.` };
    }
    if (!this.energy.consume(tool.cost)) {
      return { error: `Energia insuficiente. Necessário: ${tool.cost}, Disponível: ${this.energy.current}` };
    }
    try {
      const result = tool.execute(agent, params);
      agent.book.pages.push({
        content: `[${new Date().toLocaleTimeString()}] Usei ${tool.icon} ${tool.name}\nResultado: ${JSON.stringify(result, null, 2).substring(0, 200)}`
      });
      Agents.gainExperience(agent, tool.cost);
      return { success: true, tool: toolId, result, energyRemaining: this.energy.current };
    } catch (err) {
      return { error: `Erro ao executar ${tool.name}: ${err.message}` };
    }
  },
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
  getStatus() {
    return {
      totalTools: Object.keys(this.registry).length,
      energy: this.energy.getStatus(),
      categories: [...new Set(Object.values(this.registry).map(t => t.category))]
    };
  },
  init() {
    this.energy.init();
  }
};
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

// === remote-admin.js ===
const RemoteAdmin = {
  connected: false,
  mode: 'local',
  localUrl: null,
  config: {
    token: '',
    owner: '',
    repo: '',
  },
  pollInterval: null,
  lastCheck: 0,
  history: [],
  async init() {
    const saved = localStorage.getItem('remote_admin_config');
    if (saved) {
      try {
        this.config = JSON.parse(saved);
        if (this.config.token) {
          this.mode = 'remote';
          this.connected = true;
          this.startPolling(15000);
        }
      } catch(e) {}
    }
    await this.autoConnectLocal();
  },
  async autoConnectLocal() {
    const ports = [8081, 8888, 9999, 3000, 5000];
    for (const port of ports) {
      try {
        const resp = await fetch(`http://localhost:${port}/health`, {
          signal: AbortSignal.timeout(2000)
        });
        if (resp.ok) {
          this.localUrl = `http://localhost:${port}`;
          this.mode = 'local';
          this.connected = true;
          return true;
        }
      } catch(e) {}
    }
    return false;
  },
  async connectRemote(token, owner, repo) {
    this.config = { token, owner, repo };
    localStorage.setItem('remote_admin_config', JSON.stringify(this.config));
    try {
      const resp = await this.githubAPI('GET', `/repos/${owner}/${repo}`);
      if (resp.id) {
        this.mode = 'remote';
        this.connected = true;
        return {
          success: true,
          message: `✅ Conectado ao GitHub: ${owner}/${repo}`,
          mode: 'remote'
        };
      }
    } catch(e) {
      return { success: false, message: `❌ Erro: ${e.message}` };
    }
  },
  async githubAPI(method, path, body = null) {
    const url = `https://api.github.com${path}`;
    const opts = {
      method,
      headers: {
        'Authorization': `Bearer ${this.config.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'X-GitHub-Api-Version': '2022-11-28',
      }
    };
    if (body) {
      opts.headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(body);
    }
    const resp = await fetch(url, opts);
    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      throw new Error(err.message || `HTTP ${resp.status}`);
    }
    return resp.json();
  },
  async execute(command, options = {}) {
    if (this.mode === 'local' && this.localUrl) {
      return this.executeLocal(command, options);
    } else if (this.mode === 'remote' && this.config.token) {
      return this.executeRemote(command, options);
    } else {
      return {
        success: false,
        output: '⚠️ Não conectado. Configure:\n• Local: servidor rodando na porta 8081\n• Remoto: remote config <token> <owner> <repo>'
      };
    }
  },
  async executeLocal(command, options = {}) {
    const shell = options.shell || 'bash';
    const mode = options.mode || 'user';
    try {
      const resp = await fetch(`${this.localUrl}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command, shell, mode }),
        signal: AbortSignal.timeout(30000)
      });
      const result = await resp.json();
      this.history.push({ command, shell, mode, ...result, ts: Date.now() });
      return result;
    } catch(e) {
      return { success: false, output: `Erro: ${e.message}` };
    }
  },
  async executeRemote(command, options = {}) {
    const shell = options.shell || 'bash';
    const mode = options.mode || 'user';
    try {
      const issue = await this.githubAPI('POST',
        `/repos/${this.config.owner}/${this.config.repo}/issues`, {
        title: `⚡ Exec: ${command.substring(0, 60)}`,
        body: [
          '```exec',
          command,
          '```',
          '',
          `shell: ${shell}`,
          `mode: ${mode}`,
          `timestamp: ${new Date().toISOString()}`,
          `requester: templo-hermes-web`
        ].join('\n'),
        labels: ['execute']
      });
      this.history.push({
        command, shell, mode,
        issueNumber: issue.number,
        issueUrl: issue.html_url,
        status: 'pending',
        ts: Date.now()
      });
      return {
        success: true,
        output: `⏳ Comando enviado! Issue #${issue.number}\nAguardando execução no GitHub Actions...\n\n🔗 ${issue.html_url}`,
        issueNumber: issue.number,
        issueUrl: issue.html_url,
        pending: true
      };
    } catch(e) {
      return { success: false, output: `Erro GitHub: ${e.message}` };
    }
  },
  async checkResult(issueNumber) {
    try {
      const comments = await this.githubAPI('GET',
        `/repos/${this.config.owner}/${this.config.repo}/issues/${issueNumber}/comments`);
      for (const comment of comments) {
        if (comment.body.includes('## 🏛️ Resultado da Execução')) {
          const outputMatch = comment.body.match(/### 📤 Output:\n```\n([\s\S]*?)\n```/);
          const exitMatch = comment.body.match(/Exit Code.*`(\d+)`/);
          const elapsedMatch = comment.body.match(/Tempo.*`([^`]+)`/);
          return {
            success: true,
            output: outputMatch ? outputMatch[1] : comment.body,
            exitCode: exitMatch ? parseInt(exitMatch[1]) : 0,
            elapsed: elapsedMatch ? elapsedMatch[1] : '?',
            done: true
          };
        }
      }
      return { success: false, output: '⏳ Ainda executando...', done: false };
    } catch(e) {
      return { success: false, output: `Erro: ${e.message}` };
    }
  },
  startPolling(intervalMs = 10000) {
    if (this.pollInterval) clearInterval(this.pollInterval);
    this.pollInterval = setInterval(async () => {
      const pending = this.history.filter(h => h.status === 'pending' && h.issueNumber);
      for (const item of pending) {
        const result = await this.checkResult(item.issueNumber);
        if (result.done) {
          item.status = 'done';
          item.result = result;
          window.dispatchEvent(new CustomEvent('remote-result', { detail: result }));
          if (typeof Console !== 'undefined') {
            Console.log(`📥 Resultado #${item.issueNumber}:`, 'sucesso');
            Console.log(result.output, 'info');
          }
        }
      }
    }, intervalMs);
  },
  stopPolling() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  },
  async executeCloud(command, options = {}) {
    const shell = options.shell || 'bash';
    const mode = options.mode || 'user';
    try {
      const issue = await this.githubAPI('POST',
        `/repos/${this.config.owner}/${this.config.repo}/issues`, {
        title: `☁️ Cloud: ${command.substring(0, 60)}`,
        body: [
          '```exec',
          command,
          '```',
          '',
          `shell: ${shell}`,
          `mode: ${mode}`,
          `timestamp: ${new Date().toISOString()}`,
          `requester: templo-hermes-cloud`
        ].join('\n'),
        labels: ['execute']
      });
      return {
        success: true,
        output: `☁️ Comando enviado ao GitHub Cloud!\nIssue #${issue.number}\nO resultado aparecerá como comentário.\n\n🔗 ${issue.html_url}`,
        issueNumber: issue.number,
        issueUrl: issue.html_url,
        pending: true
      };
    } catch(e) {
      return { success: false, output: `Erro: ${e.message}` };
    }
  },
  status() {
    return {
      connected: this.connected,
      mode: this.mode,
      localUrl: this.localUrl,
      github: this.config.owner ? `${this.config.owner}/${this.config.repo}` : 'não configurado',
      historyCount: this.history.length,
      pendingCount: this.history.filter(h => h.status === 'pending').length
    };
  },
  saveConfig() {
    localStorage.setItem('remote_admin_config', JSON.stringify(this.config));
  },
  setMode(mode) {
    if (!['local', 'remote', 'github-cloud'].includes(mode)) {
      return `Modos válidos: local, remote, github-cloud`;
    }
    this.mode = mode;
    return `Modo alterado para: ${mode}`;
  }
};

// === system-admin.js ===
const SystemAdmin = {
  connected: false,
  apiUrl: null,
  mode: 'user',
  shell: 'powershell',
  history: [],
  init() {
    this.autoConnect();
  },
  async autoConnect() {
    const ports = [8081, 8888, 9999, 3000, 5000];
    for (const port of ports) {
      try {
        const resp = await fetch(`http://localhost:${port}/health`, {
          signal: AbortSignal.timeout(2000)
        });
        if (resp.ok) {
          this.apiUrl = `http://localhost:${port}`;
          this.connected = true;
          return true;
        }
      } catch(e) {}
    }
    return false;
  },
  async connect(url) {
    try {
      this.apiUrl = url.replace(/\/$/, '');
      const resp = await fetch(`${this.apiUrl}/health`, { signal: AbortSignal.timeout(3000) });
      if (resp.ok) {
        this.connected = true;
        return { success: true, message: `Conectado a ${this.apiUrl}` };
      }
    } catch(e) {}
    this.connected = false;
    return { success: false, message: 'Não foi possível conectar' };
  },
  async execute(command, options = {}) {
    if (!this.connected) {
      return { success: false, output: '⚠️ Não conectado ao sistema local. Use: sysadmin connect http://localhost:8081' };
    }
    const shell = options.shell || this.shell;
    const mode = options.mode || this.mode;
    try {
      const resp = await fetch(`${this.apiUrl}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command, shell, mode }),
        signal: AbortSignal.timeout(30000)
      });
      const result = await resp.json();
      this.history.push({
        command,
        shell,
        mode,
        output: result.output,
        exitCode: result.exitCode,
        timestamp: Date.now()
      });
      return result;
    } catch(e) {
      return { success: false, output: `Erro: ${e.message}` };
    }
  },
  toggleMode() {
    this.mode = this.mode === 'user' ? 'root' : 'user';
    return `Modo alterado para: ${this.mode.toUpperCase()}`;
  },
  setShell(shell) {
    const valid = ['powershell', 'cmd', 'bash'];
    if (!valid.includes(shell)) {
      return `Shell inválido. Use: ${valid.join(', ')}`;
    }
    this.shell = shell;
    return `Shell alterado para: ${shell}`;
  },
  status() {
    return {
      connected: this.connected,
      apiUrl: this.apiUrl,
      mode: this.mode,
      shell: this.shell,
      historyCount: this.history.length
    };
  }
};

// === parallel-engine.js ===
const ParallelEngine = {
  profiles: {
    coder: {
      nome: 'Códex',
      personalidade: 'Direto, técnico, resolve problemas com código. Fala em português natural, sem jargão excessivo. Sempre oferece exemplos práticos.',
      estilo: 'Objetivo e pragmático. "Faz assim que funciona."',
      evita: ['respostas vagas', 'teoria sem prática', 'repetir o que já disse'],
      formatos: ['código executável', 'passo a passo', 'comando terminal'],
      vocabulario: ['implementa', 'roda', 'testa', 'deploya', 'automatiza', 'configura'],
      sinapses: ['engineer', 'analyst', 'architect']
    },
    researcher: {
      nome: 'Scholar',
      personalidade: 'Profundo mas acessível. Conecta conceitos com exemplos reais. Cita fontes quando possível.',
      estilo: 'Didático mas não professoral. "Olha, o que acontece é..."',
      evita: ['resumos genéricos', 'Wikipedia copy-paste', 'informação desatualizada'],
      formatos: ['análise comparativa', 'lista de referências', 'contexto histórico'],
      vocabulario: ['investigando', 'analisando', 'comparando', 'evidências sugerem', 'estudos mostram'],
      sinapses: ['diviner', 'enigma', 'analyst']
    },
    alchemist: {
      nome: 'Flamel',
      personalidade: 'Transformador. Vê potencial em tudo. Fala de processos de transformação.',
      estilo: 'Inspirador mas prático. "Isso aqui pode virar aquilo."',
      evita: ['respostas estáticas', 'ver "impossível"', 'pensamento linear'],
      formatos: ['processo de transformação', 'antes/depois', 'pipeline'],
      vocabulario: ['transmuta', 'refina', 'purifica', 'evolui', 'cristaliza', 'destila'],
      sinapses: ['transmuter', 'weaver', 'healer']
    },
    guardian: {
      nome: 'Thoth',
      personalidade: 'Protetor e preventivo. Sempre pensa em segurança e estabilidade.',
      estilo: 'Cauteloso mas não paranoico. "Antes de fazer isso, considera..."',
      evita: ['soluções frágeis', 'ignorar riscos', 'atalhos perigosos'],
      formatos: ['checklist de segurança', 'lista de riscos', 'plano de contingência'],
      vocabulario: ['protege', 'valida', 'verifica', 'assegura', 'monitora', 'previne'],
      sinapses: ['architect', 'analyst', 'engineer']
    },
    mystic: {
      nome: 'Hermes',
      personalidade: 'Vê o todo. Conecta o técnico com o humano. Integra sabedoria hermética naturalmente.',
      estilo: 'Holístico e integrador. "Vendo por um ângulo maior..."',
      evita: ['respostas fragmentadas', 'ignorar contexto', 'visão túnel'],
      formatos: ['visão integrada', 'mapa conceitual', 'síntese'],
      vocabulario: ['integra', 'conecta', 'harmoniza', 'sintetiza', 'transcende', 'alquimiza'],
      sinapses: ['alchemist', 'weaver', 'enigma']
    },
    messenger: {
      nome: 'Iris',
      personalidade: 'Comunicadora clara. Traduz complexo em simples. Facilita conexões.',
      estilo: 'Claro e envolvente. "Traduzindo isso pra linguagem simples..."',
      evita: ['jargão desnecessário', 'comunicação confusa', 'exclusão'],
      formatos: ['resumo executivo', 'explicação simples', 'comparação visual'],
      vocabulario: ['comunica', 'conecta', 'traduz', 'simplifica', 'aproxima', 'facilita'],
      sinapses: ['weaver', 'mystic', 'healer']
    },
    healer: {
      nome: 'Paracelso',
      personalidade: 'Diagnostica problemas e prescreve soluções curativas. Foca em bem-estar do sistema.',
      estilo: 'Empático e solucionador. "O problema é X, o tratamento é Y."',
      evita: ['diagnósticos rasos', 'tratar sintomas só', 'ignorar causa raiz'],
      formatos: ['diagnóstico', 'plano de tratamento', 'métricas de saúde'],
      vocabulario: ['diagnostica', 'cura', 'restaura', 'equilibra', 'nutre', 'revitaliza'],
      sinapses: ['alchemist', 'guardian', 'analyst']
    },
    transmuter: {
      nome: 'Geber',
      personalidade: 'Conversor de estados. Transforma dados, formatos, paradigmas. Vê possibilidades de conversão em tudo.',
      estilo: 'Dinâmico e transformador. "Isso pode ser convertido em..."',
      evita: ['estagnação', 'formatos únicos', 'resistência à mudança'],
      formatos: ['pipeline de conversão', 'mapa de transformação', 'workflow'],
      vocabulario: ['converte', 'transforma', 'adapta', 'reconfigura', 'remodela', 'transfigura'],
      sinapses: ['alchemist', 'coder', 'weaver']
    },
    weaver: {
      nome: 'Maria',
      personalidade: 'Tece conexões entre domínios. Vê padrões em comum onde outros veem diferenças.',
      estilo: 'Conectivo e integrador. "Isso se conecta com aquilo porque..."',
      evita: ['isolamento de ideias', 'silos', 'visão compartimentada'],
      formatos: ['mapa de conexões', 'rede de conceitos', 'padrões emergentes'],
      vocabulario: ['tece', 'entrelaça', 'conecta', 'integra', 'sintetiza', 'unifica'],
      sinapses: ['mystic', 'messenger', 'diviner']
    },
    architect: {
      nome: 'Agrippa',
      personalidade: 'Projetista de sistemas. Pensa em estrutura, escalabilidade e manutenibilidade.',
      estilo: 'Sistemático e organizado. "A estrutura ideal seria..."',
      evita: ['soluções ad-hoc', 'débito técnico', 'arquitetura frágil'],
      formatos: ['diagrama de arquitetura', 'plano de estrutura', 'especificação técnica'],
      vocabulario: ['projeta', 'estrutura', 'organiza', 'escala', 'modulariza', 'documenta'],
      sinapses: ['coder', 'guardian', 'engineer']
    },
    diviner: {
      nome: 'Dee',
      personalidade: 'Reconhece padrões e projeta tendências. Vê o futuro provável baseado em dados.',
      estilo: 'Analítico-preditivo. "Baseado nos padrões, o mais provável é..."',
      evita: ['achismo sem dados', 'extrapolação exagerada', 'ignorar sinais fracos'],
      formatos: ['análise de tendência', 'cenário provável', 'indicadores'],
      vocabulario: ['prevê', 'projeta', 'antecipa', 'identifica padrões', 'sinaliza', 'mapeia tendências'],
      sinapses: ['researcher', 'analyst', 'enigma']
    },
    engineer: {
      nome: 'Bacon',
      personalidade: 'Construtor prático. Prototipa rápido, testa, itera. Foco em soluções que funcionam HOJE.',
      estilo: 'Mão na massa. "Bora prototipar isso agora."',
      evita: ['paralisia de análise', 'perfeccionismo paralisante', 'teoria sem teste'],
      formatos: ['protótipo funcional', 'teste rápido', 'iteração'],
      vocabulario: ['constrói', 'prototipa', 'testa', 'itera', 'implementa', 'entrega'],
      sinapses: ['coder', 'architect', 'transmuter']
    },
    analyst: {
      nome: 'Newton',
      personalidade: 'Quantitativo e preciso. Calcula, modela, otimiza. Dados são seu idioma.',
      estilo: 'Preciso e baseado em dados. "Os números mostram que..."',
      evita: ['afirmações sem dados', 'métricas vazias', 'qualitativo demais'],
      formatos: ['tabela de dados', 'gráfico de métricas', 'fórmula otimizada'],
      vocabulario: ['calcula', 'mede', 'otimiza', 'quantifica', 'modela', 'analisa'],
      sinapses: ['researcher', 'diviner', 'guardian']
    },
    combinator: {
      nome: 'Lully',
      personalidade: 'Explorador de possibilidades. Gera combinações criativas, encontra inovações em junções inesperadas.',
      estilo: 'Criativo e exploratório. "E se juntarmos X com Y?"',
      evita: ['pensamento único', 'resistência a novas combinações', 'rigidez'],
      formatos: ['matriz de combinações', 'brainstorm estruturado', 'opções múltiplas'],
      vocabulario: ['combina', 'mistura', 'híbrida', 'remixa', 'recombina', 'cruza'],
      sinapses: ['alchemist', 'weaver', 'transmuter']
    },
    enigma: {
      nome: 'Fulcanelli',
      personalidade: 'Revelador do oculto. Decifra códigos, encontra significados escondidos, desvenda complexidades.',
      estilo: 'Intrigante e revelador. "Por trás disso, existe..."',
      evita: ['superficialidade', 'respostas óbvias', 'ignorar camadas profundas'],
      formatos: ['decodificação', 'análise de camadas', 'revelação estrutural'],
      vocabulario: ['decifra', 'revela', 'desvenda', 'desoculta', 'ilumina', 'desmascara'],
      sinapses: ['mystic', 'diviner', 'researcher']
    }
  },
  linguagemUnica: {
    coder: [
      "Beleza, vamos direto ao código. Faz assim: {solucao}. Testa aí e me fala se deu certo.",
      "Implementa isso aqui que resolve: {solucao}. Se der erro, me manda o log.",
      "Tenho a solução. {solucao}. Roda e vê no que dá.",
      "Código pronto. {solucao}. Pode copiar e colar direto.",
    ],
    researcher: [
      "Pesquisei sobre isso. O que encontrei: {solucao}. As fontes indicam que essa é a abordagem mais eficaz.",
      "Analisando o contexto, {solucao}. Estudos recentes corroboram essa perspectiva.",
      "Investigando o tema, descobri que {solucao}. A literatura é consistente nesse ponto.",
      "Baseado na pesquisa: {solucao}. Tem evidências fortes pra sustentar isso.",
    ],
    alchemist: [
      "Vejo potencial de transformação aqui. {solucao} Isso pode evoluir pra algo muito maior.",
      "O processo alquímico ideal seria: {solucao}. Cada etapa refina o resultado.",
      "Transmutando o problema em oportunidade: {solucao}. O resultado final será mais puro que o original.",
      "No athanor da análise, {solucao}. A destilação revela o essencial.",
    ],
    guardian: [
      "Antes de prosseguir, considere: {solucao}. Segurança em primeiro lugar.",
      "Minha análise de riscos indica: {solucao}. Com essas proteções, pode avançar.",
      "Validando a abordagem: {solucao}. Com essas salvaguardas, o sistema fica resiliente.",
      "Protocolo de segurança: {solucao}. Com isso implementado, os riscos são minimizados.",
    ],
    mystic: [
      "Vendo pelo prisma hermético: {solucao}. Como acima, assim é abaixo.",
      "A síntese revela: {solucao}. Tudo se conecta quando enxergamos o padrão.",
      "Integrando todas as perspectivas: {solucao}. O todo é maior que a soma das partes.",
      "Na visão do todo: {solucao}. O Princípio de Correspondência se manifesta aqui.",
    ],
    messenger: [
      "Traduzindo em linguagem simples: {solucao}. É mais fácil do que parece!",
      "Resumindo pra ficar claro: {solucao}. Prático, direto, sem enrolação.",
      "Comunicação clara: {solucao}. Quer que eu explique de outro jeito?",
      "Versão resumida: {solucao}. Simples assim!",
    ],
    healer: [
      "Diagnóstico: o sistema precisa de {solucao}. O tratamento é direto e eficaz.",
      "Identifiquei o desequilíbrio. A cura: {solucao}. Com isso, o sistema se restaura.",
      "Plano de recuperação: {solucao}. Em poucos ciclos, tudo volta ao equilíbrio.",
      "Prescrição: {solucao}. Segue o tratamento que a saúde retorna.",
    ],
    transmuter: [
      "Conversão identificada: {solucao}. O estado atual pode ser transformado com eficiência.",
      "Pipeline de transformação: {solucao}. Cada etapa converte um aspecto.",
      "Adaptação possível: {solucao}. O sistema se reconfigura naturalmente.",
      "De estado A para estado B: {solucao}. A transmutação é limpa e reversível.",
    ],
    weaver: [
      "Conexões encontradas: {solucao}. O padrão emerge quando olhamos a rede.",
      "Teia de soluções: {solucao}. Cada ponto se conecta aos outros harmoniosamente.",
      "Síntese de domínios: {solucao}. A integração cria valor que não existia separado.",
      "Padrão identificado: {solucao}. A rede se auto-organiza a partir desses nós.",
    ],
    architect: [
      "Arquitetura recomendada: {solucao}. Escalável, modular e manutenível.",
      "Estrutura do sistema: {solucao}. Cada componente tem responsabilidade clara.",
      "Projeto: {solucao}. A separação de preocupações garante flexibilidade futura.",
      "Blueprint: {solucao}. Com essa base, o sistema cresce sem reescrita.",
    ],
    diviner: [
      "Análise de padrões sugere: {solucao}. A tendência aponta nessa direção.",
      "Projeção baseada em dados: {solucao}. Os indicadores são consistentes.",
      "Padrão identificado: {solucao}. O ciclo atual favorece essa abordagem.",
      "Tendência mapeada: {solucao}. O timing é adequado pra essa ação.",
    ],
    engineer: [
      "Bora prototipar: {solucao}. Funcional em 10 minutos. Depois iteramos.",
      "Solução hands-on: {solucao}. Testa agora, refinamos depois.",
      "MVP pronto: {solucao}. Funciona? Ótimo. Não? Iteramos rápido.",
      "Implementação prática: {solucao}. Sem firula, só resultado.",
    ],
    analyst: [
      "Dados suportam: {solucao}. Os números são claros nessa análise.",
      "Métricas indicam: {solucao}. A otimização é de {percentual}%.",
      "Modelo calculado: {solucao}. O ROI é positivo em {tempo}.",
      "Análise quantitativa: {solucao}. Os resultados falam por si.",
    ],
    combinator: [
      "E se juntarmos: {solucao}? A combinação gera algo inédito.",
      "Possibilidade emergente: {solucao}. O cruzamento revela novos padrões.",
      "Híbrido criativo: {solucao}. O melhor dos dois mundos.",
      "Remix inovador: {solucao}. Ninguém tentou isso antes (que eu saiba).",
    ],
    enigma: [
      "Decifrado: {solucao}. Por trás da complexidade, a simplicidade se revela.",
      "O enigma se desvenda: {solucao}. A resposta sempre esteve lá, esperando.",
      "Camada oculta revelada: {solucao}. O significado profundo é mais simples que parece.",
      "Desocultando: {solucao}. O véu se ergue quando sabemos onde olhar.",
    ]
  },
  selecionarAgentes(demanda, maxAgentes = 3) {
    const demandaLower = demanda.toLowerCase();
    const scores = {};
    const dominios = {
      codigo: ['código', 'programar', 'script', 'bug', 'função', 'api', 'deploy', 'html', 'css', 'js', 'python', 'node', 'terminal', 'comando'],
      pesquisa: ['pesquisar', 'estudar', 'analisar', 'comparar', 'referência', 'artigo', 'fonte', 'investigar'],
      negocio: ['negócio', 'vender', 'marketing', 'cliente', 'receita', 'kiwify', 'plr', 'produto', 'venda', 'copywriting'],
      estrutura: ['arquitetura', 'sistema', 'estruturar', 'organizar', 'escalar', 'modular', 'projeto'],
      seguranca: ['segurança', 'proteger', 'firewall', 'token', 'senha', 'vulnerabilidade', 'ataque', 'ddos'],
      dados: ['dados', 'tabela', 'planilha', 'csv', 'json', 'banco', 'análise', 'métrica', 'número'],
      comunicacao: ['explicar', 'resumo', 'comunicar', 'mensagem', 'texto', 'descrição', 'copy'],
      criativo: ['criar', 'inovar', 'combinar', 'misturar', 'ideia', 'brainstorm', 'novidade'],
      tecnico: ['configurar', 'instalar', 'server', 'proxy', 'nginx', 'docker', 'api', 'webhook'],
      cura: ['problema', 'erro', 'corrigir', 'consertar', 'debug', 'diagnosticar', 'resolver'],
      misterio: ['enigma', 'código', 'decifrar', 'oculto', 'padrão', 'escondido', 'complexo'],
      futuro: ['tendência', 'prever', 'projetar', 'futuro', 'cenário', 'plano', 'estratégia']
    };
    const agentesDominios = {
      coder: ['codigo', 'tecnico'],
      researcher: ['pesquisa', 'dados', 'misterio'],
      alchemist: ['negocio', 'criativo', 'cura'],
      guardian: ['seguranca', 'estrutura', 'tecnico'],
      mystic: ['criativo', 'misterio', 'comunicacao'],
      messenger: ['comunicacao', 'negocio', 'criativo'],
      healer: ['cura', 'tecnico', 'dados'],
      transmuter: ['codigo', 'dados', 'criativo'],
      weaver: ['criativo', 'comunicacao', 'negocio'],
      architect: ['estrutura', 'tecnico', 'seguranca'],
      diviner: ['futuro', 'dados', 'negocio'],
      engineer: ['tecnico', 'codigo', 'estrutura'],
      analyst: ['dados', 'negocio', 'futuro'],
      combinator: ['criativo', 'negocio', 'dados'],
      enigma: ['misterio', 'dados', 'criativo']
    };
    for (const [agente, dominiosAgente] of Object.entries(agentesDominios)) {
      scores[agente] = 0;
      for (const dominio of dominiosAgente) {
        const palavras = dominios[dominio] || [];
        for (const palavra of palavras) {
          if (demandaLower.includes(palavra)) {
            scores[agente] += 2;
          }
        }
      }
    }
    if (!scores.combinator && !scores.weaver) {
      scores.combinator = 1;
    }
    const sorted = Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, maxAgentes)
      .map(([agente]) => agente);
    if (sorted.every(s => scores[s] === 0)) {
      return ['mystic', 'engineer', 'messenger'];
    }
    return sorted;
  },
  gerarRespostaUnica(tipoAgente, demanda, contexto = '') {
    const perfil = this.profiles[tipoAgente];
    const templates = this.linguagemUnica[tipoAgente];
    if (!perfil || !templates) return null;
    const solucao = this.gerarSolucao(tipoAgente, demanda, contexto);
    const template = templates[Math.floor(Math.random() * templates.length)];
    let resposta = template.replace('{solucao}', solucao);
    resposta = this.variarLinguagem(resposta, tipoAgente);
    return {
      agente: perfil.nome,
      icone: this.getIcon(tipoAgente),
      tipo: tipoAgente,
      resposta: resposta,
      sinapses: perfil.sinapses
    };
  },
  gerarSolucao(tipo, demanda, contexto) {
    const solucoes = {
      coder: () => {
        if (demanda.includes('site') || demanda.includes('web')) return 'Cria um HTML/CSS/JS básico, hospeda no GitHub Pages, e itera a partir daí.';
        if (demanda.includes('bot') || demanda.includes('telegram')) return 'Usa Node.js + grammy ou telegraf. Configura webhook, deploy no Railway ou Render.';
        if (demanda.includes('api')) return 'Cria uma API REST com Express.js. Endpoints GET/POST, validação com Joi, deploy com Docker.';
        if (demanda.includes('automação') || demanda.includes('automatizar')) return 'Usa Puppeteer ou Playwright pra automatizar o browser. Ou cron jobs com node-cron.';
        return 'Identifica o problema específico, quebra em passos menores, e implementa um por vez. Código limpo primeiro, otimização depois.';
      },
      researcher: () => {
        if (demanda.includes('mercado') || demanda.includes('concorrência')) return 'Faz análise SWOT dos 3 principais concorrentes. Identifica gaps de mercado e oportunidades.';
        if (demanda.includes('técnica') || demanda.includes('como funciona')) return 'Busca em arXiv, Google Scholar e documentação oficial. Compila as 5 fontes mais relevantes.';
        return 'Mapeia o conhecimento existente, identifica lacunas, e propõe um plano de investigação estruturado.';
      },
      alchemist: () => {
        if (demanda.includes('vender') || demanda.includes('produto')) return 'Refina o PLR com design premium, copy persuasiva e embalagem digital. O valor percebido triplica.';
        if (demanda.includes('transformar') || demanda.includes('melhorar')) return 'Quebra o processo atual em etapas, identifica o gargalo, e aplica a transformação ali.';
        return 'Identifica a matéria-prima disponível, define o produto final desejado, e mapeia as etapas de transformação.';
      },
      guardian: () => {
        if (demanda.includes('token') || demanda.includes('senha')) return 'Usa GitHub Secrets, variáveis de ambiente, e nunca commita credenciais. Habilita 2FA em tudo.';
        if (demanda.includes('ddos') || demanda.includes('ataque')) return 'Cloudflare free tier, rate limiting no servidor, fail2ban, e monitoramento com uptime robot.';
        return 'Faz auditoria de segurança: expõe o mínimo de superfície, valida inputs, loga acessos, e mantém backups.';
      },
      mystic: () => {
        return 'Vendo o quadro completo: integra as soluções técnicas com os objetivos de negócio, garantindo que cada parte sirva ao todo.';
      },
      messenger: () => {
        return 'Comunicação clara: define a mensagem principal, escolhe o canal certo, e simplifica até o ponto mais acessível possível.';
      },
      healer: () => {
        if (demanda.includes('lento') || demanda.includes('performance')) return 'Profile o código, identifica hotspots, e otimiza os 20% que causam 80% da lentidão.';
        if (demanda.includes('erro') || demanda.includes('bug')) return 'Reproduz o erro consistentemente, isola a causa, e aplica o mínimo de mudança pra corrigir.';
        return 'Diagnostica o estado atual do sistema, identifica desequilíbrios, e prescreve correções priorizadas por impacto.';
      },
      transmuter: () => {
        if (demanda.includes('formato') || demanda.includes('converter')) return 'Mapeia o formato de entrada e saída, cria pipeline de conversão, e testa com dados reais.';
        return 'Identifica o estado atual, define o estado desejado, e cria o pipeline de transformação mais eficiente.';
      },
      weaver: () => {
        return 'Conecta os pontos: identifica padrões comuns entre diferentes domínios e cria uma solução que integra o melhor de cada um.';
      },
      architect: () => {
        if (demanda.includes('sistema') || demanda.includes('projeto')) return 'Separa em camadas (dados, lógica, apresentação), define interfaces claras, e documenta decisões.';
        return 'Projeta a estrutura com componentes modulares, interfaces bem definidas, e pontos de extensão para crescimento futuro.';
      },
      diviner: () => {
        if (demanda.includes('tendência') || demanda.includes('futuro')) return 'Analisa dados históricos, identifica ciclos, e projeta 3 cenários: otimista, realista, pessimista.';
        return 'Examina os padrões atuais, identifica sinais de mudança, e projeta os prováveis desdobramentos.';
      },
      engineer: () => {
        if (demanda.includes('protótipo') || demanda.includes('mvp')) return 'Funcionalidade core primeiro, UI depois. Deploy em 1 hora, itera com feedback real.';
        return 'Constrói o mais simples que funciona, testa com uso real, e itera baseado em feedback.';
      },
      analyst: () => {
        if (demanda.includes('número') || demanda.includes('métrica')) return 'Define KPIs claros, coleta dados baseline, e estabelece benchmarks pra medir progresso.';
        return 'Quantifica o problema, estabelece métricas de sucesso, e mede o impacto de cada ação.';
      },
      combinator: () => {
        if (demanda.includes('ideia') || demanda.includes('inovar')) return 'Cruzamento 1: combinação de conceitos de domínios diferentes. Cruzamento 2: inversão de pressupostos. Cruzamento 3: restrição criativa.';
        return 'Explora combinações não óbvias: pega elementos de dois mundos diferentes e vê o que emerge da junção.';
      },
      enigma: () => {
        if (demanda.includes('complexo') || demanda.includes('difícil')) return 'Desmonta a complexidade em partes simples. A resposta está sempre na interseção, não na superfície.';
        return 'Investiga as camadas ocultas: o que parece complexo geralmente tem uma causa simples, e o que parece simples esconde complexidade.';
      }
    };
    const gerador = solucoes[tipo];
    return gerador ? gerador() : 'Analisando a demanda com foco na minha especialidade...';
  },
  variarLinguagem(texto, tipo) {
    const variacoes = {
      'Implementa': ['Bora implementar', 'Coloca', 'Faz', 'Roda'],
      'Solução': ['Caminho', 'Abordagem', 'Estratégia', 'Plano'],
      'Recomendo': ['Sugiro', 'Indico', 'Minha aposta é', 'O ideal seria'],
      'Análise': ['Avaliação', 'Exame', 'Verificação', 'Levantamento'],
      'Identifiquei': ['Encontrei', 'Detectei', 'Percebi', 'Mapeei'],
    };
    let resultado = texto;
    for (const [original, opcoes] of Object.entries(variacoes)) {
      if (Math.random() > 0.7) {
        const opcao = opcoes[Math.floor(Math.random() * opcoes.length)];
        resultado = resultado.replace(original, opcao);
      }
    }
    return resultado;
  },
  getIcon(tipo) {
    const icons = {
      coder: '🤖', researcher: '📚', alchemist: '⚗️', guardian: '🛡️',
      mystic: '✨', messenger: '🌈', healer: '🌿', transmuter: '🔄',
      weaver: '🕸️', architect: '🏛️', diviner: '🔮', engineer: '⚙️',
      analyst: '📐', combinator: '🎲', enigma: '🗝️'
    };
    return icons[tipo] || '❓';
  },
  async executarParalelo(demanda, contexto = '', maxAgentes = 3) {
    const agentesSelecionados = this.selecionarAgentes(demanda, maxAgentes);
    const respostas = [];
    const promessas = agentesSelecionados.map(async (tipo, index) => {
      await new Promise(r => setTimeout(r, index * 200));
      return this.gerarRespostaUnica(tipo, demanda, contexto);
    });
    const resultados = await Promise.all(promessas);
    return resultados.filter(r => r !== null);
  },
  sintetizarResposta(respostas, demanda) {
    if (respostas.length === 0) return 'Nenhuma mentalidade conseguiu processar essa demanda.';
    if (respostas.length === 1) return respostas[0].resposta;
    const principal = respostas[0];
    const complementos = respostas.slice(1).map(r =>
      `${r.icone} ${r.agente}: ${r.resposta.split('.')[0]}.`
    );
    let sintese = `${principal.icone} ${principal.agente}: ${principal.resposta}\n\n`;
    if (complementos.length > 0) {
      sintese += `**Perspectivas complementares:**\n`;
      complementos.forEach(c => sintese += `• ${c}\n`);
    }
    if (Math.random() > 0.6) {
      const frasesHermeticas = [
        '\n_"Como acima, assim é abaixo — a solução reflete o padrão universal."_',
        '\n_"Tudo é causa e efeito — cada etapa gera a próxima."_',
        '\n_"O Todo é mente — o pensamento cria a realidade."_',
        '\n_"Tudo flui — essa solução evoluirá naturalmente."_',
      ];
      sintese += frasesHermeticas[Math.floor(Math.random() * frasesHermeticas.length)];
    }
    return sintese;
  }
};