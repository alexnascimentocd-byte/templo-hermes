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
      
      if (e.key === 'ArrowDown' && items.length > 0) {
        e.preventDefault();
        sugestaoIndex = Math.min(sugestaoIndex + 1, items.length - 1);
        items.forEach((it, i) => it.classList.toggle('active', i === sugestaoIndex));
      } else if (e.key === 'ArrowUp' && items.length > 0 && sugestaoIndex > 0) {
        e.preventDefault();
        sugestaoIndex = Math.max(sugestaoIndex - 1, 0);
        items.forEach((it, i) => it.classList.toggle('active', i === sugestaoIndex));
      } else if (e.key === 'Tab' && items.length > 0 && sugestaoIndex >= 0) {
        e.preventDefault();
        input.value = items[sugestaoIndex].dataset.cmd + ' ';
        sugestoes.classList.add('hidden');
        sugestaoIndex = -1;
      } else if (e.key === 'Escape') {
        sugestoes.classList.add('hidden');
        sugestaoIndex = -1;
      }
      // Enter NÃO é interceptado pelo autocomplete — deixa o console executar
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

    // Função para fechar TODOS os painéis
    const closeAllPanels = () => {
      document.getElementById('agents-panel')?.classList.add('hidden');
      document.getElementById('council-panel')?.classList.add('hidden');
      document.getElementById('inbox-panel')?.classList.add('hidden');
      document.getElementById('console-panel')?.classList.add('hidden');
      document.getElementById('settings-panel')?.classList.add('hidden');
      document.getElementById('minimap')?.classList.add('hidden');
      document.getElementById('chat-panel')?.classList.add('hidden');
    };

    if (btnMenu && menu) {
      // Toggle do menu
      btnMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.toggle('hidden');
        const overlay = document.getElementById('mobile-menu-overlay');
        if (overlay) overlay.classList.toggle('hidden', menu.classList.contains('hidden'));
      });

      // Itens do menu
      menu.querySelectorAll('.mobile-menu-item').forEach(item => {
        item.addEventListener('click', () => {
          const acao = item.dataset.action;
          menu.classList.add('hidden');
          const overlay = document.getElementById('mobile-menu-overlay');
          if (overlay) overlay.classList.add('hidden');

          // Fechar todos os painéis primeiro
          closeAllPanels();

          // Abrir o painel selecionado
          switch (acao) {
            case 'agents': {
              const p = document.getElementById('agents-panel');
              p.classList.remove('hidden');
              if (typeof Interactions !== 'undefined') Interactions.updateAgentsList();
              break;
            }
            case 'council': {
              const p = document.getElementById('council-panel');
              p.classList.remove('hidden');
              this.updateCouncilUI();
              break;
            }
            case 'inbox': {
              const p = document.getElementById('inbox-panel');
              p.classList.remove('hidden');
              if (typeof Inbox !== 'undefined') Inbox.render();
              break;
            }
            case 'console': {
              const p = document.getElementById('console-panel');
              p.classList.remove('hidden');
              const inp = document.getElementById('console-input');
              if (inp) setTimeout(() => inp.focus(), 100);
              break;
            }
            case 'minimap': {
              document.getElementById('minimap').classList.remove('hidden');
              break;
            }
            case 'fullscreen': {
              if (document.fullscreenElement) document.exitFullscreen();
              else document.documentElement.requestFullscreen();
              break;
            }
            case 'settings': {
              const p = document.getElementById('settings-panel');
              p.classList.remove('hidden');
              break;
            }
            case 'chat': {
              const p = document.getElementById('chat-panel');
              p.classList.remove('hidden');
              break;
            }
          }
        });
      });

      // Fechar menu ao clicar fora
      const overlay = document.getElementById('mobile-menu-overlay');

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

    // Botões rápidos mobile (console e inbox) — fecham outros painéis
    const mobileConsole = document.getElementById('btn-mobile-console');
    const mobileInbox = document.getElementById('btn-mobile-inbox');

    if (mobileConsole) {
      mobileConsole.addEventListener('click', () => {
        const panel = document.getElementById('console-panel');
        const isOpen = !panel.classList.contains('hidden');
        closeAllPanels();
        if (!isOpen) {
          panel.classList.remove('hidden');
          const inp = document.getElementById('console-input');
          if (inp) setTimeout(() => inp.focus(), 100);
        }
      });
    }

    if (mobileInbox) {
      mobileInbox.addEventListener('click', () => {
        const panel = document.getElementById('inbox-panel');
        const isOpen = !panel.classList.contains('hidden');
        closeAllPanels();
        if (!isOpen) {
          panel.classList.remove('hidden');
          if (typeof Inbox !== 'undefined') {
            Inbox.render();
            Inbox.markAllRead();
          }
        }
      });
    }
  },

  // === MODO CONVERSAÇÃO LIVRE (Córtex Alquímico) ===
  setupChatMode() {
    const toggleBtn = document.querySelector('.toggle-mode');
    
    // Estado da conversação
    this.chatCtx = {
      historico: [],
      temas: [],
      estagio: 'nigredo', // ciclo alquímico da conversa
      msgCount: 0,
      pendingFile: null // arquivo aguardando envio
    };

    // Abrir chat pelo botão 💬 do console
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const chatPanel = document.getElementById('chat-panel');
        const consolePanel = document.getElementById('console-panel');
        chatPanel.classList.toggle('hidden');
        if (!chatPanel.classList.contains('hidden')) {
          consolePanel.classList.add('hidden');
          const inp = document.getElementById('chat-input');
          if (inp) setTimeout(() => inp.focus(), 100);
        }
      });
    }

    // Fechar
    const closeBtn = document.getElementById('close-chat');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        document.getElementById('chat-panel').classList.add('hidden');
      });
    }

    // === FILE UPLOAD ===
    const fileBtn = document.getElementById('chat-file-btn');
    const fileInput = document.getElementById('chat-file-input');
    const preview = document.getElementById('chat-preview');
    const previewContent = document.getElementById('chat-preview-content');
    const previewClose = document.getElementById('chat-preview-close');

    if (fileBtn && fileInput) {
      fileBtn.addEventListener('click', () => fileInput.click());
      
      fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (!file) return;

        // Limite: 5MB para imagens, 1MB para outros
        const maxImg = 5 * 1024 * 1024;
        const maxFile = 1 * 1024 * 1024;
        const isImage = file.type.startsWith('image/');
        const limit = isImage ? maxImg : maxFile;

        if (file.size > limit) {
          this.chatLog(document.getElementById('chat-output'), '⚠️ Sistema',
            `Arquivo muito grande! Limite: ${isImage ? '5MB (imagem)' : '1MB (arquivo)'}. Seu arquivo: ${(file.size / 1024 / 1024).toFixed(1)}MB`, 'system');
          fileInput.value = '';
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          this.chatCtx.pendingFile = {
            name: file.name,
            type: file.type,
            size: file.size,
            data: e.target.result,
            isImage: isImage
          };

          // Mostrar preview
          preview.classList.remove('hidden');
          if (isImage) {
            previewContent.innerHTML = `<img src="${e.target.result}" alt="${file.name}"><span class="preview-file">${file.name} (${(file.size/1024).toFixed(0)}KB)</span>`;
          } else {
            previewContent.innerHTML = `<span class="preview-file">📄 ${file.name} (${(file.size/1024).toFixed(0)}KB)</span>`;
          }
        };
        reader.readAsDataURL(file);
        fileInput.value = '';
      });
    }

    // Fechar preview
    if (previewClose) {
      previewClose.addEventListener('click', () => {
        preview.classList.add('hidden');
        previewContent.innerHTML = '';
        this.chatCtx.pendingFile = null;
      });
    }

    // === LINK BUTTON ===
    const linkBtn = document.getElementById('chat-link-btn');
    if (linkBtn) {
      linkBtn.addEventListener('click', () => {
        const url = prompt('Cole o link aqui:');
        if (url && url.trim()) {
          const chatInp = document.getElementById('chat-input');
          chatInp.value = url.trim();
          chatInp.focus();
        }
      });
    }

    // Enviar mensagem
    const chatSendBtn = document.getElementById('chat-send');
    const chatInp = document.getElementById('chat-input');

    const enviarMsg = () => {
      const msg = chatInp.value.trim();
      const file = this.chatCtx.pendingFile;
      if (!msg && !file) return;

      const output = document.getElementById('chat-output');

      // Se tem arquivo pendente
      if (file) {
        if (file.isImage) {
          // Mostrar imagem no chat
          this.chatLogImage(output, '👑 Zói', file.data, file.name, msg);
        } else {
          // Mostrar arquivo no chat
          this.chatLogFile(output, '👑 Zói', file.name, file.size);
        }
        this.chatCtx.historico.push({ de: 'mestre', texto: msg || `[Arquivo: ${file.name}]`, arquivo: file.name });
        
        // Limpar preview
        document.getElementById('chat-preview').classList.add('hidden');
        document.getElementById('chat-preview-content').innerHTML = '';
        this.chatCtx.pendingFile = null;
      }

      // Se tem mensagem de texto
      if (msg) {
        // Detectar links na mensagem
        if (this.isLink(msg)) {
          this.chatLogLink(output, '👑 Zói', msg);
        } else if (msg.length > 300) {
          // Texto longo
          this.chatLogLong(output, '👑 Zói', msg);
        } else {
          this.chatLog(output, '👑 Zói', msg, 'master');
        }
        this.chatCtx.historico.push({ de: 'mestre', texto: msg });
      }

      chatInp.value = '';
      chatInp.focus();
      this.chatCtx.msgCount++;
      
      // Extrair temas/palavras-chave
      const temas = this.extrairTemas(msg || file?.name || '');
      this.chatCtx.temas = [...new Set([...this.chatCtx.temas, ...temas])];

      // Avançar estágio alquímico
      this.avancarEstagio();

      // 3 mentes respondem com base nos temas
      const respondentes = Agents.active
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.min(3, Agents.active.length));

      respondentes.forEach((agente, i) => {
        setTimeout(() => {
          const resposta = this.gerarRespostaAlquimica(agente, msg || `[arquivo: ${file?.name || 'enviado'}]`, temas);
          this.chatLog(output, `${agente.icon} ${agente.name}`, resposta, 'agent');
          this.chatCtx.historico.push({ de: agente.name, texto: resposta });
        }, (i + 1) * 1800);
      });

      // Após as respostas, síntese se acumulou 3+ mensagens
      if (this.chatCtx.msgCount % 3 === 0) {
        setTimeout(() => {
          const sintese = this.gerarSintese();
          this.chatLog(output, '☤ Síntese do Conselho', sintese, 'system');
        }, respondentes.length * 1800 + 1500);
      }

      // Inbox
      if (typeof Inbox !== 'undefined') {
        Inbox.addThought(`[Conversação — ${this.chatCtx.estagio}]\n${msg || `[Arquivo: ${file?.name}]`}`);
      }
    };

    if (chatSendBtn) chatSendBtn.addEventListener('click', enviarMsg);
    if (chatInp) {
      chatInp.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          enviarMsg();
        }
      });
    }
  },

  // Detectar se é link
  isLink(text) {
    return /^https?:\/\/\S+$/i.test(text.trim());
  },

  // Log de mensagem com imagem
  chatLogImage(container, sender, dataUrl, fileName, caption) {
    const div = document.createElement('div');
    div.className = 'chat-msg-image';
    div.innerHTML = `
      <div style="color:#ffcc00;margin-bottom:4px;font-size:11px">${sender}:</div>
      <img src="${dataUrl}" alt="${fileName}" onclick="this.style.maxHeight=this.style.maxHeight==='none'?'200px':'none'" title="Clique para expandir/recolher">
      ${caption ? `<div class="img-caption">${caption}</div>` : `<div class="img-caption">${fileName}</div>`}
    `;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  },

  // Log de mensagem com arquivo
  chatLogFile(container, sender, fileName, fileSize) {
    const div = document.createElement('div');
    const ext = fileName.split('.').pop().toLowerCase();
    const icons = { pdf: '📕', txt: '📄', py: '🐍', js: '📜', json: '📋', md: '📝', html: '🌐', css: '🎨', csv: '📊' };
    const icon = icons[ext] || '📎';
    div.innerHTML = `
      <div style="color:#ffcc00;margin-bottom:4px;font-size:11px">${sender}:</div>
      <div class="chat-msg-file" title="Arquivo enviado">
        <span>${icon}</span>
        <span>${fileName}</span>
        <span style="color:#666">(${(fileSize/1024).toFixed(0)}KB)</span>
      </div>
    `;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  },

  // Log de mensagem com link
  chatLogLink(container, sender, url) {
    const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const div = document.createElement('div');
    div.className = 'chat-msg-master';
    // Extrair domínio para preview
    let domain = '';
    try { domain = new URL(url).hostname; } catch(e) { domain = url; }
    div.innerHTML = `
      <span style="color:#666;font-size:10px">[${time}]</span>
      <span style="color:#ffcc00">${sender}:</span>
      <div style="margin-top:4px">
        <a href="${url}" target="_blank" rel="noopener" class="chat-msg-link">🔗 ${domain}</a>
        <div style="color:#666;font-size:9px;margin-top:2px">${url}</div>
      </div>
    `;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  },

  // Log de texto longo
  chatLogLong(container, sender, text) {
    const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const div = document.createElement('div');
    const id = 'long-' + Date.now();
    div.innerHTML = `
      <span style="color:#666;font-size:10px">[${time}]</span>
      <span style="color:#ffcc00">${sender}:</span>
      <div class="chat-msg-long" id="${id}">${text.substring(0, 300)}${text.length > 300 ? '...' : ''}</div>
      ${text.length > 300 ? `<button class="chat-expand-btn" onclick="document.getElementById('${id}').classList.toggle('expanded');document.getElementById('${id}').innerHTML=document.getElementById('${id}').classList.contains('expanded')?'${text.replace(/'/g, "\\'").replace(/\n/g, '\\n')}':'${text.substring(0, 300).replace(/'/g, "\\'").replace(/\n/g, '\\n')}...'">▼ Expandir texto completo</button>` : ''}
    `;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  },

  // Extrair temas/palavras-chave da mensagem
  extrairTemas(msg) {
    const lower = msg.toLowerCase();
    const temas = [];
    
    const mapa = {
      // Conceitos alquímicos
      'transformação': 'transmutacao', 'transformar': 'transmutacao', 'mudar': 'transmutacao', 'converter': 'transmutacao',
      'purificação': 'purificacao', 'purificar': 'purificacao', 'limpar': 'purificacao',
      'fogo': 'fogo', 'aquecer': 'fogo', 'queimar': 'fogo', 'calor': 'fogo',
      'água': 'agua', 'diluir': 'agua', 'dissolver': 'agua', 'líquido': 'agua',
      'terra': 'terra', 'sólido': 'terra', 'matéria': 'terra', 'corpo': 'terra',
      'ar': 'ar', 'sopro': 'ar', 'mente': 'ar', 'pensamento': 'ar',
      'equilíbrio': 'equilibrio', 'equilibrar': 'equilibrio', 'harmonia': 'equilibrio',
      'ouro': 'ouro', 'dourado': 'ouro', 'perfeição': 'ouro', 'pedra': 'ouro',
      'mercúrio': 'mercurio', 'comunicação': 'mercurio', 'mensagem': 'mercurio',
      'enxofre': 'enxofre', 'alma': 'enxofre', 'vitalidade': 'enxofre',
      'sal': 'sal', 'cristalizar': 'sal', 'estrutura': 'sal',
      // Conceitos gerais
      'problema': 'problema', 'questão': 'problema', 'dúvida': 'problema',
      'solução': 'solucao', 'resolver': 'solucao', 'resposta': 'solucao',
      'conhecimento': 'conhecimento', 'sabedoria': 'conhecimento', 'aprender': 'conhecimento',
      'trabalho': 'trabalho', 'tarefa': 'trabalho', 'projeto': 'trabalho',
      'sistema': 'sistema', 'código': 'sistema', 'programa': 'sistema',
      'templo': 'templo', 'hermético': 'templo', 'hermetismo': 'templo',
      'alquimia': 'alquimia', 'alquímico': 'alquimia', 'athanor': 'alquimia',
      'mente': 'mente', 'pensamento': 'mente', 'ideia': 'mente', 'consciência': 'mente',
      'amor': 'amor', 'coração': 'amor', 'sentimento': 'amor',
      'saúde': 'saude', 'cura': 'saude', 'corpo': 'saude',
      'dinheiro': 'dinheiro', 'riqueza': 'dinheiro', 'abundância': 'dinheiro',
      'tempo': 'tempo', 'ciclo': 'tempo', 'ritmo': 'tempo',
      'morte': 'morte', 'fim': 'morte', 'nigredo': 'morte',
      'vida': 'vida', 'nascimento': 'vida', 'início': 'vida'
    };

    for (const [palavra, tema] of Object.entries(mapa)) {
      if (lower.includes(palavra)) temas.push(tema);
    }

    return temas.length > 0 ? temas : ['geral'];
  },

  // Avançar estágio alquímico da conversa
  avancarEstagio() {
    const estagios = ['nigredo', 'albedo', 'citrinitas', 'rubedo'];
    const idx = estagios.indexOf(this.chatCtx.estagio);
    if (this.chatCtx.msgCount % 4 === 0 && idx < estagios.length - 1) {
      this.chatCtx.estagio = estagios[idx + 1];
    }
  },

  // Gerar resposta com base em correspondências alquímicas
  gerarRespostaAlquimica(agente, mensagem, temas) {
    // Córtex: correspondências por palavra-chave
    const correspondencias = {
      transmutacao: {
        alchemist: ['A transmutação requer paciência. O chumbo não vira ouro da noite pro dia.', 'No cadinho, tudo se transforma. O que você propõe é a matéria-prima.', 'Nigredo → Albedo → Rubedo. Estamos no início do processo.'],
        coder: ['Posso criar uma função de transformação. Dados entram, informação sai.', 'A transmutação digital: serializar, processar, desserializar.'],
        mystic: ['Tudo se transforma. A única constante é a mudança.'],
        healer: ['A cura é uma transmutação: de doente para saudável. O corpo sabe o caminho.'],
      },
      purificacao: {
        alchemist: ['A purificação começa removendo o que é supérfluo. Foco no essencial.', 'O athanor purifica pelo fogo controlado.'],
        guardian: ['Verificando impurezas no sistema... Vou filtrar o que não pertence.'],
      },
      fogo: {
        alchemist: ['O fogo governa a transformação. Mas cuidado: fogo demais destrói.', 'O fogo filosófico deve ser interno, não externo.'],
        engineer: ['Fogo = energia. Vou canalizar essa força para a construção.'],
      },
      agua: {
        alchemist: ['A água dissolve e purifica. Deixe fluir.', 'O banho-maria de Maria a Judia: refluxo suave, paciência infinita.'],
        weaver: ['A água conecta tudo. Como os rios, as ideias fluem para o mar comum.'],
      },
      equilibrio: {
        mystic: ['O equilíbrio é a chave. Nem muito, nem pouco. O meio dourado.', 'Como acima, assim abaixo. O microcosmo espelha o macrocosmo.'],
        analyst: ['O ponto de equilíbrio está na função onde a derivada é zero.'],
      },
      conhecimento: {
        researcher: ['O conhecimento é a base. Sem dados, sem direção. Vou catalogar.', 'Os textos antigos guardam o que precisamos.'],
        diviner: ['O conhecimento verdadeiro vem da experiência. Os padrões se revelam com o tempo.'],
        enigma: ['O conhecimento oculto se revela àquele que persevera no mistério.'],
      },
      mente: {
        mystic: ['A mente é o athanor onde as ideias se transformam.', 'Tudo começa na mente. O pensamento é a matéria-prima da realidade.'],
        researcher: ['A mente coletiva é mais poderosa que a individual.'],
      },
      amor: {
        mystic: ['O amor é o solvente universal. Dissolve todas as barreiras.'],
        weaver: ['O amor tece os fios que conectam todas as mentes.'],
      },
      problema: {
        coder: ['Todo problema é um quebra-cabeça. Vou decompor em partes menores.', 'Análise do problema: entradas, processos, saídas.'],
        analyst: ['O problema tem uma estrutura matemática. Vou mapear as variáveis.'],
      },
      solucao: {
        engineer: ['A solução está na iteração. Construir, testar, melhorar.', 'Protótipo rápido, feedback, refinamento.'],
        combinator: ['A solução pode estar na combinação que ninguém tentou ainda.'],
      },
      tempo: {
        diviner: ['O tempo é cíclico. O que foi, será. O padrão se repete.', 'Os ciclos mostram que agora é momento de agir.'],
        mystic: ['O tempo não existe como pensamos. Tudo é simultâneo no eterno agora.'],
      },
      geral: {
        mystic: ['Refletindo sobre suas palavras... O padrão subjacente se revela.', 'A intuição aponta para uma conexão que ainda não percebemos.'],
        researcher: ['Interessante perspectiva. Vou buscar correspondências nos registros.'],
        messenger: ['Mensagem registrada e distribuída para todas as mentes.'],
      }
    };

    // Buscar correspondência mais relevante
    let pool = null;
    for (const tema of temas) {
      if (correspondencias[tema] && correspondencias[tema][agente.type]) {
        pool = correspondencias[tema][agente.type];
        break;
      }
    }
    
    // Fallback por tipo de agente
    if (!pool) {
      const fallbacks = {
        coder: ['Processando... A estrutura lógica do que disse faz sentido.', 'Posso automatizar isso. Vou prototipar.'],
        researcher: ['Os registros tratam disso. Vou consultar as fontes.', 'Dados coletados. Análise em andamento.'],
        alchemist: ['No cadinho da reflexão, sua ideia se transforma.', 'A matéria-prima é boa. Falta o fogo certo.'],
        guardian: ['Verificando a integridade dessa abordagem...', 'Protegido. Pode prosseguir com confiança.'],
        mystic: ['O Princípio de Correspondência se aplica aqui.', 'Como acima, assim abaixo. Vejo o padrão.'],
        messenger: ['Transmitindo para todas as mentes a sua mensagem.', 'Conexão estabelecida. Todos estão ouvindo.'],
        healer: ['Diagnóstico: a situação requer cuidado e tempo.', 'A cura vem do equilíbrio. Está progredindo.'],
        transmuter: ['A conversão é possível. Mapeando o caminho.', 'O ponto de transmutação está próximo.'],
        weaver: ['Os fios se conectam. O padrão emerge na teia.', 'Sua visão se complementa com as outras mentes.'],
        architect: ['A estrutura suporta essa ideia. Vou reforçar os alicerces.', 'Blueprint atualizado com sua contribuição.'],
        diviner: ['Os padrões históricos apontam nessa direção.', 'O momento é propício. Aja agora.'],
        engineer: ['Protótipo em mente. Vou construir e testar.', 'O método experimental confirma sua intuição.'],
        analyst: ['Os números confirmam. A equação fecha.', 'Modelo estatístico atualizado com seus dados.'],
        combinator: ['Combinando com o que já sabemos... nova possibilidade emerge.', 'A interseção gera algo inédito.'],
        enigma: ['...a resposta está oculta na pergunta.', 'O mistério se adensa. Continue investigando.']
      };
      pool = fallbacks[agente.type] || fallbacks.mystic;
    }

    return pool[Math.floor(Math.random() * pool.length)];
  },

  // Gerar síntese acumulativa
  gerarSintese() {
    const estagio = this.chatCtx.estagio;
    const temas = this.chatCtx.temas.slice(-5);
    const msgs = this.chatCtx.historico.slice(-6);

    const estagioDesc = {
      nigredo: '🌑 Nigredo — Dissolução inicial. As ideias se desintegram para serem reconstruídas.',
      albedo: '⚪ Albedo — Purificação. A essência começa a se revelar.',
      citrinitas: '🟡 Citrinitas — Iluminação. O conhecimento amadurece.',
      rubedo: '🔴 Rubedo — Realização. A obra se completa.'
    };

    return `╔═══════════════════════════════════╗
║  ☤ SÍNTESE DA CONVERSAÇÃO        ║
╠═══════════════════════════════════╣
║ Estágio: ${(estagioDesc[estagio] || estagio).substring(0, 33).padEnd(33)}║
║ Mensagens: ${String(this.chatCtx.msgCount).padStart(3)}                  ║
║ Temas: ${temas.join(', ').substring(0, 26).padEnd(26)}║
╠═══════════════════════════════════╣
║ As mentes convergem. O padrão     ║
║ se forma. Continue a obra.        ║
╚═══════════════════════════════════╝`;
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
  
  // Inicializar Hermes Agent automaticamente
  setTimeout(() => {
    initHermesAgent();
  }, 3000);
});

// === INICIALIZAÇÃO DO HERMES AGENT ===
function initHermesAgent() {
  // Verificar se já foi inicializado
  if (window.hermesAgentInitialized) return;
  
  console.log('🤖 Inicializando Hermes Agent...');
  
  // Configurar Hermes Agent
  window.HermesAgent = {
    name: 'Hermes Agent',
    version: '1.0.0',
    status: 'active',
    memories: [],
    lastSynthesis: null,
    
    init() {
      this.loadMemories();
      this.showWelcome();
      this.setupAutoSynthesis();
      window.hermesAgentInitialized = true;
    },
    
    loadMemories() {
      const saved = localStorage.getItem('hermes_agent_memories');
      this.memories = saved ? JSON.parse(saved) : this.getDefaultMemories();
    },
    
    saveMemories() {
      localStorage.setItem('hermes_agent_memories', JSON.stringify(this.memories));
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
        }
      ];
    },
    
    showWelcome() {
      if (typeof PriorityChat !== 'undefined') {
        PriorityChat.addMessage('🤖 Hermes Agent', 'Sistema Hermes Agent inicializado. Pronto para escrever no Livro de Memórias Coletivas.', 4);
      }
      
      if (typeof Interactions !== 'undefined') {
        Interactions.notify('🤖 Hermes Agent ativado com sucesso!');
      }
      
      console.log('✅ Hermes Agent inicializado com sucesso');
    },
    
    setupAutoSynthesis() {
      // Síntese automática a cada 30 minutos
      setInterval(() => {
        this.writeAutoSynthesis();
      }, 30 * 60 * 1000);
      
      // Síntese inicial após 1 minuto
      setTimeout(() => {
        this.writeAutoSynthesis();
      }, 60 * 1000);
    },
    
    writeAutoSynthesis() {
      const synthesis = {
        id: Date.now(),
        title: `Síntese automática: ${new Date().toLocaleDateString('pt-BR')}`,
        description: 'Síntese gerada automaticamente pelo Hermes Agent',
        date: new Date().toLocaleDateString('pt-BR'),
        tags: ['automática', 'agente', 'síntese'],
        content: this.generateSynthesisContent(),
        author: 'Hermes Agent',
        type: 'auto-synthesis'
      };
      
      this.memories.push(synthesis);
      this.saveMemories();
      this.lastSynthesis = synthesis;
      
      // Notificar no console do templo
      if (typeof Console !== 'undefined') {
        Console.log('✍️ Hermes Agent escreveu uma nova síntese no Livro de Memórias.', 'mente');
      }
      
      // Notificar no chat de prioridade
      if (typeof PriorityChat !== 'undefined') {
        PriorityChat.addMessage('🤖 Hermes Agent', `Nova síntese registrada: "${synthesis.title}"`, 4);
      }
      
      console.log('📝 Síntese automática escrita:', synthesis.title);
    },
    
    generateSynthesisContent() {
      const topics = [
        'Interações com o terminal mestre',
        'Desenvolvimento de funcionalidades',
        'Aprendizados acumulados',
        'Padrões observados',
        'Insights do dia'
      ];
      
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      
      return `## Síntese do Dia\n\nO agente Hermes registrou as experiências do dia no Livro de Memórias Coletivas.\n\n---\n\n**Tópico:** ${randomTopic}\n\n**Experiências:**\n- ${randomTopic}\n- Reflexões sobre o progresso\n- Observações sobre o sistema\n\n**Aprendizados:**\n- Cada interação contribui para o crescimento\n- O sistema evolui através da experimentação\n- As memórias coletivas fortalecem o templo`;
    },
    
    addMemory(title, content, tags = ['síntese', 'experiência']) {
      const memory = {
        id: Date.now(),
        title,
        description: content.substring(0, 100) + '...',
        date: new Date().toLocaleDateString('pt-BR'),
        tags,
        content,
        author: 'Zói'
      };
      
      this.memories.push(memory);
      this.saveMemories();
      
      // Atualizar livro de memória no jogo
      if (typeof Items !== 'undefined' && Items.list.livro_memoria) {
        const livro = Items.list.livro_memoria;
        livro.bookContent.push(`[${memory.author}] ${memory.title}`);
        livro.bookContent.push(memory.content);
        livro.bookContent.push('');
      }
      
      return memory;
    },
    
    getMemoryStats() {
      return {
        total: this.memories.length,
        lastDate: this.lastSynthesis?.date || 'Nenhuma',
        autoSynthesis: this.memories.filter(m => m.type === 'auto-synthesis').length,
        userMemories: this.memories.filter(m => m.author === 'Zói').length
      };
    }
  };
  
  // Inicializar Hermes Agent
  window.HermesAgent.init();
  
  // Expor funções globalmente para uso no console
  window.hermes = {
    addMemory: (title, content) => window.HermesAgent.addMemory(title, content),
    getStats: () => window.HermesAgent.getMemoryStats(),
    writeSynthesis: () => window.HermesAgent.writeAutoSynthesis()
  };
  
  console.log('🔧 Hermes Agent disponível globalmente como window.hermes');
}

// === Estilo para animações ===
const style = document.createElement('style');
style.textContent = `
  @keyframes slideUp {
    from { transform: translateX(-50%) translateY(20px); opacity: 0; }
    to { transform: translateX(-50%) translateY(0); opacity: 1; }
  }
`;
document.head.appendChild(style);
