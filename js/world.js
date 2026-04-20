/* ===== WORLD.JS - Mundo do Templo de Hermes ===== */
/* Layout em Octagrama - padrão vetorial para movimentos alinhados */

const World = {
  // Configurações do mundo
  TILE_SIZE: 32,
  WORLD_WIDTH: 40,   // blocos
  WORLD_HEIGHT: 30,  // blocos
  
  // Centro do octagrama
  CENTER_X: 20,
  CENTER_Y: 15,
  
  // Zonas do Templo (layout octagrama)
  zones: {
    // === PONTO CENTRAL (Núcleo) ===
    nucleo: {
      name: 'Núcleo Hermético',
      description: 'O centro do octagrama. Ponto de convergência de todas as energias.',
      color: '#d4a547',
      icon: '☯️',
      bounds: { x: 18, y: 13, w: 4, h: 4 },
      items: ['pedra_filosofal', 'esmeralda_hermes', 'ouro_potavel', 'elixir_vida'],
      requiredLevel: 1,
      vector: { x: 0, y: 0 }, // Centro
      skillTitle: 'Núcleo da Consciência'
    },
    
    // === 8 PONTAS DO OCTAGRAMA ===
    // Norte (0°)
    norte: {
      name: 'Pilar do Norte',
      description: 'Direção da sabedoria ancestral. Onde o conhecimento se eleva.',
      color: '#4a8aff',
      icon: '⬆️',
      bounds: { x: 18, y: 2, w: 4, h: 4 },
      items: ['pilar_norte', 'runa_sabedoria'],
      requiredLevel: 2,
      vector: { x: 0, y: -1 },
      skillTitle: 'Sabedoria Vertical'
    },
    
    // Nordeste (45°)
    nordeste: {
      name: 'Pilar do Nordeste',
      description: 'Cruzamento de elementos. Onde ar e terra se encontram.',
      color: '#8a4aff',
      icon: '↗️',
      bounds: { x: 28, y: 6, w: 4, h: 4 },
      items: ['pilar_nordeste', 'cristal_ar_terra'],
      requiredLevel: 3,
      vector: { x: 1, y: -1 },
      skillTitle: 'Síntese Elemental'
    },
    
    // Leste (90°)
    leste: {
      name: 'Pilar do Leste',
      description: 'Direção da ação e materialização. Onde ideias se tornam realidade.',
      color: '#ff8a4a',
      icon: '➡️',
      bounds: { x: 34, y: 13, w: 4, h: 4 },
      items: ['pilar_leste', 'martelo_materializacao'],
      requiredLevel: 4,
      vector: { x: 1, y: 0 },
      skillTitle: 'Materialização Ativa'
    },
    
    // Sudeste (135°)
    sudeste: {
      name: 'Pilar do Sudeste',
      description: 'Fogo e água em harmonia. Onde a transformação é controlada.',
      color: '#ff4a8a',
      icon: '↘️',
      bounds: { x: 28, y: 20, w: 4, h: 4 },
      items: ['pilar_sudeste', 'athanor_controlado'],
      requiredLevel: 5,
      vector: { x: 1, y: 1 },
      skillTitle: 'Transformação Harmônica'
    },
    
    // Sul (180°)
    sul: {
      name: 'Pilar do Sul',
      description: 'Direção da profundidade. Onde o inconsciente se manifesta.',
      color: '#4aff8a',
      icon: '⬇️',
      bounds: { x: 18, y: 24, w: 4, h: 4 },
      items: ['pilar_sul', 'espelho_profundo'],
      requiredLevel: 6,
      vector: { x: 0, y: 1 },
      skillTitle: 'Profundidade Inconsciente'
    },
    
    // Sudoeste (225°)
    sudoeste: {
      name: 'Pilar do Sudoeste',
      description: 'Terra e fogo em equilíbrio. Onde a criação é sustentada.',
      color: '#ffcc00',
      icon: '↙️',
      bounds: { x: 8, y: 20, w: 4, h: 4 },
      items: ['pilar_sudoeste', 'forno_sustentavel'],
      requiredLevel: 7,
      vector: { x: -1, y: 1 },
      skillTitle: 'Criação Sustentada'
    },
    
    // Oeste (270°)
    oeste: {
      name: 'Pilar do Oeste',
      description: 'Direção da reflexão. Onde o passado se conecta ao futuro.',
      color: '#00bcd4',
      icon: '⬅️',
      bounds: { x: 2, y: 13, w: 4, h: 4 },
      items: ['pilar_oeste', 'espelho_tempo'],
      requiredLevel: 8,
      vector: { x: -1, y: 0 },
      skillTitle: 'Reflexão Temporal'
    },
    
    // Noroeste (315°)
    noroeste: {
      name: 'Pilar do Noroeste',
      description: 'Ar e água em fusão. Onde a intuição é purificada.',
      color: '#e040fb',
      icon: '↖️',
      bounds: { x: 8, y: 6, w: 4, h: 4 },
      items: ['pilar_noroeste', 'fonte_intuicao'],
      requiredLevel: 9,
      vector: { x: -1, y: -1 },
      skillTitle: 'Intuição Purificada'
    }
  },
  
  // Tipos de bloco
  blocks: {
    AIR: 0,
    STONE: 1,
    MARBLE: 2,
    GOLD: 3,
    OBSIDIAN: 4,
    PURPLE_CRYSTAL: 5,
    WOOD: 6,
    PARCHMENT: 7,
    WATER: 8,
    FIRE: 9,
    BOOKSHELF: 10,
    TABLE: 11,
    ALTAR: 12,
    RUNE_STONE: 13,
    DOOR: 14,
    PILLAR: 15,
    CARPET: 16,
    CHEST: 17
  },
  
  // Paleta de cores dos blocos
  blockColors: {
    0: 'transparent',
    1: '#4a4a5a',
    2: '#e8e0d0',
    3: '#d4a547',
    4: '#1a1a2e',
    5: '#7b3fa0',
    6: '#5a3a1a',
    7: '#f4e4c1',
    8: '#2a4a8a',
    9: '#ff6633',
    10: '#3a2a0a',
    11: '#6a4a2a',
    12: '#2a1a3a',
    13: '#4a3a6a',
    14: '#5a4a2a',
    15: '#8a8a7a',
    16: '#6a1a1a',
    17: '#5a4a0a'
  },
  
  // Grid do mundo (será gerado)
  grid: null,
  
  // Inicializar o mundo
  init() {
    this.grid = Array(this.WORLD_HEIGHT).fill(null)
      .map(() => Array(this.WORLD_WIDTH).fill(this.blocks.AIR));
    this.buildTemple();
    return this;
  },
  
  // Construir o templo em octagrama
  buildTemple() {
    const B = this.blocks;
    
    // Chão base - mármore
    for (let y = 0; y < this.WORLD_HEIGHT; y++) {
      for (let x = 0; x < this.WORLD_WIDTH; x++) {
        this.grid[y][x] = B.MARBLE;
      }
    }
    
    // Bordas externas - obsidiana
    for (let x = 0; x < this.WORLD_WIDTH; x++) {
      this.grid[0][x] = B.OBSIDIAN;
      this.grid[this.WORLD_HEIGHT - 1][x] = B.OBSIDIAN;
    }
    for (let y = 0; y < this.WORLD_HEIGHT; y++) {
      this.grid[y][0] = B.OBSIDIAN;
      this.grid[y][this.WORLD_WIDTH - 1] = B.OBSIDIAN;
    }
    
    // Desenhar octagrama central
    this.drawOctagram();
    
    // Desenhar caminhos vetoriais
    this.drawVectorPaths();
    
    // Colunas/Pilares
    this.placePillars();
    
    // Itens específicos
    this.placeItems();
    
    // Decoração
    this.addDecoration();
  },
  
  // Desenhar octagrama (estrela de 8 pontas)
  drawOctagram() {
    const B = this.blocks;
    const cx = this.CENTER_X;
    const cy = this.CENTER_Y;
    
    // Núcleo central (3x3)
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        this.grid[cy + dy][cx + dx] = B.GOLD;
      }
    }
    
    // 8 pontas do octagrama
    const directions = [
      [0, -1],   // Norte
      [1, -1],   // Nordeste
      [1, 0],    // Leste
      [1, 1],    // Sudeste
      [0, 1],    // Sul
      [-1, 1],   // Sudoeste
      [-1, 0],   // Oeste
      [-1, -1]   // Noroeste
    ];
    
    // Desenhar linhas do centro às pontas
    directions.forEach(([dx, dy]) => {
      for (let i = 1; i <= 6; i++) {
        const x = cx + dx * i;
        const y = cy + dy * i;
        
        if (x >= 0 && x < this.WORLD_WIDTH && y >= 0 && y < this.WORLD_HEIGHT) {
          // Alternar entre cristal e runa para criar padrão
          this.grid[y][x] = (i % 2 === 0) ? B.PURPLE_CRYSTAL : B.RUNE_STONE;
        }
      }
    });
    
    // Conectar pontas adjacentes para formar estrela
    for (let i = 0; i < 8; i++) {
      const [dx1, dy1] = directions[i];
      const [dx2, dy2] = directions[(i + 1) % 8];
      
      // Linha entre pontas adjacentes
      for (let j = 1; j <= 3; j++) {
        const x1 = cx + dx1 * (6 - j);
        const y1 = cy + dy1 * (6 - j);
        const x2 = cx + dx2 * (6 - j);
        const y2 = cy + dy2 * (6 - j);
        
        if (x1 >= 0 && x1 < this.WORLD_WIDTH && y1 >= 0 && y1 < this.WORLD_HEIGHT) {
          this.grid[y1][x1] = B.PURPLE_CRYSTAL;
        }
        if (x2 >= 0 && x2 < this.WORLD_WIDTH && y2 >= 0 && y2 < this.WORLD_HEIGHT) {
          this.grid[y2][x2] = B.PURPLE_CRYSTAL;
        }
      }
    }
  },
  
  // Desenhar caminhos vetoriais (linhas retas entre zonas)
  drawVectorPaths() {
    const B = this.blocks;
    const cx = this.CENTER_X;
    const cy = this.CENTER_Y;
    
    // Caminhos do centro a cada pilar
    Object.values(this.zones).forEach(zone => {
      if (zone.vector && (zone.vector.x !== 0 || zone.vector.y !== 0)) {
        const zx = zone.bounds.x + Math.floor(zone.bounds.w / 2);
        const zy = zone.bounds.y + Math.floor(zone.bounds.h / 2);
        
        // Linha reta do centro ao pilar
        const dx = zx - cx;
        const dy = zy - cy;
        const steps = Math.max(Math.abs(dx), Math.abs(dy));
        
        for (let i = 0; i <= steps; i++) {
          const x = Math.round(cx + (dx / steps) * i);
          const y = Math.round(cy + (dy / steps) * i);
          
          if (x >= 0 && x < this.WORLD_WIDTH && y >= 0 && y < this.WORLD_HEIGHT) {
            // Caminho principal
            this.grid[y][x] = B.CARPET;
            
            // Borda do caminho
            if (x > 0) this.grid[y][x-1] = B.PURPLE_CRYSTAL;
            if (x < this.WORLD_WIDTH - 1) this.grid[y][x+1] = B.PURPLE_CRYSTAL;
          }
        }
      }
    });
  },
  
  placePillars() {
    const B = this.blocks;
    
    // Pilares nas 8 pontas do octagrama
    Object.values(this.zones).forEach(zone => {
      if (zone.vector && (zone.vector.x !== 0 || zone.vector.y !== 0)) {
        const zx = zone.bounds.x + Math.floor(zone.bounds.w / 2);
        const zy = zone.bounds.y + Math.floor(zone.bounds.h / 2);
        
        // Pilar na posição do pilar
        if (zx >= 0 && zx < this.WORLD_WIDTH && zy >= 0 && zy < this.WORLD_HEIGHT) {
          this.grid[zy][zx] = B.PILLAR;
        }
      }
    });
    
    // Pilares adicionais no núcleo
    const cx = this.CENTER_X;
    const cy = this.CENTER_Y;
    
    // 4 pilares ao redor do núcleo
    const corePositions = [
      [cx - 2, cy - 2], [cx + 2, cy - 2],
      [cx - 2, cy + 2], [cx + 2, cy + 2]
    ];
    
    corePositions.forEach(([x, y]) => {
      if (x >= 0 && x < this.WORLD_WIDTH && y >= 0 && y < this.WORLD_HEIGHT) {
        this.grid[y][x] = B.PILLAR;
      }
    });
  },
  
  placeItems() {
    const B = this.blocks;
    const cx = this.CENTER_X;
    const cy = this.CENTER_Y;
    
    // Núcleo central - Altar principal
    this.grid[cy][cx] = B.ALTAR;
    
    // Itens nas 8 pontas do octagrama
    Object.values(this.zones).forEach(zone => {
      if (zone.vector && (zone.vector.x !== 0 || zone.vector.y !== 0)) {
        const zx = zone.bounds.x + Math.floor(zone.bounds.w / 2);
        const zy = zone.bounds.y + Math.floor(zone.bounds.h / 2);
        
        // Altar em cada pilar
        if (zx >= 0 && zx < this.WORLD_WIDTH && zy >= 0 && zy < this.WORLD_HEIGHT) {
          this.grid[zy][zx] = B.ALTAR;
        }
      }
    });
    
    // Mesa redonda no núcleo
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx !== 0 || dy !== 0) { // Exceto o centro
          this.grid[cy + dy][cx + dx] = B.TABLE;
        }
      }
    }
    
    // Fonte de água no centro
    this.grid[cy][cx] = B.WATER;
    
    // Cristais nos caminhos
    const directions = [
      [0, -1], [1, -1], [1, 0], [1, 1],
      [0, 1], [-1, 1], [-1, 0], [-1, -1]
    ];
    
    directions.forEach(([dx, dy]) => {
      // Cristais a cada 2 blocos
      for (let i = 2; i <= 6; i += 2) {
        const x = cx + dx * i;
        const y = cy + dy * i;
        
        if (x >= 0 && x < this.WORLD_WIDTH && y >= 0 && y < this.WORLD_HEIGHT) {
          this.grid[y][x] = B.PURPLE_CRYSTAL;
        }
      }
    });
  },
  
  addDecoration() {
    const B = this.blocks;
    const cx = this.CENTER_X;
    const cy = this.CENTER_Y;
    
    // Tochas (fogo) nas 8 direções
    const directions = [
      [0, -1], [1, -1], [1, 0], [1, 1],
      [0, 1], [-1, 1], [-1, 0], [-1, -1]
    ];
    
    directions.forEach(([dx, dy]) => {
      // Tochas a cada 3 blocos
      for (let i = 3; i <= 6; i += 3) {
        const x = cx + dx * i;
        const y = cy + dy * i;
        
        if (x >= 0 && x < this.WORLD_WIDTH && y >= 0 && y < this.WORLD_HEIGHT) {
          this.grid[y][x] = B.FIRE;
        }
      }
    });
    
    // Tochas no núcleo
    const coreTorchPositions = [
      [cx - 3, cy - 3], [cx + 3, cy - 3],
      [cx - 3, cy + 3], [cx + 3, cy + 3]
    ];
    
    coreTorchPositions.forEach(([x, y]) => {
      if (x >= 0 && x < this.WORLD_WIDTH && y >= 0 && y < this.WORLD_HEIGHT) {
        this.grid[y][x] = B.FIRE;
      }
    });
    
    // Estantes de livros nas bordas
    for (let y = 2; y < this.WORLD_HEIGHT - 2; y += 4) {
      this.grid[y][2] = B.BOOKSHELF;
      this.grid[y][this.WORLD_WIDTH - 3] = B.BOOKSHELF;
    }
    
    // Cristais decorativos
    const crystalPositions = [
      [cx - 4, cy], [cx + 4, cy],
      [cx, cy - 4], [cx, cy + 4]
    ];
    
    crystalPositions.forEach(([x, y]) => {
      if (x >= 0 && x < this.WORLD_WIDTH && y >= 0 && y < this.WORLD_HEIGHT) {
        this.grid[y][x] = B.PURPLE_CRYSTAL;
      }
    });
  },
  
  // Obter bloco em posição
  getBlock(x, y) {
    if (x < 0 || x >= this.WORLD_WIDTH || y < 0 || y >= this.WORLD_HEIGHT) {
      return this.blocks.OBSIDIAN;
    }
    return this.grid[y][x];
  },
  
  // Verificar se é walkable
  isWalkable(x, y) {
    const block = this.getBlock(x, y);
    const nonWalkable = [
      this.blocks.OBSIDIAN, 
      this.blocks.STONE, 
      this.blocks.PILLAR, 
      this.blocks.BOOKSHELF,
      this.blocks.WATER
    ];
    return !nonWalkable.includes(block);
  },
  
  // Obter zona em posição
  getZoneAt(x, y) {
    for (const [id, zone] of Object.entries(this.zones)) {
      const b = zone.bounds;
      if (x >= b.x && x < b.x + b.w && y >= b.y && y < b.y + b.h) {
        return { id, ...zone };
      }
    }
    return null;
  },
  
  // Obter centro de uma zona
  getZoneCenter(zoneId) {
    const zone = this.zones[zoneId];
    if (!zone) return { x: 20, y: 15 };
    return {
      x: zone.bounds.x + Math.floor(zone.bounds.w / 2),
      y: zone.bounds.y + Math.floor(zone.bounds.h / 2)
    };
  },
  
  // Obter itens em uma zona
  getZoneItems(zoneId) {
    const zone = this.zones[zoneId];
    return zone ? zone.items : [];
  }
};
