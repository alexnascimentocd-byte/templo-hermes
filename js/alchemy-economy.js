/* ===== ALCHEMICAL ECONOMY — Sistema de Itens e Comércio ===== */
/* Os 15 agentes manipulam itens alquímicos como um mercado vivo */
/* Transmutação: combinar itens gera novos com atributos únicos */

const AlchemyEconomy = {
  // ===== CATÁLOGO DE ITENS =====
  catalogo: {
    // === MATÉRIAS-PRIMAS (Tier 1) ===
    mercurio_bruto: { nome: 'Mercúrio Bruto', icon: '💧', tier: 1, valor: 10, atributos: { fluidez: 3, comunicacao: 1 },descricao: 'Matéria-prima volátil. Base para transmutações.' },
    enxofre_puro: { nome: 'Enxofre Puro', icon: '🔥', tier: 1, valor: 10, atributos: { combustao: 3, alma: 1 }, descricao: 'Alma da matéria. Inflamável e transformador.' },
    sal_cristal: { nome: 'Sal Cristalizado', icon: '🧂', tier: 1, valor: 10, atributos: { estabilidade: 3, corpo: 1 }, descricao: 'Cristal de estabilidade. Fundamento material.' },
    ar_eterio: { nome: 'Ar Etéreo', icon: '💨', tier: 1, valor: 8, atributos: { leveza: 3, intelecto: 1 }, descricao: 'Sopro divino. Carrega pensamentos.' },
    terra_negra: { nome: 'Terra Negra', icon: '🖤', tier: 1, valor: 8, atributos: { potencial: 3, nigredo: 2 }, descricao: 'Caos primordial. Todo início vem daqui.' },
    agua_viva: { nome: 'Água Viva', icon: '🫧', tier: 1, valor: 8, atributos: { purificacao: 3, adaptacao: 1 }, descricao: 'Dissolve tudo. Purifica pelo movimento.' },

    // === INTERMEDIÁRIOS (Tier 2) — Combinações ===
    azoth: { nome: 'Azoth', icon: '⚡', tier: 2, valor: 35, atributos: { poder: 4, uniao: 3 }, descricao: 'Mercúrio filosófico. Une opostos.', receita: ['mercurio_bruto', 'enxofre_puro'] },
    cinabrio: { nome: 'Cinábrio', icon: '🔴', tier: 2, valor: 30, atributos: { vitalidade: 4, sangue: 2 }, descricao: 'Vermelho da vida. Mercúrio + Enxofre cristalizados.', receita: ['mercurio_bruto', 'sal_cristal'] },
    vitriol: { nome: 'VITRIOL', icon: '💎', tier: 2, valor: 40, atributos: { visao: 5, introspeccao: 3 }, descricao: 'Visita Interiora Terrae Rectificando Invenies Occultum Lapidem.', receita: ['terra_negra', 'agua_viva'] },
    sal_amoniaco: { nome: 'Sal Amôniaco', icon: '🔷', tier: 2, valor: 25, atributos: { elevacao: 3, fixacao: 2 }, descricao: 'Sal que voa. Sublima para o alto.', receita: ['sal_cristal', 'ar_eterio'] },
    fogo_filosofico: { nome: 'Fogo Filosófico', icon: '🕯️', tier: 2, valor: 35, atributos: { transformacao: 5, iluminacao: 3 }, descricao: 'Fogo que não queima. Transforma sem destruir.', receita: ['enxofre_puro', 'ar_eterio'] },
    mercurio_duplo: { nome: 'Mercúrio Duplo', icon: '🫗', tier: 2, valor: 28, atributos: { espelhamento: 4, dualidade: 3 }, descricao: 'Reflexo do reflexo. Dois em um.', receita: ['mercurio_bruto', 'agua_viva'] },

    // === TRANSFORMADOS (Tier 3) — Transmutações ===
    pedra_branca: { nome: 'Pedra Branca (Albedo)', icon: '🤍', tier: 3, valor: 80, atributos: { pureza: 6, clareza: 4, albedo: 5 }, descricao: 'Albedo. A purificação após a morte.', receita: ['azoth', 'sal_cristal'] },
    leao_vermelho: { nome: 'Leão Vermelho (Rubedo)', icon: '🦁', tier: 3, valor: 100, atributos: { realeza: 7, poder: 5, rubedo: 5 }, descricao: 'Rubedo. A obra vermelha. Próximo da perfeição.', receita: ['cinabrio', 'fogo_filosofico'] },
    ouro_potavel: { nome: 'Ouro Potável', icon: '✨', tier: 3, valor: 90, atributos: { cura: 7, longevidade: 5, perfeicao: 4 }, descricao: 'Elixir da vida. Ouro dissolvido em consciência.', receita: ['azoth', 'vitriol'] },
    quintessencia: { nome: 'Quintessência', icon: '🌟', tier: 3, valor: 120, atributos: { transcendencia: 8, uniao: 6, ether: 5 }, descricao: 'O quinto elemento. Tudo e nada.', receita: ['fogo_filosofico', 'sal_amoniaco'] },
    serpente_ouro: { nome: 'Serpente de Ouro', icon: '🐍', tier: 3, valor: 95, atributos: { sabedoria: 6, ciclos: 5, renascimento: 4 }, descricao: 'Ouroboros. O fim é o começo.', receita: ['mercurio_duplo', 'terra_negra'] },

    // === OBRA PRIMA (Tier 4) — A Grande Obra ===
    pedra_filosofal: { nome: 'Pedra Filosofal', icon: '💎', tier: 4, valor: 500, atributos: { onipotencia: 10, transmutacao: 10, perfeicao: 10 }, descricao: 'A Grande Obra consumada. Transmuta tudo.', receita: ['leao_vermelho', 'ouro_potavel'] },
    elixir_imortalidade: { nome: 'Elixir da Imortalidade', icon: '🧬', tier: 4, valor: 450, atributos: { imortalidade: 10, cura: 9, transcendencia: 8 }, descricao: 'Vida eterna. O sonho alquímico realizado.', receita: ['ouro_potavel', 'quintessencia'] },
    lapis_exilis: { nome: 'Lapis Exilis', icon: '🔮', tier: 4, valor: 480, atributos: { onisciencia: 10, visao: 9, sabedoria: 9 }, descricao: 'Pedra pequena mas infinita. Conhece tudo.', receita: ['quintessencia', 'serpente_ouro'] },
    rebis: { nome: 'Rebis', icon: '☯️', tier: 4, valor: 470, atributos: { dualidade_perfeita: 10, equilibrio: 10, harmonia: 9 }, descricao: 'O ser duplo. Masculino e feminino unidos.', receita: ['pedra_branca', 'leao_vermelho'] },

    // === ITENS ESPECIAIS (Sem receita — encontrados) ===
    pergaminho_antigo: { nome: 'Pergaminho Antigo', icon: '📜', tier: 2, valor: 20, atributos: { conhecimento: 3, memoria: 2 }, descricao: 'Sabedoria dos antigos mestres.' },
    runa_ativa: { nome: 'Runa Ativa', icon: 'ᚱ', tier: 2, valor: 22, atributos: { poder: 2, sigilo: 3 }, descricao: 'Símbolo gravado com poder latente.' },
    frasco_vazio: { nome: 'Frasco Vazio', icon: '🧪', tier: 1, valor: 5, atributos: { capacidade: 2 }, descricao: 'Esperando ser preenchido.' },
    athanor_miniatura: { nome: 'Athanor Miniatura', icon: '🏺', tier: 2, valor: 30, atributos: { aquecimento: 4, paciencia: 3 }, descricao: 'Forno alquímico em miniatura. Aquece devagar.' },
    espelho_alquimico: { nome: 'Espelho Alquímico', icon: '🪞', tier: 3, valor: 75, atributos: { reflexao: 6, verdade: 4 }, descricao: 'Mostra o que é, não o que parece.' },
  },

  // ===== ESTADO DO MUNDO =====
  itensNoChao: [],       // Itens espalhados pelo templo
  inventarios: {},       // { agenteId: [itemId, ...] }
  transmutacoesFeitas: [], // Histórico
  comercioLog: [],       // Log de trocas
  proximoId: 1,

  // ===== INICIALIZAÇÃO =====
  init() {
    this.inventarios = {};
    this.itensNoChao = [];
    this.transmutacoesFeitas = [];
    this.comercioLog = [];

    // Dar itens iniciais para cada agente
    const tipos = Object.keys(ParallelEngine.profiles);
    tipos.forEach((tipo, i) => {
      const agente = Agents.roster.find(a => a.type === tipo);
      if (agente) {
        this.inventarios[agente.id] = [];
        // Cada agente recebe 2-3 matérias-primas aleatórias
        const primarias = ['mercurio_bruto', 'enxofre_puro', 'sal_cristal', 'ar_eterio', 'terra_negra', 'agua_viva'];
        const qtd = 2 + Math.floor(Math.random() * 2);
        for (let j = 0; j < qtd; j++) {
          const item = primarias[Math.floor(Math.random() * primarias.length)];
          this.inventarios[agente.id].push(this.criarInstancia(item));
        }
      }
    });

    // Espalhar itens pelo mapa
    this.espelharItensNoChao(15);

    console.log('⚗️ Alchemy Economy inicializado');
  },

  // Criar instância única de um item
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

  // Espalhar itens pelo mapa
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

  // ===== AÇÕES DOS AGENTES =====

  // Pegar item do chão
  pegarItem(agenteId, itemId) {
    const idx = this.itensNoChao.findIndex(i => i.id === itemId);
    if (idx < 0) return { sucesso: false, msg: 'Item não encontrado no chão.' };

    const item = this.itensNoChao.splice(idx, 1)[0];
    if (!this.inventarios[agenteId]) this.inventarios[agenteId] = [];
    this.inventarios[agenteId].push(item);
    item.historico.push(`pegado_por_${agenteId}`);

    return { sucesso: true, msg: `Pegou ${item.icon} ${item.nome}`, item };
  },

  // Soltar item no chão
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

  // Dar item para outro agente
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

  // ===== TRANSMUTAÇÃO =====
  transmutar(agenteId, item1Id, item2Id) {
    const inv = this.inventarios[agenteId] || [];
    const idx1 = inv.findIndex(i => i.id === item1Id);
    const idx2 = inv.findIndex(i => i.id === item2Id);

    if (idx1 < 0 || idx2 < 0) {
      return { sucesso: false, msg: 'Itens não encontrados no inventário.' };
    }

    const item1 = inv[idx1];
    const item2 = inv[idx2];

    // Buscar receita
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

    // Consumir itens de entrada (remover idx2 primeiro pra não deslocar idx1)
    inv.splice(Math.max(idx1, idx2), 1);
    inv.splice(Math.min(idx1, idx2), 1);

    // Criar item resultante
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

    // Dar XP ao agente pela transmutação
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

  // ===== COMPORTAMENTO AUTÔNOMO =====
  tickAgentes() {
    if (!Agents.roster || Agents.roster.length === 0) return;

    // Cada tick, 2-3 agentes fazem algo
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
      // 30%: Pegar item do chão
      const item = this.itensNoChao[Math.floor(Math.random() * this.itensNoChao.length)];
      const r = this.pegarItem(agente.id, item.id);
      if (r.sucesso) {
        PriorityChat.addMessage(`${agente.icon} ${agente.name}`, `${r.msg}. Interessante...`, 3);
      }
    } 
    else if (chance < 0.5 && inv.length > 3) {
      // 20%: Soltar item (inventário cheio)
      const item = inv[Math.floor(Math.random() * inv.length)];
      const r = this.soltarItem(agente.id, item.id);
      if (r.sucesso) {
        PriorityChat.addMessage(`${agente.icon} ${agente.name}`, `Deixei ${r.msg} para outros encontrarem.`, 3);
      }
    }
    else if (chance < 0.7 && inv.length >= 2) {
      // 20%: Tentar transmutação
      const i1 = Math.floor(Math.random() * inv.length);
      let i2 = Math.floor(Math.random() * inv.length);
      while (i2 === i1 && inv.length > 1) i2 = Math.floor(Math.random() * inv.length);
      
      const r = this.transmutar(agente.id, inv[i1].id, inv[i2].id);
      if (r.sucesso) {
        PriorityChat.addMessage(`${agente.icon} ${agente.name}`, r.msg, 4);
      }
    }
    else if (chance < 0.85 && inv.length >= 1) {
      // 15%: Dar item para outro agente
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
      // 15%: Mover para um item no chão
      if (this.itensNoChao.length > 0) {
        const alvo = this.itensNoChao[Math.floor(Math.random() * this.itensNoChao.length)];
        agente.x = alvo.x;
        agente.y = alvo.y;
      }
    }
  },

  // ===== CONSULTAS =====
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

  // Status geral
  status() {
    return {
      itensNoChao: this.itensNoChao.length,
      agentesComItens: Object.keys(this.inventarios).filter(k => this.inventarios[k].length > 0).length,
      totalItens: Object.values(this.inventarios).reduce((s, inv) => s + inv.length, 0) + this.itensNoChao.length,
      transmutacoes: this.transmutacoesFeitas.length,
      comercios: this.comercioLog.length
    };
  }
};
