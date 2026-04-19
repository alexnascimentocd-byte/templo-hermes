/* ===== CONSOLE.JS - Terminal do Grimório Mestre ===== */

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

    // Log do comando
    this.log(`Zói@templo:~$ ${trimmed}`, 'input');

    // Parse
    const parts = trimmed.split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Executar
    switch (command) {
      case 'status': this.cmdStatus(); break;
      case 'agents': case 'agentes': this.cmdAgents(args); break;
      case 'summon': case 'invocar': this.cmdSummon(args); break;
      case 'dismiss': case 'dispensar': this.cmdDismiss(args); break;
      case 'council': case 'conselho': this.cmdCouncil(args); break;
      case 'tools': case 'ferramentas': this.cmdTools(); break;
      case 'inbox': case 'mensagens': this.cmdInbox(); break;
      case 'evolve': case 'evoluir': this.cmdEvolve(args); break;
      case 'energy': case 'energia': this.cmdEnergy(args); break;
      case 'clear': case 'limpar': this.clearOutput(); break;
      case 'help': case 'ajuda': this.cmdHelp(); break;
      case 'chat': this.cmdChat(args); break;
      case 'read': this.cmdRead(args); break;
      case 'write': this.cmdWrite(args); break;
      case 'runes': case 'runas': this.cmdRunes(); break;
      case 'zones': case 'zonas': this.cmdZones(); break;
      case 'spawn': this.cmdSpawnAll(); break;
      case 'fs': case 'arquivos': this.cmdFileSystem(args); break;
      default:
        this.log(`❌ Comando desconhecido: "${command}". Digite "help" para ajuda.`, 'error');
    }
  },

  // === COMANDOS ===

  cmdStatus() {
    const active = Agents.active.length;
    const roster = Agents.roster.length;
    const councilStatus = Council.getStatus();
    const mcpStatus = MCPTools.getStatus();

    this.log(`
╔═══════════════════════════════════════╗
║  🏛️ STATUS DO TEMPLO                 ║
╠═══════════════════════════════════════╣
║  Agentes Ativos: ${String(active).padStart(2)}/15              ║
║  Total no Roster: ${String(roster).padStart(2)}              ║
║  Conselho: ${councilStatus.active ? '🔴 EM SESSÃO' : '🟢 Livre'}            ║
║  Decisões: ${String(councilStatus.pastDecisions).padStart(3)}                  ║
║  Energia MCP: ${mcpStatus.energy.current}/${mcpStatus.energy.max}           ║
║  Ferramentas: ${String(mcpStatus.totalTools).padStart(2)}                   ║
║  Inbox: ${typeof Inbox !== 'undefined' ? Inbox.messages.length : 0} msgs                    ║
╚═══════════════════════════════════════╝`, 'info');
  },

  cmdAgents(args) {
    if (args[0] === 'reserve' || args[0] === 'reserva') {
      const inactive = Agents.roster.filter(a => !Agents.active.find(ac => ac.id === a.id));
      this.log(`💤 Agentes em Reserva (${inactive.length}):`, 'info');
      inactive.forEach(a => {
        this.log(`  ${a.icon} ${a.name} (${a.skill}) — Nível ${a.level} — ID: ${a.id}`, 'agent');
      });
      return;
    }

    this.log(`👥 Agentes Ativos (${Agents.active.length}/15):`, 'info');
    Agents.active.forEach(a => {
      const zone = World.getZoneAt(Math.floor(a.x), Math.floor(a.y));
      this.log(`  ${a.icon} ${a.name} | ${a.skill} | Nv.${a.level} | ${a.currentAction} | ${zone?.name || '?'}`, 'agent');
    });
    this.log(`\n  💤 Reserva: ${Agents.roster.length - Agents.active.length} (use "agents reserva" para ver)`, 'dim');
  },

  cmdSummon(args) {
    if (!args[0]) {
      this.log('❌ Uso: summon [tipo] ou summon all', 'error');
      this.log('Tipos: coder, researcher, alchemist, guardian, mystic, messenger, healer, transmuter, weaver, architect, diviner, engineer, analyst, combinator, enigma', 'dim');
      return;
    }

    if (args[0] === 'all' || args[0] === 'todos') {
      this.cmdSpawnAll();
      return;
    }

    const agent = Agents.roster.find(a => a.type === args[0] || a.name.toLowerCase() === args[0].toLowerCase());
    if (!agent) {
      this.log(`❌ Agente "${args[0]}" não encontrado.`, 'error');
      return;
    }

    if (Agents.active.find(a => a.id === agent.id)) {
      this.log(`⚠️ ${agent.name} já está ativo no templo.`, 'warn');
      return;
    }

    Agents.spawn(agent.id);
    this.log(`✅ ${agent.icon} ${agent.name} invocado ao templo!`, 'success');
  },

  cmdDismiss(args) {
    if (!args[0]) {
      this.log('❌ Uso: dismiss [id ou nome]', 'error');
      return;
    }

    const agent = Agents.active.find(a => a.id.includes(args[0]) || a.name.toLowerCase().includes(args[0].toLowerCase()));
    if (!agent) {
      this.log(`❌ Agente "${args[0]}" não está ativo.`, 'error');
      return;
    }

    Agents.despawn(agent.id);
    this.log(`🚪 ${agent.icon} ${agent.name} dispensado do templo.`, 'info');
  },

  cmdCouncil(args) {
    if (!args[0]) {
      const status = Council.getStatus();
      this.log(`☤ Status do Conselho:`, 'info');
      this.log(`  Ativo: ${status.active ? 'Sim' : 'Não'}`, 'info');
      this.log(`  Tópico: ${status.topic}`, 'info');
      this.log(`  Rodada: ${status.round}/5`, 'info');
      this.log(`  Participantes: ${status.participants}`, 'info');
      this.log(`\n  Use "council [tópico]" para convocar`, 'dim');
      this.log(`  Tópicos: transmutacao, mcp_limites, correspondencia, vibracao, polaridade, ritmo, causa_efeito, ferramentas_mcp`, 'dim');
      return;
    }

    const topicId = args[0];
    Council.convene(topicId);
    this.log(`☤ Conselho convocado: "${topicId}"`, 'success');
  },

  cmdTools() {
    const status = MCPTools.getStatus();
    this.log(`🔧 Ferramentas MCP (${status.totalTools} disponíveis):`, 'info');
    this.log(`  Energia: ${status.energy.current}/${status.energy.max} (${status.energy.percentage})`, 'info');
    this.log(`  Categorias: ${status.categories.join(', ')}`, 'info');

    Object.entries(MCPTools.registry).forEach(([id, tool]) => {
      this.log(`  ${tool.icon} ${tool.name} [${tool.category}] — Custo: ${tool.cost} — ${tool.description.substring(0, 50)}...`, 'dim');
    });
  },

  cmdInbox() {
    if (typeof Inbox === 'undefined') {
      this.log('❌ Inbox não disponível.', 'error');
      return;
    }
    const unread = Inbox.messages.filter(m => !m.read).length;
    this.log(`📬 Inbox: ${Inbox.messages.length} mensagens (${unread} não lidas)`, 'info');
    Inbox.messages.slice(0, 5).forEach(msg => {
      const typeInfo = Inbox.types[msg.type] || Inbox.types.system;
      this.log(`  ${typeInfo.icon} ${msg.title} ${msg.read ? '' : '(não lida)'}`, msg.read ? 'dim' : 'agent');
    });
    if (Inbox.messages.length > 5) {
      this.log(`  ... e mais ${Inbox.messages.length - 5}`, 'dim');
    }
  },

  cmdEvolve(args) {
    if (!args[0]) {
      this.log('❌ Uso: evolve [id ou nome]', 'error');
      return;
    }
    const agent = Agents.active.find(a => a.id.includes(args[0]) || a.name.toLowerCase().includes(args[0].toLowerCase()));
    if (!agent) {
      this.log(`❌ Agente "${args[0]}" não encontrado.`, 'error');
      return;
    }
    Agents.gainExperience(agent, agent.expToNext);
    this.log(`⬆️ ${agent.icon} ${agent.name} evoluiu para Nível ${agent.level}!`, 'success');
  },

  cmdEnergy(args) {
    if (args[0] === 'set' && args[1]) {
      MCPTools.energy.current = parseInt(args[1]) || MCPTools.energy.current;
      this.log(`⚡ Energia definida para ${MCPTools.energy.current}`, 'success');
      return;
    }
    if (args[0] === 'fill' || args[0] === 'max') {
      MCPTools.energy.current = MCPTools.energy.max;
      this.log(`⚡ Energia máxima restaurada: ${MCPTools.energy.current}`, 'success');
      return;
    }
    this.log(`⚡ Energia MCP: ${MCPTools.energy.current}/${MCPTools.energy.max} (${MCPTools.energy.getStatus().percentage})`, 'info');
  },

  cmdChat(args) {
    const msg = args.join(' ');
    if (!msg) {
      this.log('❌ Uso: chat [mensagem] — envia para o chat de prioridade', 'error');
      return;
    }
    PriorityChat.addMessage('👑 Zói', msg, 4);
    this.log(`💬 Mensagem enviada: "${msg}"`, 'success');
  },

  cmdRead(args) {
    if (!args[0]) {
      const files = MCPFileSystem.list();
      this.log(`📖 Arquivos disponíveis (${files.length}):`, 'info');
      files.forEach(f => this.log(`  📄 ${f.name} (${f.content.length} chars) — por ${f.author}`, 'dim'));
      return;
    }
    const file = MCPFileSystem.read(args[0]);
    if (!file) {
      this.log(`❌ Arquivo "${args[0]}" não encontrado.`, 'error');
      return;
    }
    this.log(`📄 ${file.name} (por ${file.author}):`, 'info');
    this.log(file.content, 'dim');
  },

  cmdWrite(args) {
    if (args.length < 2) {
      this.log('❌ Uso: write [arquivo] [conteúdo...]', 'error');
      return;
    }
    const path = args[0];
    const content = args.slice(1).join(' ');
    MCPFileSystem.write(path, content, 'Zói');
    this.log(`✍️ Arquivo "${path}" escrito (${content.length} chars).`, 'success');
  },

  cmdRunes() {
    this.log(`✦ Runas no sistema:`, 'info');
    Agents.active.forEach(a => {
      if (a.runes.length > 0) {
        this.log(`  ${a.icon} ${a.name}: ${a.runes.map(r => r.symbol).join(' ')}`, 'agent');
      }
    });
  },

  cmdZones() {
    this.log(`🗺️ Zonas do Templo:`, 'info');
    Object.values(World.zones).forEach(z => {
      this.log(`  ${z.icon || '▪'} ${z.name} (Nível ${z.requiredLevel || 1})`, 'info');
    });
  },

  cmdSpawnAll() {
    let count = 0;
    Agents.roster.forEach(a => {
      if (!Agents.active.find(ac => ac.id === a.id)) {
        Agents.spawn(a.id);
        count++;
      }
    });
    this.log(`👥 ${count} agentes adicionados! Total: ${Agents.active.length}/15`, 'success');
  },

  cmdFileSystem(args) {
    if (!args[0]) {
      this.log('Uso: fs [list|read|write|search] [args...]', 'error');
      return;
    }
    switch (args[0]) {
      case 'list': this.cmdRead([]); break;
      case 'read': this.cmdRead(args.slice(1)); break;
      case 'write': this.cmdWrite(args.slice(1)); break;
      case 'search':
        const results = MCPFileSystem.search(args.slice(1).join(' '));
        this.log(`🔍 ${results.length} arquivo(s) encontrado(s):`, 'info');
        results.forEach(r => this.log(`  📄 ${r.file} (${r.matches} matches)`, 'dim'));
        break;
    }
  },

  cmdHelp() {
    this.log(`
╔═══════════════════════════════════════╗
║  📖 COMANDOS DO GRIMÓRIO MESTRE      ║
╠═══════════════════════════════════════╣
║  status        — Status do templo     ║
║  agents        — Listar agentes       ║
║  agents reserva — Ver em reserva      ║
║  summon [tipo] — Invocar agente       ║
║  summon all    — Invocar todos        ║
║  dismiss [id]  — Dispensar agente     ║
║  council       — Status conselho      ║
║  council [id]  — Convocar conselho    ║
║  tools         — Listar ferramentas   ║
║  inbox         — Ver mensagens        ║
║  evolve [id]   — Evoluir agente       ║
║  energy        — Ver energia MCP      ║
║  energy fill   — Restaurar energia    ║
║  chat [msg]    — Enviar mensagem      ║
║  read [file]   — Ler arquivo MCP      ║
║  write [f] [c] — Escrever arquivo     ║
║  runes         — Ver runas ativas     ║
║  zones         — Listar zonas         ║
║  fs search [p] — Buscar em arquivos   ║
║  clear         — Limpar terminal      ║
║  help          — Esta ajuda           ║
╚═══════════════════════════════════════╝`, 'info');
  },

  // === UI ===

  log(text, type = 'normal') {
    const output = document.getElementById('console-output');
    if (!output) return;

    const colors = {
      normal: '#ccc',
      input: '#4aff4a',
      success: '#44ff44',
      error: '#ff4444',
      warn: '#ffaa00',
      info: '#4a8aff',
      agent: '#ffcc00',
      dim: '#888'
    };

    const div = document.createElement('div');
    div.style.cssText = `color:${colors[type] || colors.normal};white-space:pre-wrap;line-height:1.6;font-size:8px;margin:2px 0`;
    div.textContent = text;
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
  },

  clearOutput() {
    const output = document.getElementById('console-output');
    if (output) output.innerHTML = '';
    this.log('🧹 Terminal limpo.', 'dim');
  },

  // Inicializar UI
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
