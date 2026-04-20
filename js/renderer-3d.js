/* ===== RENDERER 3D.JS =====
   Renderização 3D estilo Minecraft usando Three.js
   - Converte o grid 2D do World em blocos 3D voxel
   - Câmera em perspectiva com controles orbitais
   - Agentes e jogador renderizados em 3D
   - Toggle entre modo 2D e 3D
*/

const Renderer3D = {
  // Estado
  enabled: false,
  scene: null,
  camera: null,
  renderer: null,
  controls: null,
  clock: null,
  
  // Objetos do mundo 3D
  worldGroup: null,
  agentsGroup: null,
  playerGroup: null,
  itemsGroup: null,
  
  // Cache de meshes
  blockMeshes: {},
  agentMeshes: {},
  itemMeshes: {},
  
  // Configurações
  config: {
    blockSize: 1,
    blockHeight: 1,
    maxRenderDistance: 30,
    cameraDistance: 25,
    cameraAngle: 45,
    rotationSpeed: 0.002,
    colors: {
      // Mapear tipos de bloco do World para cores 3D
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

  // Inicializar Three.js
  init() {
    if (this.enabled) return this;
    
    // Verificar se Three.js está disponível
    if (typeof THREE === 'undefined') {
      console.error('[Renderer3D] Three.js não carregado. Inclua via CDN.');
      return null;
    }

    this.clock = new THREE.Clock();
    
    // Criar container do canvas 3D
    this.createContainer();
    
    // Configurar cena
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0a1a);
    this.scene.fog = new THREE.Fog(0x0a0a1a, 20, 60);
    
    // Configurar câmera
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
    
    // Configurar renderer
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);
    
    // Configurar iluminação
    this.setupLighting();
    
    // Criar grupos
    this.worldGroup = new THREE.Group();
    this.agentsGroup = new THREE.Group();
    this.playerGroup = new THREE.Group();
    this.itemsGroup = new THREE.Group();
    this.scene.add(this.worldGroup);
    this.scene.add(this.agentsGroup);
    this.scene.add(this.playerGroup);
    this.scene.add(this.itemsGroup);
    
    // Configurar controles de câmera (manual)
    this.setupControls();
    
    // Configurar resize
    window.addEventListener('resize', () => this.onResize());
    
    // Construir mundo 3D
    this.buildWorld();
    
    // Iniciar loop de renderização
    this.animate();
    
    this.enabled = true;
    console.log('[Renderer3D] Inicializado com sucesso');
    
    return this;
  },

  // Criar container HTML
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
      
      // Botão de fechar / voltar ao 2D
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

      // HUD 3D
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
      
      // Instruções de controle
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

  // Configurar iluminação
  setupLighting() {
    // Luz ambiente
    const ambient = new THREE.AmbientLight(0x404060, 0.6);
    this.scene.add(ambient);
    
    // Luz direcional (sol)
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
    
    // Luz pontual dourada (templo)
    const templeLight = new THREE.PointLight(0xd4a547, 0.5, 30);
    templeLight.position.set(
      World.CENTER_X * this.config.blockSize,
      10,
      World.CENTER_Y * this.config.blockSize
    );
    this.scene.add(templeLight);
  },

  // Configurar controles de câmera (manual, sem dependências extras)
  setupControls() {
    const container = document.getElementById('renderer-3d-container');
    let isDragging = false;
    let previousMouse = { x: 0, y: 0 };
    let cameraTheta = Math.PI / 4; // Ângulo horizontal
    let cameraPhi = Math.PI / 6;   // Ângulo vertical
    let cameraRadius = this.config.cameraDistance;
    
    const updateCamera = () => {
      const cx = World.CENTER_X * this.config.blockSize;
      const cz = World.CENTER_Y * this.config.blockSize;
      
      this.camera.position.x = cx + cameraRadius * Math.sin(cameraTheta) * Math.cos(cameraPhi);
      this.camera.position.y = cameraRadius * Math.sin(cameraPhi);
      this.camera.position.z = cz + cameraRadius * Math.cos(cameraTheta) * Math.cos(cameraPhi);
      this.camera.lookAt(cx, 0, cz);
    };
    
    // Mouse
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
    
    // Scroll zoom
    container.addEventListener('wheel', (e) => {
      e.preventDefault();
      cameraRadius = Math.max(10, Math.min(50, cameraRadius + e.deltaY * 0.02));
      updateCamera();
    }, { passive: false });
    
    // Touch (mobile)
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
    
    // Posição inicial
    updateCamera();
  },

  // Construir o mundo 3D a partir do grid 2D do World
  buildWorld() {
    // Limpar meshes existentes
    while (this.worldGroup.children.length > 0) {
      const child = this.worldGroup.children[0];
      if (child.geometry) child.geometry.dispose();
      if (child.material) child.material.dispose();
      this.worldGroup.remove(child);
    }
    this.blockMeshes = {};
    
    const bs = this.config.blockSize;
    const bh = this.config.blockHeight;
    
    // Geometria compartilhada para blocos
    const blockGeo = new THREE.BoxGeometry(bs, bh, bs);
    
    // Iterar pelo grid do World
    for (let y = 0; y < World.WORLD_HEIGHT; y++) {
      for (let x = 0; x < World.WORLD_WIDTH; x++) {
        const block = World.getBlock(x, y);
        if (block === World.blocks.AIR) continue;
        
        // Mapear bloco do World para cor 3D
        const color = this.getBlockColor(block);
        if (color === null) continue;
        
        // Altura baseada no tipo (temple blocks ficam mais altos)
        let height = bh;
        let yOffset = 0;
        
        if (this.isTempleBlock(block)) {
          height = bh * 2;
          yOffset = bh * 0.5;
        }
        
        // Criar material com cor
        const material = new THREE.MeshLambertMaterial({ 
          color: color,
          transparent: false
        });
        
        // Criar mesh
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
    
    // Adicionar chão (base)
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
    
    // Adicionar grid lines
    this.addGridLines();
    
    // Adicionar partículas atmosféricas
    this.addParticles();
    
    console.log(`[Renderer3D] Mundo construído: ${Object.keys(this.blockMeshes).length} blocos`);
  },

  // Adicionar linhas de grid
  addGridLines() {
    const bs = this.config.blockSize;
    const material = new THREE.LineBasicMaterial({ 
      color: 0x2a2a4a,
      transparent: true,
      opacity: 0.3
    });
    
    // Linhas horizontais
    for (let y = 0; y <= World.WORLD_HEIGHT; y += 5) {
      const points = [
        new THREE.Vector3(0, 0.01, y * bs),
        new THREE.Vector3(World.WORLD_WIDTH * bs, 0.01, y * bs)
      ];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, material);
      this.worldGroup.add(line);
    }
    
    // Linhas verticais
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

  // Adicionar partículas atmosféricas
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

  // Mapear bloco do World para cor 3D
  getBlockColor(block) {
    const colors = this.config.colors;
    const blockNames = Object.keys(World.blocks);
    const blockIndex = Object.values(World.blocks).indexOf(block);
    const blockName = blockNames[blockIndex] || 'STONE';
    
    return colors[blockName] || colors.STONE;
  },

  // Verificar se é bloco de templo (mais alto)
  isTempleBlock(block) {
    const templeBlocks = [
      World.blocks.GOLD,
      World.blocks.MARBLE,
      World.blocks.CRYSTAL,
      World.blocks.RUNE
    ];
    return templeBlocks.includes(block);
  },

  // Atualizar agentes no 3D
  updateAgents() {
    // Limpar meshes de agentes antigos
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
      // Corpo (cilindro)
      const bodyGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.8, 8);
      const bodyMat = new THREE.MeshLambertMaterial({
        color: this.config.agentColors[agent.type] || 0xffffff
      });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      
      // Cabeça (esfera)
      const headGeo = new THREE.SphereGeometry(0.25, 8, 8);
      const headMat = new THREE.MeshLambertMaterial({ color: 0xffcc88 });
      const head = new THREE.Mesh(headGeo, headMat);
      head.position.y = 0.65;
      
      // Grupo do agente
      const agentGroup = new THREE.Group();
      agentGroup.add(body);
      agentGroup.add(head);
      
      // Posição
      const ax = (agent.x || 0) * bs;
      const ay = (agent.y || 0) * bs;
      agentGroup.position.set(ax, 0.5, ay);
      
      // Nome flutuante (sprite)
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
    
    // Atualizar HUD
    const hudAgents = document.getElementById('hud-3d-agents');
    if (hudAgents) {
      hudAgents.textContent = `Agentes: ${Agents.active.length}`;
    }
  },

  // Atualizar jogador (Zói) no 3D
  updatePlayer() {
    // Limpar
    while (this.playerGroup.children.length > 0) {
      const child = this.playerGroup.children[0];
      if (child.geometry) child.geometry.dispose();
      if (child.material) child.material.dispose();
      this.playerGroup.remove(child);
    }
    
    if (typeof Player === 'undefined') return;
    
    const bs = this.config.blockSize;
    
    // Corpo do Zói (dourado)
    const bodyGeo = new THREE.CylinderGeometry(0.35, 0.35, 1, 8);
    const bodyMat = new THREE.MeshLambertMaterial({ color: 0xd4a547 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    
    // Cabeça
    const headGeo = new THREE.SphereGeometry(0.3, 8, 8);
    const headMat = new THREE.MeshLambertMaterial({ color: 0xffdd88 });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 0.8;
    
    // Aura (anel)
    const auraGeo = new THREE.TorusGeometry(0.6, 0.05, 8, 16);
    const auraMat = new THREE.MeshBasicMaterial({ 
      color: 0xffcc00,
      transparent: true,
      opacity: 0.5
    });
    const aura = new THREE.Mesh(auraGeo, auraMat);
    aura.rotation.x = Math.PI / 2;
    aura.position.y = 0.3;
    
    // Grupo
    const playerMesh = new THREE.Group();
    playerMesh.add(body);
    playerMesh.add(head);
    playerMesh.add(aura);
    
    const px = (Player.x || World.CENTER_X) * bs;
    const py = (Player.y || World.CENTER_Y) * bs;
    playerMesh.position.set(px, 0.5, py);
    
    // Label "Zói"
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

  // Atualizar HUD
  updateHUD() {
    if (typeof AgentConversations !== 'undefined') {
      const stats = AgentConversations.getStats();
      const hudTheme = document.getElementById('hud-3d-theme');
      const hudConv = document.getElementById('hud-3d-conv');
      if (hudTheme) hudTheme.textContent = `Tema: ${stats.currentThemeName}`;
      if (hudConv) hudConv.textContent = `Conversas: ${stats.totalConversations}`;
    }
  },

  // Loop de animação
  animate() {
    if (!this.enabled) return;
    
    requestAnimationFrame(() => this.animate());
    
    const delta = this.clock.getDelta();
    
    // Animar partículas
    if (this.particles) {
      const positions = this.particles.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(Date.now() * 0.001 + i) * 0.002;
        if (positions[i + 1] > 17) positions[i + 1] = 2;
      }
      this.particles.geometry.attributes.position.needsUpdate = true;
    }
    
    // Animar agentes (flutuação suave)
    Object.values(this.agentMeshes).forEach((mesh, i) => {
      mesh.position.y = 0.5 + Math.sin(Date.now() * 0.002 + i) * 0.05;
    });
    
    // Renderizar
    this.renderer.render(this.scene, this.camera);
  },

  // Toggle modo 3D
  toggle() {
    const container = document.getElementById('renderer-3d-container');
    const canvas2d = document.getElementById('temple-container');
    
    if (!this.enabled) {
      // Ativar 3D
      this.init();
      container.style.display = 'block';
      if (canvas2d) canvas2d.style.display = 'none';
      
      // Atualizar mundo
      this.buildWorld();
      this.updateAgents();
      this.updatePlayer();
      this.updateHUD();
      
      if (typeof Interactions !== 'undefined' && Interactions.notify) {
        Interactions.notify('🌍 Modo 3D ativado — Estilo Minecraft');
      }
    } else {
      // Desativar 3D
      container.style.display = 'none';
      if (canvas2d) canvas2d.style.display = 'block';
      
      if (typeof Interactions !== 'undefined' && Interactions.notify) {
        Interactions.notify('⬅️ Voltando ao modo 2D');
      }
    }
    
    this.enabled = !this.enabled;
    return this.enabled;
  },

  // Refresh do mundo (chamar quando o mundo mudar)
  refresh() {
    if (!this.enabled) return;
    this.buildWorld();
    this.updateAgents();
    this.updatePlayer();
    this.updateHUD();
  },

  // Resize handler
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

  // Destruir (cleanup)
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
