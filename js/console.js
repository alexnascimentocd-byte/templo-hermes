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

    const partes = trimmed.split(/\s+/);
    const comando = partes[0].toLowerCase();
    const args = partes.slice(1);

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
      default:
        this.log(`❌ Comando desconhecido: "${comando}". Digite "ajuda" para ver os comandos.`, 'erro');
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
      this.log(`💭 Pensamento registrado: "${msg}"`, 'sucesso');
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
║  info         — Sobre o templo        ║
║  limpar       — Limpar este terminal  ║
║  ajuda        — Esta mensagem         ║
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
  }
};
