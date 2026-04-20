// === renderer.js ===
const Renderer = {
  canvas: null,
  ctx: null,
  minimapCanvas: null,
  minimapCtx: null,
  camera: {
    x: 0,
    y: 0,
    zoom: 1,
    targetX: 20,
    targetY: 15
  },
  tileColors: {},
  animFrame: 0,
  init() {
    this.canvas = document.getElementById('temple-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.minimapCanvas = document.getElementById('minimap-canvas');
    this.minimapCtx = this.minimapCanvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.tileColors = World.blockColors;
    return this;
  },
  resize() {
    const container = document.getElementById('temple-container');
    if (!container) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
    }
  },
  render() {
    const ctx = this.ctx;
    const T = World.TILE_SIZE;
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    const zoom = this.camera.zoom || 1;
    const effectiveT = T * zoom;
    const startTileX = Math.floor(this.camera.x / effectiveT) - 2;
    const startTileY = Math.floor(this.camera.y / effectiveT) - 2;
    const tilesX = Math.ceil(this.canvas.width / effectiveT) + 4;
    const tilesY = Math.ceil(this.canvas.height / effectiveT) + 4;
    for (let y = startTileY; y < startTileY + tilesY; y++) {
      for (let x = startTileX; x < startTileX + tilesX; x++) {
        const block = World.getBlock(x, y);
        if (block === World.blocks.AIR) continue;
        const screenX = x * effectiveT - this.camera.x;
        const screenY = y * effectiveT - this.camera.y;
        this.renderBlock(ctx, block, screenX, screenY, effectiveT, x, y);
      }
    }
    this.renderItems(ctx, T);
    this.renderAgents(ctx, T);
    this.renderPlayer(ctx, T);
    this.renderZoneLabels(ctx, T);
    this.renderMinimap();
    this.animFrame++;
  },
  renderBlock(ctx, block, x, y, size, tileX, tileY) {
    const color = this.tileColors[block] || '#4a4a5a';
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.fillRect(x, y, size, 2);
    ctx.fillRect(x, y, 2, size);
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(x, y + size - 2, size, 2);
    ctx.fillRect(x + size - 2, y, 2, size);
    switch (block) {
      case World.blocks.FIRE:
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
        const offset = (this.animFrame * 2 + tileX * 5) % 20;
        ctx.fillStyle = 'rgba(100,150,255,0.3)';
        ctx.fillRect(x + offset, y + 10, 12, 4);
        ctx.fillRect(x + (offset + 10) % 20, y + 20, 8, 3);
        break;
      case World.blocks.GOLD:
        const glow = Math.sin(this.animFrame * 0.1) * 0.2 + 0.2;
        ctx.fillStyle = `rgba(255,215,0,${glow})`;
        ctx.fillRect(x + 4, y + 4, size - 8, size - 8);
        break;
      case World.blocks.RUNE_STONE:
        if (this.animFrame % 60 < 30) {
          ctx.fillStyle = 'rgba(123,63,160,0.5)';
          ctx.font = '16px serif';
          ctx.fillText('ᚠ', x + 10, y + 22);
        }
        break;
      case World.blocks.BOOKSHELF:
        ctx.fillStyle = '#8b4513';
        for (let i = 0; i < 3; i++) {
          ctx.fillRect(x + 4 + i * 10, y + 4, 8, 24);
        }
        ctx.fillStyle = '#2a1a0a';
        ctx.fillRect(x + 4, y + 2, 26, 2);
        ctx.fillRect(x + 4, y + 28, 26, 2);
        break;
      case World.blocks.DESERT:
        ctx.fillStyle = 'rgba(180,150,80,0.15)';
        const sandOff = (this.animFrame + tileX * 3 + tileY * 7) % 12;
        ctx.fillRect(x + sandOff, y + 8, 16, 3);
        ctx.fillRect(x + (sandOff + 6) % 12, y + 20, 12, 2);
        break;
      case World.blocks.SAND:
        ctx.fillStyle = 'rgba(255,240,200,0.1)';
        ctx.fillRect(x + 4, y + 4, 4, 4);
        ctx.fillRect(x + 20, y + 16, 6, 6);
        break;
      case World.blocks.DUNE:
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.beginPath();
        ctx.moveTo(x, y + size);
        ctx.lineTo(x + size/2, y + 8);
        ctx.lineTo(x + size, y + size);
        ctx.fill();
        break;
      case World.blocks.CACTUS:
        ctx.fillStyle = '#1a4a1a';
        ctx.fillRect(x + 12, y + 4, 8, 24);
        ctx.fillRect(x + 4, y + 12, 8, 8);
        ctx.fillRect(x + 20, y + 8, 8, 10);
        ctx.fillStyle = '#3a7a3a';
        ctx.fillRect(x + 14, y + 6, 4, 20);
        break;
      case World.blocks.BONE:
        ctx.fillStyle = '#ddd0b8';
        ctx.fillRect(x + 8, y + 14, 16, 4);
        ctx.fillRect(x + 6, y + 10, 4, 12);
        ctx.fillRect(x + 22, y + 10, 4, 12);
        break;
      case World.blocks.RUINS:
        ctx.fillStyle = '#5a4a3a';
        ctx.fillRect(x + 2, y + 2, 12, 18);
        ctx.fillRect(x + 18, y + 8, 12, 22);
        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        ctx.fillRect(x + 6, y + 6, 4, 8);
        break;
      case World.blocks.AMETHYST:
        const amGlow = Math.sin(this.animFrame * 0.08 + tileX) * 0.15 + 0.2;
        ctx.fillStyle = `rgba(180,100,255,${amGlow})`;
        ctx.fillRect(x + 4, y + 4, size - 8, size - 8);
        ctx.fillStyle = 'rgba(255,200,255,0.15)';
        ctx.fillRect(x + 8, y + 8, 8, 8);
        break;
      case World.blocks.BLUE_CRYSTAL:
        const blGlow = Math.sin(this.animFrame * 0.08 + tileY) * 0.15 + 0.2;
        ctx.fillStyle = `rgba(80,150,255,${blGlow})`;
        ctx.fillRect(x + 4, y + 4, size - 8, size - 8);
        ctx.fillStyle = 'rgba(200,230,255,0.15)';
        ctx.fillRect(x + 8, y + 8, 8, 8);
        break;
    }
  },
  renderItems(ctx, T) {
    for (const item of Object.values(Items.registry)) {
      const screenX = item.x * T - this.camera.x;
      const screenY = item.y * T - this.camera.y;
      if (screenX < -T || screenX > this.canvas.width + T) continue;
      if (screenY < -T || screenY > this.canvas.height + T) continue;
      ctx.font = `${T - 8}px serif`;
      ctx.textAlign = 'center';
      ctx.fillText(item.icon, screenX + T / 2, screenY + T - 4);
      if (item.runes.length > 0) {
        const runeGlow = Math.sin(this.animFrame * 0.05) * 0.3 + 0.7;
        ctx.fillStyle = `rgba(212,165,71,${runeGlow})`;
        ctx.font = '12px serif';
        ctx.fillText('✦', screenX + T - 8, screenY + 10);
      }
    }
    if (typeof AlchemyEconomy !== 'undefined') {
      for (const item of AlchemyEconomy.itensNoChao) {
        const screenX = item.x * T - this.camera.x;
        const screenY = item.y * T - this.camera.y;
        if (screenX < -T || screenX > this.canvas.width + T) continue;
        if (screenY < -T || screenY > this.canvas.height + T) continue;
        const pulse = 0.5 + Math.sin(this.animFrame * 0.08 + item.x * 0.3) * 0.3;
        const glowSize = T * (item.tier >= 3 ? 0.8 : item.tier >= 2 ? 0.6 : 0.4);
        ctx.globalAlpha = pulse * 0.3;
        const colors = { 1: '#888888', 2: '#4a8aff', 3: '#ffd700', 4: '#ff44ff' };
        ctx.fillStyle = colors[item.tier] || '#888';
        ctx.beginPath();
        ctx.arc(screenX + T / 2, screenY + T / 2, glowSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.font = `${T * 0.55}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.icon, screenX + T / 2, screenY + T / 2);
        if (item.tier >= 2) {
          ctx.font = '10px sans-serif';
          ctx.fillStyle = colors[item.tier];
          ctx.fillText(`T${item.tier}`, screenX + T - 6, screenY + 8);
        }
      }
      ctx.globalAlpha = 1;
    }
  },
  renderAgents(ctx, T) {
    Agents.active.forEach(agent => {
      const screenX = agent.x * T - this.camera.x;
      const screenY = agent.y * T - this.camera.y;
      if (screenX < -T * 2 || screenX > this.canvas.width + T * 2) return;
      if (screenY < -T * 2 || screenY > this.canvas.height + T * 2) return;
      this.renderCharacter(ctx, screenX, screenY, T, agent.color, agent.icon, agent.direction, agent.frame);
      ctx.fillStyle = agent.color;
      ctx.font = '10px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(agent.name, screenX + T / 2, screenY - 8);
      ctx.fillStyle = '#d4a547';
      ctx.font = '8px "Press Start 2P", monospace';
      ctx.fillText(`Lv${agent.level}`, screenX + T / 2, screenY - 1);
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
  renderCharacter(ctx, x, y, T, color, icon, direction, frame) {
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(x + 6, y + T - 6, T - 12, 6);
    ctx.fillStyle = color;
    ctx.fillRect(x + 8, y + 12, T - 16, T - 16);
    ctx.fillStyle = '#f4d4a4';
    ctx.fillRect(x + 10, y + 4, T - 20, 12);
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
    ctx.font = '14px serif';
    ctx.textAlign = 'center';
    ctx.fillText(icon, x + T / 2, y - 2);
    ctx.textAlign = 'left';
    if (frame % 2 === 1) {
      ctx.fillStyle = color;
      ctx.fillRect(x + 10, y + T - 4, 6, 4);
      ctx.fillRect(x + T - 16, y + T - 4, 6, 4);
    }
  },
  renderPlayer(ctx, T) {
    if (!Player) return;
    const screenX = Player.x * T - this.camera.x;
    const screenY = Player.y * T - this.camera.y;
    const auraGlow = Math.sin(this.animFrame * 0.08) * 0.2 + 0.3;
    ctx.fillStyle = `rgba(212,165,71,${auraGlow})`;
    ctx.beginPath();
    ctx.arc(screenX + T / 2, screenY + T / 2, T, 0, Math.PI * 2);
    ctx.fill();
    this.renderCharacter(ctx, screenX, screenY, T, '#d4a547', '👑', Player.direction, Player.frame);
    const handX = screenX + T - 4;
    const handY = screenY + 16;
    ctx.strokeStyle = '#d4a547';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(handX + 8, handY);
    ctx.lineTo(handX, handY + 16);
    ctx.lineTo(handX + 16, handY + 16);
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = '#4a8aff';
    ctx.beginPath();
    ctx.ellipse(handX + 8, handY + 8, 4, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(handX + 8, handY + 8, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffcc00';
    ctx.font = '12px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Zói ☤', screenX + T / 2, screenY - 10);
    ctx.fillStyle = '#d4a547';
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.fillText('MESTRE', screenX + T / 2, screenY - 1);
    ctx.textAlign = 'left';
  },
  renderZoneLabels(ctx, T) {
    const zoom = this.camera.zoom || 1;
    const effectiveT = T * zoom;
    for (const [id, zone] of Object.entries(World.zones)) {
      const b = zone.bounds;
      const screenX = (b.x + b.w / 2) * effectiveT - this.camera.x;
      const screenY = (b.y + 1) * effectiveT - this.camera.y;
      if (screenY < -30 || screenY > this.canvas.height + 30) continue;
      if (screenX < -100 || screenX > this.canvas.width + 100) continue;
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(screenX - 80, screenY - 12, 160, 20);
      ctx.strokeStyle = zone.color || '#d4a547';
      ctx.lineWidth = 1;
      ctx.strokeRect(screenX - 80, screenY - 12, 160, 20);
      ctx.fillStyle = zone.color || '#d4a547';
      ctx.font = '10px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${zone.icon} ${zone.name}`, screenX, screenY + 3);
      if (zone.numeral) {
        const numY = screenY - 24;
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(screenX - 30, numY - 14, 26, 18);
        ctx.fillStyle = World.numeralSystems.caldeu.colors[
          parseInt(zone.numeral.caldeu.replace('VIII','7').replace('VII','6').replace('VI','5').replace('IV','3').replace('III','2').replace('II','1').replace('V','4').replace('I','0')) || 0
        ] || '#ffd700';
        ctx.font = 'bold 12px monospace';
        ctx.fillText(zone.numeral.caldeu, screenX - 17, numY);
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(screenX + 6, numY - 14, 24, 18);
        ctx.fillStyle = '#ffd700';
        ctx.font = '14px serif';
        ctx.fillText(zone.numeral.alquimico, screenX + 18, numY);
      }
      if (zone.octagram === 'duplo') {
        const indY = screenY - 24;
        ctx.fillStyle = 'rgba(33,150,243,0.7)';
        ctx.fillRect(screenX - 14, indY - 14, 28, 18);
        ctx.fillStyle = '#fff';
        ctx.font = '10px monospace';
        ctx.fillText('⬡ II', screenX, indY);
      } else if (zone.octagram === 'ninhado') {
        const indY = screenY - 24;
        ctx.fillStyle = 'rgba(121,85,72,0.7)';
        ctx.fillRect(screenX - 14, indY - 14, 28, 18);
        ctx.fillStyle = '#fff';
        ctx.font = '10px monospace';
        ctx.fillText('◎ III', screenX, indY);
      }
    }
    ctx.textAlign = 'left';
  },
  renderMinimap() {
    if (!this.minimapCtx) return;
    const ctx = this.minimapCtx;
    const w = 200, h = 200;
    ctx.fillStyle = '#1a1510';
    ctx.fillRect(0, 0, w, h);
    const scaleX = w / World.WORLD_WIDTH;
    const scaleY = h / World.WORLD_HEIGHT;
    for (let y = 0; y < World.WORLD_HEIGHT; y += 2) {
      for (let x = 0; x < World.WORLD_WIDTH; x += 2) {
        const block = World.getBlock(x, y);
        if ([World.blocks.DESERT, World.blocks.SAND, World.blocks.DUNE].includes(block)) {
          ctx.fillStyle = World.blockColors[block] || '#c2a05a';
          ctx.globalAlpha = 0.3;
          ctx.fillRect(x * scaleX, y * scaleY, scaleX * 2, scaleY * 2);
          ctx.globalAlpha = 1;
        }
      }
    }
    ctx.strokeStyle = 'rgba(123,63,160,0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(World.CENTER_X * scaleX, World.CENTER_Y * scaleY, 6 * scaleX, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(155,89,182,0.3)';
    ctx.beginPath();
    ctx.arc(World.CENTER_X * scaleX, World.CENTER_Y * scaleY, 12 * scaleX, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(121,85,72,0.3)';
    ctx.beginPath();
    ctx.arc(World.CENTER_X * scaleX, World.CENTER_Y * scaleY, 19 * scaleX, 0, Math.PI * 2);
    ctx.stroke();
    for (const [id, zone] of Object.entries(World.zones)) {
      const b = zone.bounds;
      ctx.fillStyle = zone.color;
      ctx.fillRect(b.x * scaleX, b.y * scaleY, b.w * scaleX, b.h * scaleY);
      ctx.strokeStyle = '#d4a547';
      ctx.strokeRect(b.x * scaleX, b.y * scaleY, b.w * scaleX, b.h * scaleY);
    }
    Agents.active.forEach(agent => {
      ctx.fillStyle = agent.color;
      ctx.beginPath();
      ctx.arc(agent.x * scaleX, agent.y * scaleY, 3, 0, Math.PI * 2);
      ctx.fill();
    });
    if (Player) {
      ctx.fillStyle = '#ffcc00';
      ctx.beginPath();
      ctx.arc(Player.x * scaleX, Player.y * scaleY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.stroke();
    }
    const vpX = (this.camera.x / World.TILE_SIZE) * scaleX;
    const vpY = (this.camera.y / World.TILE_SIZE) * scaleY;
    const vpW = (this.canvas.width / World.TILE_SIZE) * scaleX;
    const vpH = (this.canvas.height / World.TILE_SIZE) * scaleY;
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.strokeRect(vpX, vpY, vpW, vpH);
  },
  centerCamera(x, y) {
    this.camera.targetX = x * World.TILE_SIZE - this.canvas.width / 2;
    this.camera.targetY = y * World.TILE_SIZE - this.canvas.height / 2;
  },
  updateCamera() {
    const lerp = 0.1;
    this.camera.x += (this.camera.targetX - this.camera.x) * lerp;
    this.camera.y += (this.camera.targetY - this.camera.y) * lerp;
    const zoom = this.camera.zoom || 1;
    const worldPixelW = World.WORLD_WIDTH * World.TILE_SIZE;
    const worldPixelH = World.WORLD_HEIGHT * World.TILE_SIZE;
    const visibleW = this.canvas.width / zoom;
    const visibleH = this.canvas.height / zoom;
    let maxX, maxY;
    if (visibleW >= worldPixelW) {
      maxX = (worldPixelW - visibleW) / 2;
      this.camera.targetX = maxX;
    } else {
      maxX = worldPixelW - visibleW;
    }
    if (visibleH >= worldPixelH) {
      maxY = (worldPixelH - visibleH) / 2;
      this.camera.targetY = maxY;
    } else {
      maxY = worldPixelH - visibleH;
    }
    this.camera.x = Math.max(0, Math.min(maxX, this.camera.x));
    this.camera.y = Math.max(0, Math.min(maxY, this.camera.y));
  }
};

// === renderer-3d.js ===
const Renderer3D = {
  enabled: false,
  scene: null,
  camera: null,
  renderer: null,
  controls: null,
  clock: null,
  worldGroup: null,
  agentsGroup: null,
  playerGroup: null,
  itemsGroup: null,
  blockMeshes: {},
  agentMeshes: {},
  itemMeshes: {},
  config: {
    blockSize: 1,
    blockHeight: 1,
    maxRenderDistance: 30,
    cameraDistance: 25,
    cameraAngle: 45,
    rotationSpeed: 0.002,
    colors: {
      GRASS: 0x4a8a4a,
      STONE: 0x808080,
      WATER: 0x4a8aff,
      SAND: 0xd4a547,
      WOOD: 0x8b6914,
      LEAVES: 0x2d8a2d,
      GOLD: 0xffd700,
      MARBLE: 0xe8e8e8,
      LAVA: 0xff4500,
      CRYSTAL: 0x88ccff,
      DARK: 0x1a1a2e,
      RUNE: 0x9944ff,
      AIR: null
    },
    agentColors: {
      coder: 0x4a8aff,
      researcher: 0x8a4aff,
      alchemist: 0xff8a4a,
      guardian: 0x4aff8a,
      mystic: 0xffcc00,
      messenger: 0xff4a8a,
      healer: 0x4affaa,
      transmuter: 0xff6b35,
      weaver: 0xe040fb,
      architect: 0x7c4dff,
      diviner: 0x7c4dff,
      engineer: 0x78909c,
      analyst: 0xffd54f,
      combinator: 0xffab40,
      enigma: 0xce93d8,
      medical: 0x00e676
    }
  },
  init() {
    if (this.enabled) return this;
    if (typeof THREE === 'undefined') {
      console.error('[Renderer3D] Three.js não carregado. Inclua via CDN.');
      return null;
    }
    this.clock = new THREE.Clock();
    this.createContainer();
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0a1a);
    this.scene.fog = new THREE.Fog(0x0a0a1a, 20, 60);
    const container = document.getElementById('renderer-3d-container');
    const aspect = container.clientWidth / container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
    this.camera.position.set(
      World.CENTER_X * this.config.blockSize,
      this.config.cameraDistance,
      World.CENTER_Y * this.config.blockSize + 15
    );
    this.camera.lookAt(
      World.CENTER_X * this.config.blockSize,
      0,
      World.CENTER_Y * this.config.blockSize
    );
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);
    this.setupLighting();
    this.worldGroup = new THREE.Group();
    this.agentsGroup = new THREE.Group();
    this.playerGroup = new THREE.Group();
    this.itemsGroup = new THREE.Group();
    this.scene.add(this.worldGroup);
    this.scene.add(this.agentsGroup);
    this.scene.add(this.playerGroup);
    this.scene.add(this.itemsGroup);
    this.setupControls();
    window.addEventListener('resize', () => this.onResize());
    this.buildWorld();
    this.animate();
    this.enabled = true;
    return this;
  },
  createContainer() {
    let container = document.getElementById('renderer-3d-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'renderer-3d-container';
      container.style.cssText = `
        position: fixed;
        top: 56px; left: 0; right: 0; bottom: 0;
        z-index: 50;
        display: none;
        background: #0a0a1a;
      `;
      document.body.appendChild(container);
      const backBtn = document.createElement('button');
      backBtn.id = 'btn-back-2d';
      backBtn.innerHTML = '⬅️ Voltar ao 2D';
      backBtn.style.cssText = `
        position: absolute;
        top: 10px; left: 10px;
        z-index: 60;
        background: rgba(26,26,46,0.9);
        color: #4aff4a;
        border: 2px solid #4aff4a;
        padding: 8px 16px;
        font-family: 'Press Start 2P', monospace;
        font-size: 10px;
        cursor: pointer;
        border-radius: 4px;
      `;
      backBtn.addEventListener('click', () => {
        if (typeof Game !== 'undefined' && Game.toggle3D) {
          Game.toggle3D();
        } else {
          Renderer3D.toggle();
        }
      });
      container.appendChild(backBtn);
      const hud3d = document.createElement('div');
      hud3d.id = 'hud-3d';
      hud3d.style.cssText = `
        position: absolute;
        top: 10px; right: 10px;
        z-index: 60;
        background: rgba(26,26,46,0.85);
        color: #d4a547;
        border: 1px solid #4a1a6b;
        padding: 10px;
        font-family: 'Press Start 2P', monospace;
        font-size: 8px;
        border-radius: 4px;
        min-width: 150px;
      `;
      hud3d.innerHTML = `
        <div>🌍 Modo 3D</div>
        <div id="hud-3d-agents" style="margin-top:5px;color:#aaa">Agentes: 0</div>
        <div id="hud-3d-theme" style="color:#4aff4a">Tema: Criatividade</div>
        <div id="hud-3d-conv" style="color:#ffcc00">Conversas: 0</div>
      `;
      container.appendChild(hud3d);
      const instructions = document.createElement('div');
      instructions.id = 'instructions-3d';
      instructions.style.cssText = `
        position: absolute;
        bottom: 10px; left: 50%;
        transform: translateX(-50%);
        z-index: 60;
        background: rgba(26,26,46,0.85);
        color: #aaa;
        border: 1px solid #4a1a6b;
        padding: 8px 16px;
        font-family: 'Press Start 2P', monospace;
        font-size: 7px;
        border-radius: 4px;
        text-align: center;
      `;
      instructions.innerHTML = `
        🖱️ Arraste = Rotacionar | 🔄 Scroll = Zoom | Touch = Pinch/Arraste
      `;
      container.appendChild(instructions);
    }
  },
  setupLighting() {
    const ambient = new THREE.AmbientLight(0x404060, 0.6);
    this.scene.add(ambient);
    const sun = new THREE.DirectionalLight(0xffeedd, 0.8);
    sun.position.set(30, 50, 20);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 100;
    sun.shadow.camera.left = -40;
    sun.shadow.camera.right = 40;
    sun.shadow.camera.top = 40;
    sun.shadow.camera.bottom = -40;
    this.scene.add(sun);
    const templeLight = new THREE.PointLight(0xd4a547, 0.5, 30);
    templeLight.position.set(
      World.CENTER_X * this.config.blockSize,
      10,
      World.CENTER_Y * this.config.blockSize
    );
    this.scene.add(templeLight);
  },
  setupControls() {
    const container = document.getElementById('renderer-3d-container');
    let isDragging = false;
    let previousMouse = { x: 0, y: 0 };
    let cameraTheta = Math.PI / 4;
    let cameraPhi = Math.PI / 6;
    let cameraRadius = this.config.cameraDistance;
    const updateCamera = () => {
      const cx = World.CENTER_X * this.config.blockSize;
      const cz = World.CENTER_Y * this.config.blockSize;
      this.camera.position.x = cx + cameraRadius * Math.sin(cameraTheta) * Math.cos(cameraPhi);
      this.camera.position.y = cameraRadius * Math.sin(cameraPhi);
      this.camera.position.z = cz + cameraRadius * Math.cos(cameraTheta) * Math.cos(cameraPhi);
      this.camera.lookAt(cx, 0, cz);
    };
    container.addEventListener('mousedown', (e) => {
      if (e.target.tagName === 'BUTTON') return;
      isDragging = true;
      previousMouse = { x: e.clientX, y: e.clientY };
    });
    container.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - previousMouse.x;
      const dy = e.clientY - previousMouse.y;
      cameraTheta -= dx * 0.005;
      cameraPhi = Math.max(0.1, Math.min(Math.PI / 2.5, cameraPhi + dy * 0.005));
      previousMouse = { x: e.clientX, y: e.clientY };
      updateCamera();
    });
    container.addEventListener('mouseup', () => { isDragging = false; });
    container.addEventListener('mouseleave', () => { isDragging = false; });
    container.addEventListener('wheel', (e) => {
      e.preventDefault();
      cameraRadius = Math.max(10, Math.min(50, cameraRadius + e.deltaY * 0.02));
      updateCamera();
    }, { passive: false });
    let touchStart = null;
    let pinchStart = null;
    container.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        pinchStart = Math.sqrt(dx * dx + dy * dy);
      }
    });
    container.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (e.touches.length === 1 && touchStart) {
        const dx = e.touches[0].clientX - touchStart.x;
        const dy = e.touches[0].clientY - touchStart.y;
        cameraTheta -= dx * 0.005;
        cameraPhi = Math.max(0.1, Math.min(Math.PI / 2.5, cameraPhi + dy * 0.005));
        touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        updateCamera();
      } else if (e.touches.length === 2 && pinchStart) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const scale = pinchStart / dist;
        cameraRadius = Math.max(10, Math.min(50, cameraRadius * scale));
        pinchStart = dist;
        updateCamera();
      }
    }, { passive: false });
    container.addEventListener('touchend', () => {
      touchStart = null;
      pinchStart = null;
    });
    updateCamera();
  },
  buildWorld() {
    while (this.worldGroup.children.length > 0) {
      const child = this.worldGroup.children[0];
      if (child.geometry) child.geometry.dispose();
      if (child.material) child.material.dispose();
      this.worldGroup.remove(child);
    }
    this.blockMeshes = {};
    const bs = this.config.blockSize;
    const bh = this.config.blockHeight;
    const blockGeo = new THREE.BoxGeometry(bs, bh, bs);
    for (let y = 0; y < World.WORLD_HEIGHT; y++) {
      for (let x = 0; x < World.WORLD_WIDTH; x++) {
        const block = World.getBlock(x, y);
        if (block === World.blocks.AIR) continue;
        const color = this.getBlockColor(block);
        if (color === null) continue;
        let height = bh;
        let yOffset = 0;
        if (this.isTempleBlock(block)) {
          height = bh * 2;
          yOffset = bh * 0.5;
        }
        const material = new THREE.MeshLambertMaterial({
          color: color,
          transparent: false
        });
        const mesh = new THREE.Mesh(
          new THREE.BoxGeometry(bs, height, bs),
          material
        );
        mesh.position.set(x * bs, yOffset, y * bs);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.worldGroup.add(mesh);
        this.blockMeshes[`${x}_${y}`] = mesh;
      }
    }
    const floorGeo = new THREE.PlaneGeometry(
      World.WORLD_WIDTH * bs + 10,
      World.WORLD_HEIGHT * bs + 10
    );
    const floorMat = new THREE.MeshLambertMaterial({
      color: 0x0a0a1a,
      side: THREE.DoubleSide
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(
      World.CENTER_X * bs,
      -0.5,
      World.CENTER_Y * bs
    );
    floor.receiveShadow = true;
    this.worldGroup.add(floor);
    this.addGridLines();
    this.addParticles();
    console.log(`[Renderer3D] Mundo construído: ${Object.keys(this.blockMeshes).length} blocos`);
  },
  addGridLines() {
    const bs = this.config.blockSize;
    const material = new THREE.LineBasicMaterial({
      color: 0x2a2a4a,
      transparent: true,
      opacity: 0.3
    });
    for (let y = 0; y <= World.WORLD_HEIGHT; y += 5) {
      const points = [
        new THREE.Vector3(0, 0.01, y * bs),
        new THREE.Vector3(World.WORLD_WIDTH * bs, 0.01, y * bs)
      ];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, material);
      this.worldGroup.add(line);
    }
    for (let x = 0; x <= World.WORLD_WIDTH; x += 5) {
      const points = [
        new THREE.Vector3(x * bs, 0.01, 0),
        new THREE.Vector3(x * bs, 0.01, World.WORLD_HEIGHT * bs)
      ];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, material);
      this.worldGroup.add(line);
    }
  },
  addParticles() {
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);
    const bs = this.config.blockSize;
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = Math.random() * World.WORLD_WIDTH * bs;
      positions[i * 3 + 1] = Math.random() * 15 + 2;
      positions[i * 3 + 2] = Math.random() * World.WORLD_HEIGHT * bs;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: 0xd4a547,
      size: 0.15,
      transparent: true,
      opacity: 0.4,
      sizeAttenuation: true
    });
    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  },
  getBlockColor(block) {
    const colors = this.config.colors;
    const blockNames = Object.keys(World.blocks);
    const blockIndex = Object.values(World.blocks).indexOf(block);
    const blockName = blockNames[blockIndex] || 'STONE';
    return colors[blockName] || colors.STONE;
  },
  isTempleBlock(block) {
    const templeBlocks = [
      World.blocks.GOLD,
      World.blocks.MARBLE,
      World.blocks.CRYSTAL,
      World.blocks.RUNE
    ];
    return templeBlocks.includes(block);
  },
  updateAgents() {
    while (this.agentsGroup.children.length > 0) {
      const child = this.agentsGroup.children[0];
      if (child.geometry) child.geometry.dispose();
      if (child.material) child.material.dispose();
      this.agentsGroup.remove(child);
    }
    this.agentMeshes = {};
    if (typeof Agents === 'undefined' || !Agents.active) return;
    const bs = this.config.blockSize;
    Agents.active.forEach(agent => {
      const bodyGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.8, 8);
      const bodyMat = new THREE.MeshLambertMaterial({
        color: this.config.agentColors[agent.type] || 0xffffff
      });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      const headGeo = new THREE.SphereGeometry(0.25, 8, 8);
      const headMat = new THREE.MeshLambertMaterial({ color: 0xffcc88 });
      const head = new THREE.Mesh(headGeo, headMat);
      head.position.y = 0.65;
      const agentGroup = new THREE.Group();
      agentGroup.add(body);
      agentGroup.add(head);
      const ax = (agent.x || 0) * bs;
      const ay = (agent.y || 0) * bs;
      agentGroup.position.set(ax, 0.5, ay);
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 32;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(0, 0, 128, 32);
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(agent.name || agent.type, 64, 20);
      const texture = new THREE.CanvasTexture(canvas);
      const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.position.y = 1.2;
      sprite.scale.set(1.5, 0.4, 1);
      agentGroup.add(sprite);
      this.agentsGroup.add(agentGroup);
      this.agentMeshes[agent.id || agent.type] = agentGroup;
    });
    const hudAgents = document.getElementById('hud-3d-agents');
    if (hudAgents) {
      hudAgents.textContent = `Agentes: ${Agents.active.length}`;
    }
  },
  updatePlayer() {
    while (this.playerGroup.children.length > 0) {
      const child = this.playerGroup.children[0];
      if (child.geometry) child.geometry.dispose();
      if (child.material) child.material.dispose();
      this.playerGroup.remove(child);
    }
    if (typeof Player === 'undefined') return;
    const bs = this.config.blockSize;
    const bodyGeo = new THREE.CylinderGeometry(0.35, 0.35, 1, 8);
    const bodyMat = new THREE.MeshLambertMaterial({ color: 0xd4a547 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    const headGeo = new THREE.SphereGeometry(0.3, 8, 8);
    const headMat = new THREE.MeshLambertMaterial({ color: 0xffdd88 });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 0.8;
    const auraGeo = new THREE.TorusGeometry(0.6, 0.05, 8, 16);
    const auraMat = new THREE.MeshBasicMaterial({
      color: 0xffcc00,
      transparent: true,
      opacity: 0.5
    });
    const aura = new THREE.Mesh(auraGeo, auraMat);
    aura.rotation.x = Math.PI / 2;
    aura.position.y = 0.3;
    const playerMesh = new THREE.Group();
    playerMesh.add(body);
    playerMesh.add(head);
    playerMesh.add(aura);
    const px = (Player.x || World.CENTER_X) * bs;
    const py = (Player.y || World.CENTER_Y) * bs;
    playerMesh.position.set(px, 0.5, py);
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(212,165,71,0.8)';
    ctx.fillRect(0, 0, 64, 32);
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Zói', 32, 20);
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.position.y = 1.4;
    sprite.scale.set(1, 0.5, 1);
    playerMesh.add(sprite);
    this.playerGroup.add(playerMesh);
  },
  updateHUD() {
    if (typeof AgentConversations !== 'undefined') {
      const stats = AgentConversations.getStats();
      const hudTheme = document.getElementById('hud-3d-theme');
      const hudConv = document.getElementById('hud-3d-conv');
      if (hudTheme) hudTheme.textContent = `Tema: ${stats.currentThemeName}`;
      if (hudConv) hudConv.textContent = `Conversas: ${stats.totalConversations}`;
    }
  },
  animate() {
    if (!this.enabled) return;
    requestAnimationFrame(() => this.animate());
    const delta = this.clock.getDelta();
    if (this.particles) {
      const positions = this.particles.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(Date.now() * 0.001 + i) * 0.002;
        if (positions[i + 1] > 17) positions[i + 1] = 2;
      }
      this.particles.geometry.attributes.position.needsUpdate = true;
    }
    Object.values(this.agentMeshes).forEach((mesh, i) => {
      mesh.position.y = 0.5 + Math.sin(Date.now() * 0.002 + i) * 0.05;
    });
    this.renderer.render(this.scene, this.camera);
  },
  toggle() {
    const container = document.getElementById('renderer-3d-container');
    const canvas2d = document.getElementById('temple-container');
    if (!this.enabled) {
      this.init();
      container.style.display = 'block';
      if (canvas2d) canvas2d.style.display = 'none';
      this.buildWorld();
      this.updateAgents();
      this.updatePlayer();
      this.updateHUD();
      if (typeof Interactions !== 'undefined' && Interactions.notify) {
        Interactions.notify('🌍 Modo 3D ativado — Estilo Minecraft');
      }
    } else {
      container.style.display = 'none';
      if (canvas2d) canvas2d.style.display = 'block';
      if (typeof Interactions !== 'undefined' && Interactions.notify) {
        Interactions.notify('⬅️ Voltando ao modo 2D');
      }
    }
    this.enabled = !this.enabled;
    return this.enabled;
  },
  refresh() {
    if (!this.enabled) return;
    this.buildWorld();
    this.updateAgents();
    this.updatePlayer();
    this.updateHUD();
  },
  onResize() {
    if (!this.renderer || !this.camera) return;
    const container = document.getElementById('renderer-3d-container');
    if (!container) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  },
  destroy() {
    this.enabled = false;
    if (this.renderer) {
      this.renderer.dispose();
      const container = document.getElementById('renderer-3d-container');
      if (container && this.renderer.domElement.parentElement === container) {
        container.removeChild(this.renderer.domElement);
      }
    }
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.worldGroup = null;
    this.agentsGroup = null;
    this.playerGroup = null;
    this.itemsGroup = null;
    this.blockMeshes = {};
    this.agentMeshes = {};
  }
};