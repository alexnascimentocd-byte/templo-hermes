/* ===== WORLD.JS - Mundo do Templo de Hermes ===== */
/* Layout com 3 Octagramas + 2 Sistemas Numerais + Mapa Deserto */

const World = {
  // Configurações do mundo expandido
  TILE_SIZE: 32,
  WORLD_WIDTH: 60,   // blocos (era 40)
  WORLD_HEIGHT: 45,  // blocos (era 30)
  
  // Centro do octagrama principal
  CENTER_X: 30,
  CENTER_Y: 22,
  
  // Formatos de octagrama ativos
  octagramFormats: ['padrao', 'duplo', 'ninhado'],
  activeFormat: 0, // índice em octagramFormats
  
  // Sistemas numerais
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

  // Zonas do Templo (3 octagramas)
  zones: {
    // === NÚCLEO CENTRAL ===
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

    // === OCTAGRAMA 1: PADRÃO (interno, 6 blocos) ===
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

    // === OCTAGRAMA 2: DUPLO (médio, 12 blocos, estrela de 6 pontas invertida) ===
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

    // === OCTAGRAMA 3: NINHADO (externo, 18 blocos, formato concêntrico) ===
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
    CHEST: 17,
    DESERT: 18,      // Areia do deserto
    SAND: 19,        // Areia clara
    DUNE: 20,        // Dunas
    CACTUS: 21,      // Cacto desértico
    BONE: 22,        // Ossos (deco desértico)
    RUINS: 23,       // Ruínas antigas
    AMETHYST: 24,    // Ametista (cristal roxo claro)
    BLUE_CRYSTAL: 25 // Cristal azul
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
    17: '#5a4a0a',
    18: '#c2a05a',  // DESERT - areia dourada
    19: '#d4b87a',  // SAND - areia clara
    20: '#b8943a',  // DUNE - areia escura (sombra)
    21: '#2a5a2a',  // CACTUS - verde seco
    22: '#e8dcc8',  // BONE - osso
    23: '#6a5a4a',  // RUINS - pedra antiga
    24: '#9b59b6',  // AMETHYST
    25: '#3498db'   // BLUE_CRYSTAL
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
  
  // Construir o templo com 3 octagramas
  buildTemple() {
    const B = this.blocks;
    
    // 1. Chão base - DESERTO em tudo
    for (let y = 0; y < this.WORLD_HEIGHT; y++) {
      for (let x = 0; x < this.WORLD_WIDTH; x++) {
        // Variação de deserto
        const r = Math.random();
        if (r < 0.5) this.grid[y][x] = B.DESERT;
        else if (r < 0.75) this.grid[y][x] = B.SAND;
        else this.grid[y][x] = B.DUNE;
      }
    }
    
    // 2. Bordas externas - obsidiana
    for (let x = 0; x < this.WORLD_WIDTH; x++) {
      this.grid[0][x] = B.OBSIDIAN;
      this.grid[this.WORLD_HEIGHT - 1][x] = B.OBSIDIAN;
    }
    for (let y = 0; y < this.WORLD_HEIGHT; y++) {
      this.grid[y][0] = B.OBSIDIAN;
      this.grid[y][this.WORLD_WIDTH - 1] = B.OBSIDIAN;
    }
    
    // 3. Desenhar os 3 octagramas
    this.drawOctagramPadrao();   // Interno
    this.drawOctagramDuplo();    // Médio
    this.drawOctagramNinhado();  // Externo
    
    // 4. Conectar octagramas com caminhos
    this.drawConnectingPaths();
    
    // 5. Numerais nos pilares
    this.placeNumerals();
    
    // 6. Pilares
    this.placePillars();
    
    // 7. Itens
    this.placeItems();
    
    // 8. Decoração desértica
    this.addDesertDecoration();
    
    // 9. Decoração do templo
    this.addDecoration();
  },
  
  // ====== OCTAGRAMA 1: PADRÃO (interno) ======
  drawOctagramPadrao() {
    const B = this.blocks;
    const cx = this.CENTER_X;
    const cy = this.CENTER_Y;
    
    // Núcleo central (3x3) - mármore dourado
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        this.grid[cy + dy][cx + dx] = B.GOLD;
      }
    }
    
    // 8 direções
    const directions = [
      [0, -1], [1, -1], [1, 0], [1, 1],
      [0, 1], [-1, 1], [-1, 0], [-1, -1]
    ];
    
    // Linhas do centro às pontas (6 blocos)
    directions.forEach(([dx, dy]) => {
      for (let i = 1; i <= 6; i++) {
        const x = cx + dx * i;
        const y = cy + dy * i;
        if (x >= 0 && x < this.WORLD_WIDTH && y >= 0 && y < this.WORLD_HEIGHT) {
          this.grid[y][x] = (i % 2 === 0) ? B.PURPLE_CRYSTAL : B.RUNE_STONE;
        }
      }
    });
    
    // Conectar pontas adjacentes (estrela)
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
  
  // ====== OCTAGRAMA 2: DUPLO (médio, estrela de David invertida) ======
  drawOctagramDuplo() {
    const B = this.blocks;
    const cx = this.CENTER_X;
    const cy = this.CENTER_Y;
    
    // Triângulo apontando para CIMA (conecta N, SE, SW)
    const upTriangle = [
      [0, -12],   // Norte
      [10, 6],    // Sudeste
      [-10, 6]    // Sudoeste
    ];
    
    // Triângulo apontando para BAIXO (conecta S, NE, NW)
    const downTriangle = [
      [0, 12],    // Sul
      [10, -6],   // Nordeste
      [-10, -6]   // Noroeste
    ];
    
    // Desenhar triângulo de cima
    this.drawTriangle(cx, cy, upTriangle, B.AMETHYST, B.BLUE_CRYSTAL);
    // Desenhar triângulo de baixo
    this.drawTriangle(cx, cy, downTriangle, B.BLUE_CRYSTAL, B.AMETHYST);
    
    // 8 pontas do octagrama duplo
    const duploDirs = [
      [0, -12], [7, -7], [12, 0], [7, 7],
      [0, 12], [-7, 7], [-12, 0], [-7, -7]
    ];
    
    // Marcar pontas
    duploDirs.forEach(([dx, dy]) => {
      const x = cx + dx;
      const y = cy + dy;
      if (x >= 0 && x < this.WORLD_WIDTH && y >= 0 && y < this.WORLD_HEIGHT) {
        this.grid[y][x] = B.GOLD;
        // Halo ao redor
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
  
  // Desenhar triângulo conectando 3 pontos
  drawTriangle(cx, cy, vertices, lineBlock, fillBlock) {
    const B = this.blocks;
    const [v1, v2, v3] = vertices;
    
    // Linha v1 → v2
    this.drawLine(cx + v1[0], cy + v1[1], cx + v2[0], cy + v2[1], lineBlock);
    // Linha v2 → v3
    this.drawLine(cx + v2[0], cy + v2[1], cx + v3[0], cy + v3[1], lineBlock);
    // Linha v3 → v1
    this.drawLine(cx + v3[0], cy + v3[1], cx + v1[0], cy + v1[1], lineBlock);
  },
  
  // Bresenham line
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
  
  // ====== OCTAGRAMA 3: NINHADO (externo, concêntrico) ======
  drawOctagramNinhado() {
    const B = this.blocks;
    const cx = this.CENTER_X;
    const cy = this.CENTER_Y;
    
    // Anéis concêntricos octagonais
    const rings = [
      { radius: 15, block: B.STONE, width: 1 },
      { radius: 17, block: B.OBSIDIAN, width: 1 },
      { radius: 19, block: B.RUINS, width: 2 }
    ];
    
    rings.forEach(ring => {
      this.drawOctagonalRing(cx, cy, ring.radius, ring.block, ring.width);
    });
    
    // 8 pilares externos nos vértices do octágono externo
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
  
  // Desenhar anel octagonal
  drawOctagonalRing(cx, cy, radius, block, width) {
    // 8 vértices do octágono
    const vertices = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i * 45 - 22.5) * Math.PI / 180;
      vertices.push([
        Math.round(cx + radius * Math.cos(angle)),
        Math.round(cy + radius * Math.sin(angle))
      ]);
    }
    
    // Conectar vértices adjacentes
    for (let i = 0; i < 8; i++) {
      const [x0, y0] = vertices[i];
      const [x1, y1] = vertices[(i + 1) % 8];
      this.drawLine(x0, y0, x1, y1, block);
      
      // Largura extra
      if (width > 1) {
        this.drawLine(x0+1, y0, x1+1, y1, block);
      }
    }
  },
  
  // Conectar os 3 octagramas com caminhos
  drawConnectingPaths() {
    const B = this.blocks;
    const cx = this.CENTER_X;
    const cy = this.CENTER_Y;
    
    // Caminhos do octa1 (6 blocos) ao octa2 (12 blocos)
    const dirs = [
      [0, -1], [1, -1], [1, 0], [1, 1],
      [0, 1], [-1, 1], [-1, 0], [-1, -1]
    ];
    
    dirs.forEach(([dx, dy]) => {
      // Conectar ponta do octa1 à ponta do octa2
      const innerX = cx + dx * 6;
      const innerY = cy + dy * 6;
      const outerX = cx + dx * 12;
      const outerY = cy + dy * 12;
      
      this.drawLine(innerX, innerY, outerX, outerY, B.CARPET);
    });
    
    // Caminhos do octa2 ao octa3
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
  
  // Colocar numerais nos pilares
  placeNumerals() {
    // Os numerais são renderizados pelo renderer.js
    // Aqui preparamos os dados para exibição
    // As zonas já têm numeral.caldeu e numeral.alquimico definidos
  },
  
  placePillars() {
    const B = this.blocks;
    const cx = this.CENTER_X;
    const cy = this.CENTER_Y;
    
    // Pilares ao redor do núcleo
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
    
    // Fonte de água no centro
    this.grid[cy][cx] = B.WATER;
    
    // Mesa ao redor do centro
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx !== 0 || dy !== 0) {
          this.grid[cy + dy][cx + dx] = B.TABLE;
        }
      }
    }
    
    // Altar no centro exato (por cima da água)
    this.grid[cy][cx] = B.ALTAR;
    
    // Cristais nos caminhos internos
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
    
    // Baús espalhados no deserto
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
  
  // Decoração desértica
  addDesertDecoration() {
    const B = this.blocks;
    
    // Cactos aleatórios no deserto
    for (let i = 0; i < 25; i++) {
      const x = 2 + Math.floor(Math.random() * (this.WORLD_WIDTH - 4));
      const y = 2 + Math.floor(Math.random() * (this.WORLD_HEIGHT - 4));
      if (this.grid[y][x] === B.DESERT || this.grid[y][x] === B.SAND || this.grid[y][x] === B.DUNE) {
        this.grid[y][x] = B.CACTUS;
      }
    }
    
    // Ossos espalhados
    for (let i = 0; i < 15; i++) {
      const x = 2 + Math.floor(Math.random() * (this.WORLD_WIDTH - 4));
      const y = 2 + Math.floor(Math.random() * (this.WORLD_HEIGHT - 4));
      if (this.grid[y][x] === B.DESERT || this.grid[y][x] === B.SAND) {
        this.grid[y][x] = B.BONE;
      }
    }
    
    // Ruínas em pontos específicos
    const ruinSpots = [
      [8, 8], [52, 8], [8, 38], [52, 38],
      [25, 5], [35, 5], [25, 40], [35, 40]
    ];
    
    ruinSpots.forEach(([x, y]) => {
      if (x >= 1 && x < this.WORLD_WIDTH-1 && y >= 1 && y < this.WORLD_HEIGHT-1) {
        this.grid[y][x] = B.RUINS;
        // Ruínas 2x2
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
    
    // Tochas nas 8 direções internas
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
    
    // Estantes de livros
    for (let y = 10; y < this.WORLD_HEIGHT - 10; y += 6) {
      if (y > 0 && y < this.WORLD_HEIGHT) {
        this.grid[y][14] = B.BOOKSHELF;
        this.grid[y][this.WORLD_WIDTH - 15] = B.BOOKSHELF;
      }
    }
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
      this.blocks.WATER,
      this.blocks.CACTUS,
      this.blocks.RUINS
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
    // Verificar se está no deserto
    const block = this.getBlock(x, y);
    if ([this.blocks.DESERT, this.blocks.SAND, this.blocks.DUNE].includes(block)) {
      return { id: 'deserto', name: 'Deserto', description: 'Terras áridas além do templo.', color: '#c2a05a', icon: '🏜️' };
    }
    return null;
  },
  
  // Obter centro de uma zona
  getZoneCenter(zoneId) {
    const zone = this.zones[zoneId];
    if (!zone) return { x: this.CENTER_X, y: this.CENTER_Y };
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
