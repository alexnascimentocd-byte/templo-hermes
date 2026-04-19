/* ===== INBOX.JS - Caixa de Entrada do Mestre ===== */
/* Mensagens formatadas: conclusões, pensamentos, mensagens de agentes */

const Inbox = {
  messages: [],
  maxMessages: 200,
  currentFilter: 'all',
  unreadCount: 0,

  // Tipos de mensagem
  types: {
    council: { icon: '☤', label: 'Conselho', color: '#ffcc00' },
    thought: { icon: '💭', label: 'Pensamento', color: '#8a4aff' },
    agent_msg: { icon: '📨', label: 'Agente', color: '#4a8aff' },
    system: { icon: '⚙️', label: 'Sistema', color: '#888' },
    decision: { icon: '📜', label: 'Decisão', color: '#ff8a4a' },
    insight: { icon: '💡', label: 'Insight', color: '#4aff8a' }
  },

  // Adicionar mensagem à caixa de entrada
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

    this.messages.unshift(msg); // Mais recente primeiro

    // Limitar tamanho
    if (this.messages.length > this.maxMessages) {
      this.messages = this.messages.slice(0, this.maxMessages);
    }

    this.unreadCount++;

    // Atualizar badge
    this.updateBadge();

    // Atualizar UI se visível
    const panel = document.getElementById('inbox-panel');
    if (panel && !panel.classList.contains('hidden')) {
      this.render();
    }

    return msg;
  },

  // Registrar conclusão de conselho
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

  // Registrar pensamento rápido do Mestre
  addThought(text) {
    this.add('thought', 'Pensamento do Mestre', text, {
      author: 'Zói',
      timestamp: Date.now()
    });
  },

  // Registrar mensagem de agente
  addAgentMessage(agentName, agentIcon, message) {
    this.add('agent_msg', `${agentIcon} ${agentName}`, message, {
      agent: agentName
    });
  },

  // Registrar mensagem de sistema
  addSystem(title, content) {
    this.add('system', title, content);
  },

  // Registrar insight/descoberta
  addInsight(title, content) {
    this.add('insight', `💡 ${title}`, content);
  },

  // Marcar como lida
  markRead(msgId) {
    const msg = this.messages.find(m => m.id === msgId);
    if (msg && !msg.read) {
      msg.read = true;
      this.unreadCount = Math.max(0, this.unreadCount - 1);
      this.updateBadge();
    }
  },

  // Marcar todas como lidas
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

  // Favoritar
  toggleStar(msgId) {
    const msg = this.messages.find(m => m.id === msgId);
    if (msg) {
      msg.starred = !msg.starred;
      this.render();
    }
  },

  // Deletar mensagem
  delete(msgId) {
    this.messages = this.messages.filter(m => m.id !== msgId);
    this.render();
  },

  // Limpar todas
  clear() {
    this.messages = [];
    this.unreadCount = 0;
    this.updateBadge();
    this.render();
  },

  // Filtrar
  setFilter(filter) {
    this.currentFilter = filter;
    this.render();

    // Atualizar botões ativos
    document.querySelectorAll('.inbox-filter').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filter);
    });
  },

  // Obter mensagens filtradas
  getFiltered() {
    if (this.currentFilter === 'all') return this.messages;
    if (this.currentFilter === 'starred') return this.messages.filter(m => m.starred);
    return this.messages.filter(m => m.type === this.currentFilter);
  },

  // Atualizar badge de não lidas
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

  // Renderizar lista de mensagens
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

      // Formatar conteúdo com quebras de linha e estilo
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

    // Scroll pro topo (mais recente)
    list.scrollTop = 0;
  },

  // Inicializar
  init() {
    // Mensagem de boas-vindas
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

  // Configurar UI
  setupUI() {
    const btnInbox = document.getElementById('btn-inbox');
    const inboxPanel = document.getElementById('inbox-panel');
    const closeInbox = document.getElementById('close-inbox');
    const sendBtn = document.getElementById('inbox-send');
    const input = document.getElementById('inbox-input');
    const markReadBtn = document.getElementById('inbox-mark-read');
    const clearBtn = document.getElementById('inbox-clear');

    // Abrir/fechar painel
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

    // Enviar pensamento
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

    // Marcar todos lidos
    if (markReadBtn) {
      markReadBtn.addEventListener('click', () => this.markAllRead());
    }

    // Limpar
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm('Limpar todas as mensagens?')) {
          this.clear();
        }
      });
    }

    // Filtros
    document.querySelectorAll('.inbox-filter').forEach(btn => {
      btn.addEventListener('click', () => {
        this.setFilter(btn.dataset.filter);
      });
    });
  }
};
