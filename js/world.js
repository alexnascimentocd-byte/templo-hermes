/* ===== WORLD.JS - Mundo do Templo de Hermes ===== */
/* Layout em grid estilo Minecraft - cada célula = 1 bloco */

const World = {
  // Configurações do mundo
  TILE_SIZE: 32,
  WORLD_WIDTH: 40,   // blocos
  WORLD_HEIGHT: 30,  // blocos
  
  // Zonas do Templo
  zones: {
    atrio: {
      name: 'Átrio Exterior',
      description: 'O portão de entrada. Aqui os iniciados aguardam sua vez.',
      color: '#3a3a5c',
      icon: '🚪',
      bounds: { x: 0, y: 0, w: 40, h: 8 },
      items: ['portao_entrada', 'pilares_externos', 'fonte_consagracao'],
      requiredLevel: 1
    },
    salao: {
      name: 'Salão dos Trabalhos',
      description: 'Onde os agentes se reúnem e iniciam seus trabalhos.',
      color: '#5a4a3a',
      icon: '🏛️',
      bounds: { x: 0, y: 8, w: 40, h: 8 },
      items: ['mesa_principal', 'estantes_livros', 'lareira_alquimica', 'quadro_runas'],
      requiredLevel: 2
    },
    mesa: {
      name: 'Mesa de Reunião',
      description: 'Onde os agentes consultam os livros e compartilham conhecimento.',
      color: '#4a3a2a',
      icon: '📜',
      bounds: { x: 5, y: 16, w: 30, h: 6 },
      items: ['mesa_redonda', 'livro_sabedoria', 'livro_comandos', 'livro_memoria', 'cartas_rede'],
      requiredLevel: 3
    },
    sagrado: {
      name: 'Lugar Sagrado',
      description: 'Espaço intermediário. A alquimia se manifesta aqui.',
      color: '#2a1a4a',
      icon: '⚗️',
      bounds: { x: 8, y: 22, w: 24, h: 4 },
      items: ['athanor', 'alambique', 'mortario', 'caduceu_grande', 'orbe_elementos'],
      requiredLevel: 5
    },
    santissimo: {
      name: 'Lugar Santíssimo',
      description: 'O átrio interior. Onde a Grande Obra se completa.',
      color: '#1a0a3a',
      icon: '✨',
      bounds: { x: 12, y: 26, w: 16, h: 4 },
      items: ['pedra_filosofal', 'esmeralda_hermes', 'ouro_potavel', 'elixir_vida'],
      requiredLevel: 8
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
  
  // Construir o templo
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
    
    // Paredes internas por zona
    this.buildZoneWalls();
    
    // Colunas/Pilares
    this.placePillars();
    
    // Itens específicos
    this.placeItems();
    
    // Decoração
    this.addDecoration();
  },
  
  buildZoneWalls() {
    const B = this.blocks;
    
    // Parede entre Átrio e Salão
    for (let x = 0; x < this.WORLD_WIDTH; x++) {
      if (x < 15 || x > 25) {
        this.grid[8][x] = B.STONE;
      } else {
        this.grid[8][x] = B.CARPET; // Passagem
      }
    }
    
    // Parede entre Salão e Mesa
    for (let x = 5; x < 35; x++) {
      if (x < 17 || x > 23) {
        this.grid[16][x] = B.STONE;
      } else {
        this.grid[16][x] = B.CARPET;
      }
    }
    
    // Parede entre Mesa e Sagrado
    for (let x = 8; x < 32; x++) {
      if (x < 18 || x > 22) {
        this.grid[22][x] = B.STONE;
      } else {
        this.grid[22][x] = B.RUNE_STONE;
      }
    }
    
    // Parede entre Sagrado e Santíssimo
    for (let x = 12; x < 28; x++) {
      if (x < 18 || x > 22) {
        this.grid[26][x] = B.GOLD;
      } else {
        this.grid[26][x] = B.RUNE_STONE;
      }
    }
  },
  
  placePillars() {
    const B = this.blocks;
    const positions = [
      // Átrio
      [3, 3], [36, 3], [3, 6], [36, 6],
      // Salão
      [5, 11], [34, 11], [5, 14], [34, 14],
      // Mesa
      [8, 18], [31, 18], [8, 21], [31, 21],
    ];
    
    positions.forEach(([x, y]) => {
      if (y < this.WORLD_HEIGHT && x < this.WORLD_WIDTH) {
        this.grid[y][x] = B.PILLAR;
      }
    });
  },
  
  placeItems() {
    const B = this.blocks;
    
    // Átrio - Fonte no centro
    this.grid[4][20] = B.WATER;
    this.grid[4][19] = B.WATER;
    this.grid[4][21] = B.WATER;
    
    // Salão - Mesa principal
    for (let x = 15; x < 26; x++) {
      this.grid[12][x] = B.TABLE;
    }
    
    // Salão - Estantes de livros
    for (let y = 9; y < 15; y++) {
      this.grid[y][2] = B.BOOKSHELF;
      this.grid[y][37] = B.BOOKSHELF;
    }
    
    // Mesa de Reunião - Mesa redonda central
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        this.grid[19 + dy][20 + dx] = B.TABLE;
      }
    }
    
    // Sagrado - Altar
    for (let x = 18; x < 23; x++) {
      this.grid[24][x] = B.ALTAR;
    }
    
    // Santíssimo - Altar dourado
    for (let x = 18; x < 23; x++) {
      this.grid[28][x] = B.GOLD;
    }
    this.grid[28][20] = B.ALTAR;
  },
  
  addDecoration() {
    const B = this.blocks;
    
    // Tochas (fogo) nas paredes
    const torchPositions = [
      [1, 4], [38, 4],  // Átrio
      [1, 12], [38, 12], // Salão
      [6, 19], [33, 19], // Mesa
      [9, 24], [30, 24], // Sagrado
    ];
    
    torchPositions.forEach(([x, y]) => {
      if (y < this.WORLD_HEIGHT && x < this.WORLD_WIDTH) {
        this.grid[y][x] = B.FIRE;
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
