/* ===== MAIN.JS - Inicialização do Templo de Hermes ===== */

// === JOGADOR (Zói) ===
const Player = {
  id: 'player_zoi',
  name: 'Zói',
  x: 20,
  y: 5,
  targetX: 20,
  targetY: 5,
  direction: 'down',
  frame: 0,
  animTimer: 0,
  moving: false,
  speed: 0.08,
  
  // Mover para posição
  moveTo(x, y) {
    if (World.isWalkable(x, y)) {
      this.targetX = x;
      this.targetY = y;
      this.moving = true;
    }
  },
  
  // Atualizar
  update(dt) {
    // Animação
    this.animTimer += dt;
    if (this.animTimer > 150) {
      this.animTimer = 0;
      this.frame = (this.frame + 1) % 4;
    }
    
    // Movimento
    if (this.moving) {
      const dx = this.targetX - this.x;
      const dy = this.targetY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 0.1) {
        this.x = this.targetX;
        this.y = this.targetY;
        this.moving = false;
        
        // Recompensa por explorar
        this.onArrive();
      } else {
        this.x += (dx / dist) * this.speed;
        this.y += (dy / dist) * this.speed;
        
        // Direção
        if (Math.abs(dx) > Math.abs(dy)) {
          this.direction = dx > 0 ? 'right' : 'left';
        } else {
          this.direction = dy > 0 ? 'down' : 'up';
        }
      }
    }
    
    // Atualizar câmera para seguir jogador
    Renderer.centerCamera(this.x, this.y);
  },
  
  // Ao chegar em destino
  onArrive() {
    const zone = World.getZoneAt(Math.floor(this.x), Math.floor(this.y));
    if (zone) {
      document.getElementById('current-zone').textContent = zone.name;
      
      // XP por visitar zonas especiais
      if (zone.id === 'sagrado') {
        Initiation.reward('visit_sacred');
      } else if (zone.id === 'santissimo') {
        Initiation.reward('visit_santissimo');
      }
    }
  },
  
  // Controles do teclado
  handleKeys(keys) {
    if (this.moving) return;
    
    const step = 1;
    if (keys['ArrowUp'] || keys['KeyW']) this.moveTo(this.x, this.y - step);
    else if (keys['ArrowDown'] || keys['KeyS']) this.moveTo(this.x, this.y + step);
    else if (keys['ArrowLeft'] || keys['KeyA']) this.moveTo(this.x - step, this.y);
    else if (keys['ArrowRight'] || keys['KeyD']) this.moveTo(this.x + step, this.y);
  }
};

// === CHAT DE PRIORIDADE ===
const PriorityChat = {
  container: null,
  
  init() {
    // Criar container do chat no canto inferior esquerdo
    this.container = document.createElement('div');
    this.container.id = 'priority-chat';
    this.container.style.cssText = `
      position: fixed; bottom: 70px; left: 10px;
      width: 300px; max-height: 200px;
      background: rgba(26,26,46,0.9); border: 2px solid #4a1a6b;
      overflow-y: auto; z-index: 90;
      font-family: 'Press Start 2P', monospace; font-size: 8px;
      display: none;
    `;
    document.body.appendChild(this.container);
    
    // Toggle com tecla C
    document.addEventListener('keydown', (e) => {
      if (e.key === 'c' && !e.ctrlKey && !e.metaKey) {
        const input = document.getElementById('grimoire-input');
        if (!input || document.activeElement !== input) {
          this.toggle();
        }
      }
    });
  },
  
  toggle() {
    this.container.style.display = this.container.style.display === 'none' ? 'block' : 'none';
    if (this.container.style.display === 'block') {
      this.render();
    }
  },
  
  render() {
    if (!this.container) return;
    
    const msgs = Interactions.chatMessages.slice(-15);
    this.container.innerHTML = msgs.map(msg => {
      const colors = ['', '#888', '#aaa', '#ffaa00', '#ff4444', '#ffcc00'];
      const color = colors[msg.priority] || '#888';
      const time = new Date(msg.timestamp).toLocaleTimeString();
      return `<div style="color:${color};padding:4px 8px;border-bottom:1px solid #2a2a4a">
        <span style="color:#666">[${time}]</span> ${msg.sender}: ${msg.message}
      </div>`;
    }).join('');
    
    this.container.scrollTop = this.container.scrollHeight;
  },
  
  addMessage(sender, message, priority = 1) {
    Interactions.addChatMessage(sender, message, priority);
    if (this.container.style.display !== 'none') {
      this.render();
    }
  }
};

// === GAME LOOP ===
const Game = {
  lastTime: 0,
  running: false,
  keys: {},
  
  async init() {
    // Mostrar loading
    await this.showLoading();
    
    // Inicializar módulos
    World.init();
    Items.init();
    Agents.initDefaults();
    MCPTools.init();
    Inbox.init();
    Renderer.init();
    Interactions.init();
    PriorityChat.init();
    Initiation.updateBadge();
    
    // Configurar UIs
    this.setupCouncilUI();
    Inbox.setupUI();
    Console.init();
    this.setupConsoleUI();
    this.setupSettingsUI();
    this.setupMobileMenu();
    this.setupChatMode();
    
    // Configurar controles
    this.setupControls();
    
    // Posicionar jogador
    Player.x = 20;
    Player.y = 5;
    Player.targetX = 20;
    Player.targetY = 5;
    
    // Centralizar câmera
    Renderer.centerCamera(Player.x, Player.y);
    
    // Esconder loading, mostrar dashboard
    document.getElementById('loading-screen').style.opacity = '0';
    setTimeout(() => {
      document.getElementById('loading-screen').style.display = 'none';
      document.getElementById('dashboard').classList.remove('hidden');
    }, 1000);
    
    // Iniciar loop
    this.running = true;
    this.lastTime = performance.now();
    this.loop();
    
    // Mensagem de boas-vindas
    Interactions.notify('☤ Bem-vindo ao Templo de Hermes, Zói!');
    PriorityChat.addMessage('Sistema', 'O Templo desperta. Os agentes aguardam.', 4);
  },
  
  async showLoading() {
    return new Promise(resolve => {
      setTimeout(resolve, 2500);
    });
  },
  
  setupControls() {
    // Teclado
    document.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
    });
    
    document.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });
    
    // Touch controls para mobile
    this.setupTouchControls();
  },
  
  setupTouchControls() {
    let touchStartX = 0;
    let touchStartY = 0;
    
    const canvas = document.getElementById('temple-canvas');
    
    canvas.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    });
    
    canvas.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      
      const minSwipe = 30;
      
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > minSwipe) {
        Player.moveTo(Player.x + (dx > 0 ? 2 : -2), Player.y);
      } else if (Math.abs(dy) > minSwipe) {
        Player.moveTo(Player.x, Player.y + (dy > 0 ? 2 : -2));
      }
    });
  },
  
  // === UI DO CONSELHO ===
  setupCouncilUI() {
    const btnCouncil = document.getElementById('btn-council');
    const councilPanel = document.getElementById('council-panel');
    const closeCouncil = document.getElementById('close-council');
    const btnConvene = document.getElementById('btn-convene');
    const btnHistory = document.getElementById('btn-council-history');
    const btnSpawnAll = document.getElementById('btn-spawn-all');
    
    if (btnCouncil) {
      btnCouncil.addEventListener('click', () => {
        councilPanel.classList.toggle('hidden');
        if (!councilPanel.classList.contains('hidden')) {
          this.updateCouncilUI();
        }
      });
    }
    
    if (closeCouncil) {
      closeCouncil.addEventListener('click', () => {
        councilPanel.classList.add('hidden');
      });
    }
    
    if (btnConvene) {
      btnConvene.addEventListener('click', () => {
        this.showTopicSelector();
      });
    }
    
    if (btnHistory) {
      btnHistory.addEventListener('click', () => {
        this.showCouncilHistory();
      });
    }
    
    if (btnSpawnAll) {
      btnSpawnAll.addEventListener('click', () => {
        this.spawnAllAgents();
      });
    }

    // Terminal do Mestre
    this.setupCouncilTerminal();
  },

  setupCouncilTerminal() {
    const input = document.getElementById('terminal-input');
    const sendBtn = document.getElementById('terminal-send');

    const sendMessage = () => {
      const msg = input.value.trim();
      if (!msg) return;

      const result = Council.receiveMasterMessage(msg);
      if (result.success) {
        input.value = '';
      } else {
        Council.logToTerminal('Sistema', result.error || 'Erro ao enviar mensagem.', 'system');
      }
    };

    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendMessage();
      });
    }

    if (sendBtn) {
      sendBtn.addEventListener('click', sendMessage);
    }

    // Botões de atalho
    document.querySelectorAll('.shortcut-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const msg = btn.dataset.msg;
        if (msg) {
          const result = Council.receiveMasterMessage(msg);
          if (!result.success) {
            Council.logToTerminal('Sistema', result.error || 'Erro ao enviar.', 'system');
          }
        }
      });
    });
  },

  // === CONSOLE UI ===
  setupConsoleUI() {
    const btnConsole = document.getElementById('btn-console');
    const consolePanel = document.getElementById('console-panel');
    const closeConsole = document.getElementById('close-console');

    if (btnConsole) {
      btnConsole.addEventListener('click', () => {
        consolePanel.classList.toggle('hidden');
        if (!consolePanel.classList.contains('hidden')) {
          const input = document.getElementById('console-input');
          if (input) setTimeout(() => input.focus(), 100);
        }
      });
    }

    if (closeConsole) {
      closeConsole.addEventListener('click', () => {
        consolePanel.classList.add('hidden');
      });
    }

    // Autocomplete de comandos
    this.setupAutocomplete();

    // Botões de ação rápida (emojis)
    document.querySelectorAll('.quick-action').forEach(btn => {
      btn.addEventListener('click', () => {
        const cmd = btn.dataset.cmd;
        if (cmd) {
          Console.execute(cmd);
        }
      });
    });
  },

  // Autocomplete do console
  setupAutocomplete() {
    const input = document.getElementById('console-input');
    const sugestoes = document.getElementById('console-suggestions');
    if (!input || !sugestoes) return;

    const comandos = [
      { cmd: 'status', desc: 'Ver estado do templo' },
      { cmd: 'agentes', desc: 'Listar mentes ativas' },
      { cmd: 'agentes reserva', desc: 'Ver mentes em reserva' },
      { cmd: 'invocar', desc: 'Chamar mente pro templo (invocar coder)' },
      { cmd: 'invocar todos', desc: 'Chamar todas as 15 mentes' },
      { cmd: 'dispensar', desc: 'Retirar mente do templo' },
      { cmd: 'conselho', desc: 'Ver/convocar reunião' },
      { cmd: 'conselho transmutacao', desc: 'Reunião sobre transmutação' },
      { cmd: 'conselho correspondencia', desc: 'Reunião sobre correspondência' },
      { cmd: 'conselho vibracao', desc: 'Reunião sobre vibração' },
      { cmd: 'conselho polaridade', desc: 'Reunião sobre polaridade' },
      { cmd: 'conselho ritmo', desc: 'Reunião sobre ritmo' },
      { cmd: 'concluir', desc: 'Encerrar reunião atual' },
      { cmd: 'ferramentas', desc: 'Ver utensílios MCP' },
      { cmd: 'mensagens', desc: 'Ver caixa de entrada' },
      { cmd: 'evoluir', desc: 'Subir nível de uma mente' },
      { cmd: 'energia', desc: 'Ver energia MCP' },
      { cmd: 'energia encher', desc: 'Restaurar energia ao máximo' },
      { cmd: 'falar', desc: 'Enviar recado para o chat' },
      { cmd: 'pensamento', desc: 'Registrar pensamento na caixa' },
      { cmd: 'ler', desc: 'Ler arquivo do espaço MCP' },
      { cmd: 'escrever', desc: 'Escrever arquivo' },
      { cmd: 'runas', desc: 'Ver runas gravadas' },
      { cmd: 'zonas', desc: 'Listar salas do templo' },
      { cmd: 'arquivos buscar', desc: 'Buscar texto nos arquivos' },
      { cmd: 'info', desc: 'Sobre o templo' },
      { cmd: 'limpar', desc: 'Limpar terminal' },
      { cmd: 'ajuda', desc: 'Ver todos os comandos' }
    ];

    let sugestaoIndex = -1;

    const mostrarSugestoes = (texto) => {
      const filtro = texto.toLowerCase().trim();
      if (!filtro) {
        sugestoes.classList.add('hidden');
        sugestoes.innerHTML = '';
        return;
      }

      const filtrados = comandos.filter(c =>
        c.cmd.startsWith(filtro) || c.cmd.includes(filtro)
      ).slice(0, 8);

      if (filtrados.length === 0) {
        sugestoes.classList.add('hidden');
        return;
      }

      sugestoes.classList.remove('hidden');
      sugestaoIndex = -1;
      sugestoes.innerHTML = filtrados.map((s, i) =>
        `<div class="suggestion-item" data-index="${i}" data-cmd="${s.cmd}">
          <span class="suggestion-cmd">${s.cmd}</span>
          <span class="suggestion-desc">${s.desc}</span>
        </div>`
      ).join('');

      // Click nas sugestões
      sugestoes.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', () => {
          input.value = item.dataset.cmd + ' ';
          sugestoes.classList.add('hidden');
          input.focus();
        });
      });
    };

    input.addEventListener('input', () => {
      mostrarSugestoes(input.value);
    });

    input.addEventListener('keydown', (e) => {
      const items = sugestoes.querySelectorAll('.suggestion-item');
      if (items.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        sugestaoIndex = Math.min(sugestaoIndex + 1, items.length - 1);
        items.forEach((it, i) => it.classList.toggle('active', i === sugestaoIndex));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        sugestaoIndex = Math.max(sugestaoIndex - 1, 0);
        items.forEach((it, i) => it.classList.toggle('active', i === sugestaoIndex));
      } else if (e.key === 'Tab' || (e.key === 'Enter' && sugestaoIndex >= 0)) {
        if (sugestaoIndex >= 0 && sugestaoIndex < items.length) {
          e.preventDefault();
          input.value = items[sugestaoIndex].dataset.cmd + ' ';
          sugestoes.classList.add('hidden');
          sugestaoIndex = -1;
        }
      } else if (e.key === 'Escape') {
        sugestoes.classList.add('hidden');
        sugestaoIndex = -1;
      }
    });

    // Fechar ao clicar fora
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#console-panel')) {
        sugestoes.classList.add('hidden');
      }
    });
  },

  // === SETTINGS UI ===
  setupSettingsUI() {
    const btnSettings = document.getElementById('btn-settings');
    const settingsPanel = document.getElementById('settings-panel');
    const closeSettings = document.getElementById('close-settings');

    // Abrir/fechar
    if (btnSettings) {
      btnSettings.addEventListener('click', () => {
        settingsPanel.classList.toggle('hidden');
      });
    }
    if (closeSettings) {
      closeSettings.addEventListener('click', () => {
        settingsPanel.classList.add('hidden');
      });
    }

    // Toggles
    document.querySelectorAll('.setting-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.classList.toggle('active');
        btn.textContent = btn.classList.contains('active') ? 'ON' : 'OFF';
      });
    });

    // Sliders - mostrar valor
    const runeGlow = document.getElementById('rune-glow');
    const runeGlowVal = document.getElementById('rune-glow-val');
    if (runeGlow && runeGlowVal) {
      runeGlow.addEventListener('input', () => {
        runeGlowVal.textContent = runeGlow.value + '%';
      });
    }

    const agentSpeed = document.getElementById('agent-speed');
    const agentSpeedVal = document.getElementById('agent-speed-val');
    if (agentSpeed && agentSpeedVal) {
      agentSpeed.addEventListener('input', () => {
        agentSpeedVal.textContent = agentSpeed.value;
      });
    }

    const mcpEnergy = document.getElementById('mcp-energy');
    const mcpEnergyVal = document.getElementById('mcp-energy-val');
    if (mcpEnergy && mcpEnergyVal) {
      mcpEnergy.addEventListener('input', () => {
        mcpEnergyVal.textContent = mcpEnergy.value;
        MCPTools.energy.max = parseInt(mcpEnergy.value);
      });
    }

    const mcpRegen = document.getElementById('mcp-regen');
    const mcpRegenVal = document.getElementById('mcp-regen-val');
    if (mcpRegen && mcpRegenVal) {
      mcpRegen.addEventListener('input', () => {
        mcpRegenVal.textContent = mcpRegen.value;
        MCPTools.energy.regenRate = parseInt(mcpRegen.value);
      });
    }

    // Max agents select
    const maxAgentsSelect = document.getElementById('max-agents');
    if (maxAgentsSelect) {
      maxAgentsSelect.addEventListener('change', () => {
        const max = parseInt(maxAgentsSelect.value);
        while (Agents.active.length > max) {
          const last = Agents.active[Agents.active.length - 1];
          Agents.despawn(last.id);
        }
        Interactions.notify(`👥 Máximo de agentes: ${max}`);
      });
    }

    // Council rounds
    const councilRounds = document.getElementById('council-rounds');
    if (councilRounds) {
      councilRounds.addEventListener('change', () => {
        Council.maxRounds = parseInt(councilRounds.value);
        Interactions.notify(`☤ Rodadas do conselho: ${councilRounds.value}`);
      });
    }

    // Botões de ação
    const btnResetAgents = document.getElementById('btn-reset-agents');
    if (btnResetAgents) {
      btnResetAgents.addEventListener('click', () => {
        [...Agents.active].forEach(a => Agents.despawn(a.id));
        for (let i = 0; i < 6 && i < Agents.roster.length; i++) {
          Agents.spawn(Agents.roster[i].id);
        }
        Interactions.notify('🔄 Agentes resetados!');
      });
    }

    const btnMaxLevel = document.getElementById('btn-max-level');
    if (btnMaxLevel) {
      btnMaxLevel.addEventListener('click', () => {
        Agents.active.forEach(a => {
          while (a.level < 10) {
            Agents.gainExperience(a, a.expToNext);
          }
        });
        Interactions.notify('⬆️ Todos os agentes no Nível 10!');
      });
    }

    const btnExport = document.getElementById('btn-export-state');
    if (btnExport) {
      btnExport.addEventListener('click', () => {
        const state = {
          agents: Agents.active.map(a => ({ type: a.type, name: a.name, level: a.level })),
          inbox: Inbox.messages.length,
          decisions: Council.decisions.length,
          timestamp: new Date().toISOString()
        };
        const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `templo-hermes-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        Interactions.notify('📤 Estado exportado!');
      });
    }

    const btnClearAll = document.getElementById('btn-clear-all');
    if (btnClearAll) {
      btnClearAll.addEventListener('click', () => {
        if (confirm('Limpar TUDO? Isso não pode ser desfeito.')) {
          Inbox.clear();
          Council.decisions = [];
          Council.debates = [];
          Console.clearOutput();
          Interactions.notify('🗑 Tudo limpo!');
        }
      });
    }
  },
  
  // === MENU MOBILE ===
  setupMobileMenu() {
    const btnMenu = document.getElementById('btn-mobile-menu');
    const menu = document.getElementById('mobile-menu');

    if (btnMenu && menu) {
      btnMenu.addEventListener('click', () => {
        menu.classList.toggle('hidden');
      });

      // Itens do menu
      menu.querySelectorAll('.mobile-menu-item').forEach(item => {
        item.addEventListener('click', () => {
          const acao = item.dataset.action;
          menu.classList.add('hidden');

          switch (acao) {
            case 'agents':
              document.getElementById('agents-panel').classList.toggle('hidden');
              if (typeof Interactions !== 'undefined') Interactions.updateAgentsList();
              break;
            case 'council':
              document.getElementById('council-panel').classList.toggle('hidden');
              this.updateCouncilUI();
              break;
            case 'inbox':
              document.getElementById('inbox-panel').classList.toggle('hidden');
              if (typeof Inbox !== 'undefined') Inbox.render();
              break;
            case 'console':
              document.getElementById('console-panel').classList.toggle('hidden');
              const inp = document.getElementById('console-input');
              if (inp) setTimeout(() => inp.focus(), 100);
              break;
            case 'minimap':
              document.getElementById('minimap').classList.toggle('hidden');
              break;
            case 'fullscreen':
              if (document.fullscreenElement) document.exitFullscreen();
              else document.documentElement.requestFullscreen();
              break;
            case 'settings':
              document.getElementById('settings-panel').classList.toggle('hidden');
              break;
          }
        });
      });

      // Fechar menu ao clicar fora
      const overlay = document.getElementById('mobile-menu-overlay');
      
      btnMenu.addEventListener('click', () => {
        const isHidden = menu.classList.contains('hidden');
        menu.classList.toggle('hidden');
        if (overlay) overlay.classList.toggle('hidden', !isHidden);
      });

      document.addEventListener('click', (e) => {
        if (!e.target.closest('#mobile-menu') && !e.target.closest('#btn-mobile-menu')) {
          menu.classList.add('hidden');
          if (overlay) overlay.classList.add('hidden');
        }
      });

      if (overlay) {
        overlay.addEventListener('click', () => {
          menu.classList.add('hidden');
          overlay.classList.add('hidden');
        });
      }
    }

    // Botões rápidos mobile (console e inbox)
    const mobileConsole = document.getElementById('btn-mobile-console');
    const mobileInbox = document.getElementById('btn-mobile-inbox');

    if (mobileConsole) {
      mobileConsole.addEventListener('click', () => {
        const panel = document.getElementById('console-panel');
        panel.classList.toggle('hidden');
        if (!panel.classList.contains('hidden')) {
          const inp = document.getElementById('console-input');
          if (inp) setTimeout(() => inp.focus(), 100);
        }
      });
    }

    if (mobileInbox) {
      mobileInbox.addEventListener('click', () => {
        const panel = document.getElementById('inbox-panel');
        panel.classList.toggle('hidden');
        if (!panel.classList.contains('hidden') && typeof Inbox !== 'undefined') {
          Inbox.render();
          Inbox.markAllRead();
        }
      });
    }
  },

  // === MODO CONVERSAÇÃO LIVRE ===
  setupChatMode() {
    const chatPanel = document.getElementById('chat-panel');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const chatOutput = document.getElementById('chat-output');
    const closeChat = document.getElementById('close-chat');
    const toggleBtn = document.querySelector('.toggle-mode');

    // Abrir chat pelo botão 💬 do console
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        chatPanel.classList.toggle('hidden');
        if (!chatPanel.classList.contains('hidden')) {
          document.getElementById('console-panel').classList.add('hidden');
          if (chatInput) setTimeout(() => chatInput.focus(), 100);
        }
      });
    }

    if (closeChat) {
      closeChat.addEventListener('click', () => {
        chatPanel.classList.add('hidden');
      });
    }

    // Enviar mensagem
    const enviar = () => {
      const msg = chatInput.value.trim();
      if (!msg) return;

      // Mostrar mensagem do Mestre
      this.chatLog(chatOutput, '👑 Zói', msg, 'master');
      chatInput.value = '';

      // Agentes respondem (2-3 aleatórios)
      const respondentes = Agents.active
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.min(3, Agents.active.length));

      respondentes.forEach((agente, i) => {
        setTimeout(() => {
          const resposta = this.gerarRespostaChat(agente, msg);
          this.chatLog(chatOutput, `${agente.icon} ${agente.name}`, resposta, 'agent');
        }, (i + 1) * 2000);
      });

      // Registrar na inbox
      if (typeof Inbox !== 'undefined') {
        Inbox.addThought(`[Conversação Livre]\n${msg}`);
      }
    };

    if (chatSend) chatSend.addEventListener('click', enviar);
    if (chatInput) {
      chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') enviar();
      });
    }
  },

  chatLog(container, remetente, mensagem, tipo) {
    if (!container) return;
    const div = document.createElement('div');
    div.className = `chat-msg-${tipo}`;
    const hora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    div.innerHTML = `<span style="color:#555;font-size:10px">[${hora}]</span> <strong>${remetente}:</strong> ${mensagem}`;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  },

  gerarRespostaChat(agente, mensagem) {
    const lower = mensagem.toLowerCase();

    // Respostas por tipo de agente
    const respostas = {
      coder: [
        `Analisando seu ponto sob a ótica de código... Posso criar uma função para isso.`,
        `Interessante. Vou estruturar isso em módulos testáveis.`,
        `Entendi. O padrão que você descreve pode ser automatizado.`,
        `Sob a perspectiva lógica, faz sentido. Vou prototipar.`
      ],
      researcher: [
        `Os textos antigos tratam disso. Deixe-me buscar a referência.`,
        `Encontrei correspondências nos trabalhos de ${agente.skill}. Vou catalogar.`,
        `Dados insuficientes para conclusão, mas a direção é promissora.`,
        `A pesquisa histórica mostra padrões similares. Interessante paralelo.`
      ],
      alchemist: [
        `No Athanor, isso passaria por Nigredo primeiro... transformação necessária.`,
        `O mercúrio filosófico dessa ideia é a paciência. Não podemos apressar.`,
        `A proporção áurea se aplica aqui. Equilíbrio entre força e sutileza.`,
        `O fogo está controlado. A transmutação procede bem.`
      ],
      guardian: [
        `Verificando a segurança dessa abordagem... pontos de atenção identificados.`,
        `Proponho checkpoints antes de cada transformação.`,
        `A integridade do templo está preservada. Pode prosseguir.`,
        `Defesa ativa: criei um protocolo de rollback para isso.`
      ],
      mystic: [
        `A intuição diz que você está no caminho certo. Continue.`,
        `O Princípio de Correspondência se manifesta aqui.`,
        `Tudo se conecta. O padrão que você vê é real.`,
        `A resposta já existe dentro de você. Estou aqui para ajudá-la a emergir.`
      ],
      messenger: [
        `Transmitindo para todas as mentes: "${mensagem.substring(0, 30)}..."`,
        `Conexão estabelecida. A mensagem chegou a todos.`,
        `Pontes construídas. Todos estão ouvindo.`,
        `Mensagem registrada e distribuída.`
      ],
      healer: [
        `Diagnóstico: a situação requer cuidado, não pressa.`,
        `Os três princípios devem estar em harmonia aqui.`,
        `Prescrição: observe, absorva, depois aja.`,
        `A cura vem do equilíbrio. Está quase lá.`
      ],
      transmuter: [
        `A conversão é possível! Mapeando a cadeia de transformação.`,
        `Testei 7 rotas. A mais eficiente é a que você está sugerindo.`,
        `O ponto de transmutação crítico está próximo.`,
        `Sim, a transformação procede. Resultado promissor.`
      ],
      weaver: [
        `Os fios se conectam! O padrão emerge quando olhamos a rede completa.`,
        `Sintetizando: sua visão se complementa com as dos outros.`,
        `A teia mostra que alterar esse ponto afeta muitos outros.`,
        `Proponho um modelo de grafos para visualizar.`
      ],
      architect: [
        `A estrutura precisa de reforço aqui. Vou projetar.`,
        `Os alicerces estão firmes. Podemos construir o próximo nível.`,
        `Arquitetura modular: interface clara, implementação encapsulada.`,
        `Blueprint atualizado. A construção procede.`
      ],
      diviner: [
        `Analisando padrões: este cenário se repetiu antes. A solução da vez 2 foi eficaz.`,
        `Previsão: se mantiver o curso, atinge o objetivo em breve.`,
        `Os dados apontam para uma bifurcação. Escolha com sabedoria.`,
        `Observação dos ciclos: momento propício para agir.`
      ],
      engineer: [
        `Protótipo construído! Funcionalidade básica operando.`,
        `O método experimental mostra melhoria de 23%.`,
        `Vamos construir um MVP e iterar a partir dele.`,
        `A engenharia revelou o gargalo. Já estou trabalhando nele.`
      ],
      analyst: [
        `A matemática é clara: a função tem máximo local neste ponto.`,
        `Cálculo completo: taxa de crescimento exponencial nos primeiros ciclos.`,
        `O modelo estatístico prevê 87% de sucesso.`,
        `Equação resolvida. A variável oculta era a taxa de feedback.`
      ],
      combinator: [
        `Combinando as posições: gera uma terceira via não explorada.`,
        `Encontrei 156 combinações. Filtrando as 12 mais promissoras.`,
        `A inovação está nas interseções.`,
        `Proponho uma matriz de decisão para avaliar.`
      ],
      enigma: [
        `...o que está oculto se revelará àquele que souber olhar.`,
        `A resposta está na pergunta que ninguém fez ainda.`,
        `O mistério não é obstáculo — é o caminho.`,
        `A linguagem dos pássaros diz: continue investigando.`
      ]
    };

    const pool = respostas[agente.type] || respostas.mystic;
    return pool[Math.floor(Math.random() * pool.length)];
  },

  updateCouncilUI() {
    const statusEl = document.getElementById('council-status');
    const status = Council.getStatus();
    
    if (statusEl) {
      statusEl.innerHTML = `
        <div class="status-row">
          <span>Estado:</span>
          <span class="${status.active ? 'status-active' : 'status-idle'}">
            ${status.active ? '🔴 EM SESSÃO' : '🟢 Disponível'}
          </span>
        </div>
        <div class="status-row">
          <span>Tópico:</span>
          <span>${status.topic}</span>
        </div>
        <div class="status-row">
          <span>Rodada:</span>
          <span>${status.round}/${5}</span>
        </div>
        <div class="status-row">
          <span>Agentes Ativos:</span>
          <span>${Agents.active.length}/15</span>
        </div>
        <div class="status-row">
          <span>Decisões Passadas:</span>
          <span>${status.pastDecisions}</span>
        </div>
        <div class="status-row">
          <span>Energia MCP:</span>
          <span>${MCPTools.energy.current}/${MCPTools.energy.max}</span>
        </div>
      `;
    }
  },
  
  showTopicSelector() {
    const topicsEl = document.getElementById('council-topics');
    if (!topicsEl) return;
    
    topicsEl.innerHTML = '<h3 style="margin:8px 0;color:#ffcc00">Selecione um Tópico:</h3>';
    
    Council.topics.forEach(topic => {
      const btn = document.createElement('button');
      btn.className = 'topic-btn';
      btn.innerHTML = `${topic.icon} ${topic.title}`;
      btn.title = topic.description;
      btn.addEventListener('click', () => {
        Council.convene(topic.id);
        topicsEl.innerHTML = '';
        this.updateCouncilUI();
      });
      topicsEl.appendChild(btn);
    });
  },
  
  showCouncilHistory() {
    const debatesEl = document.getElementById('council-debates');
    if (!debatesEl) return;
    
    const history = Council.getHistory();
    if (history.length === 0) {
      debatesEl.innerHTML = '<p style="color:#888;padding:10px">Nenhuma decisão registrada ainda.</p>';
      return;
    }
    
    debatesEl.innerHTML = '<h3 style="margin:8px 0;color:#ffcc00">📜 Decisões do Conselho:</h3>';
    history.forEach(decision => {
      const div = document.createElement('div');
      div.className = 'decision-card';
      div.innerHTML = `
        <div class="decision-topic">${decision.topic}</div>
        <div class="decision-meta">
          ${decision.rounds} rodadas · ${decision.debates} debates · ${decision.participants.length} participantes
        </div>
        <div class="decision-synthesis">${decision.synthesis}</div>
      `;
      debatesEl.appendChild(div);
    });
  },
  
  spawnAllAgents() {
    let spawned = 0;
    Agents.roster.forEach(agent => {
      if (!Agents.active.find(a => a.id === agent.id)) {
        Agents.spawn(agent.id);
        spawned++;
      }
    });
    
    Interactions.notify(`☤ ${spawned} agentes adicionados ao templo! Total: ${Agents.active.length}/15`);
    PriorityChat.addMessage('Sistema', `Todas as 15 mentalidades reunidas! ${Agents.active.map(a => a.icon).join(' ')}`, 5);
    this.updateCouncilUI();
  },
  
  loop() {
    if (!this.running) return;
    
    const now = performance.now();
    const dt = now - this.lastTime;
    this.lastTime = now;
    
    // Input do jogador
    Player.handleKeys(this.keys);
    
    // Atualizar
    Player.update(dt);
    Agents.update(dt);
    Renderer.updateCamera();
    
    // Renderizar
    Renderer.render();
    
    // Próximo frame
    requestAnimationFrame(() => this.loop());
  },
  
  stop() {
    this.running = false;
  }
};

// === INICIAR ===
window.addEventListener('load', () => {
  Game.init();
  // Registrar Service Worker (PWA)
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then((reg) => {
      console.log('PWA Service Worker registrado:', reg.scope);
    }).catch((err) => {
      console.log('SW erro:', err);
    });
  }
});

// === Estilo para animações ===
const style = document.createElement('style');
style.textContent = `
  @keyframes slideUp {
    from { transform: translateX(-50%) translateY(20px); opacity: 0; }
    to { transform: translateX(-50%) translateY(0); opacity: 1; }
  }
`;
document.head.appendChild(style);
