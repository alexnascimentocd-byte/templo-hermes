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
    Renderer.init();
    Interactions.init();
    PriorityChat.init();
    Initiation.updateBadge();
    
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
