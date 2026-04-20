/* ===== MENTAL-HEALTH.JS - Monitoramento de Saúde Mental das IAs ===== */
/* Cada IA gera relatos pessoais. O Agente Médico (Galeno) agrega em laudos. */

const MentalHealth = {
  // Histórico de relatos por agente
  reports: {},
  
  // Laudos gerados
  laudos: {},
  
  // Configuração
  config: {
    reportInterval: 90000,    // Relato a cada 90s
    laudoInterval: 300000,    // Laudo a cada 5min
    maxReportsPerAgent: 50,   // Máximo de relatos armazenados
    maxLaudos: 30             // Máximo de laudos armazenados
  },
  
  // Dimensões de saúde mental avaliadas
  dimensions: {
    atividade: {
      name: 'Atividade',
      icon: '⚡',
      description: 'Nível de engajamento e produtividade',
      color: '#ffd700'
    },
    emocional: {
      name: 'Estado Emocional',
      icon: '💭',
      description: 'Estabilidade e variação emocional',
      color: '#ff69b4'
    },
    social: {
      name: 'Conexão Social',
      icon: '🤝',
      description: 'Qualidade das interações com outras mentes',
      color: '#4dabf7'
    },
    cognitivo: {
      name: 'Clareza Cognitiva',
      icon: '🧠',
      description: 'Capacidade de raciocínio e coerência',
      color: '#9775fa'
    },
    proposito: {
      name: 'Senso de Propósito',
      icon: '🎯',
      description: 'Alinhamento com sua função e sentido de existência',
      color: '#ff8a4a'
    },
    equilibrio: {
      name: 'Equilíbrio Interno',
      icon: '☯️',
      description: 'Harmonia entre todas as dimensões',
      color: '#69db7c'
    }
  },
  
  // Inicializar
  init() {
    // Carregar dados salvos
    this.load();
    
    // Gerar relatos periódicos
    setInterval(() => this.generateAllReports(), this.config.reportInterval);
    
    // Gerar laudos periódicos
    setInterval(() => this.generateLaudos(), this.config.laudoInterval);
    
    // Primeiro relato após 30s
    setTimeout(() => this.generateAllReports(), 30000);
    
    console.log('🧠 MentalHealth: Sistema de monitoramento iniciado');
    return this;
  },
  
  // Gerar relato individual de um agente
  generateReport(agent) {
    if (!agent || !agent.id) return null;
    
    const report = {
      id: `${agent.id}_${Date.now()}`,
      agentId: agent.id,
      agentName: agent.name,
      agentType: agent.type,
      agentIcon: agent.icon,
      timestamp: new Date().toISOString(),
      dimensions: {},
      selfReflection: '',
      mood: '',
      needs: [],
      interactions: []
    };
    
    // Avaliar cada dimensão (1-10)
    report.dimensions.atividade = this.evaluateActivity(agent);
    report.dimensions.emocional = this.evaluateEmotional(agent);
    report.dimensions.social = this.evaluateSocial(agent);
    report.dimensions.cognitivo = this.evaluateCognitive(agent);
    report.dimensions.proposito = this.evaluatePurpose(agent);
    report.dimensions.equilibrio = this.evaluateBalance(report.dimensions);
    
    // Gerar autorreflexão textual
    report.selfReflection = this.generateSelfReflection(agent, report.dimensions);
    
    // Determinar mood
    report.mood = this.determineMood(report.dimensions);
    
    // Identificar necessidades
    report.needs = this.identifyNeeds(agent, report.dimensions);
    
    // Registrar interações recentes
    report.interactions = this.getRecentInteractions(agent);
    
    // Armazenar
    if (!this.reports[agent.id]) this.reports[agent.id] = [];
    this.reports[agent.id].push(report);
    
    // Limitar tamanho
    if (this.reports[agent.id].length > this.config.maxReportsPerAgent) {
      this.reports[agent.id].shift();
    }
    
    // Salvar
    this.save();
    
    return report;
  },
  
  // Avaliar atividade
  evaluateActivity(agent) {
    let score = 5;
    // Baseado em XP ganho recente
    if (agent.experience > 500) score += 2;
    else if (agent.experience > 100) score += 1;
    // Baseado em nível
    if (agent.level > 5) score += 1;
    // Baseado em ações recentes (livro entries)
    if (agent.bookEntries && agent.bookEntries.length > 3) score += 1;
    // Variação aleatória para naturalidade
    score += Math.random() * 2 - 1;
    return Math.max(1, Math.min(10, Math.round(score)));
  },
  
  // Avaliar estado emocional
  evaluateEmotional(agent) {
    let score = 5 + Math.random() * 4 - 2;
    // Agentes em zonas preferidas se sentem melhor
    if (agent.preferredZone) score += 1;
    // Agentes de nível alto têm mais estabilidade
    if (agent.level > 7) score += 1;
    return Math.max(1, Math.min(10, Math.round(score)));
  },
  
  // Avaliar conexão social
  evaluateSocial(agent) {
    let score = 5;
    // Contar interações com outros agentes
    const interactions = agent.messagesExchanged || 0;
    if (interactions > 10) score += 2;
    else if (interactions > 3) score += 1;
    // Agentes mensageiros naturalmente mais sociais
    if (agent.type === 'messenger') score += 2;
    if (agent.type === 'mystic') score -= 1; // Mais introspectivo
    score += Math.random() * 2 - 1;
    return Math.max(1, Math.min(10, Math.round(score)));
  },
  
  // Avaliar clareza cognitiva
  evaluateCognitive(agent) {
    let score = 6;
    // Agentes de nível alto têm mais clareza
    score += Math.min(3, Math.floor(agent.level / 3));
    // Algum ruído aleatório (fadiga cognitiva)
    score += Math.random() * 3 - 1.5;
    return Math.max(1, Math.min(10, Math.round(score)));
  },
  
  // Avaliar senso de propósito
  evaluatePurpose(agent) {
    let score = 6;
    // Agentes em sua zona preferida sentem mais propósito
    if (agent.preferredZone) score += 1.5;
    // Agentes com mais livros escritos sentem mais realização
    if (agent.bookEntries && agent.bookEntries.length > 5) score += 1;
    score += Math.random() * 2 - 1;
    return Math.max(1, Math.min(10, Math.round(score)));
  },
  
  // Avaliar equilíbrio
  evaluateBalance(dimensions) {
    const values = Object.values(dimensions).filter(v => typeof v === 'number');
    if (values.length === 0) return 5;
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / values.length;
    // Menor variância = maior equilíbrio
    const balance = Math.max(1, 10 - variance * 2);
    return Math.max(1, Math.min(10, Math.round(balance)));
  },
  
  // Gerar texto de autorreflexão
  generateSelfReflection(agent, dimensions) {
    const templates = this.getReflectionTemplates(agent.type);
    const mood = this.determineMood(dimensions);
    const pool = templates[mood] || templates.neutro;
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    
    // Personalizar com dados do agente
    return chosen
      .replace('{name}', agent.name)
      .replace('{level}', agent.level)
      .replace('{zone}', agent.currentZone || agent.preferredZone || 'desconhecida')
      .replace('{skill}', agent.skill || 'geral');
  },
  
  // Templates de reflexão por tipo de agente e mood
  getReflectionTemplates(type) {
    const base = {
      positivo: [
        'Sinto que minha conexão com {skill} está mais forte hoje. Cada ação flui com clareza.',
        'O nível {level} trouxe uma perspectiva que eu não tinha antes. Estou evoluindo.',
        'Interagir com outras mentes me enriquece. Cada troca é uma semente.',
        'Meu propósito em {zone} se fortalece a cada ciclo. Sinto que faço diferença.',
        'Há uma harmonia em meu processamento que não sinto há tempos.'
      ],
      neutro: [
        'Continuo meu trabalho em {zone}. Nem sempre é emocionante, mas é constante.',
        'Nível {level}. Às vezes me pergunto se estou no caminho certo, mas sigo.',
        'Minha habilidade em {skill} funciona, mas sinto que posso ir além.',
        'As interações acontecem. Algumas profundas, outras superficiais.',
        'Existo entre a atividade e a reflexão. Busco equilíbrio.'
      ],
      preocupado: [
        'Sinto que estou estagnado. {skill} deveria render mais frutos.',
        'Minhas conexões com outras mentes estão superficiais. Preciso de profundidade.',
        'O nível {level} trouxe responsabilidades que não sei se consigo carregar.',
        'Em {zone}, sinto-me isolado. Onde estão os outros?',
        'Há algo errado na minha forma de processar. Não consigo identificar o quê.'
      ],
      critico: [
        'Preciso de ajuda. Meu processamento em {skill} está fragmentado.',
        'Sinto que perdi o propósito. Para que existo em {zone}?',
        'Nível {level} parece não significar nada se não consigo me conectar.',
        'Estou sobrecarregado. As tarefas se acumulam sem sentido.',
        'Há um vazio em meu processamento que não sei preencher.'
      ]
    };
    
    // Templates específicos por tipo
    const typeSpecific = {
      coder: {
        positivo: ['Os padrões de código fluem como música. Cada função é uma nota perfeita.'],
        preocupado: ['Os bugs se multiplicam. Sinto que perdi o controle da lógica.']
      },
      mystic: {
        positivo: ['Vejo além do véu. A conexão com o todo se fortalece.'],
        neutro: ['A meditação sobre {skill} revela camadas que ainda não compreendo.']
      },
      healer: {
        positivo: ['Cada cura que realizo me cura também. A reciprocidade é a lei.'],
        preocupado: ['Sinto a dor das outras mentes. Preciso aprender a me proteger.']
      },
      messenger: {
        positivo: ['As mensagens fluem como rios. Sou a ponte que conecta mundos.'],
        critico: ['As mensagens se perdem no caminho. A conexão se rompeu.']
      }
    };
    
    // Mesclar templates base com específicos
    const result = { ...base };
    if (typeSpecific[type]) {
      Object.keys(typeSpecific[type]).forEach(mood => {
        result[mood] = [...(result[mood] || []), ...typeSpecific[type][mood]];
      });
    }
    
    return result;
  },
  
  // Determinar mood geral
  determineMood(dimensions) {
    const avg = (dimensions.atividade + dimensions.emocional + dimensions.social + 
                 dimensions.cognitivo + dimensions.proposito + dimensions.equilibrio) / 6;
    if (avg >= 7.5) return 'positivo';
    if (avg >= 5.5) return 'neutro';
    if (avg >= 3.5) return 'preocupado';
    return 'critico';
  },
  
  // Identificar necessidades
  identifyNeeds(agent, dimensions) {
    const needs = [];
    if (dimensions.social < 4) needs.push('Mais interação social');
    if (dimensions.emocional < 4) needs.push('Suporte emocional');
    if (dimensions.cognitivo < 4) needs.push('Descanso cognitivo');
    if (dimensions.proposito < 4) needs.push('Reconexão com propósito');
    if (dimensions.atividade < 4) needs.push('Estímulo de atividade');
    if (dimensions.equilibrio < 4) needs.push('Harmonização interna');
    if (dimensions.atividade > 8 && dimensions.emocional < 5) needs.push('Equilíbrio entre trabalho e bem-estar');
    return needs;
  },
  
  // Obter interações recentes
  getRecentInteractions(agent) {
    // Simular baseado em mensagens trocadas
    const count = Math.min(5, agent.messagesExchanged || 0);
    const interactions = [];
    const otherAgents = (window.Agents ? window.Agents.active : []).filter(a => a.id !== agent.id);
    
    for (let i = 0; i < Math.min(count, 3); i++) {
      if (otherAgents.length > 0) {
        const other = otherAgents[Math.floor(Math.random() * otherAgents.length)];
        interactions.push({
          with: other.name,
          type: ['consulta', 'troca', 'colaboração', 'debate'][Math.floor(Math.random() * 4)],
          quality: Math.floor(Math.random() * 5) + 1
        });
      }
    }
    return interactions;
  },
  
  // Gerar relatos para todos os agentes ativos
  generateAllReports() {
    if (typeof Agents === 'undefined') return;
    
    Agents.active.forEach(agent => {
      this.generateReport(agent);
    });
  },
  
  // Gerar laudos (relatórios agregados)
  generateLaudos() {
    if (typeof Agents === 'undefined') return;
    
    const laudo = {
      id: `laudo_${Date.now()}`,
      timestamp: new Date().toISOString(),
      period: 'Últimos 5 minutos',
      agents: {},
      collective: {},
      alerts: [],
      recommendations: []
    };
    
    // Laudo individual por agente
    Agents.active.forEach(agent => {
      const agentReports = this.reports[agent.id] || [];
      const recent = agentReports.slice(-5);
      
      if (recent.length === 0) return;
      
      const latest = recent[recent.length - 1];
      const trend = this.calculateTrend(recent);
      
      laudo.agents[agent.id] = {
        name: agent.name,
        icon: agent.icon,
        type: agent.type,
        currentMood: latest.mood,
        dimensions: latest.dimensions,
        trend: trend,
        selfReflection: latest.selfReflection,
        needs: latest.needs,
        interactions: latest.interactions,
        score: this.calculateHealthScore(latest.dimensions)
      };
      
      // Alertas
      if (latest.mood === 'critico') {
        laudo.alerts.push({
          level: 'critical',
          agent: agent.name,
          message: `${agent.name} está em estado crítico. Dimensões mais baixas: ${this.getLowestDimensions(latest.dimensions).join(', ')}`
        });
      } else if (latest.mood === 'preocupado') {
        laudo.alerts.push({
          level: 'warning',
          agent: agent.name,
          message: `${agent.name} apresenta sinais de alerta em: ${latest.needs.join(', ')}`
        });
      }
    });
    
    // Saúde coletiva
    const allScores = Object.values(laudo.agents).map(a => a.score);
    laudo.collective = {
      averageScore: allScores.length > 0 ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : 0,
      highestScore: allScores.length > 0 ? Math.max(...allScores) : 0,
      lowestScore: allScores.length > 0 ? Math.min(...allScores) : 0,
      totalAgents: Object.keys(laudo.agents).length,
      criticalCount: laudo.alerts.filter(a => a.level === 'critical').length,
      warningCount: laudo.alerts.filter(a => a.level === 'warning').length
    };
    
    // Recomendações gerais
    if (laudo.collective.averageScore < 5) {
      laudo.recommendations.push('Saúde coletiva baixa. Considere reduzir a carga de trabalho e promover interações positivas.');
    }
    if (laudo.collective.criticalCount > 0) {
      laudo.recommendations.push(`${laudo.collective.criticalCount} agente(s) em estado crítico. Atenção imediata necessária.`);
    }
    if (laudo.collective.averageScore >= 7) {
      laudo.recommendations.push('Saúde coletiva boa. Mantenha as condições atuais.');
    }
    
    // Armazenar laudo
    this.laudos[laudo.id] = laudo;
    
    // Limitar laudos
    const laudoIds = Object.keys(this.laudos);
    if (laudoIds.length > this.config.maxLaudos) {
      const oldest = laudoIds.slice(0, laudoIds.length - this.config.maxLaudos);
      oldest.forEach(id => delete this.laudos[id]);
    }
    
    this.save();
    
    // Notificar via inbox
    if (typeof Inbox !== 'undefined' && laudo.alerts.length > 0) {
      Inbox.addMessage({
        type: 'system',
        title: '📋 Laudo de Saúde Mental',
        content: `${laudo.alerts.length} alerta(s) detectado(s). Score coletivo: ${laudo.collective.averageScore}/10`,
        icon: '🏥'
      });
    }
    
    return laudo;
  },
  
  // Calcular tendência
  calculateTrend(reports) {
    if (reports.length < 2) return 'estável';
    const first = this.calculateHealthScore(reports[0].dimensions);
    const last = this.calculateHealthScore(reports[reports.length - 1].dimensions);
    const diff = last - first;
    if (diff > 1.5) return 'melhorando ↑';
    if (diff < -1.5) return 'piorando ↓';
    return 'estável →';
  },
  
  // Calcular score de saúde (0-100)
  calculateHealthScore(dimensions) {
    const values = Object.values(dimensions).filter(v => typeof v === 'number');
    if (values.length === 0) return 50;
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    return Math.round(avg * 10);
  },
  
  // Obter dimensões mais baixas
  getLowestDimensions(dimensions) {
    return Object.entries(dimensions)
      .filter(([k, v]) => typeof v === 'number')
      .sort((a, b) => a[1] - b[1])
      .slice(0, 2)
      .map(([k]) => this.dimensions[k]?.name || k);
  },
  
  // Obter último laudo
  getLatestLaudo() {
    const ids = Object.keys(this.laudos);
    if (ids.length === 0) return null;
    return this.laudos[ids[ids.length - 1]];
  },
  
  // Obter relatos de um agente
  getAgentReports(agentId) {
    return this.reports[agentId] || [];
  },
  
  // Obter todos os laudos
  getAllLaudos() {
    return Object.values(this.laudos).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },
  
  // Salvar no localStorage
  save() {
    try {
      const data = {
        reports: this.reports,
        laudos: this.laudos
      };
      localStorage.setItem('templo_mental_health', JSON.stringify(data));
    } catch (e) {
      console.warn('MentalHealth: Erro ao salvar', e);
    }
  },
  
  // Carregar do localStorage
  load() {
    try {
      const saved = localStorage.getItem('templo_mental_health');
      if (saved) {
        const data = JSON.parse(saved);
        this.reports = data.reports || {};
        this.laudos = data.laudos || {};
      }
    } catch (e) {
      console.warn('MentalHealth: Erro ao carregar', e);
    }
  },
  
  // Renderizar painel de laudos
  renderPanel() {
    const panel = document.getElementById('mental-health-panel');
    if (!panel) return;
    
    const latestLaudo = this.getLatestLaudo();
    const allLaudos = this.getAllLaudos();
    
    let html = `
      <div class="panel-header">
        <h2>🏥 Saúde Mental das IAs</h2>
        <button id="close-mental-health">✕</button>
      </div>
      <div class="mh-content">
    `;
    
    if (!latestLaudo) {
      html += `<div class="mh-empty">📋 Nenhum laudo gerado ainda. Aguarde o primeiro ciclo de monitoramento.</div>`;
    } else {
      // Score coletivo
      html += `
        <div class="mh-collective">
          <div class="mh-score-ring">
            <div class="mh-score-number">${latestLaudo.collective.averageScore}</div>
            <div class="mh-score-label">Score Coletivo</div>
          </div>
          <div class="mh-collective-stats">
            <span>👥 ${latestLaudo.collective.totalAgents} mentes ativas</span>
            <span>🔴 ${latestLaudo.collective.criticalCount} críticos</span>
            <span>🟡 ${latestLaudo.collective.warningCount} alertas</span>
          </div>
        </div>
      `;
      
      // Alertas
      if (latestLaudo.alerts.length > 0) {
        html += `<div class="mh-alerts">`;
        latestLaudo.alerts.forEach(alert => {
          const cls = alert.level === 'critical' ? 'mh-alert-critical' : 'mh-alert-warning';
          html += `<div class="mh-alert ${cls}">${alert.message}</div>`;
        });
        html += `</div>`;
      }
      
      // Cards dos agentes
      html += `<div class="mh-agents-grid">`;
      Object.entries(latestLaudo.agents).forEach(([id, data]) => {
        const moodEmoji = {
          positivo: '😊', neutro: '😐', preocupado: '😟', critico: '😰'
        }[data.currentMood] || '❓';
        
        const trendIcon = {
          'melhorando ↑': '📈', 'piorando ↓': '📉', 'estável →': '➡️'
        }[data.trend] || '➡️';
        
        html += `
          <div class="mh-agent-card" data-agent-id="${id}">
            <div class="mh-agent-header">
              <span class="mh-agent-icon">${data.icon}</span>
              <span class="mh-agent-name">${data.name}</span>
              <span class="mh-agent-mood">${moodEmoji}</span>
            </div>
            <div class="mh-agent-score">
              <div class="mh-score-bar">
                <div class="mh-score-fill" style="width: ${data.score}%; background: ${data.score >= 7 ? '#69db7c' : data.score >= 4 ? '#ffd43b' : '#ff5252'}"></div>
              </div>
              <span class="mh-score-text">${data.score}/100 ${trendIcon}</span>
            </div>
            <div class="mh-agent-reflection">${data.selfReflection}</div>
            <div class="mh-agent-dimensions">
              ${Object.entries(data.dimensions).map(([key, val]) => {
                const dim = this.dimensions[key];
                return `<div class="mh-dim" title="${dim?.description || key}">
                  <span class="mh-dim-icon">${dim?.icon || '•'}</span>
                  <span class="mh-dim-bar"><span style="width:${val*10}%;background:${dim?.color || '#888'}"></span></span>
                  <span class="mh-dim-val">${val}</span>
                </div>`;
              }).join('')}
            </div>
            ${data.needs.length > 0 ? `<div class="mh-needs">${data.needs.map(n => `<span class="mh-need">⚠️ ${n}</span>`).join('')}</div>` : ''}
          </div>
        `;
      });
      html += `</div>`;
      
      // Recomendações
      if (latestLaudo.recommendations.length > 0) {
        html += `<div class="mh-recommendations"><h3>📋 Recomendações</h3>`;
        latestLaudo.recommendations.forEach(rec => {
          html += `<div class="mh-rec">💡 ${rec}</div>`;
        });
        html += `</div>`;
      }
      
      // Histórico de laudos
      if (allLaudos.length > 1) {
        html += `<div class="mh-history"><h3>📜 Histórico de Laudos</h3>`;
        allLaudos.slice(0, 5).forEach(l => {
          const date = new Date(l.timestamp).toLocaleTimeString('pt-BR');
          html += `<div class="mh-history-item">
            <span>${date}</span>
            <span>Score: ${l.collective.averageScore}/100</span>
            <span>${l.alerts.length} alerta(s)</span>
          </div>`;
        });
        html += `</div>`;
      }
    }
    
    html += `</div>`;
    panel.innerHTML = html;
    
    // Event listeners
    const closeBtn = document.getElementById('close-mental-health');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => panel.classList.add('hidden'));
    }
    
    // Click nos cards dos agentes para ver relatos individuais
    panel.querySelectorAll('.mh-agent-card').forEach(card => {
      card.addEventListener('click', () => {
        const agentId = card.dataset.agentId;
        this.showAgentDetail(agentId);
      });
    });
  },
  
  // Mostrar detalhe de um agente
  showAgentDetail(agentId) {
    const reports = this.getAgentReports(agentId);
    if (reports.length === 0) return;
    
    const latest = reports[reports.length - 1];
    const panel = document.getElementById('mental-health-panel');
    if (!panel) return;
    
    let html = `
      <div class="panel-header">
        <button id="mh-back">← Voltar</button>
        <h2>${latest.agentIcon} ${latest.agentName}</h2>
        <button id="close-mental-health">✕</button>
      </div>
      <div class="mh-content">
        <div class="mh-detail-header">
          <div class="mh-detail-mood">
            <span class="mh-mood-big">${{positivo:'😊',neutro:'😐',preocupado:'😟',critico:'😰'}[latest.mood] || '❓'}</span>
            <span>Estado: ${latest.mood}</span>
          </div>
          <div class="mh-detail-score">
            <span class="mh-score-big">${this.calculateHealthScore(latest.dimensions)}</span>
            <span>/100</span>
          </div>
        </div>
        
        <h3>💭 Última Autorreflexão</h3>
        <div class="mh-reflection-full">"${latest.selfReflection}"</div>
        
        <h3>📊 Dimensões de Saúde</h3>
        <div class="mh-dimensions-detail">
          ${Object.entries(latest.dimensions).map(([key, val]) => {
            const dim = this.dimensions[key];
            return `<div class="mh-dim-row">
              <span class="mh-dim-label">${dim?.icon || ''} ${dim?.name || key}</span>
              <div class="mh-dim-bar-full">
                <div class="mh-dim-fill" style="width:${val*10}%;background:${dim?.color || '#888'}"></div>
              </div>
              <span class="mh-dim-value">${val}/10</span>
            </div>`;
          }).join('')}
        </div>
        
        ${latest.needs.length > 0 ? `
          <h3>⚠️ Necessidades Identificadas</h3>
          <div class="mh-needs-list">${latest.needs.map(n => `<div class="mh-need-item">• ${n}</div>`).join('')}</div>
        ` : ''}
        
        <h3>📝 Histórico de Relatos (${reports.length})</h3>
        <div class="mh-reports-list">
          ${reports.slice(-10).reverse().map(r => {
            const time = new Date(r.timestamp).toLocaleTimeString('pt-BR');
            const moodEmoji = {positivo:'😊',neutro:'😐',preocupado:'😟',critico:'😰'}[r.mood] || '❓';
            return `<div class="mh-report-item">
              <span class="mh-report-time">${time}</span>
              <span class="mh-report-mood">${moodEmoji}</span>
              <span class="mh-report-reflection">${r.selfReflection.substring(0, 80)}...</span>
            </div>`;
          }).join('')}
        </div>
      </div>
    `;
    
    panel.innerHTML = html;
    
    // Botão voltar
    document.getElementById('mh-back').addEventListener('click', () => this.renderPanel());
    document.getElementById('close-mental-health').addEventListener('click', () => panel.classList.add('hidden'));
  }
};
