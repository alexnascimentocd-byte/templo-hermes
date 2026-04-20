/* ===== INTERACTIONS.JS - Sistema de Interação ===== */

const Interactions = {
  // Estado
  selectedItem: null,
  hoveredItem: null,
  
  // Chat de prioridade
  chatMessages: [],
  maxMessages: 50,
  
  // Inicializar
  init() {
    // Click no canvas
    const canvas = document.getElementById('temple-canvas');
    // Click é tratado pelo sistema de drag (mousedown/mouseup)
    
    // Touch e navegação estilo Google Maps
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragThreshold = 5; // Pixels antes de considerar drag vs click
    let hasDragged = false;
    let lastTouchDist = 0;

    // Mouse drag para pan
    canvas.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return; // Só botão esquerdo
      isDragging = true;
      hasDragged = false;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      canvas.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      const dx = e.clientX - dragStartX;
      const dy = e.clientY - dragStartY;
      
      // Só considerar drag se passou do threshold
      if (Math.abs(dx) > dragThreshold || Math.abs(dy) > dragThreshold) {
        hasDragged = true;
      }
      
      if (hasDragged) {
        // Mover câmera (inverter direção pra parecer natural)
        Renderer.camera.targetX -= dx;
        Renderer.camera.targetY -= dy;
        Renderer.camera.x -= dx;
        Renderer.camera.y -= dy;
        
        dragStartX = e.clientX;
        dragStartY = e.clientY;
      }
    });

    window.addEventListener('mouseup', (e) => {
      if (isDragging) {
        isDragging = false;
        canvas.style.cursor = 'default';
        
        // Se não arrastou, tratar como click
        if (!hasDragged) {
          this.onCanvasClick(e);
        }
      }
    });

    // Mouse wheel para zoom
    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      
      const zoomSpeed = 0.001;
      const delta = -e.deltaY * zoomSpeed;
      
      // Zoom limitado entre 0.5x e 3x
      Renderer.camera.zoom = Math.max(0.5, Math.min(3, Renderer.camera.zoom + delta));
      
      // Zoom centrado no mouse
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      // Ajustar câmera para zoom centrado
      if (delta > 0) {
        // Zoom in: aproximar do mouse
        Renderer.camera.targetX += (mouseX - canvas.width / 2) * 0.02;
        Renderer.camera.targetY += (mouseY - canvas.height / 2) * 0.02;
      } else {
        // Zoom out: distanciar
        Renderer.camera.targetX -= (mouseX - canvas.width / 2) * 0.01;
        Renderer.camera.targetY -= (mouseY - canvas.height / 2) * 0.01;
      }
    }, { passive: false });

    // Touch para mobile — arrastar
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      
      if (e.touches.length === 1) {
        // Um dedo: arrastar
        isDragging = true;
        hasDragged = false;
        dragStartX = e.touches[0].clientX;
        dragStartY = e.touches[0].clientY;
      } else if (e.touches.length === 2) {
        // Dois dedos: pinch zoom
        isDragging = false;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        lastTouchDist = Math.sqrt(dx * dx + dy * dy);
      }
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      
      if (e.touches.length === 1 && isDragging) {
        const dx = e.touches[0].clientX - dragStartX;
        const dy = e.touches[0].clientY - dragStartY;
        
        if (Math.abs(dx) > dragThreshold || Math.abs(dy) > dragThreshold) {
          hasDragged = true;
        }
        
        if (hasDragged) {
          Renderer.camera.targetX -= dx;
          Renderer.camera.targetY -= dy;
          Renderer.camera.x -= dx;
          Renderer.camera.y -= dy;
          
          dragStartX = e.touches[0].clientX;
          dragStartY = e.touches[0].clientY;
        }
      } else if (e.touches.length === 2) {
        // Pinch zoom
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (lastTouchDist > 0) {
          const scale = dist / lastTouchDist;
          Renderer.camera.zoom = Math.max(0.5, Math.min(3, Renderer.camera.zoom * scale));
        }
        
        lastTouchDist = dist;
      }
    }, { passive: false });

    canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      
      if (e.touches.length === 0) {
        isDragging = false;
        lastTouchDist = 0;
        
        // Se não arrastou, tratar como click
        if (!hasDragged && e.changedTouches.length > 0) {
          const touch = e.changedTouches[0];
          this.onCanvasClick({ clientX: touch.clientX, clientY: touch.clientY });
        }
      }
    }, { passive: false });
    
    // Botões do painel
    document.getElementById('close-panel').addEventListener('click', () => this.closePanel());
    document.getElementById('close-agents').addEventListener('click', () => this.closeAgentsPanel());
    
    // Navegação
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => this.navigateToZone(btn.dataset.zone));
    });
    
    // Minimap toggle
    document.getElementById('btn-minimap').addEventListener('click', () => {
      const mm = document.getElementById('minimap');
      mm.classList.toggle('hidden');
      if (!mm.classList.contains('hidden')) {
        if (typeof PriorityChat !== 'undefined') PriorityChat.container.style.display = 'none';
      } else {
        if (typeof PriorityChat !== 'undefined') PriorityChat.showIfClear();
      }
    });
    
    // Agentes toggle
    document.getElementById('btn-agents').addEventListener('click', () => {
      document.getElementById('agents-panel').classList.toggle('hidden');
      this.updateAgentsList();
    });
    
    // Fullscreen
    document.getElementById('btn-fullscreen').addEventListener('click', () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        document.documentElement.requestFullscreen();
      }
    });
    
    // Livro
    document.getElementById('book-close').addEventListener('click', () => this.closeBook());
    document.getElementById('book-prev').addEventListener('click', () => this.bookPrev());
    document.getElementById('book-next').addEventListener('click', () => this.bookNext());
    document.getElementById('book-copy').addEventListener('click', () => this.copyBookText());
    
    return this;
  },
  
  // Click no canvas
  onCanvasClick(e) {
    const rect = Renderer.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Converter para coordenadas do mundo
    const worldX = Math.floor((x + Renderer.camera.x) / World.TILE_SIZE);
    const worldY = Math.floor((y + Renderer.camera.y) / World.TILE_SIZE);
    
    // Verificar se clicou em algum item
    const clickedItem = this.getItemAt(worldX, worldY);
    if (clickedItem) {
      this.selectItem(clickedItem);
      return;
    }
    
    // Verificar se clicou em algum agente
    const clickedAgent = this.getAgentAt(worldX, worldY);
    if (clickedAgent) {
      this.showAgentInfo(clickedAgent);
      return;
    }
    // Movimento apenas via D-pad, não por click no canvas
  },
  
  // Hover no canvas
  onCanvasHover(e) {
    const rect = Renderer.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const worldX = Math.floor((x + Renderer.camera.x) / World.TILE_SIZE);
    const worldY = Math.floor((y + Renderer.camera.y) / World.TILE_SIZE);
    
    const item = this.getItemAt(worldX, worldY);
    if (item !== this.hoveredItem) {
      this.hoveredItem = item;
      Renderer.canvas.style.cursor = item ? 'pointer' : 'default';
    }
  },
  
  // Obter item em posição
  getItemAt(x, y) {
    for (const item of Object.values(Items.registry)) {
      if (Math.abs(item.x - x) <= 1 && Math.abs(item.y - y) <= 1) {
        return item;
      }
    }
    return null;
  },
  
  // Obter agente em posição
  getAgentAt(x, y) {
    for (const agent of Agents.active) {
      if (Math.abs(Math.floor(agent.x) - x) <= 1 && Math.abs(Math.floor(agent.y) - y) <= 1) {
        return agent;
      }
    }
    return null;
  },
  
  // Selecionar item
  selectItem(item) {
    this.selectedItem = item;
    
    // Verificar se é o Grimório Mestre
    if (item.isGrimoire) {
      this.openGrimoire(item);
      return;
    }
    
    // Verificar se é um livro
    if (item.bookContent) {
      this.openBook(item);
      return;
    }
    
    // Mostrar painel de interação
    this.showItemPanel(item);
  },
  
  // Mostrar painel do item
  showItemPanel(item) {
    const panel = document.getElementById('interaction-panel');
    panel.classList.remove('hidden');
    
    document.getElementById('panel-title').textContent = item.name;
    document.getElementById('panel-icon').textContent = item.icon;
    document.getElementById('panel-description').textContent = item.description;
    
    // Runas
    const runesContainer = document.getElementById('panel-runes');
    if (item.runes.length > 0) {
      runesContainer.innerHTML = '<h3>✦ Runas Gravadas</h3>';
      item.runes.forEach(rune => {
        runesContainer.innerHTML += `
          <div class="rune-entry rune-active">
            <span class="rune-symbol">${rune.symbol}</span>
            <span class="rune-agent">${rune.agentName}</span>
            <div class="rune-text">${rune.meaning}</div>
          </div>
        `;
      });
    } else {
      runesContainer.innerHTML = '<h3>✦ Runas Gravadas</h3><p style="color:#8a7a5a;font-style:italic">Nenhuma runa gravada ainda.</p>';
    }
    
    // Histórico
    const historyContainer = document.getElementById('panel-history');
    if (item.interactions.length > 0) {
      historyContainer.innerHTML = '<h3>📜 Histórico de Interações</h3>';
      const recent = item.interactions.slice(-5).reverse();
      recent.forEach(inter => {
        const time = new Date(inter.timestamp).toLocaleTimeString();
        historyContainer.innerHTML += `
          <div class="history-entry">
            <div class="history-time">${time}</div>
            <div class="history-action">${inter.agentName} — ${inter.action}</div>
          </div>
        `;
      });
    } else {
      historyContainer.innerHTML = '<h3>📜 Histórico</h3><p style="color:#8a7a5a;font-style:italic">Nenhuma interação registrada.</p>';
    }
    
    // Ações
    const actions = document.getElementById('panel-actions');
    actions.innerHTML = '';
    
    if (Player) {
      actions.innerHTML += `<button onclick="Interactions.playerInteract('${item.id}')">🔮 Interagir</button>`;
      actions.innerHTML += `<button onclick="Interactions.playerInscribe('${item.id}')">✦ Gravar Runa</button>`;
    }
  },
  
  // Jogador interage com item
  playerInteract(itemId) {
    const item = Items.getItem(itemId);
    if (!item || !Player) return;
    
    Items.interact(itemId, { 
      id: Player.id, 
      name: 'Zói', 
      currentAction: 'interact' 
    });
    
    this.notify(`Você interagiu com ${item.name}`);
    this.showItemPanel(item); // Atualizar painel
  },
  
  // Jogador grava runa
  playerInscribe(itemId) {
    const item = Items.getItem(itemId);
    if (!item || !Player) return;
    
    const rune = Runes.generate({ id: Player.id, name: 'Zói' });
    item.runes.push(rune);
    
    this.notify(`✦ Runa gravada: ${rune.symbol} — ${rune.meaning}`);
    this.showItemPanel(item); // Atualizar painel
  },
  
  // Abrir livro
  openBook(item) {
    const modal = document.getElementById('book-modal');
    modal.classList.remove('hidden');
    
    document.getElementById('book-title').textContent = item.name;
    
    this.currentBook = item;
    this.currentBookPage = 0;
    this.renderBookPages();
  },
  
  // Renderizar páginas do livro
  renderBookPages() {
    if (!this.currentBook) return;
    
    const pages = this.currentBook.bookContent;
    const leftIdx = this.currentBookPage * 2;
    const rightIdx = this.currentBookPage * 2 + 1;
    
    const leftContent = (pages[leftIdx] || '').replace(/\n/g, '<br>');
    const rightContent = (pages[rightIdx] || '').replace(/\n/g, '<br>');
    
    document.getElementById('left-page-content').innerHTML = leftContent;
    document.getElementById('right-page-content').innerHTML = rightContent;
    document.getElementById('left-page-num').textContent = leftIdx + 1;
    document.getElementById('right-page-num').textContent = rightIdx + 1;
    document.getElementById('book-page-indicator').textContent = `Página ${leftIdx + 1}-${Math.min(rightIdx + 1, pages.length)}`;
  },
  
  bookPrev() {
    if (this.currentBookPage > 0) {
      this.currentBookPage--;
      this.renderBookPages();
    }
  },
  
  bookNext() {
    if (this.currentBook && (this.currentBookPage + 1) * 2 < this.currentBook.bookContent.length) {
      this.currentBookPage++;
      this.renderBookPages();
    }
  },
  
  closeBook() {
    document.getElementById('book-modal').classList.add('hidden');
    this.currentBook = null;
  },
  
  // Copiar todo o texto do livro para o clipboard
  copyBookText() {
    if (!this.currentBook) return;
    
    const pages = this.currentBook.bookContent;
    const title = this.currentBook.name || 'Livro';
    
    // Montar texto completo de todas as páginas
    let fullText = `═══ ${title} ═══\n\n`;
    
    pages.forEach((page, i) => {
      if (page && page.trim()) {
        fullText += `--- Página ${i + 1} ---\n`;
        fullText += page.replace(/<br>/g, '\n').replace(/<[^>]+>/g, '') + '\n\n';
      }
    });
    
    // Copiar para clipboard
    navigator.clipboard.writeText(fullText).then(() => {
      const btn = document.getElementById('book-copy');
      const original = btn.textContent;
      btn.textContent = '✅ Copiado!';
      btn.style.background = '#2d5a2d';
      btn.style.borderColor = '#4a8a4a';
      setTimeout(() => {
        btn.textContent = original;
        btn.style.background = '';
        btn.style.borderColor = '';
      }, 2000);
      this.notify('📋 Texto copiado para a área de transferência!');
    }).catch(() => {
      // Fallback para navegadores sem clipboard API
      const ta = document.createElement('textarea');
      ta.value = fullText;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      
      const btn = document.getElementById('book-copy');
      btn.textContent = '✅ Copiado!';
      setTimeout(() => { btn.textContent = '📋 Copiar'; }, 2000);
      this.notify('📋 Texto copiado!');
    });
  },
  
  // Abrir Grimório Mestre
  openGrimoire(item) {
    // Verificar se o jogador pode acessar
    if (item.masterOnly && !item.holder && Player) {
      this.openTerminalGrimoire(item);
    } else if (item.holder) {
      this.notify(`⚠️ O Grimório está com ${item.holder}. Use master.revoke para recuperar.`);
    } else {
      this.notify('⚠️ Apenas o Mestre pode abrir o Grimório.');
    }
  },
  
  // Terminal do Grimório
  openTerminalGrimoire(item) {
    const modal = document.getElementById('book-modal');
    modal.classList.remove('hidden');
    
    document.getElementById('book-title').textContent = '📕 GRIMÓRIO MESTRE';
    
    // Conteúdo como terminal
    const leftContent = document.getElementById('left-page-content');
    leftContent.innerHTML = `
      <div style="font-family:'Press Start 2P',monospace;font-size:8px;color:#1a4a1a;background:#0a0a0a;padding:8px;height:100%;overflow-y:auto">
        <div style="color:#d4a547">═══ GRIMÓRIO MESTRE ═══</div>
        <div style="color:#8a8a8a">Acesso: ${item.holder || 'Zói (Mestre)'}</div>
        <div style="margin-top:8px;color:#4a8aff">Comandos disponíveis:</div>
        <div style="color:#aaa">> status</div>
        <div style="color:#aaa">> agents</div>
        <div style="color:#aaa">> summon [tipo]</div>
        <div style="color:#aaa">> delegate [id] [tarefa]</div>
        <div style="color:#aaa">> revoke</div>
        <div style="color:#aaa">> evolve [id]</div>
        <div style="margin-top:8px;color:#888">Digite o comando...</div>
        <div style="margin-top:4px">
          <span style="color:#ff4444">►</span>
          <input type="text" id="grimoire-input" style="background:transparent;border:none;color:#4aff4a;font-family:inherit;font-size:inherit;width:80%;outline:none" placeholder="_">
        </div>
        <div id="grimoire-output" style="margin-top:8px"></div>
      </div>
    `;
    
    const rightContent = document.getElementById('right-page-content');
    rightContent.innerHTML = `
      <div style="font-family:'Press Start 2P',monospace;font-size:8px;color:#d4a547;padding:8px">
        <div style="text-align:center;margin-bottom:12px">☤ LOG DE ATIVIDADE ☤</div>
        <div id="grimoire-log" style="color:#8a8a8a;font-size:7px;line-height:1.8">
          ${this.getRecentActivityLog()}
        </div>
      </div>
    `;
    
    // Focar no input
    setTimeout(() => {
      const input = document.getElementById('grimoire-input');
      if (input) {
        input.focus();
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            this.executeGrimoireCommand(input.value);
            input.value = '';
          }
        });
      }
    }, 100);
  },
  
  // Executar comando do grimório
  executeGrimoireCommand(cmd) {
    const output = document.getElementById('grimoire-output');
    if (!output) return;
    
    const parts = cmd.trim().toLowerCase().split(' ');
    const command = parts[0];
    const args = parts.slice(1);
    
    let result = '';
    
    switch (command) {
      case 'status':
        result = `Agentes: ${Agents.active.length} | Zona: ${World.getZoneAt(Math.floor(Player?.x || 20), Math.floor(Player?.y || 15))?.name || 'N/A'}`;
        break;
      case 'agents':
        result = Agents.active.map(a => `${a.icon} ${a.name} Lv${a.level} (${a.currentAction})`).join('<br>');
        break;
      case 'summon':
        const type = args[0] || 'coder';
        if (Agents.types[type]) {
          const agent = Agents.create(type);
          Agents.spawn(agent.id);
          result = `✦ ${Agents.types[type].icon} ${agent.name} invocado!`;
        } else {
          result = `⚠️ Tipo inválido: ${type}. Tipos: ${Object.keys(Agents.types).join(', ')}`;
        }
        break;
      case 'delegate':
        const agentId = args[0];
        const task = args.slice(1).join(' ');
        const agent = Agents.getAgent(agentId);
        if (agent) {
          Items.registry.grimorio_mestre.holder = agent.name;
          result = `📜 Grimório delegado a ${agent.name} para: ${task || 'tarefa geral'}`;
        } else {
          result = '⚠️ Agente não encontrado.';
        }
        break;
      case 'revoke':
        Items.registry.grimorio_mestre.holder = null;
        result = '✦ Grimório recuperado pelo Mestre.';
        break;
      case 'evolve':
        const target = args[0];
        const tgtAgent = Agents.getAgent(target);
        if (tgtAgent) {
          Agents.gainExperience(tgtAgent, 100);
          result = `✦ ${tgt_agent.name} ganhou 100 XP!`;
        } else {
          result = '⚠️ Agente não encontrado.';
        }
        break;
      case 'chat':
        const msg = args.join(' ');
        if (msg) {
          this.addChatMessage('Zói', msg, 5); // Prioridade máxima
          result = `💬 Mensagem enviada: "${msg}"`;
        }
        break;
      default:
        result = `⚠️ Comando desconhecido: ${command}`;
    }
    
    output.innerHTML += `<div style="color:#4aff4a;margin-top:4px">> ${cmd}</div><div style="color:#aaa">${result}</div>`;
    output.scrollTop = output.scrollHeight;
  },
  
  // Log de atividade recente
  getRecentActivityLog() {
    const logs = [];
    Agents.active.forEach(agent => {
      logs.push(`${agent.icon} ${agent.name}: ${agent.currentAction}`);
    });
    return logs.join('<br>') || 'Nenhuma atividade recente.';
  },
  
  // Fechar painel
  closePanel() {
    document.getElementById('interaction-panel').classList.add('hidden');
    this.selectedItem = null;
  },
  
  // Mostrar info do agente
  showAgentInfo(agent) {
    // Abrir grimório com diário do NPC (como pegar o livro na mão)
    if (typeof NPCGrimoire !== 'undefined') {
      // Fechar outros painéis
      document.querySelectorAll('.panel').forEach(p => p.classList.add('hidden'));
      
      // Abrir grimório
      const panel = document.getElementById('grimoire-panel');
      if (panel) {
        panel.classList.remove('hidden');
        
        // Ir pra aba de diário
        NPCGrimoire.switchTabDirect('diario');
        
        // Selecionar o NPC clicado
        NPCGrimoire.selecionarNPC(agent.type);
      }
      
      this.notify(`📖 Abrindo grimório de ${agent.icon} ${agent.name}...`);
    } else {
      this.notify(`${agent.icon} ${agent.name} — Nível ${agent.level} | ${agent.skill} | ${agent.currentAction}`);
    }
  },
  
  // Navegar para zona
  navigateToZone(zoneId) {
    // Atualizar botões ativos
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.zone === zoneId);
    });
    
    // Centralizar câmera na zona
    const center = World.getZoneCenter(zoneId);
    Renderer.centerCamera(center.x, center.y);
    
    // Mover jogador
    if (Player) {
      Player.moveTo(center.x, center.y + 2);
    }
    
    // Atualizar HUD
    const zone = World.zones[zoneId];
    document.getElementById('current-zone').textContent = zone ? zone.name : 'Desconhecido';
  },
  
  // Atualizar lista de agentes
  updateAgentsList() {
    const list = document.getElementById('agents-list');
    list.innerHTML = '';
    
    // Seção: Agentes Ativos
    if (Agents.active.length > 0) {
      const activeHeader = document.createElement('div');
      activeHeader.style.cssText = 'color:#ffcc00;font-size:10px;padding:8px;border-bottom:1px solid #4a1a6b;margin-bottom:4px';
      activeHeader.textContent = `🔴 ATIVOS (${Agents.active.length}/15)`;
      list.appendChild(activeHeader);
    }
    
    Agents.active.forEach(agent => {
      const card = document.createElement('div');
      card.className = 'agent-card';
      card.style.cursor = 'pointer';
      card.innerHTML = `
        <div class="agent-header">
          <div class="agent-avatar">${agent.icon}</div>
          <div>
            <div class="agent-name">${agent.name}</div>
            <div class="agent-level">Nível ${agent.level} • ${agent.skill}</div>
            <div style="color:#8a7a5a;font-size:7px;margin-top:2px">${agent.hermetic || ''}</div>
          </div>
        </div>
        <div class="agent-status">Status: ${agent.currentAction}</div>
        <div class="agent-location">📍 ${World.getZoneAt(Math.floor(agent.x), Math.floor(agent.y))?.name || 'N/A'}</div>
        <div style="margin-top:6px;font-size:0.75rem;color:#8a8a8a">
          XP: ${agent.experience}/${agent.expToNext} | Runas: ${agent.runes.length} | Cartas: ${agent.inbox.length}
        </div>
        <div style="text-align:center;margin-top:6px;font-size:0.7rem;color:#d4a547">📖 Abrir Grimório</div>
      `;
      // Click pra abrir grimório do NPC
      card.addEventListener('click', () => {
        this.showAgentInfo(agent);
      });
      list.appendChild(card);
    });

    // Seção: Em Reserva (roster mas não ativos)
    const inactive = Agents.roster.filter(a => !Agents.active.find(ac => ac.id === a.id));
    if (inactive.length > 0) {
      const reserveHeader = document.createElement('div');
      reserveHeader.style.cssText = 'color:#888;font-size:10px;padding:8px;border-bottom:1px solid #2a2a4a;margin:8px 0 4px';
      reserveHeader.textContent = `💤 EM RESERVA (${inactive.length})`;
      list.appendChild(reserveHeader);

      inactive.forEach(agent => {
        const card = document.createElement('div');
        card.className = 'agent-card';
        card.style.opacity = '0.5';
        card.innerHTML = `
          <div class="agent-header">
            <div class="agent-avatar">${agent.icon}</div>
            <div>
              <div class="agent-name">${agent.name}</div>
              <div class="agent-level">${agent.skill} • Nível ${agent.level}</div>
              <div style="color:#8a7a5a;font-size:7px;margin-top:2px">${agent.hermetic || ''}</div>
            </div>
          </div>
          <div class="agent-description" style="color:#8a8a8a;font-size:7px;margin-top:4px">${agent.description}</div>
        `;
        // Click to spawn
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
          Agents.spawn(agent.id);
          this.updateAgentsList();
          PriorityChat.addMessage('Sistema', `${agent.icon} ${agent.name} invocado ao templo!`, 3);
        });
        list.appendChild(card);
      });
    }
    
    // Adicionar jogador
    if (Player) {
      const playerCard = document.createElement('div');
      playerCard.className = 'agent-card active';
      playerCard.innerHTML = `
        <div class="agent-header">
          <div class="agent-avatar">👑</div>
          <div>
            <div class="agent-name" style="color:#ffcc00">Zói (Você)</div>
            <div class="agent-level">Mestre do Templo</div>
          </div>
        </div>
        <div class="agent-status">Nível de Iniciação: ${Initiation.getLevel()}</div>
        <div class="agent-location">📍 ${World.getZoneAt(Math.floor(Player.x), Math.floor(Player.y))?.name || 'N/A'}</div>
      `;
      list.insertBefore(playerCard, list.firstChild);
    }
  },
  
  // Fechar painel de agentes
  closeAgentsPanel() {
    document.getElementById('agents-panel').classList.add('hidden');
    if (typeof PriorityChat !== 'undefined') PriorityChat.showIfClear();
  },
  
  // Sistema de Chat com prioridade
  addChatMessage(sender, message, priority = 1) {
    // Prioridade: 1=baixa, 2=normal, 3=importante, 4=urgente, 5=mestre
    const msg = {
      sender,
      message,
      priority,
      timestamp: Date.now(),
      id: `msg_${Date.now()}`
    };
    
    this.chatMessages.push(msg);
    
    // Manter tamanho limitado
    if (this.chatMessages.length > this.maxMessages) {
      this.chatMessages.shift();
    }
    
    // Notificar se prioridade alta
    if (priority >= 3) {
      this.notify(`${this.getPriorityIcon(priority)} ${sender}: ${message}`);
    }
  },
  
  getPriorityIcon(priority) {
    const icons = ['', '💬', '💬', '⚡', '🔥', '👑'];
    return icons[priority] || '💬';
  },
  
  // Notificação
  notify(message) {
    // Verificar se algum painel está aberto — não mostrar toast se estiver
    const panels = ['console-panel', 'chat-panel', 'council-panel', 'inbox-panel', 'settings-panel', 'agents-panel'];
    const panelOpen = panels.some(id => {
      const el = document.getElementById(id);
      return el && !el.classList.contains('hidden');
    });

    if (panelOpen) return; // Não mostrar notificação se painel aberto

    // Criar toast
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed; top: 58px; left: 50%; transform: translateX(-50%);
      background: rgba(26,26,46,0.95); border: 2px solid #d4a547;
      color: #f4e4c1; padding: 10px 20px; z-index: 90;
      font-family: 'MedievalSharp', cursive; font-size: 13px;
      border-radius: 6px; max-width: 90vw; text-align: center;
      animation: slideDown 0.3s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.5s';
      setTimeout(() => toast.remove(), 500);
    }, 3000);
  }
};
