/* ===== COGNITIVE CORTEX — Córtex Cognitivo das 15 Mentalidades ===== */
/* Visão, Escrita, Leitura, Análise, Execução — do digital ao material */
/* Ponte direta: Conselho → Código → Terminal */

const CognitiveCortex = {
  // ===== CÓRTEX DO CÉREBRO =====
  cortexes: {
    // Córtex Prefrontal — Planejamento, decisões, contexto
    prefrontal: {
      nome: 'Pré-Frontal',
      funcao: 'Planejamento estratégico e tomada de decisão',
      processar(entrada, contexto) {
        const analise = {
          objetivo: this.extrairObjetivo(entrada),
          complexidade: this.avaliarComplexidade(entrada),
          passos: this.quebrarEmPassos(entrada),
          riscos: this.identificarRiscos(entrada),
          prioridade: this.calcularPrioridade(entrada)
        };
        return analise;
      },
      extrairObjetivo(entrada) {
        const lower = entrada.toLowerCase();
        if (lower.includes('criar') || lower.includes('fazer') || lower.includes('construir')) return 'criação';
        if (lower.includes('corrigir') || lower.includes('consertar') || lower.includes('debugar')) return 'correção';
        if (lower.includes('analisar') || lower.includes('verificar') || lower.includes('investigar')) return 'análise';
        if (lower.includes('automatizar') || lower.includes('agendar') || lower.includes('script')) return 'automação';
        if (lower.includes('otimizar') || lower.includes('melhorar') || lower.includes('refatorar')) return 'otimização';
        if (lower.includes('mostrar') || lower.includes('listar') || lower.includes('ver')) return 'consulta';
        return 'geral';
      },
      avaliarComplexidade(entrada) {
        let score = 1;
        const complexos = ['sistema', 'arquitetura', 'deploy', 'integrar', 'api', 'banco', 'docker', 'pipeline'];
        complexos.forEach(c => { if (entrada.toLowerCase().includes(c)) score++; });
        return Math.min(score, 5);
      },
      quebrarEmPassos(entrada) {
        // Quebrar em passos lógicos
        const passos = [];
        const lower = entrada.toLowerCase();
        if (lower.includes('criar')) passos.push('1. Definir estrutura');
        if (lower.includes('criar')) passos.push('2. Implementar');
        if (lower.includes('criar') || lower.includes('testar')) passos.push('3. Testar');
        if (lower.includes('deploy') || lower.includes('publicar')) passos.push('4. Deploy');
        if (passos.length === 0) passos.push('1. Analisar', '2. Executar', '3. Verificar');
        return passos;
      },
      identificarRiscos(entrada) {
        const riscos = [];
        const lower = entrada.toLowerCase();
        if (lower.includes('deletar') || lower.includes('remover') || lower.includes('rm ')) riscos.push('⚠️ Operação destrutiva');
        if (lower.includes('sudo') || lower.includes('root')) riscos.push('⚠️ Privilégios elevados');
        if (lower.includes('token') || lower.includes('senha') || lower.includes('password')) riscos.push('🔒 Dados sensíveis');
        if (lower.includes('produção') || lower.includes('production')) riscos.push('🔴 Ambiente de produção');
        return riscos.length > 0 ? riscos : ['✅ Sem riscos identificados'];
      },
      calcularPrioridade(entrada) {
        const lower = entrada.toLowerCase();
        if (lower.includes('urgente') || lower.includes('agora') || lower.includes('rápido')) return '🔴 Alta';
        if (lower.includes('importante') || lower.includes('preciso')) return '🟡 Média';
        return '🟢 Normal';
      }
    },

    // Córtex Frontal — Lógica, código, execução
    frontal: {
      nome: 'Frontal',
      funcao: 'Processamento lógico e geração de código',
      processar(entrada, analise) {
        return {
          codigo: this.gerarCodigo(entrada, analise),
          comandos: this.gerarComandos(entrada, analise),
          estrutura: this.definirEstrutura(entrada, analise)
        };
      },
      gerarCodigo(entrada, analise) {
        const lower = entrada.toLowerCase();

        // Detectar linguagem desejada
        let linguagem = 'bash';
        if (lower.includes('python') || lower.includes('.py')) linguagem = 'python';
        else if (lower.includes('javascript') || lower.includes('node') || lower.includes('.js')) linguagem = 'javascript';
        else if (lower.includes('html') || lower.includes('página') || lower.includes('site')) linguagem = 'html';
        else if (lower.includes('css') || lower.includes('estilo')) linguagem = 'css';
        else if (lower.includes('powershell') || lower.includes('ps1')) linguagem = 'powershell';

        // Gerar código baseado no objetivo
        const templates = {
          criar: {
            python: `#!/usr/bin/env python3\n# ${entrada}\n\ndef main():\n    print("Executando: ${entrada}")\n    # TODO: implementar\n    pass\n\nif __name__ == '__main__':\n    main()`,
            javascript: `// ${entrada}\n\nfunction main() {\n  console.log('Executando: ${entrada}');\n  // TODO: implementar\n}\n\nmain();`,
            bash: `#!/bin/bash\n# ${entrada}\n\necho "Executando: ${entrada}"\n# TODO: implementar\nexit 0`,
            html: `<!DOCTYPE html>\n<html>\n<head><title>${entrada}</title></head>\n<body>\n  <h1>${entrada}</h1>\n</body>\n</html>`,
            powershell: `# ${entrada}\nWrite-Host "Executando: ${entrada}"\n# TODO: implementar`
          },
          analisar: {
            bash: `#!/bin/bash\n# Análise: ${entrada}\n\necho "=== Análise de Sistema ==="\ndate\necho ""\necho "=== CPU ==="\ntop -bn1 | head -5\necho ""\necho "=== Memória ==="\nfree -h\necho ""\necho "=== Disco ==="\ndf -h`,
            python: `#!/usr/bin/env python3\nimport os, subprocess, json\n\ndef analisar():\n    resultado = {\n        'cwd': os.getcwd(),\n        'usuario': os.getenv('USER'),\n        'home': os.getenv('HOME')\n    }\n    print(json.dumps(resultado, indent=2))\n\nanalisar()`
          },
          automacao: {
            python: `#!/usr/bin/env python3\nimport schedule, time\n\ndef tarefa():\n    print("Tarefa executada")\n    # TODO: implementar\n\nschedule.every(1).hours.do(tarefa)\n\nwhile True:\n    schedule.run_pending()\n    time.sleep(60)`,
            bash: `#!/bin/bash\n# Automação: ${entrada}\n# Adicione ao crontab: crontab -e\n# */30 * * * * /caminho/para/este/script.sh\n\necho "[$(date)] Executando..."\n# TODO: implementar`
          },
          consulta: {
            bash: `#!/bin/bash\n# Consulta: ${entrada}\necho "Coletando informações..."\nuname -a\nwhoami\ndate\nuptime`
          }
        };

        const objetivo = analise?.objetivo || 'geral';
        const porLinguagem = templates[objetivo] || templates.criar;
        return porLinguagem[linguagem] || porLinguagem.bash || `# Código para: ${entrada}\n# TODO: implementar`;
      },
      gerarComandos(entrada, analise) {
        const comandos = [];
        const lower = entrada.toLowerCase();

        if (lower.includes('arquivo') || lower.includes('file')) {
          comandos.push('ls -la', 'find . -type f -name "*" | head -20');
        }
        if (lower.includes('processo') || lower.includes('process')) {
          comandos.push('ps aux --sort=-%cpu | head -10');
        }
        if (lower.includes('rede') || lower.includes('network')) {
          comandos.push('ip addr', 'netstat -tlnp | head -10');
        }
        if (lower.includes('git')) {
          comandos.push('git status', 'git log --oneline -5');
        }
        if (lower.includes('docker')) {
          comandos.push('docker ps -a', 'docker images');
        }
        if (lower.includes('npm') || lower.includes('node')) {
          comandos.push('node --version', 'npm list --depth=0');
        }

        return comandos.length > 0 ? comandos : ['echo "Pronto para executar"'];
      },
      definirEstrutura(entrada, analise) {
        return {
          linguagem: this.detectarLinguagem(entrada),
          dependencias: this.detectarDependencias(entrada),
          arquivos: this.detectarArquivosNecessarios(entrada)
        };
      },
      detectarLinguagem(entrada) {
        const lower = entrada.toLowerCase();
        if (lower.includes('python')) return 'python';
        if (lower.includes('javascript') || lower.includes('node') || lower.includes('js')) return 'javascript';
        if (lower.includes('html')) return 'html';
        if (lower.includes('css')) return 'css';
        if (lower.includes('bash') || lower.includes('shell')) return 'bash';
        return 'auto';
      },
      detectarDependencias(entrada) {
        const deps = [];
        const lower = entrada.toLowerCase();
        if (lower.includes('express')) deps.push('express');
        if (lower.includes('react')) deps.push('react');
        if (lower.includes('flask')) deps.push('flask');
        if (lower.includes('pandas')) deps.push('pandas');
        if (lower.includes('requests')) deps.push('requests');
        return deps;
      },
      detectarArquivosNecessarios(entrada) {
        return ['main.' + (this.detectarLinguagem(entrada) === 'python' ? 'py' : 'js')];
      }
    },

    // Córtex Visual — Enxergar objetos, analisar tela
    visual: {
      nome: 'Visual',
      funcao: 'Percepção visual e análise de objetos na tela',
      memoria: [],
      verObjetos() {
        const objetos = [];

        // Ver agentes no mapa
        if (typeof Agents !== 'undefined' && Agents.active) {
          Agents.active.forEach(a => {
            objetos.push({
              tipo: 'agente',
              nome: a.name,
              icone: a.icon,
              posicao: { x: a.x, y: a.y },
              nivel: a.level,
              zona: typeof World !== 'undefined' ? World.getZoneAt(a.x, a.y)?.name : '?'
            });
          });
        }

        // Ver itens no chão
        if (typeof AlchemyEconomy !== 'undefined') {
          AlchemyEconomy.itensNoChao.forEach(item => {
            objetos.push({
              tipo: 'item',
              nome: item.nome,
              icone: item.icon,
              posicao: { x: item.x, y: item.y },
              tier: item.tier,
              valor: item.valor
            });
          });
        }

        // Ver jogador
        if (typeof Player !== 'undefined') {
          objetos.push({
            tipo: 'jogador',
            nome: 'Zói (Mestre)',
            icone: '👑',
            posicao: { x: Player.x, y: Player.y },
            zona: typeof World !== 'undefined' ? World.getZoneAt(Player.x, Player.y)?.name : '?'
          });
        }

        this.memoria = objetos;
        return objetos;
      },
      descreverCena() {
        const objetos = this.verObjetos();
        const agentes = objetos.filter(o => o.tipo === 'agente');
        const itens = objetos.filter(o => o.tipo === 'item');
        const jogador = objetos.find(o => o.tipo === 'jogador');

        let desc = `👁️ CENA ATUAL:\n`;
        desc += `📍 Mestre em: ${jogador?.zona || '?'} (${Math.floor(jogador?.posicao?.x || 0)},${Math.floor(jogador?.posicao?.y || 0)})\n`;
        desc += `👥 ${agentes.length} agentes ativos\n`;
        desc += `📦 ${itens.length} itens no chão\n\n`;

        // Agentes por zona
        const porZona = {};
        agentes.forEach(a => {
          if (!porZona[a.zona]) porZona[a.zona] = [];
          porZona[a.zona].push(a);
        });
        desc += `Agentes por zona:\n`;
        for (const [zona, lista] of Object.entries(porZona)) {
          desc += `  📍 ${zona}: ${lista.map(a => `${a.icone}${a.nome}`).join(', ')}\n`;
        }

        // Itens mais valiosos
        if (itens.length > 0) {
          const topItens = [...itens].sort((a, b) => b.valor - a.valor).slice(0, 5);
          desc += `\nItens mais valiosos:\n`;
          topItens.forEach(item => {
            desc += `  ${item.icone} ${item.nome} (Tier ${item.tier}) — ${item.valor} moedas\n`;
          });
        }

        return desc;
      },
      analisarObjeto(nome) {
        const objetos = this.verObjetos();
        const encontrado = objetos.find(o =>
          o.nome.toLowerCase().includes(nome.toLowerCase()) ||
          o.icone === nome
        );
        if (!encontrado) return `👁️ Objeto "${nome}" não encontrado na cena.`;

        let analise = `👁️ ANÁLISE: ${encontrado.icone} ${encontrado.nome}\n`;
        analise += `  Tipo: ${encontrado.tipo}\n`;
        analise += `  Posição: (${Math.floor(encontrado.posicao.x)}, ${Math.floor(encontrado.posicao.y)})\n`;

        if (encontrado.tipo === 'agente') {
          analise += `  Nível: ${encontrado.nivel}\n`;
          const inv = AlchemyEconomy?.inventarios[encontrado.id] || [];
          analise += `  Inventário: ${inv.length} itens\n`;
          if (inv.length > 0) {
            analise += `  Itens: ${inv.map(i => i.icon).join(' ')}\n`;
          }
        } else if (encontrado.tipo === 'item') {
          analise += `  Tier: ${encontrado.tier}\n`;
          analise += `  Valor: ${encontrado.valor} moedas\n`;
        }

        return analise;
      }
    },

    // Córtex Traseiro — Memória, contexto, padrões
    posterior: {
      nome: 'Posterior',
      funcao: 'Memória de longo prazo e reconhecimento de padrões',
      memoria: [],
      contexto: {},

      registrar(evento) {
        this.memoria.push({
          ...evento,
          timestamp: Date.now()
        });
        // Manter últimas 100
        if (this.memoria.length > 100) this.memoria = this.memoria.slice(-100);
      },

      buscar(termo) {
        return this.memoria.filter(m =>
          JSON.stringify(m).toLowerCase().includes(termo.toLowerCase())
        ).slice(-10);
      },

      reconhecerPadroes() {
        const padroes = [];

        // Padrão: transmutações frequentes
        const transmutacoes = this.memoria.filter(m => m.tipo === 'transmutacao');
        if (transmutacoes.length > 5) {
          padroes.push('⚗️ Alta atividade de transmutação detectada');
        }

        // Padrão: concentração de itens
        if (typeof AlchemyEconomy !== 'undefined') {
          const itens = AlchemyEconomy.itensNoChao;
          const porZona = {};
          itens.forEach(i => {
            const key = `${Math.floor(i.x / 5)},${Math.floor(i.y / 5)}`;
            porZona[key] = (porZona[key] || 0) + 1;
          });
          for (const [zona, qtd] of Object.entries(porZona)) {
            if (qtd >= 5) padroes.push(`📦 Concentração de ${qtd} itens na zona ${zona}`);
          }
        }

        return padroes.length > 0 ? padroes : ['🔍 Nenhum padrão significativo detectado'];
      },

      // Histórico de melhorias
      melhorias: [],
      registrarMelhoria(agente, tipo, antes, depois) {
        this.melhorias.push({
          agente,
          tipo,
          antes,
          depois,
          ganho: depois - antes,
          timestamp: Date.now()
        });
      },

      verMelhorias() {
        if (this.melhorias.length === 0) return '📈 Nenhuma melhoria registrada ainda.';

        let out = '📈 RANKING DE MELHORIAS\n\n';
        const porAgente = {};
        this.melhorias.forEach(m => {
          if (!porAgente[m.agente]) porAgente[m.agente] = { total: 0, count: 0 };
          porAgente[m.agente].total += m.ganho;
          porAgente[m.agente].count++;
        });

        Object.entries(porAgente)
          .sort((a, b) => b[1].total - a[1].total)
          .forEach(([agente, dados], i) => {
            const medalha = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
            out += `${medalha} ${agente}: +${dados.total} (${dados.count} melhorias)\n`;
          });

        return out;
      }
    }
  },

  // ===== PROCESSAMENTO INTEGRADO =====
  processar(entrada) {
    const prefrontal = this.cortexes.prefrontal.processar(entrada, {});
    const frontal = this.cortexes.frontal.processar(entrada, prefrontal);
    const visual = this.cortexes.visual.verObjetos();
    const padroes = this.cortexes.posterior.reconhecerPadroes();

    // Registrar na memória
    this.cortexes.posterior.registrar({
      tipo: 'processamento',
      entrada,
      analise: prefrontal,
      timestamp: Date.now()
    });

    return {
      analise: prefrontal,
      codigo: frontal.codigo,
      comandos: frontal.comandos,
      estrutura: frontal.estrutura,
      cenas: {
        objetos: visual.length,
        agentes: visual.filter(o => o.tipo === 'agente').length,
        itens: visual.filter(o => o.tipo === 'item').length
      },
      padroes
    };
  },

  // ===== SAÍDA PARA TERMINAL =====
  async executarNoTerminal(resultado) {
    if (!resultado.comandos || resultado.comandos.length === 0) {
      return { sucesso: false, msg: 'Nenhum comando para executar.' };
    }

    const resultados = [];
    for (const cmd of resultado.comandos) {
      // Executar via SystemAdmin ou RemoteAdmin
      let res = null;
      if (typeof SystemAdmin !== 'undefined' && SystemAdmin.connected) {
        res = await SystemAdmin.execute(cmd, { shell: 'bash' });
      } else if (typeof RemoteAdmin !== 'undefined' && RemoteAdmin.connected) {
        res = await RemoteAdmin.execute(cmd, { shell: 'bash' });
      }

      resultados.push({
        comando: cmd,
        resultado: res,
        sucesso: res?.success || false
      });
    }

    return {
      sucesso: true,
      comandos: resultados,
      total: resultados.length,
      sucessos: resultados.filter(r => r.sucesso).length
    };
  },

  // ===== BRIDGE: Conselho → Código =====
  async conselhoParaCodigo(ideia) {
    // Processar a ideia pelo córtex
    const resultado = this.processar(ideia);

    // Formatar como código pronto pra executar
    let saida = `🧠 ANÁLISE COGNITIVA\n\n`;

    saida += `📋 Objetivo: ${resultado.analise.objetivo}\n`;
    saida += `🔧 Complexidade: ${'█'.repeat(resultado.analise.complexidade)}${'░'.repeat(5 - resultado.analise.complexidade)}\n`;
    saida += `⚡ Prioridade: ${resultado.analise.prioridade}\n`;
    saida += `🛡️ Riscos: ${resultado.analise.riscos.join(', ')}\n\n`;

    saida += `📝 Passos:\n`;
    resultado.analise.passos.forEach(p => saida += `  ${p}\n`);

    saida += `\n💻 Código gerado:\n\`\`\`\n${resultado.codigo}\n\`\`\`\n`;

    if (resultado.comandos.length > 0) {
      saida += `\n⚙️ Comandos para executar:\n`;
      resultado.comandos.forEach(c => saida += `  $ ${c}\n`);
    }

    saida += `\n👁️ Cena atual: ${resultado.cenas.agentes} agentes, ${resultado.cenas.itens} itens\n`;

    if (resultado.padroes.length > 0) {
      saida += `\n🔍 Padrões:\n`;
      resultado.padroes.forEach(p => saida += `  ${p}\n`);
    }

    return saida;
  },

  // ===== ESCREVER ARQUIVO =====
  async escreverArquivo(caminho, conteudo) {
    // Via SystemAdmin ou fallback local
    if (typeof SystemAdmin !== 'undefined' && SystemAdmin.connected) {
      const isWindows = navigator.platform.includes('Win');
      if (isWindows) {
        // Escapar conteúdo para PowerShell
        const escaped = conteudo.replace(/'/g, "''").replace(/\n/g, "`n");
        return await SystemAdmin.execute(`Set-Content -Path "${caminho}" -Value '${escaped}'`, { shell: 'powershell' });
      } else {
        // Usar heredoc no bash
        const cmd = `cat > "${caminho}" << 'HERMES_EOF'\n${conteudo}\nHERMES_EOF`;
        return await SystemAdmin.execute(cmd, { shell: 'bash' });
      }
    }
    return { success: false, output: 'Sistema não conectado.' };
  },

  // ===== LER ARQUIVO =====
  async lerArquivo(caminho) {
    if (typeof SystemAdmin !== 'undefined' && SystemAdmin.connected) {
      const isWindows = navigator.platform.includes('Win');
      const cmd = isWindows
        ? `Get-Content -Path "${caminho}" -TotalCount 100`
        : `cat "${caminho}" | head -100`;
      return await SystemAdmin.execute(cmd, { shell: isWindows ? 'powershell' : 'bash' });
    }
    return { success: false, output: 'Sistema não conectado.' };
  },

  // Status
  status() {
    return {
      cortexes: Object.keys(this.cortexes).length,
      memoria: this.cortexes.posterior.memoria.length,
      melhorias: this.cortexes.posterior.melhorias.length,
      objetosVisiveis: this.cortexes.visual.memoria.length
    };
  }
};
