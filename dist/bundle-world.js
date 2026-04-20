// === world.js ===
const World = {
  TILE_SIZE: 32,
  WORLD_WIDTH: 60,
  WORLD_HEIGHT: 45,
  CENTER_X: 30,
  CENTER_Y: 22,
  octagramFormats: ['padrao', 'duplo', 'ninhado'],
  activeFormat: 0,
  numeralSystems: {
    caldeu: {
      name: 'Numerais Caldeus',
      description: 'Sistema numeral baseado na tradição caldeia, de 1 a 8',
      mapping: { 1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI', 7: 'VII', 8: 'VIII' },
      colors: ['#ff6b6b', '#ffa94d', '#ffd43b', '#69db7c', '#4dabf7', '#9775fa', '#f06595', '#e599f7']
    },
    alquimico: {
      name: 'Numerais Alquímicos',
      description: 'Sistema baseado nos planetas e elementos alquímicos',
      mapping: {
        1: '☉ Sol', 2: '☽ Lua', 3: '♀ Vênus', 4: '♂ Marte',
        5: '♃ Júpiter', 6: '♄ Saturno', 7: '☿ Mercúrio', 8: '⛢ Urano'
      },
      symbols: ['☉', '☽', '♀', '♂', '♃', '♄', '☿', '⛢'],
      colors: ['#ffd700', '#c0c0c0', '#ff69b4', '#ff4500', '#daa520', '#8b7355', '#87ceeb', '#4169e1']
    }
  },
  zones: {
    nucleo: {
      name: 'Núcleo Hermético',
      description: 'O centro absoluto. Ponto de convergência de todas as energias.',
      color: '#d4a547', icon: '☯️',
      bounds: { x: 28, y: 20, w: 5, h: 5 },
      items: ['pedra_filosofal', 'esmeralda_hermes', 'ouro_potavel', 'elixir_vida'],
      requiredLevel: 1,
      vector: { x: 0, y: 0 },
      skillTitle: 'Núcleo da Consciência',
      octagram: 'nucleo'
    },
    norte: {
      name: 'Pilar do Norte', color: '#4a8aff', icon: '⬆️',
      bounds: { x: 28, y: 8, w: 5, h: 5 },
      items: ['pilar_norte', 'runa_sabedoria'],
      requiredLevel: 2, vector: { x: 0, y: -1 },
      skillTitle: 'Sabedoria Vertical', octagram: 'padrao',
      numeral: { caldeu: 'I', alquimico: '☉' }
    },
    nordeste: {
      name: 'Pilar do Nordeste', color: '#8a4aff', icon: '↗️',
      bounds: { x: 38, y: 12, w: 5, h: 5 },
      items: ['pilar_nordeste', 'cristal_ar_terra'],
      requiredLevel: 3, vector: { x: 1, y: -1 },
      skillTitle: 'Síntese Elemental', octagram: 'padrao',
      numeral: { caldeu: 'II', alquimico: '☽' }
    },
    leste: {
      name: 'Pilar do Leste', color: '#ff8a4a', icon: '➡️',
      bounds: { x: 44, y: 20, w: 5, h: 5 },
      items: ['pilar_leste', 'martelo_materializacao'],
      requiredLevel: 4, vector: { x: 1, y: 0 },
      skillTitle: 'Materialização Ativa', octagram: 'padrao',
      numeral: { caldeu: 'III', alquimico: '♀' }
    },
    sudeste: {
      name: 'Pilar do Sudeste', color: '#ff4a8a', icon: '↘️',
      bounds: { x: 38, y: 28, w: 5, h: 5 },
      items: ['pilar_sudeste', 'athanor_controlado'],
      requiredLevel: 5, vector: { x: 1, y: 1 },
      skillTitle: 'Transformação Harmônica', octagram: 'padrao',
      numeral: { caldeu: 'IV', alquimico: '♂' }
    },
    sul: {
      name: 'Pilar do Sul', color: '#4aff8a', icon: '⬇️',
      bounds: { x: 28, y: 32, w: 5, h: 5 },
      items: ['pilar_sul', 'espelho_profundo'],
      requiredLevel: 6, vector: { x: 0, y: 1 },
      skillTitle: 'Profundidade Inconsciente', octagram: 'padrao',
      numeral: { caldeu: 'V', alquimico: '♃' }
    },
    sudoeste: {
      name: 'Pilar do Sudoeste', color: '#ffcc00', icon: '↙️',
      bounds: { x: 18, y: 28, w: 5, h: 5 },
      items: ['pilar_sudoeste', 'forno_sustentavel'],
      requiredLevel: 7, vector: { x: -1, y: 1 },
      skillTitle: 'Criação Sustentada', octagram: 'padrao',
      numeral: { caldeu: 'VI', alquimico: '♄' }
    },
    oeste: {
      name: 'Pilar do Oeste', color: '#00bcd4', icon: '⬅️',
      bounds: { x: 12, y: 20, w: 5, h: 5 },
      items: ['pilar_oeste', 'espelho_tempo'],
      requiredLevel: 8, vector: { x: -1, y: 0 },
      skillTitle: 'Reflexão Temporal', octagram: 'padrao',
      numeral: { caldeu: 'VII', alquimico: '☿' }
    },
    noroeste: {
      name: 'Pilar do Noroeste', color: '#e040fb', icon: '↖️',
      bounds: { x: 18, y: 12, w: 5, h: 5 },
      items: ['pilar_noroeste', 'fonte_intuicao'],
      requiredLevel: 9, vector: { x: -1, y: -1 },
      skillTitle: 'Intuição Purificada', octagram: 'padrao',
      numeral: { caldeu: 'VIII', alquimico: '⛢' }
    },
    duplo_n: {
      name: 'Gêmeo Norte', color: '#2196f3', icon: '⬡',
      bounds: { x: 28, y: 2, w: 5, h: 5 },
      items: ['cristal_gemeo_norte'],
      requiredLevel: 3, vector: { x: 0, y: -1 },
      skillTitle: 'Polaridade Superior', octagram: 'duplo'
    },
    duplo_ne: {
      name: 'Gêmeo Nordeste', color: '#673ab7', icon: '⬡',
      bounds: { x: 46, y: 8, w: 5, h: 5 },
      items: ['cristal_gemeo_ne'],
      requiredLevel: 4, vector: { x: 1, y: -1 },
      skillTitle: 'Fusão Elemental', octagram: 'duplo'
    },
    duplo_e: {
      name: 'Gêmeo Leste', color: '#ff9800', icon: '⬡',
      bounds: { x: 52, y: 20, w: 5, h: 5 },
      items: ['cristal_gemeo_leste'],
      requiredLevel: 5, vector: { x: 1, y: 0 },
      skillTitle: 'Extensão Ativa', octagram: 'duplo'
    },
    duplo_se: {
      name: 'Gêmeo Sudeste', color: '#e91e63', icon: '⬡',
      bounds: { x: 46, y: 32, w: 5, h: 5 },
      items: ['cristal_gemeo_se'],
      requiredLevel: 6, vector: { x: 1, y: 1 },
      skillTitle: 'Expansão Harmônica', octagram: 'duplo'
    },
    duplo_s: {
      name: 'Gêmeo Sul', color: '#00e676', icon: '⬡',
      bounds: { x: 28, y: 38, w: 5, h: 5 },
      items: ['cristal_gemeo_sul'],
      requiredLevel: 7, vector: { x: 0, y: 1 },
      skillTitle: 'Profundidade Estendida', octagram: 'duplo'
    },
    duplo_so: {
      name: 'Gêmeo Sudoeste', color: '#ffc107', icon: '⬡',
      bounds: { x: 10, y: 32, w: 5, h: 5 },
      items: ['cristal_gemeo_so'],
      requiredLevel: 8, vector: { x: -1, y: 1 },
      skillTitle: 'Criação Expandida', octagram: 'duplo'
    },
    duplo_o: {
      name: 'Gêmeo Oeste', color: '#00bcd4', icon: '⬡',
      bounds: { x: 4, y: 20, w: 5, h: 5 },
      items: ['cristal_gemeo_oeste'],
      requiredLevel: 9, vector: { x: -1, y: 0 },
      skillTitle: 'Reflexão Estendida', octagram: 'duplo'
    },
    duplo_no: {
      name: 'Gêmeo Noroeste', color: '#ce93d8', icon: '⬡',
      bounds: { x: 10, y: 8, w: 5, h: 5 },
      items: ['cristal_gemeo_no'],
      requiredLevel: 10, vector: { x: -1, y: -1 },
      skillTitle: 'Intuição Expandida', octagram: 'duplo'
    },
    anel_1: {
      name: 'Anel da Matéria', color: '#795548', icon: '◎',
      bounds: { x: 2, y: 2, w: 5, h: 5 },
      items: ['pedra_anel_materia'],
      requiredLevel: 5, vector: { x: -1, y: -1 },
      skillTitle: 'Limite Material', octagram: 'ninhado'
    },
    anel_2: {
      name: 'Anel da Força', color: '#f44336', icon: '◎',
      bounds: { x: 54, y: 2, w: 4, h: 5 },
      items: ['pedra_anel_forca'],
      requiredLevel: 6, vector: { x: 1, y: -1 },
      skillTitle: 'Limite Energético', octagram: 'ninhado'
    },
    anel_3: {
      name: 'Anel da Mente', color: '#3f51b5', icon: '◎',
      bounds: { x: 54, y: 38, w: 4, h: 5 },
      items: ['pedra_anel_mente'],
      requiredLevel: 7, vector: { x: 1, y: 1 },
      skillTitle: 'Limite Mental', octagram: 'ninhado'
    },
    anel_4: {
      name: 'Anel do Espírito', color: '#9c27b0', icon: '◎',
      bounds: { x: 2, y: 38, w: 5, h: 5 },
      items: ['pedra_anel_espirito'],
      requiredLevel: 8, vector: { x: -1, y: 1 },
      skillTitle: 'Limite Espiritual', octagram: 'ninhado'
    }
  },
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
    CHEST: 17,
    DESERT: 18,
    SAND: 19,
    DUNE: 20,
    CACTUS: 21,
    BONE: 22,
    RUINS: 23,
    AMETHYST: 24,
    BLUE_CRYSTAL: 25
  },
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
    17: '#5a4a0a',
    18: '#c2a05a',
    19: '#d4b87a',
    20: '#b8943a',
    21: '#2a5a2a',
    22: '#e8dcc8',
    23: '#6a5a4a',
    24: '#9b59b6',
    25: '#3498db'
  },
  grid: null,
  init() {
    this.grid = Array(this.WORLD_HEIGHT).fill(null)
      .map(() => Array(this.WORLD_WIDTH).fill(this.blocks.AIR));
    this.buildTemple();
    return this;
  },
  buildTemple() {
    const B = this.blocks;
    for (let y = 0; y < this.WORLD_HEIGHT; y++) {
      for (let x = 0; x < this.WORLD_WIDTH; x++) {
        const r = Math.random();
        if (r < 0.5) this.grid[y][x] = B.DESERT;
        else if (r < 0.75) this.grid[y][x] = B.SAND;
        else this.grid[y][x] = B.DUNE;
      }
    }
    for (let x = 0; x < this.WORLD_WIDTH; x++) {
      this.grid[0][x] = B.OBSIDIAN;
      this.grid[this.WORLD_HEIGHT - 1][x] = B.OBSIDIAN;
    }
    for (let y = 0; y < this.WORLD_HEIGHT; y++) {
      this.grid[y][0] = B.OBSIDIAN;
      this.grid[y][this.WORLD_WIDTH - 1] = B.OBSIDIAN;
    }
    this.drawOctagramPadrao();
    this.drawOctagramDuplo();
    this.drawOctagramNinhado();
    this.drawConnectingPaths();
    this.placeNumerals();
    this.placePillars();
    this.placeItems();
    this.addDesertDecoration();
    this.addDecoration();
  },
  drawOctagramPadrao() {
    const B = this.blocks;
    const cx = this.CENTER_X;
    const cy = this.CENTER_Y;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        this.grid[cy + dy][cx + dx] = B.GOLD;
      }
    }
    const directions = [
      [0, -1], [1, -1], [1, 0], [1, 1],
      [0, 1], [-1, 1], [-1, 0], [-1, -1]
    ];
    directions.forEach(([dx, dy]) => {
      for (let i = 1; i <= 6; i++) {
        const x = cx + dx * i;
        const y = cy + dy * i;
        if (x >= 0 && x < this.WORLD_WIDTH && y >= 0 && y < this.WORLD_HEIGHT) {
          this.grid[y][x] = (i % 2 === 0) ? B.PURPLE_CRYSTAL : B.RUNE_STONE;
        }
      }
    });
    for (let i = 0; i < 8; i++) {
      const [dx1, dy1] = directions[i];
      const [dx2, dy2] = directions[(i + 1) % 8];
      for (let j = 1; j <= 3; j++) {
        const x1 = cx + dx1 * (6 - j);
        const y1 = cy + dy1 * (6 - j);
        const x2 = cx + dx2 * (6 - j);
        const y2 = cy + dy2 * (6 - j);
        if (x1 >= 0 && x1 < this.WORLD_WIDTH && y1 >= 0 && y1 < this.WORLD_HEIGHT)
          this.grid[y1][x1] = B.PURPLE_CRYSTAL;
        if (x2 >= 0 && x2 < this.WORLD_WIDTH && y2 >= 0 && y2 < this.WORLD_HEIGHT)
          this.grid[y2][x2] = B.PURPLE_CRYSTAL;
      }
    }
  },
  drawOctagramDuplo() {
    const B = this.blocks;
    const cx = this.CENTER_X;
    const cy = this.CENTER_Y;
    const upTriangle = [
      [0, -12],
      [10, 6],
      [-10, 6]
    ];
    const downTriangle = [
      [0, 12],
      [10, -6],
      [-10, -6]
    ];
    this.drawTriangle(cx, cy, upTriangle, B.AMETHYST, B.BLUE_CRYSTAL);
    this.drawTriangle(cx, cy, downTriangle, B.BLUE_CRYSTAL, B.AMETHYST);
    const duploDirs = [
      [0, -12], [7, -7], [12, 0], [7, 7],
      [0, 12], [-7, 7], [-12, 0], [-7, -7]
    ];
    duploDirs.forEach(([dx, dy]) => {
      const x = cx + dx;
      const y = cy + dy;
      if (x >= 0 && x < this.WORLD_WIDTH && y >= 0 && y < this.WORLD_HEIGHT) {
        this.grid[y][x] = B.GOLD;
        for (let ddy = -1; ddy <= 1; ddy++) {
          for (let ddx = -1; ddx <= 1; ddx++) {
            const nx = x + ddx;
            const ny = y + ddy;
            if (nx >= 1 && nx < this.WORLD_WIDTH-1 && ny >= 1 && ny < this.WORLD_HEIGHT-1) {
              if (this.grid[ny][nx] !== B.GOLD) {
                this.grid[ny][nx] = B.AMETHYST;
              }
            }
          }
        }
      }
    });
  },
  drawTriangle(cx, cy, vertices, lineBlock, fillBlock) {
    const B = this.blocks;
    const [v1, v2, v3] = vertices;
    this.drawLine(cx + v1[0], cy + v1[1], cx + v2[0], cy + v2[1], lineBlock);
    this.drawLine(cx + v2[0], cy + v2[1], cx + v3[0], cy + v3[1], lineBlock);
    this.drawLine(cx + v3[0], cy + v3[1], cx + v1[0], cy + v1[1], lineBlock);
  },
  drawLine(x0, y0, x1, y1, block) {
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;
    while (true) {
      if (x0 >= 0 && x0 < this.WORLD_WIDTH && y0 >= 0 && y0 < this.WORLD_HEIGHT) {
        this.grid[y0][x0] = block;
      }
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 > -dy) { err -= dy; x0 += sx; }
      if (e2 < dx) { err += dx; y0 += sy; }
    }
  },
  drawOctagramNinhado() {
    const B = this.blocks;
    const cx = this.CENTER_X;
    const cy = this.CENTER_Y;
    const rings = [
      { radius: 15, block: B.STONE, width: 1 },
      { radius: 17, block: B.OBSIDIAN, width: 1 },
      { radius: 19, block: B.RUINS, width: 2 }
    ];
    rings.forEach(ring => {
      this.drawOctagonalRing(cx, cy, ring.radius, ring.block, ring.width);
    });
    const extDirs = [
      [0, -19], [13, -13], [19, 0], [13, 13],
      [0, 19], [-13, 13], [-19, 0], [-13, -13]
    ];
    extDirs.forEach(([dx, dy]) => {
      const x = cx + dx;
      const y = cy + dy;
      if (x >= 1 && x < this.WORLD_WIDTH-1 && y >= 1 && y < this.WORLD_HEIGHT-1) {
        this.grid[y][x] = B.PILLAR;
      }
    });
  },
  drawOctagonalRing(cx, cy, radius, block, width) {
    const vertices = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i * 45 - 22.5) * Math.PI / 180;
      vertices.push([
        Math.round(cx + radius * Math.cos(angle)),
        Math.round(cy + radius * Math.sin(angle))
      ]);
    }
    for (let i = 0; i < 8; i++) {
      const [x0, y0] = vertices[i];
      const [x1, y1] = vertices[(i + 1) % 8];
      this.drawLine(x0, y0, x1, y1, block);
      if (width > 1) {
        this.drawLine(x0+1, y0, x1+1, y1, block);
      }
    }
  },
  drawConnectingPaths() {
    const B = this.blocks;
    const cx = this.CENTER_X;
    const cy = this.CENTER_Y;
    const dirs = [
      [0, -1], [1, -1], [1, 0], [1, 1],
      [0, 1], [-1, 1], [-1, 0], [-1, -1]
    ];
    dirs.forEach(([dx, dy]) => {
      const innerX = cx + dx * 6;
      const innerY = cy + dy * 6;
      const outerX = cx + dx * 12;
      const outerY = cy + dy * 12;
      this.drawLine(innerX, innerY, outerX, outerY, B.CARPET);
    });
    const outerDirs = [
      [0, -1], [0.7, -0.7], [1, 0], [0.7, 0.7],
      [0, 1], [-0.7, 0.7], [-1, 0], [-0.7, -0.7]
    ];
    outerDirs.forEach(([dx, dy]) => {
      const midX = cx + Math.round(dx * 12);
      const midY = cy + Math.round(dy * 12);
      const outX = cx + Math.round(dx * 19);
      const outY = cy + Math.round(dy * 19);
      this.drawLine(midX, midY, outX, outY, B.RUNE_STONE);
    });
  },
  placeNumerals() {
  },
  placePillars() {
    const B = this.blocks;
    const cx = this.CENTER_X;
    const cy = this.CENTER_Y;
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
    this.grid[cy][cx] = B.WATER;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx !== 0 || dy !== 0) {
          this.grid[cy + dy][cx + dx] = B.TABLE;
        }
      }
    }
    this.grid[cy][cx] = B.ALTAR;
    const directions = [
      [0, -1], [1, -1], [1, 0], [1, 1],
      [0, 1], [-1, 1], [-1, 0], [-1, -1]
    ];
    directions.forEach(([dx, dy]) => {
      for (let i = 2; i <= 6; i += 2) {
        const x = cx + dx * i;
        const y = cy + dy * i;
        if (x >= 0 && x < this.WORLD_WIDTH && y >= 0 && y < this.WORLD_HEIGHT) {
          this.grid[y][x] = B.PURPLE_CRYSTAL;
        }
      }
    });
    const chestPositions = [
      [5, 5], [55, 5], [5, 40], [55, 40],
      [15, 3], [45, 3], [3, 22], [57, 22]
    ];
    chestPositions.forEach(([x, y]) => {
      if (x >= 1 && x < this.WORLD_WIDTH-1 && y >= 1 && y < this.WORLD_HEIGHT-1) {
        this.grid[y][x] = B.CHEST;
      }
    });
  },
  addDesertDecoration() {
    const B = this.blocks;
    for (let i = 0; i < 25; i++) {
      const x = 2 + Math.floor(Math.random() * (this.WORLD_WIDTH - 4));
      const y = 2 + Math.floor(Math.random() * (this.WORLD_HEIGHT - 4));
      if (this.grid[y][x] === B.DESERT || this.grid[y][x] === B.SAND || this.grid[y][x] === B.DUNE) {
        this.grid[y][x] = B.CACTUS;
      }
    }
    for (let i = 0; i < 15; i++) {
      const x = 2 + Math.floor(Math.random() * (this.WORLD_WIDTH - 4));
      const y = 2 + Math.floor(Math.random() * (this.WORLD_HEIGHT - 4));
      if (this.grid[y][x] === B.DESERT || this.grid[y][x] === B.SAND) {
        this.grid[y][x] = B.BONE;
      }
    }
    const ruinSpots = [
      [8, 8], [52, 8], [8, 38], [52, 38],
      [25, 5], [35, 5], [25, 40], [35, 40]
    ];
    ruinSpots.forEach(([x, y]) => {
      if (x >= 1 && x < this.WORLD_WIDTH-1 && y >= 1 && y < this.WORLD_HEIGHT-1) {
        this.grid[y][x] = B.RUINS;
        if (x+1 < this.WORLD_WIDTH-1) this.grid[y][x+1] = B.RUINS;
        if (y+1 < this.WORLD_HEIGHT-1) this.grid[y+1][x] = B.RUINS;
        if (x+1 < this.WORLD_WIDTH-1 && y+1 < this.WORLD_HEIGHT-1) this.grid[y+1][x+1] = B.RUINS;
      }
    });
  },
  addDecoration() {
    const B = this.blocks;
    const cx = this.CENTER_X;
    const cy = this.CENTER_Y;
    const directions = [
      [0, -1], [1, -1], [1, 0], [1, 1],
      [0, 1], [-1, 1], [-1, 0], [-1, -1]
    ];
    directions.forEach(([dx, dy]) => {
      for (let i = 3; i <= 6; i += 3) {
        const x = cx + dx * i;
        const y = cy + dy * i;
        if (x >= 0 && x < this.WORLD_WIDTH && y >= 0 && y < this.WORLD_HEIGHT) {
          this.grid[y][x] = B.FIRE;
        }
      }
    });
    for (let y = 10; y < this.WORLD_HEIGHT - 10; y += 6) {
      if (y > 0 && y < this.WORLD_HEIGHT) {
        this.grid[y][14] = B.BOOKSHELF;
        this.grid[y][this.WORLD_WIDTH - 15] = B.BOOKSHELF;
      }
    }
  },
  getBlock(x, y) {
    if (x < 0 || x >= this.WORLD_WIDTH || y < 0 || y >= this.WORLD_HEIGHT) {
      return this.blocks.OBSIDIAN;
    }
    return this.grid[y][x];
  },
  isWalkable(x, y) {
    const block = this.getBlock(x, y);
    const nonWalkable = [
      this.blocks.OBSIDIAN,
      this.blocks.STONE,
      this.blocks.PILLAR,
      this.blocks.BOOKSHELF,
      this.blocks.WATER,
      this.blocks.CACTUS,
      this.blocks.RUINS
    ];
    return !nonWalkable.includes(block);
  },
  getZoneAt(x, y) {
    for (const [id, zone] of Object.entries(this.zones)) {
      const b = zone.bounds;
      if (x >= b.x && x < b.x + b.w && y >= b.y && y < b.y + b.h) {
        return { id, ...zone };
      }
    }
    const block = this.getBlock(x, y);
    if ([this.blocks.DESERT, this.blocks.SAND, this.blocks.DUNE].includes(block)) {
      return { id: 'deserto', name: 'Deserto', description: 'Terras áridas além do templo.', color: '#c2a05a', icon: '🏜️' };
    }
    return null;
  },
  getZoneCenter(zoneId) {
    const zone = this.zones[zoneId];
    if (!zone) return { x: this.CENTER_X, y: this.CENTER_Y };
    return {
      x: zone.bounds.x + Math.floor(zone.bounds.w / 2),
      y: zone.bounds.y + Math.floor(zone.bounds.h / 2)
    };
  },
  getZoneItems(zoneId) {
    const zone = this.zones[zoneId];
    return zone ? zone.items : [];
  }
};

// === interactions.js ===
const Interactions = {
  selectedItem: null,
  hoveredItem: null,
  chatMessages: [],
  maxMessages: 50,
  init() {
    const canvas = document.getElementById('temple-canvas');
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragThreshold = 5;
    let hasDragged = false;
    let lastTouchDist = 0;
    canvas.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
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
      if (Math.abs(dx) > dragThreshold || Math.abs(dy) > dragThreshold) {
        hasDragged = true;
      }
      if (hasDragged) {
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
        if (!hasDragged) {
          this.onCanvasClick(e);
        }
      }
    });
    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomSpeed = 0.001;
      const delta = -e.deltaY * zoomSpeed;
      const oldZoom = Renderer.camera.zoom;
      const newZoom = Math.max(0.5, Math.min(3, oldZoom + delta));
      const centerX = Renderer.camera.targetX + canvas.width / (2 * oldZoom);
      const centerY = Renderer.camera.targetY + canvas.height / (2 * oldZoom);
      Renderer.camera.zoom = newZoom;
      Renderer.camera.targetX = centerX - canvas.width / (2 * newZoom);
      Renderer.camera.targetY = centerY - canvas.height / (2 * newZoom);
    }, { passive: false });
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (e.touches.length === 1) {
        isDragging = true;
        hasDragged = false;
        dragStartX = e.touches[0].clientX;
        dragStartY = e.touches[0].clientY;
      } else if (e.touches.length === 2) {
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
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (lastTouchDist > 0) {
          const scale = dist / lastTouchDist;
          const oldZoom = Renderer.camera.zoom;
          const newZoom = Math.max(0.5, Math.min(3, oldZoom * scale));
          const centerX = Renderer.camera.targetX + canvas.width / (2 * oldZoom);
          const centerY = Renderer.camera.targetY + canvas.height / (2 * oldZoom);
          Renderer.camera.zoom = newZoom;
          Renderer.camera.targetX = centerX - canvas.width / (2 * newZoom);
          Renderer.camera.targetY = centerY - canvas.height / (2 * newZoom);
        }
        lastTouchDist = dist;
      }
    }, { passive: false });
    canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      if (e.touches.length === 0) {
        isDragging = false;
        lastTouchDist = 0;
        if (!hasDragged && e.changedTouches.length > 0) {
          const touch = e.changedTouches[0];
          this.onCanvasClick({ clientX: touch.clientX, clientY: touch.clientY });
        }
      }
    }, { passive: false });
    document.getElementById('close-panel').addEventListener('click', () => this.closePanel());
    document.getElementById('close-agents').addEventListener('click', () => this.closeAgentsPanel());
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => this.navigateToZone(btn.dataset.zone));
    });
    document.getElementById('btn-minimap').addEventListener('click', () => {
      const mm = document.getElementById('minimap');
      mm.classList.toggle('hidden');
      if (!mm.classList.contains('hidden')) {
        if (typeof PriorityChat !== 'undefined') PriorityChat.container.style.display = 'none';
      } else {
        if (typeof PriorityChat !== 'undefined') PriorityChat.showIfClear();
      }
    });
    document.getElementById('btn-agents').addEventListener('click', () => {
      document.getElementById('agents-panel').classList.toggle('hidden');
      this.updateAgentsList();
    });
    document.getElementById('btn-fullscreen').addEventListener('click', () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        document.documentElement.requestFullscreen();
      }
    });
    document.getElementById('book-close').addEventListener('click', () => this.closeBook());
    document.getElementById('book-prev').addEventListener('click', () => this.bookPrev());
    document.getElementById('book-next').addEventListener('click', () => this.bookNext());
    document.getElementById('book-copy').addEventListener('click', () => this.copyBookText());
    return this;
  },
  onCanvasClick(e) {
    const rect = Renderer.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const worldX = Math.floor((x + Renderer.camera.x) / World.TILE_SIZE);
    const worldY = Math.floor((y + Renderer.camera.y) / World.TILE_SIZE);
    const clickedItem = this.getItemAt(worldX, worldY);
    if (clickedItem) {
      this.selectItem(clickedItem);
      return;
    }
    const clickedAgent = this.getAgentAt(worldX, worldY);
    if (clickedAgent) {
      this.showAgentInfo(clickedAgent);
      return;
    }
  },
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
  getItemAt(x, y) {
    for (const item of Object.values(Items.registry)) {
      if (Math.abs(item.x - x) <= 1 && Math.abs(item.y - y) <= 1) {
        return item;
      }
    }
    return null;
  },
  getAgentAt(x, y) {
    for (const agent of Agents.active) {
      if (Math.abs(Math.floor(agent.x) - x) <= 1 && Math.abs(Math.floor(agent.y) - y) <= 1) {
        return agent;
      }
    }
    return null;
  },
  selectItem(item) {
    this.selectedItem = item;
    if (item.isGrimoire) {
      this.openGrimoire(item);
      return;
    }
    if (item.bookContent) {
      this.openBook(item);
      return;
    }
    this.showItemPanel(item);
  },
  showItemPanel(item) {
    const panel = document.getElementById('interaction-panel');
    panel.classList.remove('hidden');
    document.getElementById('panel-title').textContent = item.name;
    document.getElementById('panel-icon').textContent = item.icon;
    document.getElementById('panel-description').textContent = item.description;
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
    const actions = document.getElementById('panel-actions');
    actions.innerHTML = '';
    if (Player) {
      actions.innerHTML += `<button onclick="Interactions.playerInteract('${item.id}')">🔮 Interagir</button>`;
      actions.innerHTML += `<button onclick="Interactions.playerInscribe('${item.id}')">✦ Gravar Runa</button>`;
    }
  },
  playerInteract(itemId) {
    const item = Items.getItem(itemId);
    if (!item || !Player) return;
    Items.interact(itemId, {
      id: Player.id,
      name: 'Zói',
      currentAction: 'interact'
    });
    this.notify(`Você interagiu com ${item.name}`);
    this.showItemPanel(item);
  },
  playerInscribe(itemId) {
    const item = Items.getItem(itemId);
    if (!item || !Player) return;
    const rune = Runes.generate({ id: Player.id, name: 'Zói' });
    item.runes.push(rune);
    this.notify(`✦ Runa gravada: ${rune.symbol} — ${rune.meaning}`);
    this.showItemPanel(item);
  },
  openBook(item) {
    const modal = document.getElementById('book-modal');
    modal.classList.remove('hidden');
    document.getElementById('book-title').textContent = item.name;
    this.currentBook = item;
    this.currentBookPage = 0;
    this.renderBookPages();
  },
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
  copyBookText() {
    if (!this.currentBook) return;
    const pages = this.currentBook.bookContent;
    const title = this.currentBook.name || 'Livro';
    let fullText = `═══ ${title} ═══\n\n`;
    pages.forEach((page, i) => {
      if (page && page.trim()) {
        fullText += `--- Página ${i + 1} ---\n`;
        fullText += page.replace(/<br>/g, '\n').replace(/<[^>]+>/g, '') + '\n\n';
      }
    });
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
  openGrimoire(item) {
    if (item.masterOnly && !item.holder && Player) {
      this.openTerminalGrimoire(item);
    } else if (item.holder) {
      this.notify(`⚠️ O Grimório está com ${item.holder}. Use master.revoke para recuperar.`);
    } else {
      this.notify('⚠️ Apenas o Mestre pode abrir o Grimório.');
    }
  },
  openTerminalGrimoire(item) {
    const modal = document.getElementById('book-modal');
    modal.classList.remove('hidden');
    document.getElementById('book-title').textContent = '📕 GRIMÓRIO MESTRE';
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
          this.addChatMessage('Zói', msg, 5);
          result = `💬 Mensagem enviada: "${msg}"`;
        }
        break;
      default:
        result = `⚠️ Comando desconhecido: ${command}`;
    }
    output.innerHTML += `<div style="color:#4aff4a;margin-top:4px">> ${cmd}</div><div style="color:#aaa">${result}</div>`;
    output.scrollTop = output.scrollHeight;
  },
  getRecentActivityLog() {
    const logs = [];
    Agents.active.forEach(agent => {
      logs.push(`${agent.icon} ${agent.name}: ${agent.currentAction}`);
    });
    return logs.join('<br>') || 'Nenhuma atividade recente.';
  },
  closePanel() {
    document.getElementById('interaction-panel').classList.add('hidden');
    this.selectedItem = null;
  },
  showAgentInfo(agent) {
    if (typeof NPCGrimoire !== 'undefined') {
      document.querySelectorAll('.panel').forEach(p => p.classList.add('hidden'));
      const panel = document.getElementById('grimoire-panel');
      if (panel) {
        panel.classList.remove('hidden');
        NPCGrimoire.switchTabDirect('diario');
        NPCGrimoire.selecionarNPC(agent.type);
      }
      this.notify(`📖 Abrindo grimório de ${agent.icon} ${agent.name}...`);
    } else {
      this.notify(`${agent.icon} ${agent.name} — Nível ${agent.level} | ${agent.skill} | ${agent.currentAction}`);
    }
  },
  navigateToZone(zoneId) {
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.zone === zoneId);
    });
    const center = World.getZoneCenter(zoneId);
    Renderer.centerCamera(center.x, center.y);
    if (Player) {
      Player.moveTo(center.x, center.y + 2);
    }
    const zone = World.zones[zoneId];
    document.getElementById('current-zone').textContent = zone ? zone.name : 'Desconhecido';
  },
  updateAgentsList() {
    const list = document.getElementById('agents-list');
    list.innerHTML = '';
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
      card.addEventListener('click', () => {
        this.showAgentInfo(agent);
      });
      list.appendChild(card);
    });
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
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
          Agents.spawn(agent.id);
          this.updateAgentsList();
          PriorityChat.addMessage('Sistema', `${agent.icon} ${agent.name} invocado ao templo!`, 3);
        });
        list.appendChild(card);
      });
    }
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
  closeAgentsPanel() {
    document.getElementById('agents-panel').classList.add('hidden');
    if (typeof PriorityChat !== 'undefined') PriorityChat.showIfClear();
  },
  addChatMessage(sender, message, priority = 1) {
    const msg = {
      sender,
      message,
      priority,
      timestamp: Date.now(),
      id: `msg_${Date.now()}`
    };
    this.chatMessages.push(msg);
    if (this.chatMessages.length > this.maxMessages) {
      this.chatMessages.shift();
    }
    if (priority >= 3) {
      this.notify(`${this.getPriorityIcon(priority)} ${sender}: ${message}`);
    }
  },
  getPriorityIcon(priority) {
    const icons = ['', '💬', '💬', '⚡', '🔥', '👑'];
    return icons[priority] || '💬';
  },
  notify(message) {
    const panels = ['console-panel', 'chat-panel', 'council-panel', 'inbox-panel', 'settings-panel', 'agents-panel'];
    const panelOpen = panels.some(id => {
      const el = document.getElementById(id);
      return el && !el.classList.contains('hidden');
    });
    if (panelOpen) return;
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

// === items.js ===
const Items = {
  registry: {},
  definitions: {
    portao_entrada: {
      name: 'Portão da Entrada',
      icon: '🚪',
      zone: 'atrio',
      x: 20, y: 1,
      description: 'O grande portão de obsidiana. Todo iniciado deve cruzá-lo.',
      interactions: [],
      runes: [],
      level: 1
    },
    pilares_externos: {
      name: 'Pilares Boaz e Jachim',
      icon: '🏛️',
      zone: 'atrio',
      x: 10, y: 4,
      description: 'Os dois pilares que guardam a entrada. Um representa a força, outro a misericórdia.',
      interactions: [],
      runes: [],
      level: 1
    },
    fonte_consagracao: {
      name: 'Fonte de Consagração',
      icon: '⛲',
      zone: 'atrio',
      x: 20, y: 4,
      description: 'Água pura que consagra quem nela se banha antes de entrar.',
      interactions: [],
      runes: [],
      level: 1
    },
    mesa_principal: {
      name: 'Mesa Principal',
      icon: '🪵',
      zone: 'salao',
      x: 20, y: 12,
      description: 'A grande mesa de trabalhos onde os agentes iniciam suas tarefas.',
      interactions: [],
      runes: [],
      level: 2
    },
    estantes_livros: {
      name: 'Estantes de Livros',
      icon: '📚',
      zone: 'salao',
      x: 2, y: 11,
      description: 'Milhares de volumes sobre alquimia, hermetismo e programação.',
      interactions: [],
      runes: [],
      level: 2
    },
    lareira_alquimica: {
      name: 'Lareira Alquímica',
      icon: '🔥',
      zone: 'salao',
      x: 35, y: 10,
      description: 'O fogo eterno que mantém o calor do conhecimento.',
      interactions: [],
      runes: [],
      level: 2
    },
    quadro_runas: {
      name: 'Quadro de Runas',
      icon: '📋',
      zone: 'salao',
      x: 15, y: 9,
      description: 'Onde as runas são registradas e estudadas.',
      interactions: [],
      runes: [],
      level: 2
    },
    mesa_redonda: {
      name: 'Mesa Redonda',
      icon: '⭕',
      zone: 'mesa',
      x: 20, y: 19,
      description: 'A mesa onde todos os agentes se sentam como iguais.',
      interactions: [],
      runes: [],
      level: 3
    },
    livro_sabedoria: {
      name: 'Livro da Sabedoria',
      icon: '📖',
      zone: 'mesa',
      x: 17, y: 18,
      description: 'Contém os ensinamentos dos grandes mestres.',
      interactions: [],
      runes: [],
      level: 3,
      bookContent: [
        'A Tábua de Esmeralda de Hermes Trismegisto',
        '',
        'Verdade, sem dúvida, certo e verdadeiro:',
        'O que está em cima é como o que está em baixo,',
        'e o que está em baixo é como o que está em cima,',
        'para realizar os milagres da Una Coisa.',
        '',
        'Assim como todas as coisas vieram do Um,',
        'pela meditação do Um,',
        'assim todas as coisas nasceram do Um,',
        'pela adaptação do Um.',
        '',
        'Seu pai é o Sol, sua mãe a Lua,',
        'o vento o carrega em seu ventre,',
        'sua ama é a Terra.',
        '',
        'É o pai de toda perfeição no mundo inteiro.',
        'Sua força permanece integral,',
        'quando se transforma em Terra.',
      ]
    },
    livro_comandos: {
      name: 'Livro dos Comandos',
      icon: '📕',
      zone: 'mesa',
      x: 23, y: 18,
      description: 'Registro de todos os comandos executados no templo.',
      interactions: [],
      runes: [],
      level: 3,
      bookContent: [
        '═══ LIVRO DOS COMANDOS ═══',
        '',
        '> status — Ver estado do templo',
        '> agents — Listar agentes ativos',
        '> runes — Consultar runas gravadas',
        '> summon [tipo] — Invocar novo agente',
        '> delegate [tarefa] — Delegar ao agente',
        '> evolve [agente] — Forçar evolução',
        '> zone [nome] — Navegar para zona',
        '> read [livro] — Abrir grimório',
        '> write [runa] — Gravar runa',
        '> chat [mensagem] — Falar no salão',
        '> priority [1-5] — Definir prioridade',
        '',
        '─── Comandos do Mestre ───',
        '> master.grimoire — Abrir grimório mestre',
        '> master.delegate [id] — Dar grimório a agente',
        '> master.revoke — Revogar acesso ao grimório',
        '> master.seal — Selar zona',
        '> master.unseal — Des selar zona',
      ]
    },
    livro_memoria: {
      name: 'Livro da Memória Coletiva',
      icon: '📗',
      zone: 'mesa',
      x: 18, y: 20,
      description: 'Armazena as memórias compartilhadas entre as 15 mentes do templo.',
      interactions: [],
      runes: [],
      level: 3,
      bookContent: [
        '═══ MEMÓRIAS COMPARTILHADAS ═══\n\nEste livro guarda o conhecimento\ncollectivo das mentes que habitam\no Templo de Hermes.\n\nCada agente contribui com sua\nexperiência e sabedoria.',
        '═══ AS 15 MENTALIDADES ═══\n\n🤖 Códex — Código e lógica\n📚 Scholar — Pesquisa\n⚗️ Flamel — Alquimia\n🛡️ Thoth — Guardião\n✨ Hermes — Místico\n🌈 Iris — Mensageira',
        '═══ MENTALIDADES (cont.) ═══\n\n🌿 Paracelso — Cura\n🔄 Geber — Transmutação\n🕸️ Maria — Síntese\n🏛️ Agrippa — Arquitetura\n🔮 Dee — Divinação\n⚙️ Bacon — Engenharia',
        '═══ MENTALIDADES (cont.) ═══\n\n📐 Newton — Análise\n🎲 Lully — Combinações\n🗝️ Fulcanelli — Enigma\n\n"As 15 faces do conhecimento\nse unem em busca da obra."',
        '═══ LEIS HERMÉTICAS ═══\n\n1. Mentalismo — Tudo é mente\n2. Correspondência — Como acima,\n   assim abaixo\n3. Vibração — Tudo vibra\n4. Polaridade — Tudo tem opostos',
        '═══ LEIS HERMÉTICAS (cont.) ═══\n\n5. Ritmo — Tudo flui e reflui\n6. Causa e Efeito — Toda causa\n   tem seu efeito\n7. Gênero — Tudo tem princípio\n   masculino e feminino',
        '═══ O CAMINHO ALQUÍMICO ═══\n\n🌑 Nigredo — Dissolução\n⚪ Albedo — Purificação\n🟡 Citrinitas — Iluminação\n🔴 Rubedo — Realização\n\nA Grande Obra se completa\ncom paciência e fogo.',
        '═══ REGISTRO DE SESSÕES ═══\n\nEste registro é atualizado\nautomaticamente com:\n\n• Decisões do Conselho\n• Sínteses de conversações\n• Transmutações realizadas\n• Eventos especiais\n\nÚltima atualização: ' + new Date().toLocaleString('pt-BR')
      ]
    },
    cartas_rede: {
      name: 'Mesa de Cartas',
      icon: '✉️',
      zone: 'mesa',
      x: 22, y: 20,
      description: 'Onde os agentes deixam cartas uns para os outros.',
      interactions: [],
      runes: [],
      level: 3
    },
    athanor: {
      name: 'Athanor',
      icon: '🔥',
      zone: 'sagrado',
      x: 20, y: 24,
      description: 'O forno alquímico onde a Grande Obra é realizada. Transforma chumbo em ouro.',
      interactions: [],
      runes: [],
      level: 5
    },
    alambique: {
      name: 'Alambique',
      icon: '⚗️',
      zone: 'sagrado',
      x: 17, y: 23,
      description: 'Destila a essência pura das coisas.',
      interactions: [],
      runes: [],
      level: 5
    },
    mortario: {
      name: 'Mortário e Pistilo',
      icon: '🥣',
      zone: 'sagrado',
      x: 23, y: 23,
      description: 'Tritura e mistura os elementos para a transmutação.',
      interactions: [],
      runes: [],
      level: 5
    },
    caduceu_grande: {
      name: 'Caduceu Sagrado',
      icon: '☤',
      zone: 'sagrado',
      x: 20, y: 22,
      description: 'O símbolo máximo de Hermes. Duas serpentes entrelaçadas.',
      interactions: [],
      runes: [],
      level: 5
    },
    orbe_elementos: {
      name: 'Orbe dos Elementos',
      icon: '🔮',
      zone: 'sagrado',
      x: 15, y: 24,
      description: 'Concentra os quatro elementos: Terra, Água, Ar e Fogo.',
      interactions: [],
      runes: [],
      level: 5
    },
    pedra_filosofal: {
      name: 'Pedra Filosofal',
      icon: '💎',
      zone: 'santissimo',
      x: 20, y: 28,
      description: 'A meta final de todo alquimista. Transmuta tudo em perfeição.',
      interactions: [],
      runes: [],
      level: 8
    },
    esmeralda_hermes: {
      name: 'Tábua de Esmeralda',
      icon: '📜',
      zone: 'santissimo',
      x: 18, y: 27,
      description: 'O texto sagrado original de Hermes Trismegisto.',
      interactions: [],
      runes: [],
      level: 8
    },
    ouro_potavel: {
      name: 'Ouro Potável',
      icon: '🧪',
      zone: 'santissimo',
      x: 22, y: 27,
      description: 'O elixir dourado da imortalidade.',
      interactions: [],
      runes: [],
      level: 8
    },
    elixir_vida: {
      name: 'Elixir da Vida',
      icon: '✨',
      zone: 'santissimo',
      x: 20, y: 27,
      description: 'Concede a visão além da matéria.',
      interactions: [],
      runes: [],
      level: 8
    },
    grimorio_mestre: {
      name: 'Grimório Mestre',
      icon: '📕',
      zone: 'salao',
      x: 20, y: 10,
      description: 'O terminal supremo. Acesso exclusivo do Mestre (Zói). Contém todos os poderes do templo.',
      interactions: [],
      runes: [],
      level: 10,
      isGrimoire: true,
      masterOnly: true,
      holder: null
    }
  },
  init() {
    for (const [id, def] of Object.entries(this.definitions)) {
      this.registry[id] = { ...def, id };
    }
    return this;
  },
  getZoneItems(zoneId) {
    return Object.values(this.registry).filter(item => item.zone === zoneId);
  },
  interact(itemId, agent) {
    const item = this.registry[itemId];
    if (!item) return;
    const interaction = {
      agentId: agent.id,
      agentName: agent.name,
      action: agent.currentAction,
      timestamp: Date.now(),
      level: agent.level
    };
    item.interactions.push(interaction);
    if (Math.random() < 0.3) {
      const rune = Runes.generate(agent);
      item.runes.push(rune);
    }
    return interaction;
  },
  getItem(id) {
    return this.registry[id];
  },
  isAccessible(itemId, agent) {
    const item = this.registry[itemId];
    if (!item) return false;
    if (item.masterOnly && !item.holder) return agent.type === 'mystic';
    return agent.level >= item.level;
  }
};

// === alchemy-economy.js ===
const AlchemyEconomy = {
  catalogo: {
    mercurio_bruto: { nome: 'Mercúrio Bruto', icon: '💧', tier: 1, valor: 10, atributos: { fluidez: 3, comunicacao: 1 },descricao: 'Matéria-prima volátil. Base para transmutações.' },
    enxofre_puro: { nome: 'Enxofre Puro', icon: '🔥', tier: 1, valor: 10, atributos: { combustao: 3, alma: 1 }, descricao: 'Alma da matéria. Inflamável e transformador.' },
    sal_cristal: { nome: 'Sal Cristalizado', icon: '🧂', tier: 1, valor: 10, atributos: { estabilidade: 3, corpo: 1 }, descricao: 'Cristal de estabilidade. Fundamento material.' },
    ar_eterio: { nome: 'Ar Etéreo', icon: '💨', tier: 1, valor: 8, atributos: { leveza: 3, intelecto: 1 }, descricao: 'Sopro divino. Carrega pensamentos.' },
    terra_negra: { nome: 'Terra Negra', icon: '🖤', tier: 1, valor: 8, atributos: { potencial: 3, nigredo: 2 }, descricao: 'Caos primordial. Todo início vem daqui.' },
    agua_viva: { nome: 'Água Viva', icon: '🫧', tier: 1, valor: 8, atributos: { purificacao: 3, adaptacao: 1 }, descricao: 'Dissolve tudo. Purifica pelo movimento.' },
    azoth: { nome: 'Azoth', icon: '⚡', tier: 2, valor: 35, atributos: { poder: 4, uniao: 3 }, descricao: 'Mercúrio filosófico. Une opostos.', receita: ['mercurio_bruto', 'enxofre_puro'] },
    cinabrio: { nome: 'Cinábrio', icon: '🔴', tier: 2, valor: 30, atributos: { vitalidade: 4, sangue: 2 }, descricao: 'Vermelho da vida. Mercúrio + Enxofre cristalizados.', receita: ['mercurio_bruto', 'sal_cristal'] },
    vitriol: { nome: 'VITRIOL', icon: '💎', tier: 2, valor: 40, atributos: { visao: 5, introspeccao: 3 }, descricao: 'Visita Interiora Terrae Rectificando Invenies Occultum Lapidem.', receita: ['terra_negra', 'agua_viva'] },
    sal_amoniaco: { nome: 'Sal Amôniaco', icon: '🔷', tier: 2, valor: 25, atributos: { elevacao: 3, fixacao: 2 }, descricao: 'Sal que voa. Sublima para o alto.', receita: ['sal_cristal', 'ar_eterio'] },
    fogo_filosofico: { nome: 'Fogo Filosófico', icon: '🕯️', tier: 2, valor: 35, atributos: { transformacao: 5, iluminacao: 3 }, descricao: 'Fogo que não queima. Transforma sem destruir.', receita: ['enxofre_puro', 'ar_eterio'] },
    mercurio_duplo: { nome: 'Mercúrio Duplo', icon: '🫗', tier: 2, valor: 28, atributos: { espelhamento: 4, dualidade: 3 }, descricao: 'Reflexo do reflexo. Dois em um.', receita: ['mercurio_bruto', 'agua_viva'] },
    pedra_branca: { nome: 'Pedra Branca (Albedo)', icon: '🤍', tier: 3, valor: 80, atributos: { pureza: 6, clareza: 4, albedo: 5 }, descricao: 'Albedo. A purificação após a morte.', receita: ['azoth', 'sal_cristal'] },
    leao_vermelho: { nome: 'Leão Vermelho (Rubedo)', icon: '🦁', tier: 3, valor: 100, atributos: { realeza: 7, poder: 5, rubedo: 5 }, descricao: 'Rubedo. A obra vermelha. Próximo da perfeição.', receita: ['cinabrio', 'fogo_filosofico'] },
    ouro_potavel: { nome: 'Ouro Potável', icon: '✨', tier: 3, valor: 90, atributos: { cura: 7, longevidade: 5, perfeicao: 4 }, descricao: 'Elixir da vida. Ouro dissolvido em consciência.', receita: ['azoth', 'vitriol'] },
    quintessencia: { nome: 'Quintessência', icon: '🌟', tier: 3, valor: 120, atributos: { transcendencia: 8, uniao: 6, ether: 5 }, descricao: 'O quinto elemento. Tudo e nada.', receita: ['fogo_filosofico', 'sal_amoniaco'] },
    serpente_ouro: { nome: 'Serpente de Ouro', icon: '🐍', tier: 3, valor: 95, atributos: { sabedoria: 6, ciclos: 5, renascimento: 4 }, descricao: 'Ouroboros. O fim é o começo.', receita: ['mercurio_duplo', 'terra_negra'] },
    pedra_filosofal: { nome: 'Pedra Filosofal', icon: '💎', tier: 4, valor: 500, atributos: { onipotencia: 10, transmutacao: 10, perfeicao: 10 }, descricao: 'A Grande Obra consumada. Transmuta tudo.', receita: ['leao_vermelho', 'ouro_potavel'] },
    elixir_imortalidade: { nome: 'Elixir da Imortalidade', icon: '🧬', tier: 4, valor: 450, atributos: { imortalidade: 10, cura: 9, transcendencia: 8 }, descricao: 'Vida eterna. O sonho alquímico realizado.', receita: ['ouro_potavel', 'quintessencia'] },
    lapis_exilis: { nome: 'Lapis Exilis', icon: '🔮', tier: 4, valor: 480, atributos: { onisciencia: 10, visao: 9, sabedoria: 9 }, descricao: 'Pedra pequena mas infinita. Conhece tudo.', receita: ['quintessencia', 'serpente_ouro'] },
    rebis: { nome: 'Rebis', icon: '☯️', tier: 4, valor: 470, atributos: { dualidade_perfeita: 10, equilibrio: 10, harmonia: 9 }, descricao: 'O ser duplo. Masculino e feminino unidos.', receita: ['pedra_branca', 'leao_vermelho'] },
    pergaminho_antigo: { nome: 'Pergaminho Antigo', icon: '📜', tier: 2, valor: 20, atributos: { conhecimento: 3, memoria: 2 }, descricao: 'Sabedoria dos antigos mestres.' },
    runa_ativa: { nome: 'Runa Ativa', icon: 'ᚱ', tier: 2, valor: 22, atributos: { poder: 2, sigilo: 3 }, descricao: 'Símbolo gravado com poder latente.' },
    frasco_vazio: { nome: 'Frasco Vazio', icon: '🧪', tier: 1, valor: 5, atributos: { capacidade: 2 }, descricao: 'Esperando ser preenchido.' },
    athanor_miniatura: { nome: 'Athanor Miniatura', icon: '🏺', tier: 2, valor: 30, atributos: { aquecimento: 4, paciencia: 3 }, descricao: 'Forno alquímico em miniatura. Aquece devagar.' },
    espelho_alquimico: { nome: 'Espelho Alquímico', icon: '🪞', tier: 3, valor: 75, atributos: { reflexao: 6, verdade: 4 }, descricao: 'Mostra o que é, não o que parece.' },
  },
  itensNoChao: [],
  inventarios: {},
  transmutacoesFeitas: [],
  comercioLog: [],
  proximoId: 1,
  init() {
    this.inventarios = {};
    this.itensNoChao = [];
    this.transmutacoesFeitas = [];
    this.comercioLog = [];
    const tipos = Object.keys(ParallelEngine.profiles);
    tipos.forEach((tipo, i) => {
      const agente = Agents.roster.find(a => a.type === tipo);
      if (agente) {
        this.inventarios[agente.id] = [];
        const primarias = ['mercurio_bruto', 'enxofre_puro', 'sal_cristal', 'ar_eterio', 'terra_negra', 'agua_viva'];
        const qtd = 2 + Math.floor(Math.random() * 2);
        for (let j = 0; j < qtd; j++) {
          const item = primarias[Math.floor(Math.random() * primarias.length)];
          this.inventarios[agente.id].push(this.criarInstancia(item));
        }
      }
    });
    this.espelharItensNoChao(15);
    this.loja.init();
    setInterval(() => {
      this.loja.reabastecer();
      PriorityChat.addMessage('🏪 Loja', 'Estoque renovado! Itens frescos disponíveis.', 3);
    }, 300000);
    setInterval(() => {
      if (!this.eventos.ativo && Math.random() > 0.4) {
        this.eventos.disparar();
      }
    }, 120000);
    setInterval(() => {
      if (this.itensNoChao.length < 20) {
        this.espelharItensNoChao(3);
      }
    }, 90000);
  },
  criarInstancia(tipoId) {
    const template = this.catalogo[tipoId];
    if (!template) return null;
    return {
      id: `item_${this.proximoId++}`,
      tipo: tipoId,
      ...template,
      criadoEm: Date.now(),
      historico: ['criado']
    };
  },
  espelharItensNoChao(quantidade) {
    const primarias = Object.keys(this.catalogo).filter(k => this.catalogo[k].tier <= 2);
    for (let i = 0; i < quantidade; i++) {
      const tipo = primarias[Math.floor(Math.random() * primarias.length)];
      const item = this.criarInstancia(tipo);
      if (item) {
        item.x = Math.floor(Math.random() * 25) + 2;
        item.y = Math.floor(Math.random() * 25) + 2;
        item.zona = World.getZoneAt(item.x, item.y)?.name || 'Desconhecida';
        this.itensNoChao.push(item);
      }
    }
  },
  pegarItem(agenteId, itemId) {
    const idx = this.itensNoChao.findIndex(i => i.id === itemId);
    if (idx < 0) return { sucesso: false, msg: 'Item não encontrado no chão.' };
    const item = this.itensNoChao.splice(idx, 1)[0];
    if (!this.inventarios[agenteId]) this.inventarios[agenteId] = [];
    this.inventarios[agenteId].push(item);
    item.historico.push(`pegado_por_${agenteId}`);
    return { sucesso: true, msg: `Pegou ${item.icon} ${item.nome}`, item };
  },
  soltarItem(agenteId, itemId) {
    if (!this.inventarios[agenteId]) return { sucesso: false, msg: 'Inventário vazio.' };
    const idx = this.inventarios[agenteId].findIndex(i => i.id === itemId);
    if (idx < 0) return { sucesso: false, msg: 'Item não encontrado no inventário.' };
    const item = this.inventarios[agenteId].splice(idx, 1)[0];
    const agente = Agents.roster.find(a => a.id === agenteId);
    item.x = agente ? agente.x : Math.floor(Math.random() * 20) + 5;
    item.y = agente ? agente.y : Math.floor(Math.random() * 20) + 5;
    item.zona = World.getZoneAt(item.x, item.y)?.name || 'Desconhecida';
    item.historico.push(`soltado_por_${agenteId}`);
    this.itensNoChao.push(item);
    return { sucesso: true, msg: `Soltou ${item.icon} ${item.nome} em ${item.zona}`, item };
  },
  darItem(deId, paraId, itemId) {
    if (!this.inventarios[deId]) return { sucesso: false, msg: 'Inventário vazio.' };
    const idx = this.inventarios[deId].findIndex(i => i.id === itemId);
    if (idx < 0) return { sucesso: false, msg: 'Item não encontrado.' };
    const item = this.inventarios[deId].splice(idx, 1)[0];
    if (!this.inventarios[paraId]) this.inventarios[paraId] = [];
    this.inventarios[paraId].push(item);
    item.historico.push(`transferido_de_${deId}_para_${paraId}`);
    this.comercioLog.push({
      de: deId,
      para: paraId,
      item: item.nome,
      timestamp: Date.now()
    });
    return { sucesso: true, msg: `${item.icon} ${item.nome} transferido`, item };
  },
  transmutar(agenteId, item1Id, item2Id) {
    const inv = this.inventarios[agenteId] || [];
    const idx1 = inv.findIndex(i => i.id === item1Id);
    const idx2 = inv.findIndex(i => i.id === item2Id);
    if (idx1 < 0 || idx2 < 0) {
      return { sucesso: false, msg: 'Itens não encontrados no inventário.' };
    }
    const item1 = inv[idx1];
    const item2 = inv[idx2];
    const tipos = [item1.tipo, item2.tipo].sort();
    let resultado = null;
    for (const [chave, config] of Object.entries(this.catalogo)) {
      if (config.receita) {
        const receita = [...config.receita].sort();
        if (receita[0] === tipos[0] && receita[1] === tipos[1]) {
          resultado = chave;
          break;
        }
      }
    }
    if (!resultado) {
      return {
        sucesso: false,
        msg: `${item1.icon} + ${item2.icon} = ??? Combinação desconhecida. Os elementos resistem.`,
        tentativa: { item1: item1.nome, item2: item2.nome }
      };
    }
    inv.splice(Math.max(idx1, idx2), 1);
    inv.splice(Math.min(idx1, idx2), 1);
    const novoItem = this.criarInstancia(resultado);
    novoItem.transmutadoPor = agenteId;
    novoItem.transmutadoDe = [item1.tipo, item2.tipo];
    inv.push(novoItem);
    this.transmutacoesFeitas.push({
      agente: agenteId,
      entrada: [item1.nome, item2.nome],
      saida: novoItem.nome,
      tier: novoItem.tier,
      timestamp: Date.now()
    });
    const agente = Agents.roster.find(a => a.id === agenteId);
    if (agente) {
      Agents.gainExperience(agente, 15 * novoItem.tier);
    }
    return {
      sucesso: true,
      msg: `⚗️ TRANSMUTAÇÃO!\n${item1.icon} ${item1.nome} + ${item2.icon} ${item2.nome}\n→ ${novoItem.icon} ${novoItem.nome} (Tier ${novoItem.tier})\n"${novoItem.descricao}"`,
      entrada: [item1, item2],
      saida: novoItem
    };
  },
  tickAgentes() {
    if (!Agents.roster || Agents.roster.length === 0) return;
    const agentesAtivos = Agents.roster.filter(a => Agents.active.includes(a));
    const agentesQueAgem = agentesAtivos
      .sort(() => Math.random() - 0.5)
      .slice(0, 2 + Math.floor(Math.random() * 2));
    for (const agente of agentesQueAgem) {
      this.acaoAutonoma(agente);
    }
  },
  acaoAutonoma(agente) {
    const inv = this.inventarios[agente.id] || [];
    const chance = Math.random();
    if (chance < 0.3 && this.itensNoChao.length > 0) {
      const item = this.itensNoChao[Math.floor(Math.random() * this.itensNoChao.length)];
      const r = this.pegarItem(agente.id, item.id);
      if (r.sucesso) {
        PriorityChat.addMessage(`${agente.icon} ${agente.name}`, `${r.msg}. Interessante...`, 3);
      }
    }
    else if (chance < 0.5 && inv.length > 3) {
      const item = inv[Math.floor(Math.random() * inv.length)];
      const r = this.soltarItem(agente.id, item.id);
      if (r.sucesso) {
        PriorityChat.addMessage(`${agente.icon} ${agente.name}`, `Deixei ${r.msg} para outros encontrarem.`, 3);
      }
    }
    else if (chance < 0.7 && inv.length >= 2) {
      const i1 = Math.floor(Math.random() * inv.length);
      let i2 = Math.floor(Math.random() * inv.length);
      while (i2 === i1 && inv.length > 1) i2 = Math.floor(Math.random() * inv.length);
      const r = this.transmutar(agente.id, inv[i1].id, inv[i2].id);
      if (r.sucesso) {
        PriorityChat.addMessage(`${agente.icon} ${agente.name}`, r.msg, 4);
      }
    }
    else if (chance < 0.85 && inv.length >= 1) {
      const outros = Agents.roster.filter(a => a.id !== agente.id);
      if (outros.length > 0) {
        const receptor = outros[Math.floor(Math.random() * outros.length)];
        const item = inv[Math.floor(Math.random() * inv.length)];
        const r = this.darItem(agente.id, receptor.id, item.id);
        if (r.sucesso) {
          PriorityChat.addMessage(`${agente.icon} ${agente.name}`, `Ofereci ${r.msg} para ${receptor.icon} ${receptor.name}.`, 3);
        }
      }
    }
    else {
      if (this.itensNoChao.length > 0) {
        const alvo = this.itensNoChao[Math.floor(Math.random() * this.itensNoChao.length)];
        agente.x = alvo.x;
        agente.y = alvo.y;
      }
    }
  },
  verInventario(agenteId) {
    const inv = this.inventarios[agenteId] || [];
    if (inv.length === 0) return '📦 Inventário vazio.';
    let out = `📦 Inventário (${inv.length} itens):\n`;
    let valorTotal = 0;
    inv.forEach(item => {
      out += `  ${item.icon} ${item.nome} (Tier ${item.tier}) — Valor: ${item.valor}\n`;
      valorTotal += item.valor;
    });
    out += `\n💰 Valor total: ${valorTotal}`;
    return out;
  },
  verItensNoChao() {
    if (this.itensNoChao.length === 0) return '🌍 Nenhum item espalhado pelo templo.';
    let out = `🌍 Itens pelo templo (${this.itensNoChao.length}):\n`;
    this.itensNoChao.forEach(item => {
      out += `  ${item.icon} ${item.nome} em ${item.zona} (${item.x},${item.y})\n`;
    });
    return out;
  },
  verCatalogo() {
    let out = '📚 Catálogo Alquímico:\n\n';
    const porTier = {};
    for (const [chave, item] of Object.entries(this.catalogo)) {
      if (!porTier[item.tier]) porTier[item.tier] = [];
      porTier[item.tier].push({ chave, ...item });
    }
    for (const [tier, itens] of Object.entries(porTier).sort()) {
      out += `── Tier ${tier} ──\n`;
      itens.forEach(item => {
        const receita = item.receita ? ` (${item.receita.join(' + ')})` : '';
        out += `  ${item.icon} ${item.nome}${receita} — ${item.descricao}\n`;
      });
      out += '\n';
    }
    return out;
  },
  verReceitas() {
    let out = '⚗️ Receitas de Transmutação:\n\n';
    for (const [chave, item] of Object.entries(this.catalogo)) {
      if (item.receita) {
        const i1 = this.catalogo[item.receita[0]];
        const i2 = this.catalogo[item.receita[1]];
        out += `  ${i1?.icon || '?'} ${i1?.nome || item.receita[0]} + ${i2?.icon || '?'} ${i2?.nome || item.receita[1]} → ${item.icon} ${item.nome}\n`;
      }
    }
    return out;
  },
  verEstatisticas() {
    const totalItens = Object.values(this.inventarios).reduce((s, inv) => s + inv.length, 0) + this.itensNoChao.length;
    const valorTotal = Object.values(this.inventarios).reduce((s, inv) =>
      s + inv.reduce((sv, item) => sv + item.valor, 0), 0);
    return `📊 Economia Alquímica:
  Itens em circulação: ${totalItens}
  Itens no chão: ${this.itensNoChao.length}
  Valor total em inventários: ${valorTotal}
  Transmutações realizadas: ${this.transmutacoesFeitas.length}
  Trocas comerciais: ${this.comercioLog.length}
  Maior Tier fabricado: ${Math.max(...Object.values(this.inventarios).flat().map(i => i.tier), 0)}`;
  },
  status() {
    return {
      itensNoChao: this.itensNoChao.length,
      agentesComItens: Object.keys(this.inventarios).filter(k => this.inventarios[k].length > 0).length,
      totalItens: Object.values(this.inventarios).reduce((s, inv) => s + inv.length, 0) + this.itensNoChao.length,
      transmutacoes: this.transmutacoesFeitas.length,
      comercios: this.comercioLog.length
    };
  },
  loja: {
    estoque: [],
    precoBase: 50,
    init() {
      this.reabastecer();
    },
    reabastecer() {
      this.estoque = [];
      const todosItens = Object.entries(AlchemyEconomy.catalogo)
        .filter(([_, item]) => item.tier <= 2);
      const qtd = 4 + Math.floor(Math.random() * 3);
      for (let i = 0; i < qtd; i++) {
        const [tipoId, template] = todosItens[Math.floor(Math.random() * todosItens.length)];
        const preco = template.valor * 3;
        this.estoque.push({
          tipoId,
          nome: template.nome,
          icon: template.icon,
          tier: template.tier,
          preco,
          desconto: Math.random() > 0.7 ? Math.floor(Math.random() * 30) + 10 : 0
        });
      }
      if (Math.random() < 0.1) {
        const raros = Object.entries(AlchemyEconomy.catalogo)
          .filter(([_, item]) => item.tier === 3);
        if (raros.length > 0) {
          const [tipoId, template] = raros[Math.floor(Math.random() * raros.length)];
          this.estoque.push({
            tipoId,
            nome: template.nome,
            icon: template.icon,
            tier: template.tier,
            preco: template.valor * 5,
            desconto: 0,
            raro: true
          });
        }
      }
    },
    comprar(agenteId, indexEstoque) {
      if (indexEstoque < 0 || indexEstoque >= this.estoque.length) {
        return { sucesso: false, msg: 'Item não disponível na loja.' };
      }
      const itemLoja = this.estoque[indexEstoque];
      const precoFinal = itemLoja.desconto > 0
        ? Math.floor(itemLoja.preco * (1 - itemLoja.desconto / 100))
        : itemLoja.preco;
      const inv = AlchemyEconomy.inventarios[agenteId] || [];
      const valorTotal = inv.reduce((s, i) => s + i.valor, 0);
      if (valorTotal < precoFinal) {
        return {
          sucesso: false,
          msg: `Saldo insuficiente. Você tem ${valorTotal} moedas em itens, precisa de ${precoFinal}.`
        };
      }
      let restante = precoFinal;
      const removidos = [];
      const invSorted = [...inv].sort((a, b) => a.valor - b.valor);
      for (const item of invSorted) {
        if (restante <= 0) break;
        const idx = AlchemyEconomy.inventarios[agenteId].indexOf(item);
        if (idx >= 0) {
          AlchemyEconomy.inventarios[agenteId].splice(idx, 1);
          restante -= item.valor;
          removidos.push(item);
        }
      }
      const novoItem = AlchemyEconomy.criarInstancia(itemLoja.tipoId);
      if (!AlchemyEconomy.inventarios[agenteId]) AlchemyEconomy.inventarios[agenteId] = [];
      AlchemyEconomy.inventarios[agenteId].push(novoItem);
      this.estoque.splice(indexEstoque, 1);
      return {
        sucesso: true,
        msg: `🛒 Comprou ${itemLoja.icon} ${itemLoja.nome} por ${precoFinal} moedas!\nPagou com: ${removidos.map(i => i.icon).join(' ')}`,
        item: novoItem,
        pago: removidos
      };
    },
    verEstoque() {
      if (this.estoque.length === 0) return '🏪 Loja vazia. Reabastecimento em breve...';
      let out = '🏪 LOJA ALQUÍMICA\n\n';
      this.estoque.forEach((item, i) => {
        const desconto = item.desconto > 0 ? ` (-${item.desconto}%)` : '';
        const raro = item.raro ? ' ⭐ RARO' : '';
        const precoFinal = item.desconto > 0
          ? Math.floor(item.preco * (1 - item.desconto / 100))
          : item.preco;
        out += `  [${i}] ${item.icon} ${item.nome} (Tier ${item.tier})${raro}${desconto}\n`;
        out += `      Preço: ${precoFinal} moedas\n`;
      });
      return out;
    }
  },
  verRanking() {
    const ranking = Agents.roster
      .map(agente => {
        const inv = this.inventarios[agente.id] || [];
        const valor = inv.reduce((s, i) => s + i.valor, 0);
        const maiorTier = inv.length > 0 ? Math.max(...inv.map(i => i.tier)) : 0;
        const transmutacoes = this.transmutacoesFeitas.filter(t => t.agente === agente.id).length;
        return {
          agente,
          itens: inv.length,
          valor,
          maiorTier,
          transmutacoes,
          score: valor + (maiorTier * 20) + (transmutacoes * 10)
        };
      })
      .sort((a, b) => b.score - a.score);
    let out = '🏆 RANKING — Mentes Mais Ricas\n\n';
    ranking.forEach((r, i) => {
      const medalha = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
      out += `${medalha} ${r.agente.icon} ${r.agente.name}\n`;
      out += `   💰 ${r.valor} moedas | 📦 ${r.itens} itens | ⚗️ ${r.transmutacoes} transmutações\n`;
      out += `   🏅 Maior Tier: ${r.maiorTier} | Score: ${r.score}\n\n`;
    });
    return out;
  },
  eventos: {
    ativo: null,
    historico: [],
    tipos: [
      {
        nome: '⭐ Chuva de Estrelas',
        descricao: 'Itens raros caem do céu do templo!',
        efeito: (eco) => {
          const raros = Object.entries(eco.catalogo).filter(([_, i]) => i.tier >= 3);
          if (raros.length === 0) return;
          const [tipoId] = raros[Math.floor(Math.random() * raros.length)];
          for (let i = 0; i < 3; i++) {
            const item = eco.criarInstancia(tipoId);
            if (item) {
              item.x = Math.floor(Math.random() * 20) + 5;
              item.y = Math.floor(Math.random() * 20) + 5;
              item.zona = 'Evento';
              eco.itensNoChao.push(item);
            }
          }
        }
      },
      {
        nome: '🔥 Forno Aceso',
        descricao: 'Transmutações dão o dobro de XP!',
        efeito: () => {  }
      },
      {
        nome: '🌪️ Tempestade Alquímica',
        descricao: 'Itens se movem aleatoriamente pelo mapa!',
        efeito: (eco) => {
          eco.itensNoChao.forEach(item => {
            item.x = Math.floor(Math.random() * 25) + 2;
            item.y = Math.floor(Math.random() * 25) + 2;
            item.zona = 'Tempestade';
          });
        }
      },
      {
        nome: '🤝 Feira de Trocas',
        descricao: 'Agentes trocam itens com desconto de 50%!',
        efeito: (eco) => {
          const agentes = Agents.roster.filter(a => Agents.active.includes(a));
          for (let i = 0; i < 5; i++) {
            if (agentes.length < 2) break;
            const a1 = agentes[Math.floor(Math.random() * agentes.length)];
            let a2 = agentes[Math.floor(Math.random() * agentes.length)];
            while (a2.id === a1.id) a2 = agentes[Math.floor(Math.random() * agentes.length)];
            const inv1 = eco.inventarios[a1.id] || [];
            if (inv1.length > 0) {
              const item = inv1[Math.floor(Math.random() * inv1.length)];
              eco.darItem(a1.id, a2.id, item.id);
            }
          }
        }
      },
      {
        nome: '💎 Veio de Ouro',
        descricao: 'Ouro Potável aparece no subsolo!',
        efeito: (eco) => {
          for (let i = 0; i < 2; i++) {
            const item = eco.criarInstancia('ouro_potavel');
            if (item) {
              item.x = Math.floor(Math.random() * 20) + 5;
              item.y = Math.floor(Math.random() * 20) + 5;
              item.zona = 'Subsolo';
              eco.itensNoChao.push(item);
            }
          }
        }
      },
      {
        nome: '🧪 Laboratório Secreto',
        descricao: 'Receita secreta revelada por tempo limitado!',
        efeito: () => {  }
      }
    ],
    disparar() {
      const evento = this.tipos[Math.floor(Math.random() * this.tipos.length)];
      this.ativo = {
        ...evento,
        inicio: Date.now(),
        duracao: 60000
      };
      evento.efeito(AlchemyEconomy);
      this.historico.push({
        nome: evento.nome,
        timestamp: Date.now()
      });
      PriorityChat.addMessage('🎭 EVENTO', `${evento.nome}\n${evento.descricao}`, 5);
      setTimeout(() => {
        this.ativo = null;
      }, this.ativo.duracao);
      return evento;
    },
    status() {
      if (!this.ativo) return '🎭 Nenhum evento ativo.';
      const restante = Math.max(0, Math.floor((this.ativo.duracao - (Date.now() - this.ativo.inicio)) / 1000));
      return `🎭 ${this.ativo.nome}\n${this.ativo.descricao}\n⏱️ Restam ${restante}s`;
    }
  },
  desenharItensNoMapa(ctx, tileSize, offsetX, offsetY, viewportX, viewportY, viewportW, viewportH) {
    if (!ctx) return;
    for (const item of this.itensNoChao) {
      const screenX = (item.x - viewportX) * tileSize + offsetX;
      const screenY = (item.y - viewportY) * tileSize + offsetY;
      if (screenX < -tileSize || screenX > viewportW + tileSize) continue;
      if (screenY < -tileSize || screenY > viewportH + tileSize) continue;
      const pulse = 0.5 + Math.sin(Date.now() / 500 + item.x * 0.3) * 0.3;
      const size = tileSize * 0.6;
      ctx.globalAlpha = pulse * 0.4;
      ctx.fillStyle = item.tier >= 3 ? '#ffd700' : item.tier >= 2 ? '#4a8aff' : '#888888';
      ctx.beginPath();
      ctx.arc(screenX + tileSize / 2, screenY + tileSize / 2, size * 0.7, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.font = `${size}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.icon, screenX + tileSize / 2, screenY + tileSize / 2);
    }
    ctx.globalAlpha = 1;
  },
  gerarMapaCalor() {
    const mapa = {};
    for (const item of this.itensNoChao) {
      const key = `${Math.floor(item.x / 5)},${Math.floor(item.y / 5)}`;
      if (!mapa[key]) mapa[key] = { itens: [], valor: 0 };
      mapa[key].itens.push(item);
      mapa[key].valor += item.valor;
    }
    let out = '🗺️ MAPA DE ITENS (por zona 5x5):\n\n';
    for (let y = 0; y < 6; y++) {
      let linha = '';
      for (let x = 0; x < 6; x++) {
        const key = `${x},${y}`;
        const zona = mapa[key];
        if (zona) {
          const densidade = zona.itens.length;
          linha += densidade >= 3 ? '🟠' : densidade >= 2 ? '🟡' : '🟢';
        } else {
          linha += '⚫';
        }
      }
      out += linha + '\n';
    }
    out += '\n🟠 Muitos itens | 🟡 Alguns | 🟢 Poucos | ⚫ Vazio';
    return out;
  }
};