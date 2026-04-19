/* ===== RUNES.JS - Sistema de Runas Sagradas ===== */

const Runes = {
  // Símbolos rúnicos
  symbols: [
    'ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ',
    'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛊ',
    'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ', 'ᛚ', 'ᛜ', 'ᛞ', 'ᛟ',
    '☿', '☉', '☽', '♄', '♃', '♂', '♀',
    '△', '▽', '◇', '○', '⊕', '☍', '☊', '☋'
  ],
  
  // Significados
  meanings: {
    'ᚠ': 'Riqueza e abundância',
    'ᚢ': 'Força e energia vital',
    'ᚦ': 'Gigante e proteção',
    'ᚨ': 'Comunicação e mensagem',
    'ᚱ': 'Viagem e movimento',
    'ᚲ': 'Chamado e iluminação',
    'ᚷ': 'Dádiva e generosidade',
    'ᚹ': 'Alegria e prazer',
    'ᚺ': 'Harmonia e cura',
    'ᚾ': 'Necessidade e constrangimento',
    'ᛁ': 'Gelo e preservação',
    'ᛃ': 'Ano e colheita',
    'ᛇ': 'Teixo e transcendência',
    'ᛈ': 'Potência e destino',
    'ᛉ': 'Elmo e proteção',
    'ᛊ': 'Sol e sucesso',
    'ᛏ': 'Tribunal e justiça',
    'ᛒ': 'Bétula e renascimento',
    'ᛖ': 'Cavalo e progresso',
    'ᛗ': 'Homem e humanidade',
    'ᛚ': 'Água e fluxo',
    'ᛜ': 'Herança e legado',
    'ᛞ': 'Dia e luz',
    'ᛟ': 'Herança e riqueza',
    '☿': 'Mercúrio - Comunicação',
    '☉': 'Sol - Consciência',
    '☽': 'Lua - Intuição',
    '♄': 'Saturno - Estrutura',
    '♃': 'Júpiter - Expansão',
    '♂': 'Marte - Ação',
    '♀': 'Vênus - Amor',
    '△': 'Fogo - Aspiração',
    '▽': 'Água - Receptividade',
    '◇': 'Ar - Intelecto',
    '○': 'Espírito - Totalidade',
    '⊕': 'Terra - Manifestação',
    '☍': 'Oposição - Equilíbrio',
    '☊': 'Nodo Norte - Destino',
    '☋': 'Nodo Sul - Karma'
  },
  
  // Gerar runa aleatória
  generate(agent) {
    const symbol = this.symbols[Math.floor(Math.random() * this.symbols.length)];
    const meaning = this.meanings[symbol] || 'Significado desconhecido';
    
    return {
      id: `rune_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      symbol: symbol,
      meaning: meaning,
      agentId: agent ? agent.id : 'system',
      agentName: agent ? agent.name : 'Sistema',
      timestamp: Date.now(),
      location: agent ? World.getZoneAt(Math.floor(agent.x), Math.floor(agent.y))?.name : 'Desconhecido',
      power: Math.floor(Math.random() * 10) + 1
    };
  },
  
  // Gerar sequência de runas (mensagem)
  encode(message) {
    const runes = [];
    for (let i = 0; i < Math.min(message.length, 20); i++) {
      const charCode = message.charCodeAt(i);
      const index = charCode % this.symbols.length;
      runes.push({
        symbol: this.symbols[index],
        original: message[i],
        meaning: this.meanings[this.symbols[index]] || ''
      });
    }
    return runes;
  },
  
  // Formatar runa para exibição
  format(rune) {
    return `${rune.symbol} — ${rune.meaning} [${rune.agentName}, ${rune.location}]`;
  }
};
