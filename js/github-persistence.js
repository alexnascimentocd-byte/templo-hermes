/* ===== GITHUB PERSISTENCE.JS =====
   Persistência de dados no GitHub
   - Salva estado dos módulos como JSON no repositório
   - Sincroniza entre dispositivos
   - Backup automático dos dados
*/

const GitHubPersistence = {
  config: {
    repo: 'alexnascimentocd-byte/templo-hermes',
    branch: 'main',
    dataPath: 'data/',
    autoSync: false
  },

  // Salvar dados no GitHub (via API)
  async saveData(filename, data) {
    const token = localStorage.getItem('github_persist_token');
    if (!token) {
      console.warn('[GitHubPersist] Token não configurado. Use: persist config TOKEN');
      return false;
    }

    try {
      const content = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));
      
      // Verificar se arquivo existe para pegar SHA
      let sha = null;
      try {
        const checkRes = await fetch(
          `https://api.github.com/repos/${this.config.repo}/contents/${this.config.dataPath}${filename}`,
          { headers: { Authorization: `token ${token}` } }
        );
        if (checkRes.ok) {
          const checkData = await checkRes.json();
          sha = checkData.sha;
        }
      } catch (e) {}

      // Criar ou atualizar arquivo
      const body = {
        message: `📊 Data update: ${filename} (${new Date().toLocaleString('pt-BR')})`,
        content: content,
        branch: this.config.branch
      };
      if (sha) body.sha = sha;

      const res = await fetch(
        `https://api.github.com/repos/${this.config.repo}/contents/${this.config.dataPath}${filename}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `token ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        }
      );

      return res.ok;
    } catch (e) {
      console.error('[GitHubPersist] Erro ao salvar:', e);
      return false;
    }
  },

  // Carregar dados do GitHub
  async loadData(filename) {
    try {
      const res = await fetch(
        `https://raw.githubusercontent.com/${this.config.repo}/${this.config.branch}/${this.config.dataPath}${filename}`
      );
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {}
    return null;
  },

  // Salvar estado completo de todos os módulos
  async saveAll() {
    const modules = {
      'sales-office.json': typeof SalesOffice !== 'undefined' ? SalesOffice.getStats() : {},
      'campaigns.json': typeof CampaignEngine !== 'undefined' ? CampaignEngine.getStats() : {},
      'network.json': typeof NetworkGateway !== 'undefined' ? NetworkGateway.getStats() : {},
      'leads.json': typeof LeadDiversification !== 'undefined' ? LeadDiversification.getStats() : {},
      'webdev.json': typeof WebDevDepartment !== 'undefined' ? WebDevDepartment.getStats() : {},
      'conversations.json': typeof AgentConversations !== 'undefined' ? AgentConversations.getStats() : {},
      'dashboard.json': typeof UnifiedDashboard !== 'undefined' ? { pages: UnifiedDashboard.pages || [] } : {}
    };

    let saved = 0;
    for (const [filename, data] of Object.entries(modules)) {
      if (await this.saveData(filename, data)) saved++;
    }

    return { total: Object.keys(modules).length, saved };
  },

  // Status
  getStatus() {
    const hasToken = !!localStorage.getItem('github_persist_token');
    return {
      configured: hasToken,
      repo: this.config.repo,
      dataPath: this.config.dataPath,
      autoSync: this.config.autoSync
    };
  }
};
