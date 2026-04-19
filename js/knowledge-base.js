/* ===== KNOWLEDGE BASE — Base de Conhecimento Offline ===== */
/* Sistema autônomo sem dependência de API externa */

const KnowledgeBase = {
  // Versão da base
  version: '1.0.0',
  
  // ===== PERFIL DO ZÓI =====
  perfil: {
    nome: 'Zói',
    idioma: 'pt-BR',
    cnpj: { numero: '28173770000155', status: 'INAPTA', desde: '2024-08-08', motivo: 'Omissão DASN-SIMEI' },
    cpf_ativo: true,
    plataformas: ['Kiwify', 'Hotmart', 'Eduzz', 'TikTok', 'Kwai', 'YouTube', 'Shopee Afiliados'],
    evitar: ['PagSeguro', 'Mercado Pago (vendedores)', 'Stripe'],
    github: 'alexnascimentocd-byte',
    projetos: ['pfc-hermetico (privado)', 'skynetchat', 'templo-hermes'],
    preferencias: {
      comunicacao: 'áudio Telegram',
      linguagem: 'português nativo',
      solucoes: 'gratuitas primeiro',
      abordagem: 'pragmática'
    },
    kiwify: {
      conta: 'alexnascimentocd-byte',
      produtos: [
        { nome: 'Pack 550+ Scripts e Copies', preco: 19.90, checkout: 'pay.kiwify.com.br/qC8YHzK' },
        { nome: 'Primeira Venda em 48h', preco: 9.90, checkout: 'pay.kiwify.com.br/xcL4QxC' },
        { nome: 'Marketing Digital + Mentalidade', preco: 27.90, checkout: 'pay.kiwify.com.br/D4NExoo' }
      ],
      pagina_vendas: 'https://alexnascimentocd-byte.github.io/pack-digital/'
    },
    plr_drive: 'https://drive.google.com/drive/folders/1Hy7_GTsmzzWu7yuHuQhvA_nuLEB7XG6b',
    ambiente: {
      os: 'WSL Ubuntu + Windows',
      ram: '9.7GB',
      ia_local: ['llama3.2:3b', 'qwen2.5-coder:7b'],
      ferramentas: ['Ollama', 'Claude Code', 'GitHub CLI']
    }
  },

  // ===== CONHECIMENTO HERMÉTICO =====
  hermetismo: {
    sete_leis: {
      mentalismo: 'O Tudo é Mente; o Universo é mental.',
      correspondencia: 'Como acima, assim abaixo; como abaixo, assim acima.',
      vibração: 'Nada está parudo; tudo se move; tudo vibra.',
      polaridade: 'Tudo é duplo; todos os polos são reconciliáveis.',
      ritmo: 'Tudo tem suas marés; tudo sobe e desce.',
      causa_e_efeito: 'Toda causa tem seu efeito; todo efeito tem sua causa.',
      gênero: 'O gênero está em tudo; tudo tem princípios masculino e feminino.'
    },
    fases_magnum_opus: {
      nigredo: { cor: 'preto', fase: 'dissolução', simbolo: 'corvo', planeta: 'Saturno ♄' },
      albedo: { cor: 'branco', fase: 'purificação', simbolo: 'cisne', planeta: 'Lua ☽' },
      citrinitas: { cor: 'amarelo', fase: 'iluminação', simbolo: 'sol nascente', planeta: 'Sol ☉' },
      rubedo: { cor: 'vermelho', fase: 'perfeição', simbolo: 'rei vermelho', planeta: 'Marte ♂' }
    },
    tábua_esmeralda: [
      'É verdade, sem mentira, certo e muito verdadeiro.',
      'O que está em baixo é como o que está em cima.',
      'E o que está em cima é como o que está em baixo.',
      'Para realizar os milagres de uma só coisa.',
      'Assim como todas as coisas vieram do Um.',
      'E pela meditação do Um todas as coisas se adaptaram.',
      'O sol é seu pai, a lua é sua mãe.',
      'O vento o carrega em seu ventre.',
      'A terra é sua ama.',
      'O pai de todo o telesma do mundo está aqui.',
      'Sua força ou poder é inteira se for convertida em terra.'
    ],
    correspondencias: {
      planetas: { Sol: 'ouro, realeza, ego', Lua: 'prata, intuição, sonhos', Marte: 'ferro, guerra, ação', Mercúrio: 'mercúrio, comunicação, comércio', Júpiter: 'estanho, expansão, lei', Vênus: 'cobre, amor, beleza', Saturno: 'chumbo, limitação, tempo' },
      elementos: { Fogo: 'ação, vontade, energia', Água: 'emoção, intuição, fluxo', Ar: 'intelecto, comunicação, ideias', Terra: 'matéria, estabilidade, forma' },
      metais: { Ouro: 'Sol — perfeição', Prata: 'Lua — receptividade', Ferro: 'Marte — força', Mercúrio: 'Mercúrio — mutação', Estanho: 'Júpiter — crescimento', Cobre: 'Vênus — harmonia', Chumbo: 'Saturno — densidade' }
    },
    mestres: {
      hermes_trismegisto: 'Três vezes grande. Autor da Tábua de Esmeralda. Pai do hermetismo.',
      paracelso: 'Médico alquímico. Pai da toxicologia. "A dose faz o veneno."',
      flamel: 'Lendário alquimista francês. Suposto criador da Pedra Filosofal.',
      fulcanelli: 'Alquimista francês anônimo do séc. XX. Autor do Mistério das Catedrais.',
      maria_hebrea: 'Primeira alquimista. Inventora do banho-maria e do tribikos.',
      geber: 'Pai da química árabe. Classificação dos compostos.',
      agrippa: 'Ocultista renascentista. Filosofia oculta em três livros.',
      john_dee: 'Matemático, astrólogo, conselheiro da Rainha Elizabeth I.',
      ramon_lully: 'Combinatória universal. A Ars Magna.',
      roger_bacon: 'Frade franciscano. Precursor do método científico.',
      isaac_newton: 'Físico que escreveu mais sobre alquimia que sobre física.'
    }
  },

  // ===== CONHECIMENTO TÉCNICO =====
  tecnico: {
    linguagens: ['Python', 'JavaScript', 'HTML', 'CSS', 'Shell/Bash'],
    ferramentas: ['Git', 'GitHub', 'Ollama', 'Claude Code', 'Node.js', 'Express'],
    servicos: ['GitHub Pages', 'Railway', 'Oracle Cloud Free', 'Telegram Bot API'],
    padroes: ['PWA', 'SPA', 'API REST', 'WebSocket', 'Service Worker'],
    estruturas_dados: {
      memoria_agentes: 'localStorage (web) + JSON (persistência)',
      base_conhecimento: 'Objeto JavaScript (este arquivo)',
      cache: 'Service Worker (offline)',
      sessao: 'sessionStorage'
    }
  },

  // ===== MARKETING DIGITAL =====
  marketing: {
    estrategias: ['PLR (Private Label Rights)', 'Afiliados', 'Produto próprio', 'Conteúdo gratuito → Funil'],
    canais: ['Telegram', 'YouTube', 'TikTok', 'Kwai', 'Instagram', 'Shopee'],
    metricas: ['Conversão', 'Ticket médio', 'LTV (Lifetime Value)', 'ROI', 'CAC (Custo de Aquisição)'],
    funil: {
      topo: 'Conteúdo gratuito (vídeo, post, artigo)',
      meio: 'Lead magnet (ebook gratuito, planilha)',
      fundo: 'Produto (Kiwify checkout) + Upsell',
      retenção: 'Área de membros + Comunidade'
    },
    copywriting: {
      gatilhos: ['Escassez', 'Urgência', 'Prova social', 'Autoridade', 'Reciprocidade'],
      estrutura: 'PAS (Problema-Agitação-Solução) ou AIDA (Atenção-Interesse-Dejseo-Ação)',
      headlines: ['Como [resultado] em [tempo]', 'O segredo de [autoridade] para [resultado]', '[Número] erras que [audiência] comete'] }
  },

  // ===== CONHECIMENTO ACUMULADO =====
  memoria: {
    sessoes: [],
    decisoes: [],
    aprendizados: [],
    erros_evitados: []
  },

  // ===== MÉTODOS =====
  
  // Buscar conhecimento por palavra-chave
  buscar(termo) {
    const lower = termo.toLowerCase();
    const resultados = [];
    
    // Buscar em hermetismo
    for (const [chave, valor] of Object.entries(this.hermetismo.sete_leis)) {
      if (chave.includes(lower) || valor.toLowerCase().includes(lower)) {
        resultados.push({ fonte: '7 Leis', chave, valor });
      }
    }
    
    // Buscar em correspondências
    for (const [cat, items] of Object.entries(this.hermetismo.correspondencias)) {
      for (const [chave, valor] of Object.entries(items)) {
        if (chave.toLowerCase().includes(lower) || valor.toLowerCase().includes(lower)) {
          resultados.push({ fonte: cat, chave, valor });
        }
      }
    }
    
    // Buscar em mestres
    for (const [chave, valor] of Object.entries(this.hermetismo.mestres)) {
      if (chave.toLowerCase().includes(lower) || valor.toLowerCase().includes(lower)) {
        resultados.push({ fonte: 'Mestres', chave, valor });
      }
    }
    
    return resultados;
  },
  
  // Adicionar memória
  adicionarMemoria(tipo, dados) {
    const entrada = {
      timestamp: Date.now(),
      data: new Date().toLocaleDateString('pt-BR'),
      tipo,
      dados
    };
    this.memoria[tipo + 's'] = this.memoria[tipo + 's'] || [];
    this.memoria[tipo + 's'].push(entrada);
    this.salvar();
  },
  
  // Salvar base (persistência)
  salvar() {
    try {
      const dados = {
        version: this.version,
        memoria: this.memoria,
        perfil: this.perfil,
        timestamp: Date.now()
      };
      localStorage.setItem('kb_hermes', JSON.stringify(dados));
      return true;
    } catch(e) {
      console.warn('Erro ao salvar KB:', e);
      return false;
    }
  },
  
  // Carregar base (persistência)
  carregar() {
    try {
      const raw = localStorage.getItem('kb_hermes');
      if (!raw) return false;
      const dados = JSON.parse(raw);
      if (dados.memoria) this.memoria = dados.memoria;
      if (dados.version !== this.version) {
        console.log('KB: versão atualizada de', dados.version, 'para', this.version);
      }
      return true;
    } catch(e) {
      console.warn('Erro ao carregar KB:', e);
      return false;
    }
  },
  
  // Gerar resposta offline para um tema
  responder(tema, agente) {
    const conhecimento = this.buscar(tema);
    if (conhecimento.length === 0) {
      return `${agente.icon} ${agente.name}: Interessante perspectiva sobre "${tema}". Vou meditar sobre isso e trazer insights na próxima sessão.`;
    }
    
    // Selecionar 2-3 resultados relevantes
    const selecionados = conhecimento.slice(0, 3);
    const respostas = selecionados.map(r => {
      return `• ${r.chave}: ${r.valor}`;
    });
    
    return `${agente.icon} ${agente.name}: ${respostas.join('\n')}`;
  },
  
  // Inicializar
  init() {
    this.carregar();
    console.log('📚 Knowledge Base v' + this.version + ' carregada');
  }
};
