/* ===== INITIATION.JS - Sistema de Iniciação ===== */

const Initiation = {
  // Níveis de iniciação hermética
  levels: [
    { level: 1, title: 'Profano', icon: '🚪', description: 'Aquele que busca.', xpRequired: 0, zones: ['atrio'] },
    { level: 2, title: 'Aspirante', icon: '🔍', description: 'Aquele que pergunta.', xpRequired: 100, zones: ['atrio', 'salao'] },
    { level: 3, title: 'Aprendiz', icon: '📖', description: 'Aquele que estuda.', xpRequired: 300, zones: ['atrio', 'salao', 'mesa'] },
    { level: 4, title: 'Companheiro', icon: '🔨', description: 'Aquele que trabalha.', xpRequired: 600, zones: ['atrio', 'salao', 'mesa'] },
    { level: 5, title: 'Adepto', icon: '⚗️', description: 'Aquele que transforma.', xpRequired: 1000, zones: ['atrio', 'salao', 'mesa', 'sagrado'] },
    { level: 6, title: 'Mago', icon: '🌟', description: 'Aquele que conhece.', xpRequired: 1500, zones: ['atrio', 'salao', 'mesa', 'sagrado'] },
    { level: 7, title: 'Mestre', icon: '👑', description: 'Aquele que ensina.', xpRequired: 2500, zones: ['atrio', 'salao', 'mesa', 'sagrado'] },
    { level: 8, title: 'Adeptus Major', icon: '☤', description: 'A Grande Obra se inicia.', xpRequired: 4000, zones: ['atrio', 'salao', 'mesa', 'sagrado', 'santissimo'] },
    { level: 9, title: 'Adeptus Exemptus', icon: '✨', description: 'Aquele que transcende.', xpRequired: 6000, zones: ['atrio', 'salao', 'mesa', 'sagrado', 'santissimo'] },
    { level: 10, title: 'Ipsissimus', icon: '☿', description: 'O Um. O Todo.', xpRequired: 10000, zones: ['atrio', 'salao', 'mesa', 'sagrado', 'santissimo'] }
  ],
  
  // XP do jogador
  playerXP: 0,
  
  // Obter nível atual
  getLevel() {
    let current = this.levels[0];
    for (const lvl of this.levels) {
      if (this.playerXP >= lvl.xpRequired) {
        current = lvl;
      }
    }
    return current;
  },
  
  // Obter próximo nível
  getNextLevel() {
    const current = this.getLevel();
    const idx = this.levels.findIndex(l => l.level === current.level);
    return idx < this.levels.length - 1 ? this.levels[idx + 1] : null;
  },
  
  // Adicionar XP
  addXP(amount) {
    const before = this.getLevel();
    this.playerXP += amount;
    const after = this.getLevel();
    
    if (after.level > before.level) {
      this.onLevelUp(after);
    }
    
    this.updateBadge();
  },
  
  // Callback de level up
  onLevelUp(newLevel) {
    Interactions.notify(`🎉 Iniciação alcançada: ${newLevel.icon} ${newLevel.title}!`);
    Interactions.addChatMessage('Sistema', `Zói alcançou o nível ${newLevel.level}: ${newLevel.title}`, 5);
    
    // Runa especial de iniciação
    const rune = Runes.generate({ id: 'system', name: 'Iniciação' });
    rune.meaning = `Marcado como ${newLevel.title}`;
    rune.power = newLevel.level * 2;
  },
  
  // Atualizar badge
  updateBadge() {
    const level = this.getLevel();
    const badge = document.getElementById('initiation-badge');
    if (badge) {
      badge.querySelector('.badge-icon').textContent = level.icon;
      badge.querySelector('.badge-text').textContent = level.title;
      badge.querySelector('.badge-level').textContent = `Nível ${level.level}`;
    }
  },
  
  // Verificar se pode acessar zona
  canAccessZone(zoneId) {
    const level = this.getLevel();
    return level.zones.includes(zoneId);
  },
  
  // Progresso para próximo nível
  getProgress() {
    const current = this.getLevel();
    const next = this.getNextLevel();
    if (!next) return 1;
    
    const currentXP = this.playerXP - current.xpRequired;
    const needed = next.xpRequired - current.xpRequired;
    return currentXP / needed;
  },
  
  // Ações que concedem XP
  rewards: {
    interact: 5,
    inscribe_rune: 15,
    read_book: 10,
    write_book: 20,
    exchange: 25,
    visit_sacred: 30,
    visit_santissimo: 50,
    complete_task: 40,
    summon_agent: 20,
    delegate_task: 35
  },
  
  // Dar recompensa por ação
  reward(action) {
    const xp = this.rewards[action] || 0;
    if (xp > 0) {
      this.addXP(xp);
    }
  }
};
