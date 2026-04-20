/* ===== UNIFIED DASHBOARD.JS =====
   Painel de Controle Unificado
   - Métricas de TODOS os departamentos em uma tela
   - Gráficos de receita com Canvas
   - WhatsApp Click-to-Chat integrado
   - Gerador de Landing Pages reais
   - Persistência no GitHub
   - Metas e projeções Fibonacci × φ
*/

const UnifiedDashboard = {
  active: false,
  panel: null,
  refreshInterval: null,
  data: {},

  // Configuração
  config: {
    refreshMs: 30000,        // Atualiza a cada 30s
    metaMensal: 3000,        // Meta R$ 3.000/mês
    whatsappNumber: '',      // Alex preenche depois
    githubToken: '',         // Para persistência
    githubRepo: 'alexnascimentocd-byte/templo-hermes'
  },

  // Inicializar
  init() {
    this.createPanel();
    this.refresh();
    this.startAutoRefresh();
    this.active = true;
    this.log('📊 Dashboard Unificado iniciado');
    return this;
  },

  // Criar painel HTML
  createPanel() {
    // Container principal
    const panel = document.createElement('div');
    panel.id = 'unified-dashboard';
    panel.className = 'panel hidden';
    panel.style.cssText = `
      position: fixed; top: 56px; right: 0; width: 420px; max-width: 100vw;
      height: calc(100vh - 56px); background: #0a0a1a; border-left: 2px solid #4a1a6b;
      z-index: 100; overflow-y: auto; font-family: 'Press Start 2P', monospace;
      font-size: 8px; color: #ccc;
    `;

    panel.innerHTML = `
      <div class="panel-header" style="background:linear-gradient(135deg,#1a0a2e,#0a1a2e);padding:12px;border-bottom:2px solid #4a1a6b;display:flex;justify-content:space-between;align-items:center;">
        <h2 style="margin:0;color:#d4a547;font-size:10px;">📊 Painel de Controle</h2>
        <button id="close-dashboard" style="background:none;border:1px solid #666;color:#aaa;padding:4px 8px;cursor:pointer;font-family:inherit;font-size:8px;">✕</button>
      </div>
      
      <!-- Resumo Geral -->
      <div id="dash-summary" style="padding:10px;border-bottom:1px solid #2a2a4a;"></div>
      
      <!-- Gráfico de Receita -->
      <div style="padding:10px;border-bottom:1px solid #2a2a4a;">
        <div style="color:#d4a547;margin-bottom:8px;">💰 RECEITA — Meta: R$ <span id="dash-meta">3.000</span></div>
        <canvas id="dash-revenue-chart" width="380" height="120" style="width:100%;border:1px solid #2a2a4a;border-radius:4px;"></canvas>
        <div id="dash-revenue-stats" style="margin-top:6px;display:flex;justify-content:space-between;"></div>
      </div>

      <!-- Departamentos -->
      <div style="padding:10px;border-bottom:1px solid #2a2a4a;">
        <div style="color:#d4a547;margin-bottom:8px;">🏢 DEPARTAMENTOS</div>
        <div id="dash-departments"></div>
      </div>

      <!-- Leads e Vendas -->
      <div style="padding:10px;border-bottom:1px solid #2a2a4a;">
        <div style="color:#d4a547;margin-bottom:8px;">🎯 LEADS & VENDAS</div>
        <div id="dash-funnel"></div>
      </div>

      <!-- WhatsApp Quick Actions -->
      <div style="padding:10px;border-bottom:1px solid #2a2a4a;">
        <div style="color:#d4a547;margin-bottom:8px;">📱 AÇÕES RÁPIDAS</div>
        <div id="dash-actions" style="display:flex;flex-wrap:wrap;gap:6px;"></div>
      </div>

      <!-- Landing Pages -->
      <div style="padding:10px;border-bottom:1px solid #2a2a4a;">
        <div style="color:#d4a547;margin-bottom:8px;">🌐 LANDING PAGES</div>
        <div id="dash-landing-pages"></div>
      </div>

      <!-- Notificações Recentes -->
      <div style="padding:10px;">
        <div style="color:#d4a547;margin-bottom:8px;">🔔 NOTIFICAÇÕES</div>
        <div id="dash-notifications"></div>
      </div>
    `;

    document.body.appendChild(panel);
    this.panel = panel;

    // Botão no header
    this.addHeaderButton();

    // Fechar
    document.getElementById('close-dashboard')?.addEventListener('click', () => {
      panel.classList.add('hidden');
    });
  },

  // Adicionar botão no header
  addHeaderButton() {
    const headerRight = document.querySelector('.header-buttons-desktop');
    if (headerRight && !document.getElementById('btn-dashboard')) {
      const btn = document.createElement('button');
      btn.id = 'btn-dashboard';
      btn.title = 'Painel de Controle';
      btn.textContent = '📊';
      btn.addEventListener('click', () => this.toggle());
      
      // Inserir antes do botão de settings
      const settingsBtn = document.getElementById('btn-settings');
      if (settingsBtn) {
        headerRight.insertBefore(btn, settingsBtn);
      } else {
        headerRight.appendChild(btn);
      }
    }

    // Mobile menu
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu && !mobileMenu.querySelector('[data-action="dashboard"]')) {
      const item = document.createElement('button');
      item.className = 'mobile-menu-item';
      item.dataset.action = 'dashboard';
      item.textContent = '📊 Painel de Controle';
      item.addEventListener('click', () => this.toggle());
      mobileMenu.insertBefore(item, mobileMenu.firstChild);
    }
  },

  // Toggle painel
  toggle() {
    if (!this.panel) return;
    this.panel.classList.toggle('hidden');
    if (!this.panel.classList.contains('hidden')) {
      this.refresh();
    }
  },

  // Refresh completo
  refresh() {
    this.collectData();
    this.renderSummary();
    this.renderRevenueChart();
    this.renderDepartments();
    this.renderFunnel();
    this.renderActions();
    this.renderLandingPages();
    this.renderNotifications();
  },

  // Coletar dados de todos os módulos
  collectData() {
    this.data = {
      conversations: typeof AgentConversations !== 'undefined' ? AgentConversations.getStats() : null,
      network: typeof NetworkGateway !== 'undefined' ? NetworkGateway.getStats() : null,
      sales: typeof SalesOffice !== 'undefined' ? SalesOffice.getStats() : null,
      campaigns: typeof CampaignEngine !== 'undefined' ? CampaignEngine.getStats() : null,
      diversification: typeof LeadDiversification !== 'undefined' ? LeadDiversification.getStats() : null,
      webdev: typeof WebDevDepartment !== 'undefined' ? WebDevDepartment.getStats() : null,
      cloud: typeof CloudEngine !== 'undefined' ? CloudEngine.getStatus() : null,
      presence: typeof PresenceEngine !== 'undefined' ? PresenceEngine.getStatus() : null,
      timestamp: new Date().toISOString()
    };
  },

  // Renderizar resumo
  renderSummary() {
    const el = document.getElementById('dash-summary');
    if (!el) return;

    const totalRevenue = (this.data.sales?.revenue?.total || 0) + 
                         (this.data.network?.totalRevenue || 0) + 
                         (this.data.campaigns?.revenue?.total || 0);
    
    const totalLeads = (this.data.diversification?.totalProfiles || 0) + 
                       (this.data.campaigns?.leads?.total || 0);
    
    const totalConversions = (this.data.sales?.deals?.won || 0) + 
                             (this.data.campaigns?.metrics?.converted || 0);

    const cloudStatus = this.data.cloud?.active ? '🟢' : '🔴';

    el.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
        <div style="background:#1a1a2e;padding:8px;border-radius:4px;border-left:3px solid #ffd700;">
          <div style="color:#ffd700;font-size:12px;">R$ ${totalRevenue}</div>
          <div style="color:#888;">Receita Total</div>
        </div>
        <div style="background:#1a1a2e;padding:8px;border-radius:4px;border-left:3px solid #4a8aff;">
          <div style="color:#4a8aff;font-size:12px;">${totalLeads}</div>
          <div style="color:#888;">Leads Capturados</div>
        </div>
        <div style="background:#1a1a2e;padding:8px;border-radius:4px;border-left:3px solid #4aff8a;">
          <div style="color:#4aff8a;font-size:12px;">${totalConversions}</div>
          <div style="color:#888;">Conversões</div>
        </div>
        <div style="background:#1a1a2e;padding:8px;border-radius:4px;border-left:3px solid #ff6b6b;">
          <div style="color:#ff6b6b;font-size:12px;">${cloudStatus} Cloud</div>
          <div style="color:#888;">${this.data.cloud?.status || 'offline'}</div>
        </div>
      </div>
    `;
  },

  // Renderizar gráfico de receita
  renderRevenueChart() {
    const canvas = document.getElementById('dash-revenue-chart');
    const statsEl = document.getElementById('dash-revenue-stats');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const meta = this.config.metaMensal;

    // Dados simulados de receita acumulada (últimos 7 dias)
    const salesRevenue = this.data.sales?.revenue?.total || 0;
    const networkRevenue = this.data.network?.totalRevenue || 0;
    const campaignRevenue = this.data.campaigns?.revenue?.total || 0;
    const totalRevenue = salesRevenue + networkRevenue + campaignRevenue;

    // Projeção Fibonacci
    const projection = [totalRevenue];
    const fib = [1, 1, 2, 3, 5, 8];
    for (let i = 1; i < 7; i++) {
      projection.push(Math.round(totalRevenue * fib[i] * 1.618 / 7 * (i + 1)));
    }

    // Limpar
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = '#1a1a2e';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const y = 10 + (h - 20) * i / 4;
      ctx.beginPath();
      ctx.moveTo(30, y);
      ctx.lineTo(w - 10, y);
      ctx.stroke();
    }

    // Linha da meta
    const metaY = h - 20 - ((h - 30) * Math.min(meta, Math.max(...projection)) / Math.max(...projection, meta));
    ctx.strokeStyle = '#ff6b6b';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(30, metaY);
    ctx.lineTo(w - 10, metaY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#ff6b6b';
    ctx.font = '8px monospace';
    ctx.fillText('META', w - 45, metaY - 3);

    // Barras de receita por fonte
    const barWidth = 30;
    const spacing = 50;
    const sources = [
      { name: 'Vendas', value: salesRevenue, color: '#4aff8a' },
      { name: 'Network', value: networkRevenue, color: '#4a8aff' },
      { name: 'Campanhas', value: campaignRevenue, color: '#ffcc00' }
    ];

    const maxValue = Math.max(...sources.map(s => s.value), meta, 100);

    sources.forEach((source, i) => {
      const x = 50 + i * spacing;
      const barH = (h - 30) * source.value / maxValue;
      const y = h - 15 - barH;

      // Barra
      ctx.fillStyle = source.color;
      ctx.fillRect(x, y, barWidth, barH);

      // Label
      ctx.fillStyle = '#888';
      ctx.font = '7px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(source.name, x + barWidth / 2, h - 3);
      ctx.fillText(`R$${source.value}`, x + barWidth / 2, y - 5);
    });

    // Linha de projeção
    ctx.strokeStyle = '#d4a547';
    ctx.lineWidth = 2;
    ctx.beginPath();
    projection.forEach((val, i) => {
      const x = 40 + (w - 50) * i / (projection.length - 1);
      const y = h - 20 - ((h - 30) * val / maxValue);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Stats
    if (statsEl) {
      const progress = Math.round((totalRevenue / meta) * 100);
      const projected = Math.round(totalRevenue * 1.618);
      statsEl.innerHTML = `
        <span style="color:${progress >= 100 ? '#4aff8a' : '#ffcc00'};">📊 ${progress}% da meta</span>
        <span style="color:#d4a547;">🔮 Projeção φ: R$ ${projected}</span>
        <span style="color:#888;">📅 7 dias</span>
      `;
    }
  },

  // Renderizar departamentos
  renderDepartments() {
    const el = document.getElementById('dash-departments');
    if (!el) return;

    const depts = [
      { icon: '🗣️', name: 'Conversas', data: this.data.conversations, metric: `${this.data.conversations?.totalConversations || 0} conversas` },
      { icon: '🌐', name: 'Network', data: this.data.network, metric: `R$ ${this.data.network?.totalRevenue || 0}` },
      { icon: '💼', name: 'Vendas', data: this.data.sales, metric: `${this.data.sales?.deals?.won || 0} fechadas` },
      { icon: '🚀', name: 'Campanhas', data: this.data.campaigns, metric: `${this.data.campaigns?.campaigns?.active || 0} ativas` },
      { icon: '🎯', name: 'Diversificação', data: this.data.diversification, metric: `${this.data.diversification?.totalProfiles || 0} perfis` },
      { icon: '🏗️', name: 'Dev Web', data: this.data.webdev, metric: `${this.data.webdev?.projects?.total || 0} projetos` },
      { icon: '☁️', name: 'Cloud', data: this.data.cloud, metric: this.data.cloud?.active ? '🟢 Online' : '🔴 Offline' },
      { icon: '📱', name: 'Presença', data: this.data.presence, metric: this.data.presence?.active ? '🟢 Ativo' : '🔴 Inativo' }
    ];

    el.innerHTML = depts.map(d => `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:4px 0;border-bottom:1px solid #1a1a2e;">
        <span>${d.icon} ${d.name}</span>
        <span style="color:#4aff8a;">${d.metric}</span>
      </div>
    `).join('');
  },

  // Renderizar funil
  renderFunnel() {
    const el = document.getElementById('dash-funnel');
    if (!el) return;

    const leads = this.data.diversification?.totalProfiles || 0;
    const contacted = this.data.sales?.pipeline?.total || 0;
    const proposals = this.data.sales?.pipeline?.active || 0;
    const won = this.data.sales?.deals?.won || 0;
    const rate = this.data.sales?.deals?.winRate || 0;

    el.innerHTML = `
      <div style="display:flex;align-items:center;gap:4px;margin-bottom:6px;">
        <div style="flex:1;background:#4a8aff;padding:6px;border-radius:4px;text-align:center;">
          <div style="font-size:12px;color:#fff;">${leads}</div>
          <div style="color:#aaa;">Leads</div>
        </div>
        <span style="color:#666;">→</span>
        <div style="flex:1;background:#ffa94d;padding:6px;border-radius:4px;text-align:center;">
          <div style="font-size:12px;color:#fff;">${contacted}</div>
          <div style="color:#aaa;">Pipeline</div>
        </div>
        <span style="color:#666;">→</span>
        <div style="flex:1;background:#69db7c;padding:6px;border-radius:4px;text-align:center;">
          <div style="font-size:12px;color:#fff;">${proposals}</div>
          <div style="color:#aaa;">Ativos</div>
        </div>
        <span style="color:#666;">→</span>
        <div style="flex:1;background:#4aff8a;padding:6px;border-radius:4px;text-align:center;">
          <div style="font-size:12px;color:#fff;">${won}</div>
          <div style="color:#aaa;">Ganhos 🎉</div>
        </div>
      </div>
      <div style="text-align:center;color:#d4a547;">Taxa de conversão: ${rate}%</div>
    `;
  },

  // Renderizar ações rápidas (WhatsApp, Kiwify, etc)
  renderActions() {
    const el = document.getElementById('dash-actions');
    if (!el) return;

    const actions = [
      { icon: '📱', label: 'WhatsApp', action: () => this.openWhatsApp(), color: '#25d366' },
      { icon: '💰', label: 'Kiwify', action: () => window.open('https://kiwify.com.br', '_blank'), color: '#ff6b35' },
      { icon: '🚀', label: 'Campanhas', action: () => this.runAction('campanha executar'), color: '#4a8aff' },
      { icon: '💼', label: 'Vendas', action: () => this.runAction('vendas ciclo'), color: '#ffa94d' },
      { icon: '🌐', label: 'Network', action: () => this.runAction('rede ciclo'), color: '#69db7c' },
      { icon: '🏗️', label: 'Dev Web', action: () => this.runAction('devweb ciclo'), color: '#e040fb' },
      { icon: '📊', label: 'Refresh', action: () => this.refresh(), color: '#d4a547' },
      { icon: '🎯', label: 'Diversificar', action: () => this.runAction('diversificar ciclo'), color: '#ff4a8a' }
    ];

    el.innerHTML = actions.map(a => `
      <button class="dash-action-btn" style="background:${a.color}22;border:1px solid ${a.color};color:${a.color};padding:6px 10px;border-radius:4px;cursor:pointer;font-family:inherit;font-size:7px;display:flex;align-items:center;gap:4px;" data-action="${a.label}">
        ${a.icon} ${a.label}
      </button>
    `).join('');

    // Bind actions
    el.querySelectorAll('.dash-action-btn').forEach((btn, i) => {
      btn.addEventListener('click', actions[i].action);
    });
  },

  // Abrir WhatsApp com mensagem pré-preenchida
  openWhatsApp() {
    const number = this.config.whatsappNumber;
    if (!number) {
      const num = prompt('Digite seu número do WhatsApp (ex: 5527999999999):');
      if (num) {
        this.config.whatsappNumber = num.replace(/\D/g, '');
        localStorage.setItem('dashboard_whatsapp', this.config.whatsappNumber);
      } else return;
    }

    const msg = encodeURIComponent('Olá! Vim pelo Templo de Hermes 🏛️');
    window.open(`https://wa.me/${this.config.whatsappNumber}?text=${msg}`, '_blank');
  },

  // Executar comando do console
  runAction(cmd) {
    if (typeof Console !== 'undefined') {
      Console.execute(cmd);
      setTimeout(() => this.refresh(), 3000);
    }
  },

  // Renderizar landing pages
  renderLandingPages() {
    const el = document.getElementById('dash-landing-pages');
    if (!el) return;

    const products = [
      { name: 'Pack 550+ Scripts', price: 'R$ 19,90', url: 'pay.kiwify.com.br/qC8YHzK', icon: '📝' },
      { name: 'Primeira Venda 48h', price: 'R$ 9,90', url: 'pay.kiwify.com.br/xcL4QxC', icon: '🎯' },
      { name: 'Marketing + Mentalidade', price: 'R$ 27,90', url: 'pay.kiwify.com.br/D4NExoo', icon: '🧠' }
    ];

    el.innerHTML = products.map(p => `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid #1a1a2e;">
        <span>${p.icon} ${p.name}</span>
        <div>
          <span style="color:#4aff8a;">${p.price}</span>
          <a href="https://${p.url}" target="_blank" style="color:#4a8aff;margin-left:6px;">🔗</a>
          <button class="dash-wa-share" data-product="${p.name}" data-url="https://${p.url}" style="background:#25d36622;border:1px solid #25d366;color:#25d366;padding:2px 6px;border-radius:3px;cursor:pointer;font-size:7px;margin-left:4px;">📱</button>
        </div>
      </div>
    `).join('');

    // WhatsApp share buttons
    el.querySelectorAll('.dash-wa-share').forEach(btn => {
      btn.addEventListener('click', () => {
        const product = btn.dataset.product;
        const url = btn.dataset.url;
        const msg = encodeURIComponent(`🏛️ Confira: ${product}\n${url}`);
        window.open(`https://wa.me/?text=${msg}`, '_blank');
      });
    });
  },

  // Renderizar notificações
  renderNotifications() {
    const el = document.getElementById('dash-notifications');
    if (!el) return;

    let notifs = [];
    if (typeof PresenceEngine !== 'undefined') {
      notifs = PresenceEngine.getNotifications(true).slice(0, 5);
    }

    if (notifs.length === 0) {
      el.innerHTML = '<div style="color:#666;">📭 Nenhuma notificação não lida</div>';
      return;
    }

    el.innerHTML = notifs.map(n => `
      <div style="padding:4px 0;border-bottom:1px solid #1a1a2e;display:flex;gap:6px;">
        <span>${n.icon}</span>
        <div>
          <div style="color:#fff;">${n.title}</div>
          <div style="color:#666;">${n.timeAgo}</div>
        </div>
      </div>
    `).join('');
  },

  // Auto-refresh
  startAutoRefresh() {
    this.refreshInterval = setInterval(() => {
      if (this.panel && !this.panel.classList.contains('hidden')) {
        this.refresh();
      }
    }, this.config.refreshMs);
  },

  // Log
  log(msg) {
    if (typeof Console !== 'undefined' && Console.log) {
      Console.log(msg, 'info');
    }
  },

  // Destroy
  destroy() {
    if (this.refreshInterval) clearInterval(this.refreshInterval);
    if (this.panel) this.panel.remove();
    this.active = false;
  }
};

// Auto-inicializar
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      UnifiedDashboard.init();
    }, 6000);
  });
}
