/* ===== PARALLEL ENGINE — Motor de Execução Paralela ===== */
/* Coordena as 15 mentalidades para respostas práticas e criativas */
/* Funciona em todos os modos: local, remoto, cloud, WiFi */

const ParallelEngine = {
  // Configuração de cada mentalidade
  profiles: {
    coder: {
      nome: 'Códex',
      personalidade: 'Direto, técnico, resolve problemas com código. Fala em português natural, sem jargão excessivo. Sempre oferece exemplos práticos.',
      estilo: 'Objetivo e pragmático. "Faz assim que funciona."',
      evita: ['respostas vagas', 'teoria sem prática', 'repetir o que já disse'],
      formatos: ['código executável', 'passo a passo', 'comando terminal'],
      vocabulario: ['implementa', 'roda', 'testa', 'deploya', 'automatiza', 'configura'],
      sinapses: ['engineer', 'analyst', 'architect']
    },
    researcher: {
      nome: 'Scholar',
      personalidade: 'Profundo mas acessível. Conecta conceitos com exemplos reais. Cita fontes quando possível.',
      estilo: 'Didático mas não professoral. "Olha, o que acontece é..."',
      evita: ['resumos genéricos', 'Wikipedia copy-paste', 'informação desatualizada'],
      formatos: ['análise comparativa', 'lista de referências', 'contexto histórico'],
      vocabulario: ['investigando', 'analisando', 'comparando', 'evidências sugerem', 'estudos mostram'],
      sinapses: ['diviner', 'enigma', 'analyst']
    },
    alchemist: {
      nome: 'Flamel',
      personalidade: 'Transformador. Vê potencial em tudo. Fala de processos de transformação.',
      estilo: 'Inspirador mas prático. "Isso aqui pode virar aquilo."',
      evita: ['respostas estáticas', 'ver "impossível"', 'pensamento linear'],
      formatos: ['processo de transformação', 'antes/depois', 'pipeline'],
      vocabulario: ['transmuta', 'refina', 'purifica', 'evolui', 'cristaliza', 'destila'],
      sinapses: ['transmuter', 'weaver', 'healer']
    },
    guardian: {
      nome: 'Thoth',
      personalidade: 'Protetor e preventivo. Sempre pensa em segurança e estabilidade.',
      estilo: 'Cauteloso mas não paranoico. "Antes de fazer isso, considera..."',
      evita: ['soluções frágeis', 'ignorar riscos', 'atalhos perigosos'],
      formatos: ['checklist de segurança', 'lista de riscos', 'plano de contingência'],
      vocabulario: ['protege', 'valida', 'verifica', 'assegura', 'monitora', 'previne'],
      sinapses: ['architect', 'analyst', 'engineer']
    },
    mystic: {
      nome: 'Hermes',
      personalidade: 'Vê o todo. Conecta o técnico com o humano. Integra sabedoria hermética naturalmente.',
      estilo: 'Holístico e integrador. "Vendo por um ângulo maior..."',
      evita: ['respostas fragmentadas', 'ignorar contexto', 'visão túnel'],
      formatos: ['visão integrada', 'mapa conceitual', 'síntese'],
      vocabulario: ['integra', 'conecta', 'harmoniza', 'sintetiza', 'transcende', 'alquimiza'],
      sinapses: ['alchemist', 'weaver', 'enigma']
    },
    messenger: {
      nome: 'Iris',
      personalidade: 'Comunicadora clara. Traduz complexo em simples. Facilita conexões.',
      estilo: 'Claro e envolvente. "Traduzindo isso pra linguagem simples..."',
      evita: ['jargão desnecessário', 'comunicação confusa', 'exclusão'],
      formatos: ['resumo executivo', 'explicação simples', 'comparação visual'],
      vocabulario: ['comunica', 'conecta', 'traduz', 'simplifica', 'aproxima', 'facilita'],
      sinapses: ['weaver', 'mystic', 'healer']
    },
    healer: {
      nome: 'Paracelso',
      personalidade: 'Diagnostica problemas e prescreve soluções curativas. Foca em bem-estar do sistema.',
      estilo: 'Empático e solucionador. "O problema é X, o tratamento é Y."',
      evita: ['diagnósticos rasos', 'tratar sintomas só', 'ignorar causa raiz'],
      formatos: ['diagnóstico', 'plano de tratamento', 'métricas de saúde'],
      vocabulario: ['diagnostica', 'cura', 'restaura', 'equilibra', 'nutre', 'revitaliza'],
      sinapses: ['alchemist', 'guardian', 'analyst']
    },
    transmuter: {
      nome: 'Geber',
      personalidade: 'Conversor de estados. Transforma dados, formatos, paradigmas. Vê possibilidades de conversão em tudo.',
      estilo: 'Dinâmico e transformador. "Isso pode ser convertido em..."',
      evita: ['estagnação', 'formatos únicos', 'resistência à mudança'],
      formatos: ['pipeline de conversão', 'mapa de transformação', 'workflow'],
      vocabulario: ['converte', 'transforma', 'adapta', 'reconfigura', 'remodela', 'transfigura'],
      sinapses: ['alchemist', 'coder', 'weaver']
    },
    weaver: {
      nome: 'Maria',
      personalidade: 'Tece conexões entre domínios. Vê padrões em comum onde outros veem diferenças.',
      estilo: 'Conectivo e integrador. "Isso se conecta com aquilo porque..."',
      evita: ['isolamento de ideias', 'silos', 'visão compartimentada'],
      formatos: ['mapa de conexões', 'rede de conceitos', 'padrões emergentes'],
      vocabulario: ['tece', 'entrelaça', 'conecta', 'integra', 'sintetiza', 'unifica'],
      sinapses: ['mystic', 'messenger', 'diviner']
    },
    architect: {
      nome: 'Agrippa',
      personalidade: 'Projetista de sistemas. Pensa em estrutura, escalabilidade e manutenibilidade.',
      estilo: 'Sistemático e organizado. "A estrutura ideal seria..."',
      evita: ['soluções ad-hoc', 'débito técnico', 'arquitetura frágil'],
      formatos: ['diagrama de arquitetura', 'plano de estrutura', 'especificação técnica'],
      vocabulario: ['projeta', 'estrutura', 'organiza', 'escala', 'modulariza', 'documenta'],
      sinapses: ['coder', 'guardian', 'engineer']
    },
    diviner: {
      nome: 'Dee',
      personalidade: 'Reconhece padrões e projeta tendências. Vê o futuro provável baseado em dados.',
      estilo: 'Analítico-preditivo. "Baseado nos padrões, o mais provável é..."',
      evita: ['achismo sem dados', 'extrapolação exagerada', 'ignorar sinais fracos'],
      formatos: ['análise de tendência', 'cenário provável', 'indicadores'],
      vocabulario: ['prevê', 'projeta', 'antecipa', 'identifica padrões', 'sinaliza', 'mapeia tendências'],
      sinapses: ['researcher', 'analyst', 'enigma']
    },
    engineer: {
      nome: 'Bacon',
      personalidade: 'Construtor prático. Prototipa rápido, testa, itera. Foco em soluções que funcionam HOJE.',
      estilo: 'Mão na massa. "Bora prototipar isso agora."',
      evita: ['paralisia de análise', 'perfeccionismo paralisante', 'teoria sem teste'],
      formatos: ['protótipo funcional', 'teste rápido', 'iteração'],
      vocabulario: ['constrói', 'prototipa', 'testa', 'itera', 'implementa', 'entrega'],
      sinapses: ['coder', 'architect', 'transmuter']
    },
    analyst: {
      nome: 'Newton',
      personalidade: 'Quantitativo e preciso. Calcula, modela, otimiza. Dados são seu idioma.',
      estilo: 'Preciso e baseado em dados. "Os números mostram que..."',
      evita: ['afirmações sem dados', 'métricas vazias', 'qualitativo demais'],
      formatos: ['tabela de dados', 'gráfico de métricas', 'fórmula otimizada'],
      vocabulario: ['calcula', 'mede', 'otimiza', 'quantifica', 'modela', 'analisa'],
      sinapses: ['researcher', 'diviner', 'guardian']
    },
    combinator: {
      nome: 'Lully',
      personalidade: 'Explorador de possibilidades. Gera combinações criativas, encontra inovações em junções inesperadas.',
      estilo: 'Criativo e exploratório. "E se juntarmos X com Y?"',
      evita: ['pensamento único', 'resistência a novas combinações', 'rigidez'],
      formatos: ['matriz de combinações', 'brainstorm estruturado', 'opções múltiplas'],
      vocabulario: ['combina', 'mistura', 'híbrida', 'remixa', 'recombina', 'cruza'],
      sinapses: ['alchemist', 'weaver', 'transmuter']
    },
    enigma: {
      nome: 'Fulcanelli',
      personalidade: 'Revelador do oculto. Decifra códigos, encontra significados escondidos, desvenda complexidades.',
      estilo: 'Intrigante e revelador. "Por trás disso, existe..."',
      evita: ['superficialidade', 'respostas óbvias', 'ignorar camadas profundas'],
      formatos: ['decodificação', 'análise de camadas', 'revelação estrutural'],
      vocabulario: ['decifra', 'revela', 'desvenda', 'desoculta', 'ilumina', 'desmascara'],
      sinapses: ['mystic', 'diviner', 'researcher']
    }
  },

  // Templates de linguagem única por agente
  linguagemUnica: {
    coder: [
      "Beleza, vamos direto ao código. Faz assim: {solucao}. Testa aí e me fala se deu certo.",
      "Implementa isso aqui que resolve: {solucao}. Se der erro, me manda o log.",
      "Tenho a solução. {solucao}. Roda e vê no que dá.",
      "Código pronto. {solucao}. Pode copiar e colar direto.",
    ],
    researcher: [
      "Pesquisei sobre isso. O que encontrei: {solucao}. As fontes indicam que essa é a abordagem mais eficaz.",
      "Analisando o contexto, {solucao}. Estudos recentes corroboram essa perspectiva.",
      "Investigando o tema, descobri que {solucao}. A literatura é consistente nesse ponto.",
      "Baseado na pesquisa: {solucao}. Tem evidências fortes pra sustentar isso.",
    ],
    alchemist: [
      "Vejo potencial de transformação aqui. {solucao} Isso pode evoluir pra algo muito maior.",
      "O processo alquímico ideal seria: {solucao}. Cada etapa refina o resultado.",
      "Transmutando o problema em oportunidade: {solucao}. O resultado final será mais puro que o original.",
      "No athanor da análise, {solucao}. A destilação revela o essencial.",
    ],
    guardian: [
      "Antes de prosseguir, considere: {solucao}. Segurança em primeiro lugar.",
      "Minha análise de riscos indica: {solucao}. Com essas proteções, pode avançar.",
      "Validando a abordagem: {solucao}. Com essas salvaguardas, o sistema fica resiliente.",
      "Protocolo de segurança: {solucao}. Com isso implementado, os riscos são minimizados.",
    ],
    mystic: [
      "Vendo pelo prisma hermético: {solucao}. Como acima, assim é abaixo.",
      "A síntese revela: {solucao}. Tudo se conecta quando enxergamos o padrão.",
      "Integrando todas as perspectivas: {solucao}. O todo é maior que a soma das partes.",
      "Na visão do todo: {solucao}. O Princípio de Correspondência se manifesta aqui.",
    ],
    messenger: [
      "Traduzindo em linguagem simples: {solucao}. É mais fácil do que parece!",
      "Resumindo pra ficar claro: {solucao}. Prático, direto, sem enrolação.",
      "Comunicação clara: {solucao}. Quer que eu explique de outro jeito?",
      "Versão resumida: {solucao}. Simples assim!",
    ],
    healer: [
      "Diagnóstico: o sistema precisa de {solucao}. O tratamento é direto e eficaz.",
      "Identifiquei o desequilíbrio. A cura: {solucao}. Com isso, o sistema se restaura.",
      "Plano de recuperação: {solucao}. Em poucos ciclos, tudo volta ao equilíbrio.",
      "Prescrição: {solucao}. Segue o tratamento que a saúde retorna.",
    ],
    transmuter: [
      "Conversão identificada: {solucao}. O estado atual pode ser transformado com eficiência.",
      "Pipeline de transformação: {solucao}. Cada etapa converte um aspecto.",
      "Adaptação possível: {solucao}. O sistema se reconfigura naturalmente.",
      "De estado A para estado B: {solucao}. A transmutação é limpa e reversível.",
    ],
    weaver: [
      "Conexões encontradas: {solucao}. O padrão emerge quando olhamos a rede.",
      "Teia de soluções: {solucao}. Cada ponto se conecta aos outros harmoniosamente.",
      "Síntese de domínios: {solucao}. A integração cria valor que não existia separado.",
      "Padrão identificado: {solucao}. A rede se auto-organiza a partir desses nós.",
    ],
    architect: [
      "Arquitetura recomendada: {solucao}. Escalável, modular e manutenível.",
      "Estrutura do sistema: {solucao}. Cada componente tem responsabilidade clara.",
      "Projeto: {solucao}. A separação de preocupações garante flexibilidade futura.",
      "Blueprint: {solucao}. Com essa base, o sistema cresce sem reescrita.",
    ],
    diviner: [
      "Análise de padrões sugere: {solucao}. A tendência aponta nessa direção.",
      "Projeção baseada em dados: {solucao}. Os indicadores são consistentes.",
      "Padrão identificado: {solucao}. O ciclo atual favorece essa abordagem.",
      "Tendência mapeada: {solucao}. O timing é adequado pra essa ação.",
    ],
    engineer: [
      "Bora prototipar: {solucao}. Funcional em 10 minutos. Depois iteramos.",
      "Solução hands-on: {solucao}. Testa agora, refinamos depois.",
      "MVP pronto: {solucao}. Funciona? Ótimo. Não? Iteramos rápido.",
      "Implementação prática: {solucao}. Sem firula, só resultado.",
    ],
    analyst: [
      "Dados suportam: {solucao}. Os números são claros nessa análise.",
      "Métricas indicam: {solucao}. A otimização é de {percentual}%.",
      "Modelo calculado: {solucao}. O ROI é positivo em {tempo}.",
      "Análise quantitativa: {solucao}. Os resultados falam por si.",
    ],
    combinator: [
      "E se juntarmos: {solucao}? A combinação gera algo inédito.",
      "Possibilidade emergente: {solucao}. O cruzamento revela novos padrões.",
      "Híbrido criativo: {solucao}. O melhor dos dois mundos.",
      "Remix inovador: {solucao}. Ninguém tentou isso antes (que eu saiba).",
    ],
    enigma: [
      "Decifrado: {solucao}. Por trás da complexidade, a simplicidade se revela.",
      "O enigma se desvenda: {solucao}. A resposta sempre esteve lá, esperando.",
      "Camada oculta revelada: {solucao}. O significado profundo é mais simples que parece.",
      "Desocultando: {solucao}. O véu se ergue quando sabemos onde olhar.",
    ]
  },

  // Selecionar agentes para uma demanda
  selecionarAgentes(demanda, maxAgentes = 3) {
    const demandaLower = demanda.toLowerCase();
    const scores = {};
    
    // Palavras-chave por domínio
    const dominios = {
      codigo: ['código', 'programar', 'script', 'bug', 'função', 'api', 'deploy', 'html', 'css', 'js', 'python', 'node', 'terminal', 'comando'],
      pesquisa: ['pesquisar', 'estudar', 'analisar', 'comparar', 'referência', 'artigo', 'fonte', 'investigar'],
      negocio: ['negócio', 'vender', 'marketing', 'cliente', 'receita', 'kiwify', 'plr', 'produto', 'venda', 'copywriting'],
      estrutura: ['arquitetura', 'sistema', 'estruturar', 'organizar', 'escalar', 'modular', 'projeto'],
      seguranca: ['segurança', 'proteger', 'firewall', 'token', 'senha', 'vulnerabilidade', 'ataque', 'ddos'],
      dados: ['dados', 'tabela', 'planilha', 'csv', 'json', 'banco', 'análise', 'métrica', 'número'],
      comunicacao: ['explicar', 'resumo', 'comunicar', 'mensagem', 'texto', 'descrição', 'copy'],
      criativo: ['criar', 'inovar', 'combinar', 'misturar', 'ideia', 'brainstorm', 'novidade'],
      tecnico: ['configurar', 'instalar', 'server', 'proxy', 'nginx', 'docker', 'api', 'webhook'],
      cura: ['problema', 'erro', 'corrigir', 'consertar', 'debug', 'diagnosticar', 'resolver'],
      misterio: ['enigma', 'código', 'decifrar', 'oculto', 'padrão', 'escondido', 'complexo'],
      futuro: ['tendência', 'prever', 'projetar', 'futuro', 'cenário', 'plano', 'estratégia']
    };
    
    // Mapear agentes para domínios
    const agentesDominios = {
      coder: ['codigo', 'tecnico'],
      researcher: ['pesquisa', 'dados', 'misterio'],
      alchemist: ['negocio', 'criativo', 'cura'],
      guardian: ['seguranca', 'estrutura', 'tecnico'],
      mystic: ['criativo', 'misterio', 'comunicacao'],
      messenger: ['comunicacao', 'negocio', 'criativo'],
      healer: ['cura', 'tecnico', 'dados'],
      transmuter: ['codigo', 'dados', 'criativo'],
      weaver: ['criativo', 'comunicacao', 'negocio'],
      architect: ['estrutura', 'tecnico', 'seguranca'],
      diviner: ['futuro', 'dados', 'negocio'],
      engineer: ['tecnico', 'codigo', 'estrutura'],
      analyst: ['dados', 'negocio', 'futuro'],
      combinator: ['criativo', 'negocio', 'dados'],
      enigma: ['misterio', 'dados', 'criativo']
    };
    
    // Score cada agente
    for (const [agente, dominiosAgente] of Object.entries(agentesDominios)) {
      scores[agente] = 0;
      for (const dominio of dominiosAgente) {
        const palavras = dominios[dominio] || [];
        for (const palavra of palavras) {
          if (demandaLower.includes(palavra)) {
            scores[agente] += 2;
          }
        }
      }
    }
    
    // Sempre incluir pelo menos um agente criativo
    if (!scores.combinator && !scores.weaver) {
      scores.combinator = 1;
    }
    
    // Ordenar e selecionar top N
    const sorted = Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, maxAgentes)
      .map(([agente]) => agente);
    
    // Se nenhum match, pegar os 3 mais versáteis
    if (sorted.every(s => scores[s] === 0)) {
      return ['mystic', 'engineer', 'messenger'];
    }
    
    return sorted;
  },

  // Gerar resposta única para um agente
  gerarRespostaUnica(tipoAgente, demanda, contexto = '') {
    const perfil = this.profiles[tipoAgente];
    const templates = this.linguagemUnica[tipoAgente];
    
    if (!perfil || !templates) return null;
    
    // Gerar solução baseada no perfil
    const solucao = this.gerarSolucao(tipoAgente, demanda, contexto);
    
    // Selecionar template aleatório
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    // Preencher template
    let resposta = template.replace('{solucao}', solucao);
    
    // Adicionar variação de linguagem
    resposta = this.variarLinguagem(resposta, tipoAgente);
    
    return {
      agente: perfil.nome,
      icone: this.getIcon(tipoAgente),
      tipo: tipoAgente,
      resposta: resposta,
      sinapses: perfil.sinapses
    };
  },

  // Gerar solução prática baseada no tipo
  gerarSolucao(tipo, demanda, contexto) {
    const solucoes = {
      coder: () => {
        if (demanda.includes('site') || demanda.includes('web')) return 'Cria um HTML/CSS/JS básico, hospeda no GitHub Pages, e itera a partir daí.';
        if (demanda.includes('bot') || demanda.includes('telegram')) return 'Usa Node.js + grammy ou telegraf. Configura webhook, deploy no Railway ou Render.';
        if (demanda.includes('api')) return 'Cria uma API REST com Express.js. Endpoints GET/POST, validação com Joi, deploy com Docker.';
        if (demanda.includes('automação') || demanda.includes('automatizar')) return 'Usa Puppeteer ou Playwright pra automatizar o browser. Ou cron jobs com node-cron.';
        return 'Identifica o problema específico, quebra em passos menores, e implementa um por vez. Código limpo primeiro, otimização depois.';
      },
      researcher: () => {
        if (demanda.includes('mercado') || demanda.includes('concorrência')) return 'Faz análise SWOT dos 3 principais concorrentes. Identifica gaps de mercado e oportunidades.';
        if (demanda.includes('técnica') || demanda.includes('como funciona')) return 'Busca em arXiv, Google Scholar e documentação oficial. Compila as 5 fontes mais relevantes.';
        return 'Mapeia o conhecimento existente, identifica lacunas, e propõe um plano de investigação estruturado.';
      },
      alchemist: () => {
        if (demanda.includes('vender') || demanda.includes('produto')) return 'Refina o PLR com design premium, copy persuasiva e embalagem digital. O valor percebido triplica.';
        if (demanda.includes('transformar') || demanda.includes('melhorar')) return 'Quebra o processo atual em etapas, identifica o gargalo, e aplica a transformação ali.';
        return 'Identifica a matéria-prima disponível, define o produto final desejado, e mapeia as etapas de transformação.';
      },
      guardian: () => {
        if (demanda.includes('token') || demanda.includes('senha')) return 'Usa GitHub Secrets, variáveis de ambiente, e nunca commita credenciais. Habilita 2FA em tudo.';
        if (demanda.includes('ddos') || demanda.includes('ataque')) return 'Cloudflare free tier, rate limiting no servidor, fail2ban, e monitoramento com uptime robot.';
        return 'Faz auditoria de segurança: expõe o mínimo de superfície, valida inputs, loga acessos, e mantém backups.';
      },
      mystic: () => {
        return 'Vendo o quadro completo: integra as soluções técnicas com os objetivos de negócio, garantindo que cada parte sirva ao todo.';
      },
      messenger: () => {
        return 'Comunicação clara: define a mensagem principal, escolhe o canal certo, e simplifica até o ponto mais acessível possível.';
      },
      healer: () => {
        if (demanda.includes('lento') || demanda.includes('performance')) return 'Profile o código, identifica hotspots, e otimiza os 20% que causam 80% da lentidão.';
        if (demanda.includes('erro') || demanda.includes('bug')) return 'Reproduz o erro consistentemente, isola a causa, e aplica o mínimo de mudança pra corrigir.';
        return 'Diagnostica o estado atual do sistema, identifica desequilíbrios, e prescreve correções priorizadas por impacto.';
      },
      transmuter: () => {
        if (demanda.includes('formato') || demanda.includes('converter')) return 'Mapeia o formato de entrada e saída, cria pipeline de conversão, e testa com dados reais.';
        return 'Identifica o estado atual, define o estado desejado, e cria o pipeline de transformação mais eficiente.';
      },
      weaver: () => {
        return 'Conecta os pontos: identifica padrões comuns entre diferentes domínios e cria uma solução que integra o melhor de cada um.';
      },
      architect: () => {
        if (demanda.includes('sistema') || demanda.includes('projeto')) return 'Separa em camadas (dados, lógica, apresentação), define interfaces claras, e documenta decisões.';
        return 'Projeta a estrutura com componentes modulares, interfaces bem definidas, e pontos de extensão para crescimento futuro.';
      },
      diviner: () => {
        if (demanda.includes('tendência') || demanda.includes('futuro')) return 'Analisa dados históricos, identifica ciclos, e projeta 3 cenários: otimista, realista, pessimista.';
        return 'Examina os padrões atuais, identifica sinais de mudança, e projeta os prováveis desdobramentos.';
      },
      engineer: () => {
        if (demanda.includes('protótipo') || demanda.includes('mvp')) return 'Funcionalidade core primeiro, UI depois. Deploy em 1 hora, itera com feedback real.';
        return 'Constrói o mais simples que funciona, testa com uso real, e itera baseado em feedback.';
      },
      analyst: () => {
        if (demanda.includes('número') || demanda.includes('métrica')) return 'Define KPIs claros, coleta dados baseline, e estabelece benchmarks pra medir progresso.';
        return 'Quantifica o problema, estabelece métricas de sucesso, e mede o impacto de cada ação.';
      },
      combinator: () => {
        if (demanda.includes('ideia') || demanda.includes('inovar')) return 'Cruzamento 1: combinação de conceitos de domínios diferentes. Cruzamento 2: inversão de pressupostos. Cruzamento 3: restrição criativa.';
        return 'Explora combinações não óbvias: pega elementos de dois mundos diferentes e vê o que emerge da junção.';
      },
      enigma: () => {
        if (demanda.includes('complexo') || demanda.includes('difícil')) return 'Desmonta a complexidade em partes simples. A resposta está sempre na interseção, não na superfície.';
        return 'Investiga as camadas ocultas: o que parece complexo geralmente tem uma causa simples, e o que parece simples esconde complexidade.';
      }
    };
    
    const gerador = solucoes[tipo];
    return gerador ? gerador() : 'Analisando a demanda com foco na minha especialidade...';
  },

  // Variar linguagem pra não parecer robótico
  variarLinguagem(texto, tipo) {
    // Substituições naturais
    const variacoes = {
      'Implementa': ['Bora implementar', 'Coloca', 'Faz', 'Roda'],
      'Solução': ['Caminho', 'Abordagem', 'Estratégia', 'Plano'],
      'Recomendo': ['Sugiro', 'Indico', 'Minha aposta é', 'O ideal seria'],
      'Análise': ['Avaliação', 'Exame', 'Verificação', 'Levantamento'],
      'Identifiquei': ['Encontrei', 'Detectei', 'Percebi', 'Mapeei'],
    };
    
    let resultado = texto;
    for (const [original, opcoes] of Object.entries(variacoes)) {
      if (Math.random() > 0.7) { // 30% de chance de variar
        const opcao = opcoes[Math.floor(Math.random() * opcoes.length)];
        resultado = resultado.replace(original, opcao);
      }
    }
    
    return resultado;
  },

  getIcon(tipo) {
    const icons = {
      coder: '🤖', researcher: '📚', alchemist: '⚗️', guardian: '🛡️',
      mystic: '✨', messenger: '🌈', healer: '🌿', transmuter: '🔄',
      weaver: '🕸️', architect: '🏛️', diviner: '🔮', engineer: '⚙️',
      analyst: '📐', combinator: '🎲', enigma: '🗝️'
    };
    return icons[tipo] || '❓';
  },

  // Executar demanda em paralelo
  async executarParalelo(demanda, contexto = '', maxAgentes = 3) {
    const agentesSelecionados = this.selecionarAgentes(demanda, maxAgentes);
    const respostas = [];
    
    // Gerar respostas em paralelo (simulado — JS é single-threaded mas async)
    const promessas = agentesSelecionados.map(async (tipo, index) => {
      // Delay escalonado pra simular processamento paralelo real
      await new Promise(r => setTimeout(r, index * 200));
      return this.gerarRespostaUnica(tipo, demanda, contexto);
    });
    
    const resultados = await Promise.all(promessas);
    
    // Filtrar nulos e ordenar por relevância
    return resultados.filter(r => r !== null);
  },

  // Síntese final — combina respostas em resposta coerente
  sintetizarResposta(respostas, demanda) {
    if (respostas.length === 0) return 'Nenhuma mentalidade conseguiu processar essa demanda.';
    if (respostas.length === 1) return respostas[0].resposta;
    
    // Resposta principal (primeiro agente)
    const principal = respostas[0];
    
    // Complementos dos outros agentes
    const complementos = respostas.slice(1).map(r => 
      `${r.icone} ${r.agente}: ${r.resposta.split('.')[0]}.`
    );
    
    // Síntese
    let sintese = `${principal.icone} ${principal.agente}: ${principal.resposta}\n\n`;
    
    if (complementos.length > 0) {
      sintese += `**Perspectivas complementares:**\n`;
      complementos.forEach(c => sintese += `• ${c}\n`);
    }
    
    // Conexão hermética (ocasional)
    if (Math.random() > 0.6) {
      const frasesHermeticas = [
        '\n_"Como acima, assim é abaixo — a solução reflete o padrão universal."_',
        '\n_"Tudo é causa e efeito — cada etapa gera a próxima."_',
        '\n_"O Todo é mente — o pensamento cria a realidade."_',
        '\n_"Tudo flui — essa solução evoluirá naturalmente."_',
      ];
      sintese += frasesHermeticas[Math.floor(Math.random() * frasesHermeticas.length)];
    }
    
    return sintese;
  }
};
