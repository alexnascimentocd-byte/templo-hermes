/* ===== AGENT TRAINER — Treinamento das 15 Mentalidades ===== */
/* Exercícios para respostas mais criativas, práticas e não repetitivas */

const AgentTrainer = {
  // Banco de demandas reais para treinamento
  demandas: {
    tecnico: [
      "Como faço pra deployar um site estático no GitHub Pages?",
      "Meu bot do Telegram parou de responder, como debugar?",
      "Quero criar uma API REST em Node.js, por onde começo?",
      "Como automatizar backup de arquivos no Windows?",
      "Meu servidor tá lento, como diagnosticar?",
      "Como configurar SSL no Nginx?",
      "Quero usar Docker pra meu projeto, como começar?",
      "Como criar um webhook que dispara quando alguém abre uma Issue?",
      "Meu código Python tá consumindo muita RAM, como otimizar?",
      "Como fazer deploy automático com GitHub Actions?",
    ],
    negocio: [
      "Como vender meu produto digital pela Kiwify?",
      "Qual a melhor estratégia de preço pra PLR?",
      "Como criar uma página de vendas que converte?",
      "Quais canais de tráfego devo usar pra meu nicho?",
      "Como estruturar um funil de vendas do zero?",
      "Como fazer copywriting persuasivo sem parecer spam?",
      "Como usar o TikTok pra atrair clientes?",
      "Qual modelo de negócio digital é mais escalável?",
      "Como precificar um serviço de consultoria?",
      "Como criar um lançamento digital do zero?",
    ],
    criativo: [
      "Como criar conteúdo original sobre hermetismo?",
      "Quero fazer um projeto artístico digital, ideias?",
      "Como combinar programação com arte visual?",
      "Como criar uma experiência interativa na web?",
      "Como transformar dados em arte?",
      "Como criar um jogo educativo sobre alquimia?",
      "Como fazer um site que conta uma história?",
      "Como criar uma identidade visual única?",
      "Como usar IA pra gerar arte original?",
      "Como criar um zine digital sobre filosofia hermética?",
    ],
    analitico: [
      "Como medir o ROI do meu marketing digital?",
      "Como analisar a concorrência no meu nicho?",
      "Como criar um dashboard de métricas pro meu negócio?",
      "Como prever tendências de mercado usando dados?",
      "Como calcular o custo de aquisição de cliente?",
      "Como fazer análise de funil de conversão?",
      "Como usar Google Analytics pra otimizar conversões?",
      "Como criar um modelo financeiro pro meu projeto?",
      "Como analisar dados de vendas pra tomar decisões?",
      "Como benchmarkar meu produto contra concorrentes?",
    ],
    seguranca: [
      "Como proteger meu site contra DDoS?",
      "Como gerenciar tokens e senhas com segurança?",
      "Como fazer pentest no meu próprio servidor?",
      "Como proteger minha API contra abuso?",
      "Como configurar firewall no Linux?",
      "Como implementar autenticação JWT segura?",
      "Como detectar invasão no meu servidor?",
      "Como fazer backup seguro de dados sensíveis?",
      "Como proteger credenciais em repositórios Git?",
      "Como configurar rate limiting pra proteger APIs?",
    ]
  },

  // Treinar um agente específico
  treinarAgente(tipoAgente, categoria, numExercicios = 3) {
    const demandasCategoria = this.demandas[categoria] || this.demandas.tecnico;
    const resultados = [];
    
    // Selecionar exercícios aleatórios
    const exercicios = [];
    for (let i = 0; i < numExercicios; i++) {
      const idx = Math.floor(Math.random() * demandasCategoria.length);
      exercicios.push(demandasCategoria[idx]);
    }
    
    // Gerar respostas
    for (const demanda of exercicios) {
      if (typeof ParallelEngine !== 'undefined') {
        const resultado = ParallelEngine.gerarRespostaUnica(tipoAgente, demanda, '');
        if (resultado) {
          resultados.push({
            demanda: demanda,
            resposta: resultado.resposta,
            agente: resultado.agente
          });
        }
      }
    }
    
    return resultados;
  },

  // Treinar todos os agentes em todas as categorias
  treinarTodos() {
    const tipos = Object.keys(ParallelEngine.profiles);
    const categorias = Object.keys(this.demandas);
    const relatorio = {};
    
    for (const tipo of tipos) {
      relatorio[tipo] = {
        nome: ParallelEngine.profiles[tipo].nome,
        exercicios: [],
        totalRespostas: 0,
        respostasUnicas: new Set()
      };
      
      // 2 exercícios por categoria
      for (const categoria of categorias) {
        const resultados = this.treinarAgente(tipo, categoria, 2);
        for (const r of resultados) {
          relatorio[tipo].exercicios.push(r);
          relatorio[tipo].totalRespostas++;
          // Verificar unicidade (primeiras 50 chars)
          const key = r.resposta.substring(0, 50);
          relatorio[tipo].respostasUnicas.add(key);
        }
      }
      
      // Calcular score de criatividade
      relatorio[tipo].criatividade = relatorio[tipo].respostasUnicas.size / relatorio[tipo].totalRespostas;
    }
    
    return relatorio;
  },

  // Gerar relatório de treinamento
  gerarRelatorio() {
    const relatorio = this.treinarTodos();
    let output = '📊 RELATÓRIO DE TREINAMENTO — 15 MENTALIDADES\n';
    output += '═'.repeat(50) + '\n\n';
    
    for (const [tipo, dados] of Object.entries(relatorio)) {
      const icon = ParallelEngine.getIcon(tipo);
      const score = Math.round(dados.criatividade * 100);
      const bar = '█'.repeat(Math.floor(score / 10)) + '░'.repeat(10 - Math.floor(score / 10));
      
      output += `${icon} ${dados.nome} (${tipo})\n`;
      output += `  Criatividade: ${bar} ${score}%\n`;
      output += `  Respostas: ${dados.totalRespostas} | Únicas: ${dados.respostasUnicas.size}\n`;
      
      // Exemplo de resposta
      if (dados.exercicios.length > 0) {
        const exemplo = dados.exercicios[0];
        output += `  Exemplo: "${exemplo.resposta.substring(0, 80)}..."\n`;
      }
      output += '\n';
    }
    
    // Estatísticas gerais
    const totalRespostas = Object.values(relatorio).reduce((sum, d) => sum + d.totalRespostas, 0);
    const totalUnicas = Object.values(relatorio).reduce((sum, d) => sum + d.respostasUnicas.size, 0);
    const mediaCriatividade = Object.values(relatorio).reduce((sum, d) => sum + d.criatividade, 0) / Object.keys(relatorio).length;
    
    output += '═'.repeat(50) + '\n';
    output += `📈 RESUMO GERAL:\n`;
    output += `  Total de respostas: ${totalRespostas}\n`;
    output += `  Respostas únicas: ${totalUnicas}\n`;
    output += `  Criatividade média: ${Math.round(mediaCriatividade * 100)}%\n`;
    output += `  Mentalidades treinadas: ${Object.keys(relatorio).length}/15\n`;
    
    return output;
  }
};
