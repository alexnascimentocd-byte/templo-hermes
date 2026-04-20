/* ===== RENDERER.JS - Renderização estilo Minecraft ===== */

const Renderer = {
  canvas: null,
  ctx: null,
  minimapCanvas: null,
  minimapCtx: null,
  
  // Camera
  camera: {
    x: 0,
    y: 0,
    zoom: 1,
    targetX: 20,
    targetY: 15
  },
  
  // Configurações
  tileColors: {},
  animFrame: 0,
  
  // Inicializar
  init() {
    this.canvas = document.getElementById('temple-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.minimapCanvas = document.getElementById('minimap-canvas');
    this.minimapCtx = this.minimapCanvas.getContext('2d');
    
    // Configurar tamanho
    this.resize();
    window.addEventListener('resize', () => this.resize());
    
    // Mapear cores dos blocos
    this.tileColors = World.blockColors;
    
    return this;
  },
  
  // Redimensionar
  resize() {
    const container = document.getElementById('temple-container');
    if (!container) return;
    
    this.canvas.width = container.clientWidth;
    this.canvas.height = container.clientHeight;
  },
  
  // Renderizar frame
  render() {
    const ctx = this.ctx;
    const T = World.TILE_SIZE;
    
    // Limpar
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Calcular tiles visíveis (com zoom)
    const zoom = this.camera.zoom || 1;
    const effectiveT = T * zoom;
    const startTileX = Math.floor(this.camera.x / effectiveT) - 2;
    const startTileY = Math.floor(this.camera.y / effectiveT) - 2;
    const tilesX = Math.ceil(this.canvas.width / effectiveT) + 4;
    const tilesY = Math.ceil(this.canvas.height / effectiveT) + 4;
    
    // Renderizar blocos
    for (let y = startTileY; y < startTileY + tilesY; y++) {
      for (let x = startTileX; x < startTileX + tilesX; x++) {
        const block = World.getBlock(x, y);
        if (block === World.blocks.AIR) continue;
        
        const screenX = x * effectiveT - this.camera.x;
        const screenY = y * effectiveT - this.camera.y;
        
        this.renderBlock(ctx, block, screenX, screenY, effectiveT, x, y);
      }
    }
    
    // Renderizar itens
    this.renderItems(ctx, T);
    
    // Renderizar agentes
    this.renderAgents(ctx, T);
    
    // Renderizar jogador (Zói)
    this.renderPlayer(ctx, T);
    
    // Renderizar zonas
    this.renderZoneLabels(ctx, T);
    
    // Atualizar minimapa
    this.renderMinimap();
    
    this.animFrame++;
  },
  
  // Renderizar bloco individual
  renderBlock(ctx, block, x, y, size, tileX, tileY) {
    const color = this.tileColors[block] || '#4a4a5a';
    
    // Cor base
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);
    
    // Efeito 3D pixelado (bordas)
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.fillRect(x, y, size, 2); // Topo claro
    ctx.fillRect(x, y, 2, size); // Esquerda clara
    
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(x, y + size - 2, size, 2); // Base escura
    ctx.fillRect(x + size - 2, y, 2, size); // Direita escura
    
    // Efeitos especiais por tipo
    switch (block) {
      case World.blocks.FIRE:
        // Flicker do fogo
        if (this.animFrame % 10 < 5) {
          ctx.fillStyle = '#ff9933';
          ctx.fillRect(x + 8, y + 4, 16, 12);
          ctx.fillStyle = '#ffcc00';
          ctx.fillRect(x + 12, y + 8, 8, 8);
        } else {
          ctx.fillStyle = '#ff6600';
          ctx.fillRect(x + 6, y + 6, 20, 10);
          ctx.fillStyle = '#ffaa00';
          ctx.fillRect(x + 10, y + 10, 12, 8);
        }
        break;
        
      case World.blocks.WATER:
        // Ondulação
        const offset = (this.animFrame * 2 + tileX * 5) % 20;
        ctx.fillStyle = 'rgba(100,150,255,0.3)';
        ctx.fillRect(x + offset, y + 10, 12, 4);
        ctx.fillRect(x + (offset + 10) % 20, y + 20, 8, 3);
        break;
        
      case World.blocks.GOLD:
        // Brilho dourado
        const glow = Math.sin(this.animFrame * 0.1) * 0.2 + 0.2;
        ctx.fillStyle = `rgba(255,215,0,${glow})`;
        ctx.fillRect(x + 4, y + 4, size - 8, size - 8);
        break;
        
      case World.blocks.RUNE_STONE:
        // Runa piscando
        if (this.animFrame % 60 < 30) {
          ctx.fillStyle = 'rgba(123,63,160,0.5)';
          ctx.font = '16px serif';
          ctx.fillText('ᚠ', x + 10, y + 22);
        }
        break;
        
      case World.blocks.BOOKSHELF:
        // Linhas de livros
        ctx.fillStyle = '#8b4513';
        for (let i = 0; i < 3; i++) {
          ctx.fillRect(x + 4 + i * 10, y + 4, 8, 24);
        }
        ctx.fillStyle = '#2a1a0a';
        ctx.fillRect(x + 4, y + 2, 26, 2);
        ctx.fillRect(x + 4, y + 28, 26, 2);
        break;
    }
  },
  
  // Renderizar itens do mundo
  renderItems(ctx, T) {
    // Renderizar itens do Items.registry (original)
    for (const item of Object.values(Items.registry)) {
      const screenX = item.x * T - this.camera.x;
      const screenY = item.y * T - this.camera.y;

      // Só renderizar se visível
      if (screenX < -T || screenX > this.canvas.width + T) continue;
      if (screenY < -T || screenY > this.canvas.height + T) continue;

      // Ícone do item
      ctx.font = `${T - 8}px serif`;
      ctx.textAlign = 'center';
      ctx.fillText(item.icon, screenX + T / 2, screenY + T - 4);
      
      // Runas no item
      if (item.runes.length > 0) {
        const runeGlow = Math.sin(this.animFrame * 0.05) * 0.3 + 0.7;
        ctx.fillStyle = `rgba(212,165,71,${runeGlow})`;
        ctx.font = '12px serif';
        ctx.fillText('✦', screenX + T - 8, screenY + 10);
      }
    }

    // Renderizar itens da AlchemyEconomy (itens alquímicos no chão)
    if (typeof AlchemyEconomy !== 'undefined') {
      for (const item of AlchemyEconomy.itensNoChao) {
        const screenX = item.x * T - this.camera.x;
        const screenY = item.y * T - this.camera.y;

        if (screenX < -T || screenX > this.canvas.width + T) continue;
        if (screenY < -T || screenY > this.canvas.height + T) continue;

        // Brilho pulsante por tier
        const pulse = 0.5 + Math.sin(this.animFrame * 0.08 + item.x * 0.3) * 0.3;
        const glowSize = T * (item.tier >= 3 ? 0.8 : item.tier >= 2 ? 0.6 : 0.4);

        // Halo de brilho
        ctx.globalAlpha = pulse * 0.3;
        const colors = { 1: '#888888', 2: '#4a8aff', 3: '#ffd700', 4: '#ff44ff' };
        ctx.fillStyle = colors[item.tier] || '#888';
        ctx.beginPath();
        ctx.arc(screenX + T / 2, screenY + T / 2, glowSize, 0, Math.PI * 2);
        ctx.fill();

        // Ícone do item
        ctx.globalAlpha = 1;
        ctx.font = `${T * 0.55}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.icon, screenX + T / 2, screenY + T / 2);

        // Tier indicator (pequeno número)
        if (item.tier >= 2) {
          ctx.font = '10px sans-serif';
          ctx.fillStyle = colors[item.tier];
          ctx.fillText(`T${item.tier}`, screenX + T - 6, screenY + 8);
        }
      }
      ctx.globalAlpha = 1;
    }
  },
  
  // Renderizar agentes
  renderAgents(ctx, T) {
    Agents.active.forEach(agent => {
      const screenX = agent.x * T - this.camera.x;
      const screenY = agent.y * T - this.camera.y;
      
      // Só renderizar se visível
      if (screenX < -T * 2 || screenX > this.canvas.width + T * 2) return;
      if (screenY < -T * 2 || screenY > this.canvas.height + T * 2) return;
      
      // Corpo do agente (pixelado)
      this.renderCharacter(ctx, screenX, screenY, T, agent.color, agent.icon, agent.direction, agent.frame);
      
      // Nome do agente
      ctx.fillStyle = agent.color;
      ctx.font = '10px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(agent.name, screenX + T / 2, screenY - 8);
      
      // Nível
      ctx.fillStyle = '#d4a547';
      ctx.font = '8px "Press Start 2P", monospace';
      ctx.fillText(`Lv${agent.level}`, screenX + T / 2, screenY - 1);
      
      // Ação atual
      if (agent.currentAction !== 'idle') {
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.font = '8px monospace';
        const actionText = {
          wandering: '...',
          visiting: '👁',
          reading: '📖',
          writing: '✏️',
          exchanging: '🔄'
        };
        ctx.fillText(actionText[agent.currentAction] || '', screenX + T / 2, screenY + T + 12);
      }
    });
    ctx.textAlign = 'left';
  },
  
  // Renderizar personagem (genérico)
  renderCharacter(ctx, x, y, T, color, icon, direction, frame) {
    // Sombra
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(x + 6, y + T - 6, T - 12, 6);
    
    // Corpo
    ctx.fillStyle = color;
    ctx.fillRect(x + 8, y + 12, T - 16, T - 16);
    
    // Cabeça
    ctx.fillStyle = '#f4d4a4';
    ctx.fillRect(x + 10, y + 4, T - 20, 12);
    
    // Olhos baseados na direção
    ctx.fillStyle = '#000';
    let eyeOffsetX = 0, eyeOffsetY = 6;
    switch (direction) {
      case 'left': eyeOffsetX = -2; break;
      case 'right': eyeOffsetX = 2; break;
      case 'up': eyeOffsetY = 4; break;
      case 'down': eyeOffsetY = 8; break;
    }
    ctx.fillRect(x + 12 + eyeOffsetX, y + eyeOffsetY, 3, 3);
    ctx.fillRect(x + T - 15 + eyeOffsetX, y + eyeOffsetY, 3, 3);
    
    // Ícone flutuante
    ctx.font = '14px serif';
    ctx.textAlign = 'center';
    ctx.fillText(icon, x + T / 2, y - 2);
    ctx.textAlign = 'left';
    
    // Animação de caminhada
    if (frame % 2 === 1) {
      ctx.fillStyle = color;
      ctx.fillRect(x + 10, y + T - 4, 6, 4);
      ctx.fillRect(x + T - 16, y + T - 4, 6, 4);
    }
  },
  
  // Renderizar jogador (Zói) com Olho de Horus
  renderPlayer(ctx, T) {
    if (!Player) return;
    
    const screenX = Player.x * T - this.camera.x;
    const screenY = Player.y * T - this.camera.y;
    
    // Aura dourada do jogador
    const auraGlow = Math.sin(this.animFrame * 0.08) * 0.2 + 0.3;
    ctx.fillStyle = `rgba(212,165,71,${auraGlow})`;
    ctx.beginPath();
    ctx.arc(screenX + T / 2, screenY + T / 2, T, 0, Math.PI * 2);
    ctx.fill();
    
    // Corpo
    this.renderCharacter(ctx, screenX, screenY, T, '#d4a547', '👑', Player.direction, Player.frame);
    
    // Olho de Horus na mão direita
    const handX = screenX + T - 4;
    const handY = screenY + 16;
    
    // Triângulo
    ctx.strokeStyle = '#d4a547';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(handX + 8, handY);
    ctx.lineTo(handX, handY + 16);
    ctx.lineTo(handX + 16, handY + 16);
    ctx.closePath();
    ctx.stroke();
    
    // Olho de Horus (simplificado)
    ctx.fillStyle = '#4a8aff';
    ctx.beginPath();
    ctx.ellipse(handX + 8, handY + 8, 4, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(handX + 8, handY + 8, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Nome
    ctx.fillStyle = '#ffcc00';
    ctx.font = '12px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Zói ☤', screenX + T / 2, screenY - 10);
    ctx.fillStyle = '#d4a547';
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.fillText('MESTRE', screenX + T / 2, screenY - 1);
    ctx.textAlign = 'left';
  },
  
  // Renderizar labels das zonas
  renderZoneLabels(ctx, T) {
    for (const [id, zone] of Object.entries(World.zones)) {
      const b = zone.bounds;
      const screenX = (b.x + b.w / 2) * T - this.camera.x;
      const screenY = (b.y + 1) * T - this.camera.y;
      
      // Só mostrar se visível
      if (screenY < -20 || screenY > this.canvas.height + 20) continue;
      
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(screenX - 80, screenY - 12, 160, 20);
      ctx.strokeStyle = '#d4a547';
      ctx.lineWidth = 1;
      ctx.strokeRect(screenX - 80, screenY - 12, 160, 20);
      
      ctx.fillStyle = '#d4a547';
      ctx.font = '10px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${zone.icon} ${zone.name}`, screenX, screenY + 3);
    }
    ctx.textAlign = 'left';
  },
  
  // Renderizar minimapa
  renderMinimap() {
    if (!this.minimapCtx) return;
    const ctx = this.minimapCtx;
    const w = 200, h = 200;
    
    // Fundo
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, w, h);
    
    // Zonas
    const scaleX = w / World.WORLD_WIDTH;
    const scaleY = h / World.WORLD_HEIGHT;
    
    for (const [id, zone] of Object.entries(World.zones)) {
      const b = zone.bounds;
      ctx.fillStyle = zone.color;
      ctx.fillRect(b.x * scaleX, b.y * scaleY, b.w * scaleX, b.h * scaleY);
      ctx.strokeStyle = '#d4a547';
      ctx.strokeRect(b.x * scaleX, b.y * scaleY, b.w * scaleX, b.h * scaleY);
    }
    
    // Agentes no minimapa
    Agents.active.forEach(agent => {
      ctx.fillStyle = agent.color;
      ctx.beginPath();
      ctx.arc(agent.x * scaleX, agent.y * scaleY, 3, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // Jogador no minimapa
    if (Player) {
      ctx.fillStyle = '#ffcc00';
      ctx.beginPath();
      ctx.arc(Player.x * scaleX, Player.y * scaleY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.stroke();
    }
    
    // Viewport
    const vpX = (this.camera.x / World.TILE_SIZE) * scaleX;
    const vpY = (this.camera.y / World.TILE_SIZE) * scaleY;
    const vpW = (this.canvas.width / World.TILE_SIZE) * scaleX;
    const vpH = (this.canvas.height / World.TILE_SIZE) * scaleY;
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.strokeRect(vpX, vpY, vpW, vpH);
  },
  
  // Centralizar câmera em posição
  centerCamera(x, y) {
    this.camera.targetX = x * World.TILE_SIZE - this.canvas.width / 2;
    this.camera.targetY = y * World.TILE_SIZE - this.canvas.height / 2;
  },
  
  // Atualizar câmera suavemente
  updateCamera() {
    const lerp = 0.1;
    this.camera.x += (this.camera.targetX - this.camera.x) * lerp;
    this.camera.y += (this.camera.targetY - this.camera.y) * lerp;
    
    // Limites
    const maxX = World.WORLD_WIDTH * World.TILE_SIZE - this.canvas.width;
    const maxY = World.WORLD_HEIGHT * World.TILE_SIZE - this.canvas.height;
    this.camera.x = Math.max(0, Math.min(maxX, this.camera.x));
    this.camera.y = Math.max(0, Math.min(maxY, this.camera.y));
  }
};
