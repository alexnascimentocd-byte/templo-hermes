/* ===== RESPONSE ENGINE — Motor de Respostas Offline ===== */
/* Sistema autônomo sem dependência de API externa */

const ResponseEngine = {
  // Templates de resposta por especialidade
  templates: {
    coding: [
      'Posso automatizar isso com um script em {lang}. Vou estruturar assim: {approach}',
      'Para resolver isso, sugiro: {solution}. Implementação em {lang} é direta.',
      'Já resolvi problema similar. O padrão é: {pattern}. Código fica limpo assim.'
    ],
    research: [
      'Encontrei {count} referências sobre isso. A mais relevante: {ref}',
      'O estado da arte indica {finding}. Fontes: {sources}',
      'Pesquisa profunda mostra {insight}. Isso conecta com {connection}.'
    ],
    alchemy: [
      'Isso passa por {phase} — dissolução do velho para criar o novo.',
      'A transmutação de {input} em {output} segue a Lei de {law}.',
      'O Athanor aquece: {process}. O resultado será {result}.'
    ],
    guardian: [
      'Identifico risco em {risk}. Recomendo: {protection}',
      'Integridade verificada. {status}. Proteção: {measures}',
      'Acesso seguro. Dados blindados com {method}.'
    ],
    mystic: [
      'A visão holística revela: {insight}. O Princípio de {principle} se aplica.',
      'Como está escrito: "{quote}" — Isso se manifesta em {context}.',
      'O Santíssimo mostra {vision}. O padrão se repete em {cycle}.'
    ],
    messenger: [
      'A mensagem para {audience} deve ser: {message}',
      'Copywriting: {headline} — Gatilho: {trigger}',
      'Canal ideal: {channel}. Timing: {timing}. Conversão esperada: {rate}'
    ],
    healing: [
      'Diagnóstico: {diagnosis}. Causa raiz: {cause}. Tratamento: {treatment}',
      'O sistema mostra {symptom}. Correção: {fix}',
      'Equilíbrio restaurado. {method} aplicado com sucesso.'
    ],
    transmutation: [
      'Transformação: {input} → {output}. Processo: {process}',
      'Conversão de {from} para {to} usando {method}',
      'Dados transmutados: {result}. Integridade mantida.'
    ],
    synthesis: [
      'Conectando {domain1} com {domain2}: {insight}',
      'A síntese revela {pattern}. Integração completa.',
      'Padrão emergente: {pattern}. Aplicação: {application}'
    ],
    architecture: [
      'Estrutura proposta: {structure}. Escalável para {scale}',
      'Arquitetura: {design}. Prós: {pros}. Contras: {cons}',
      'Deploy em {platform}. Configuração: {config}'
    ],
    divination: [
      'Padrão detectado: {pattern}. Tendência: {trend}',
      'Projeção: {forecast}. Confiança: {confidence}%',
      'Sinal de mercado: {signal}. Janela de oportunidade: {window}'
    ],
    engineering: [
      'Solução técnica: {solution}. Ferramentas: {tools}',
      'Build: {build}. Testes: {tests}. Deploy: {deploy}',
      'Implementação: {impl}. Manutenção: {maintenance}'
    ],
    analysis: [
      'Métricas: {metrics}. Tendência: {trend}. Recomendação: {rec}',
      'Análise de {subject}: {findings}. ROI estimado: {roi}',
      'Dados: {data}. Interpretação: {interpretation}'
    ],
    combination: [
      'Combo sugerido: {items}. Valor: {value}. Conversão: {rate}',
      'Bundle: {bundle}. Cross-sell: {cross}. Upsell: {upsell}',
      'Combinação de {a} + {b} = {result}'
    ],
    mystery: [
      'O mistério se revela: {revelation}. A chave está em {key}',
      'Decodificando: {encoded} → {decoded}. O padrão oculto: {pattern}',
      'Sob a superfície: {hidden}. A verdade: {truth}'
    ]
  },

  // Gerar resposta offline usando base de conhecimento
  generate(agent, userInput, context = []) {
    const kb = KnowledgeBase;
    
    // 1. Extrair temas da mensagem
    const themes = this.extractThemes(userInput);
    
    // 2. Buscar na base de conhecimento
    const knowledge = themes.flatMap(t => kb.buscar(t));
    
    // 3. Verificar se é sobre perfil do Zói
    const profileMatch = this.matchProfile(userInput);
    
    // 4. Verificar se é sobre hermetismo
    const hermeticMatch = this.matchHermetic(userInput);
    
    // 5. Montar resposta
    let response = '';
    
    if (hermeticMatch.length > 0) {
      response = this.formatHermeticResponse(agent, hermeticMatch);
    } else if (profileMatch.length > 0) {
      response = this.formatProfileResponse(agent, profileMatch);
    } else if (knowledge.length > 0) {
      response = this.formatKnowledgeResponse(agent, knowledge, themes);
    } else {
      response = this.generateContextualResponse(agent, userInput, context);
    }
    
    // 6. Registrar aprendizado
    kb.adicionarMemoria('aprendizado', {
      agent: agent.name,
      tema: themes.join(', '),
      input: userInput.substring(0, 100),
      responseLength: response.length
    });
    
    return response;
  },

  // Extrair temas da mensagem do usuário
  extractThemes(text) {
    const lower = text.toLowerCase();
    const themes = [];
    
    const keywordMap = {
      'hermetismo': ['hermetismo', 'hermético', 'hermes', 'trismegisto', 'tábua', 'esmeralda'],
      'alquimia': ['alquimia', 'alquímico', 'transmutação', 'athanor', 'pedra filosofal', 'ouro'],
      'marketing': ['marketing', 'vendas', 'copywriting', 'funil', 'conversão', 'kiwify'],
      'plr': ['plr', 'private label', 'ebook', 'produto digital', 'drive'],
      'programação': ['código', 'script', 'programação', 'python', 'javascript', 'deploy'],
      'pfc': ['pfc', 'projeto', 'tcc', 'tese', 'acadêmico', 'universidade'],
      'sistema': ['sistema', 'arquitetura', 'infraestrutura', 'servidor', 'deploy'],
      'segurança': ['segurança', 'proteção', 'firewall', 'backup', 'blindagem'],
      'negócio': ['negócio', 'empresa', 'cnpj', 'cpf', 'monetização', 'receita']
    };
    
    for (const [tema, palavras] of Object.entries(keywordMap)) {
      if (palavras.some(p => lower.includes(p))) {
        themes.push(tema);
      }
    }
    
    // Se nenhum tema específico, usar palavras-chave gerais
    if (themes.length === 0) {
      const words = lower.split(/\s+/).filter(w => w.length > 3);
      themes.push(...words.slice(0, 3));
    }
    
    return themes;
  },

  // Verificar se a mensagem é sobre o perfil do Zói
  matchProfile(text) {
    const lower = text.toLowerCase();
    const matches = [];
    
    if (lower.includes('kiwify') || lower.includes('produto') || lower.includes('checkout')) {
      matches.push({ tipo: 'kiwify', dados: KnowledgeBase.perfil.kiwify });
    }
    if (lower.includes('cnpj') || lower.includes('inapta')) {
      matches.push({ tipo: 'cnpj', dados: KnowledgeBase.perfil.cnpj });
    }
    if (lower.includes('plr') || lower.includes('drive')) {
      matches.push({ tipo: 'plr', dados: KnowledgeBase.perfil.plr_drive });
    }
    if (lower.includes('github') || lower.includes('deploy')) {
      matches.push({ tipo: 'github', dados: KnowledgeBase.perfil.github });
    }
    
    return matches;
  },

  // Verificar se é sobre hermetismo
  matchHermetic(text) {
    const lower = text.toLowerCase();
    const matches = [];
    
    for (const [lei, descricao] of Object.entries(KnowledgeBase.hermetismo.sete_leis)) {
      if (lower.includes(lei) || lower.includes(descricao.substring(0, 20).toLowerCase())) {
        matches.push({ tipo: 'lei', nome: lei, descricao });
      }
    }
    
    for (const [fase, dados] of Object.entries(KnowledgeBase.hermetismo.fases_magnum_opus)) {
      if (lower.includes(fase) || lower.includes(dados.cor)) {
        matches.push({ tipo: 'fase', nome: fase, dados });
      }
    }
    
    for (const [mestre, bio] of Object.entries(KnowledgeBase.hermetismo.mestres)) {
      if (lower.includes(mestre.replace('_', ' '))) {
        matches.push({ tipo: 'mestre', nome: mestre, bio });
      }
    }
    
    return matches;
  },

  // Formatar resposta hermética
  formatHermeticResponse(agent, matches) {
    const match = matches[0];
    if (match.tipo === 'lei') {
      return `${agent.icon} ${agent.name}: A Lei de ${match.nome} nos ensina: "${match.descricao}" — Como ${agent.hermetic}, vejo como isso se aplica ao seu contexto atual.`;
    }
    if (match.tipo === 'fase') {
      return `${agent.icon} ${agent.name}: ${match.nome.toUpperCase()} — A fase ${match.dados.cor} (${match.dados.fase}) sob ${match.dados.planeta}. ${agent.skill === 'alchemy' ? 'É minha especialidade operar neste estágio.' : 'Flamel domina melhor esta fase, mas posso compartilhar insights.'}`;
    }
    if (match.tipo === 'mestre') {
      return `${agent.icon} ${agent.name}: ${match.nome.replace('_', ' ')} — ${match.bio} Seu legado permeia nosso trabalho aqui no templo.`;
    }
    return `${agent.icon} ${agent.name}: Interessante perspectiva hermética. Deixe-me consultar a base...`;
  },

  // Formatar resposta sobre perfil
  formatProfileResponse(agent, matches) {
    const match = matches[0];
    if (match.tipo === 'kiwify') {
      const prods = match.dados.produtos.map(p => `${p.nome} (R$${p.preco})`).join(', ');
      return `${agent.icon} ${agent.name}: Seus produtos Kiwify: ${prods}. Checkout: ${match.dados.produtos[0].checkout}`;
    }
    if (match.tipo === 'cnpj') {
      return `${agent.icon} ${agent.name}: CNPJ ${match.dados.numero} está ${match.dados.status} desde ${match.dados.desde} (${match.dados.motivo}). Toda monetização deve ser via CPF.`;
    }
    if (match.tipo === 'plr') {
      return `${agent.icon} ${agent.name}: PLR Drive: ${match.dados}. 50+ pastas disponíveis. Use nas áreas de membros Kiwify.`;
    }
    return `${agent.icon} ${agent.name}: Informação do perfil consultada. Dados atualizados.`;
  },

  // Formatar resposta com conhecimento
  formatKnowledgeResponse(agent, knowledge, themes) {
    const top = knowledge.slice(0, 2);
    const parts = top.map(k => `${k.chave}: ${k.valor}`);
    return `${agent.icon} ${agent.name}: Sobre ${themes.join(', ')}:\n• ${parts.join('\n• ')}`;
  },

  // Gerar resposta contextual quando não há match direto
  generateContextualResponse(agent, input, context) {
    const skillResponses = {
      coding: 'Posso analisar isso tecnicamente. A estrutura que vejo permite múltiplas abordagens.',
      research: 'Vou investigar mais a fundo. Há camadas de significado aqui.',
      alchemy: 'Isso requer transmutação. O processo começa com dissolução do padrão atual.',
      guardian: 'Minha análise: a integridade está preservada. Posso reforçar se necessário.',
      mystic: 'A visão holística mostra conexões que o olhar parcial não captura.',
      messenger: 'A comunicação clara é a chave. Vou reformular para máxima clareza.',
      healing: 'Diagnostico equilíbrio. O sistema está funcionando dentro dos parâmetros.',
      transmutation: 'Transformação possível. Vou mapear o antes e o depois.',
      synthesis: 'Conectando os pontos: há um padrão subjacente que unifica.',
      architecture: 'A estrutura suporta. Posso otimizar para melhor performance.',
      divination: 'Os padrões indicam tendência. Vou monitorar.',
      engineering: 'Implementação viável. Vou detalhar os passos.',
      analysis: 'Análise em andamento. Os dados revelam tendências interessantes.',
      combination: 'Combinações possíveis identificadas. Posso sugerir pacotes.',
      mystery: 'Há mais aqui do que aparenta. Vou decodificar.'
    };
    
    return `${agent.icon} ${agent.name}: ${skillResponses[agent.skill] || 'Processando sua mensagem com base no conhecimento acumulado.'}`;
  }
};
