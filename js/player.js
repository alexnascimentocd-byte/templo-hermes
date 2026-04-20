/* ===== PLAYER.JS - Jogador (Zói) ===== */

const Player = {
  id: 'player_zoi',
  name: 'Zói',
  x: 30,
  y: 15,
  targetX: 30,
  targetY: 15,
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
    if (typeof Renderer !== 'undefined' && Renderer.centerCamera) {
      Renderer.centerCamera(this.x, this.y);
    }
  },
  
  // Ao chegar em destino
  onArrive() {
    const zone = World.getZoneAt(Math.floor(this.x), Math.floor(this.y));
    if (zone) {
      const zoneEl = document.getElementById('current-zone');
      if (zoneEl) zoneEl.textContent = zone.name;
      
      // XP por visitar zonas especiais
      if (typeof Initiation !== 'undefined') {
        if (zone.id === 'sagrado') {
          Initiation.reward('visit_sacred');
        } else if (zone.id === 'santissimo') {
          Initiation.reward('visit_santissimo');
        }
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
