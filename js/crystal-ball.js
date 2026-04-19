/* ===== CRYSTAL BALL — Portal de Manipulação Remota ===== */
/* As 15 mentalidades interagem com o computador do Zói via console */
/* Cada agente usa sua especialidade pra manipular dados, arquivos, sistema */

const CrystalBall = {
  ativo: false,
  agenteAtual: null,
  historico: [],
  sessaoId: null,

  // Inicializar
  init() {
    this.sessaoId = 'cb_' + Date.now();
    this.ativo = true;
    console.log('🔮 Crystal Ball ativado');
  },

  // ===== PROCESSAR COMANDO NATURAL =====
  async processar(entrada) {
    const lower = entrada.toLowerCase().trim();

    // Detectar intenção e tipo de operação
    const intencao = this.detectarIntencao(lower);
    const agentesNecessarios = this.selecionarAgentes(intencao);

    // Log da operação
    const operacao = {
      id: Date.now(),
      entrada: entrada,
      intencao: intencao,
      agentes: agentesNecessarios,
      status: 'processando',
      resultados: [],
      timestamp: new Date().toISOString()
    };
    this.historico.push(operacao);

    // Executar com cada agente relevante
    const respostas = [];
    for (const tipoAgente of agentesNecessarios) {
      const resultado = await this.executarComoAgente(tipoAgente, entrada, intencao);
      respostas.push(resultado);
      operacao.resultados.push(resultado);
    }

    operacao.status = 'concluido';
    return this.formatarResposta(respostas, intencao);
  },

  // ===== DETECTAR INTENÇÃO =====
  detectarIntencao(texto) {
    const padroes = {
      sistema: {
        palavras: ['processo', 'serviço', 'cpu', 'memória', 'ram', 'disco', 'rede', 'ip', 'ping', 'status', 'uptime', 'hostname', 'usuário'],
        acao: 'info_sistema'
      },
      arquivos: {
        palavras: ['arquivo', 'pasta', 'diretório', 'listar', 'criar', 'deletar', 'mover', 'copiar', 'ler', 'escrever', 'editar', 'buscar arquivo'],
        acao: 'gerenciar_arquivos'
      },
      codigo: {
        palavras: ['código', 'script', 'programar', 'compilar', 'executar', 'debugar', 'função', 'classe', 'modulo', 'npm', 'pip', 'git'],
        acao: 'desenvolvimento'
      },
      rede: {
        palavras: ['internet', 'conexão', 'download', 'upload', 'http', 'api', 'servidor', 'porta', 'firewall', 'dns', 'proxy'],
        acao: 'rede'
      },
      seguranca: {
        palavras: ['senha', 'token', 'permissão', 'acesso', 'firewall', 'antivírus', 'backup', 'criptografar', 'proteger', 'vulnerabilidade'],
        acao: 'seguranca'
      },
      driver: {
        palavras: ['driver', 'dispositivo', 'hardware', 'gpu', 'placa', 'usb', 'bluetooth', 'wifi', 'som', ' vídeo'],
        acao: 'hardware'
      },
      producao: {
        palavras: ['deploy', 'build', 'compilar', 'produção', 'publicar', 'hospedar', 'domínio', 'ssl', 'nginx', 'docker', 'container'],
        acao: 'producao'
      },
      dados: {
        palavras: ['banco', 'database', 'sql', 'csv', 'json', 'xml', 'planilha', 'tabela', 'query', 'dados', 'importar', 'exportar'],
        acao: 'dados'
      },
      automacao: {
        palavras: ['automatizar', 'agendar', 'cron', 'rotina', 'tarefa', 'batch', 'script', 'workflow', 'pipeline'],
        acao: 'automacao'
      },
      janelas: {
        palavras: ['janela', 'programa', 'abrir', 'fechar', 'app', 'aplicativo', 'software', 'instalar', 'desinstalar', 'powershell', 'cmd'],
        acao: 'sistema_windows'
      }
    };

    const matches = [];
    for (const [categoria, config] of Object.entries(padroes)) {
      for (const palavra of config.palavras) {
        if (texto.includes(palavra)) {
          matches.push({ categoria, acao: config.acao, palavra });
          break;
        }
      }
    }

    if (matches.length === 0) {
      return { categoria: 'geral', acao: 'consulta', matches: [] };
    }

    return {
      categoria: matches[0].categoria,
      acao: matches[0].acao,
      matches: matches
    };
  },

  // ===== SELECIONAR AGENTES =====
  selecionarAgentes(intencao) {
    const mapa = {
      info_sistema: ['analyst', 'guardian', 'healer'],
      gerenciar_arquivos: ['coder', 'architect', 'guardian'],
      desenvolvimento: ['coder', 'engineer', 'architect'],
      rede: ['guardian', 'engineer', 'analyst'],
      seguranca: ['guardian', 'enigma', 'analyst'],
      hardware: ['engineer', 'healer', 'transmuter'],
      producao: ['engineer', 'architect', 'coder'],
      dados: ['analyst', 'researcher', 'weaver'],
      automacao: ['coder', 'engineer', 'transmuter'],
      sistema_windows: ['coder', 'engineer', 'guardian'],
      consulta: ['mystic', 'messenger', 'researcher']
    };

    return mapa[intencao.acao] || ['mystic', 'coder', 'engineer'];
  },

  // ===== EXECUTAR COMO AGENTE =====
  async executarComoAgente(tipoAgente, entrada, intencao) {
    const perfil = ParallelEngine.profiles[tipoAgente];
    if (!perfil) return null;

    // Traduzir entrada em comando executável
    const comando = this.traduzirComando(entrada, intencao, tipoAgente);

    // Executar via SystemAdmin ou RemoteAdmin
    let resultadoExecucao = null;
    if (typeof SystemAdmin !== 'undefined' && SystemAdmin.connected) {
      resultadoExecucao = await SystemAdmin.execute(comando.comando, {
        shell: comando.shell || 'bash',
        mode: comando.mode || 'user'
      });
    } else if (typeof RemoteAdmin !== 'undefined' && RemoteAdmin.connected) {
      resultadoExecucao = await RemoteAdmin.execute(comando.comando, {
        shell: comando.shell || 'bash',
        mode: comando.mode || 'user'
      });
    }

    // Interpretar resultado com personalidade do agente
    const interpretacao = this.interpretarResultado(
      tipoAgente,
      comando,
      resultadoExecucao,
      intencao
    );

    return {
      agente: perfil.nome,
      icone: this.getIcon(tipoAgente),
      tipo: tipoAgente,
      comando: comando.comando,
      shell: comando.shell,
      resultado: resultadoExecucao,
      interpretacao: interpretacao,
      sugestao: this.sugerirProximo(tipoAgente, resultadoExecucao, intencao)
    };
  },

  // ===== TRADUZIR LINGUAGEM NATURAL → COMANDO =====
  traduzirComando(entrada, intencao, tipoAgente) {
    const lower = entrada.toLowerCase();

    // === SISTEMA ===
    if (lower.includes('processo') || lower.includes('process')) {
      const isWindows = navigator.platform.includes('Win');
      return {
        comando: isWindows ? 'Get-Process | Sort-Object CPU -Descending | Select-Object -First 20 Name, CPU, WorkingSet' : 'ps aux --sort=-%cpu | head -20',
        shell: isWindows ? 'powershell' : 'bash',
        descricao: 'Listar processos por uso de CPU'
      };
    }

    if (lower.includes('memória') || lower.includes('ram') || lower.includes('memory')) {
      const isWindows = navigator.platform.includes('Win');
      return {
        comando: isWindows ? 'Get-CimInstance Win32_OperatingSystem | Select-Object TotalVisibleMemorySize, FreePhysicalMemory, @{N="UsedMemory";E={$_.TotalVisibleMemorySize - $_.FreePhysicalMemory}}' : 'free -h',
        shell: isWindows ? 'powershell' : 'bash',
        descricao: 'Status de memória'
      };
    }

    if (lower.includes('disco') || lower.includes('disk') || lower.includes('espaço')) {
      const isWindows = navigator.platform.includes('Win');
      return {
        comando: isWindows ? 'Get-PSDrive -PSProvider FileSystem | Select-Object Name, Used, Free, @{N="Total";E={$_.Used+$_.Free}}' : 'df -h',
        shell: isWindows ? 'powershell' : 'bash',
        descricao: 'Espaço em disco'
      };
    }

    if (lower.includes('rede') || lower.includes('ip') || lower.includes('conexão')) {
      const isWindows = navigator.platform.includes('Win');
      return {
        comando: isWindows ? 'Get-NetIPAddress | Where-Object {$_.AddressFamily -eq "IPv4"} | Select-Object IPAddress, InterfaceAlias' : 'ip addr show | grep "inet "',
        shell: isWindows ? 'powershell' : 'bash',
        descricao: 'Configuração de rede'
      };
    }

    if (lower.includes('uptime') || lower.includes('ligado') || lower.includes('tempo ligado')) {
      const isWindows = navigator.platform.includes('Win');
      return {
        comando: isWindows ? '(Get-CimInstance Win32_OperatingSystem).LastBootUpTime' : 'uptime -p',
        shell: isWindows ? 'powershell' : 'bash',
        descricao: 'Tempo de atividade'
      };
    }

    // === ARQUIVOS ===
    if (lower.includes('listar') || lower.includes('arquivo') && lower.includes('pasta')) {
      const caminho = this.extrairCaminho(entrada) || '.';
      const isWindows = navigator.platform.includes('Win');
      return {
        comando: isWindows ? `Get-ChildItem -Path "${caminho}" -Force | Select-Object Name, Length, LastWriteTime` : `ls -la "${caminho}"`,
        shell: isWindows ? 'powershell' : 'bash',
        descricao: `Listar arquivos em ${caminho}`
      };
    }

    if (lower.includes('criar pasta') || lower.includes('mkdir') || lower.includes('criar diretório')) {
      const caminho = this.extrairCaminho(entrada) || 'nova_pasta';
      return {
        comando: `mkdir -p "${caminho}"`,
        shell: 'bash',
        descricao: `Criar diretório ${caminho}`
      };
    }

    if (lower.includes('ler') && (lower.includes('arquivo') || lower.includes('file'))) {
      const caminho = this.extrairCaminho(entrada);
      if (caminho) {
        const isWindows = navigator.platform.includes('Win');
        return {
          comando: isWindows ? `Get-Content -Path "${caminho}" -TotalCount 50` : `head -50 "${caminho}"`,
          shell: isWindows ? 'powershell' : 'bash',
          descricao: `Ler arquivo ${caminho}`
        };
      }
    }

    if (lower.includes('buscar') && lower.includes('arquivo')) {
      const termo = entrada.match(/(?:buscar|procurar)\s+(?:arquivo\s+)?(.+?)(?:\s+em\s+(.+))?$/i);
      if (termo) {
        const isWindows = navigator.platform.includes('Win');
        const busca = termo[1];
        const dir = termo[2] || '.';
        return {
          comando: isWindows ? `Get-ChildItem -Path "${dir}" -Recurse -Filter "*${busca}*" | Select-Object FullName` : `find "${dir}" -name "*${busca}*" -type f`,
          shell: isWindows ? 'powershell' : 'bash',
          descricao: `Buscar arquivos com "${busca}"`
        };
      }
    }

    if (lower.includes('deletar') || lower.includes('remover') || lower.includes('excluir')) {
      const caminho = this.extrairCaminho(entrada);
      if (caminho) {
        return {
          comando: `rm -rf "${caminho}"`,
          shell: 'bash',
          mode: 'root',
          descricao: `⚠️ Deletar ${caminho}`,
          perigoso: true
        };
      }
    }

    // === CÓDIGO / GIT ===
    if (lower.includes('git status') || lower.includes('status do git') || lower.includes('status do repositório')) {
      return { comando: 'git status', shell: 'bash', descricao: 'Status do repositório Git' };
    }

    if (lower.includes('git log') || lower.includes('commit') && lower.includes('histórico')) {
      return { comando: 'git log --oneline -20', shell: 'bash', descricao: 'Últimos 20 commits' };
    }

    if (lower.includes('npm') || lower.includes('node')) {
      if (lower.includes('instalar') || lower.includes('install')) {
        const pkg = entrada.match(/(?:npm\s+install|instalar)\s+(\S+)/i);
        return {
          comando: `npm install ${pkg ? pkg[1] : ''}`,
          shell: 'bash',
          descricao: `Instalar pacote npm`
        };
      }
      if (lower.includes('versão') || lower.includes('version')) {
        return { comando: 'node --version && npm --version', shell: 'bash', descricao: 'Versões Node/NPM' };
      }
    }

    if (lower.includes('python') || lower.includes('pip')) {
      if (lower.includes('versão') || lower.includes('version')) {
        return { comando: 'python3 --version && pip3 --version', shell: 'bash', descricao: 'Versões Python/pip' };
      }
    }

    // === REDE ===
    if (lower.includes('ping')) {
      const host = entrada.match(/ping\s+(\S+)/i);
      return {
        comando: `ping -c 4 ${host ? host[1] : '8.8.8.8'}`,
        shell: 'bash',
        descricao: `Ping ${host ? host[1] : 'Google DNS'}`
      };
    }

    if (lower.includes('download') || lower.includes('baixar')) {
      const url = entrada.match(/(https?:\/\/\S+)/i);
      if (url) {
        return {
          comando: `curl -L -O "${url[1]}"`,
          shell: 'bash',
          descricao: `Download ${url[1]}`
        };
      }
    }

    if (lower.includes('porta') || lower.includes('port')) {
      const port = entrada.match(/(?:porta|port)\s+(\d+)/i);
      if (port) {
        return {
          comando: `netstat -tlnp 2>/dev/null | grep :${port[1]} || ss -tlnp | grep :${port[1]}`,
          shell: 'bash',
          descricao: `Verificar porta ${port[1]}`
        };
      }
      return {
        comando: 'netstat -tlnp 2>/dev/null | head -20 || ss -tlnp | head -20',
        shell: 'bash',
        descricao: 'Portas abertas'
      };
    }

    // === PRODUÇÃO / DOCKER ===
    if (lower.includes('docker')) {
      if (lower.includes('container') || lower.includes('lista')) {
        return { comando: 'docker ps -a', shell: 'bash', descricao: 'Containers Docker' };
      }
      if (lower.includes('imagem')) {
        return { comando: 'docker images', shell: 'bash', descricao: 'Imagens Docker' };
      }
      if (lower.includes('log')) {
        return { comando: 'docker logs --tail 50 $(docker ps -q | head -1)', shell: 'bash', descricao: 'Logs do último container' };
      }
      return { comando: 'docker info --format "{{.ServerVersion}}" && docker ps -a', shell: 'bash', descricao: 'Status Docker' };
    }

    if (lower.includes('nginx')) {
      return { comando: 'nginx -t 2>&1 && systemctl status nginx 2>/dev/null || service nginx status', shell: 'bash', mode: 'root', descricao: 'Status Nginx' };
    }

    // === SEGURANÇA ===
    if (lower.includes('firewall') || lower.includes('iptables')) {
      return { comando: 'iptables -L -n 2>/dev/null || ufw status', shell: 'bash', mode: 'root', descricao: 'Regras de firewall' };
    }

    if (lower.includes('log') && (lower.includes('sistema') || lower.includes('system'))) {
      const isWindows = navigator.platform.includes('Win');
      return {
        comando: isWindows ? 'Get-EventLog -LogName System -Newest 20 | Select-Object TimeGenerated, EntryType, Source, Message' : 'journalctl -n 30 --no-pager',
        shell: isWindows ? 'powershell' : 'bash',
        descricao: 'Logs do sistema'
      };
    }

    if (lower.includes('usuário') || lower.includes('user') || lower.includes('quem')) {
      const isWindows = navigator.platform.includes('Win');
      return {
        comando: isWindows ? 'whoami; net user' : 'whoami; w',
        shell: isWindows ? 'powershell' : 'bash',
        descricao: 'Usuário atual e sessões'
      };
    }

    // === AUTOMAÇÃO ===
    if (lower.includes('cron') || lower.includes('agendar') || lower.includes('tarefa')) {
      return { comando: 'crontab -l 2>/dev/null || echo "Nenhum cron configurado"', shell: 'bash', descricao: 'Tarefas agendadas' };
    }

    // === DRIVER / HARDWARE ===
    if (lower.includes('driver') || lower.includes('hardware') || lower.includes('dispositivo')) {
      const isWindows = navigator.platform.includes('Win');
      return {
        comando: isWindows ? 'Get-WmiObject Win32_PnPEntity | Select-Object Name, DeviceID | Select-Object -First 30' : 'lshw -short 2>/dev/null || lspci',
        shell: isWindows ? 'powershell' : 'bash',
        descricao: 'Dispositivos de hardware'
      };
    }

    if (lower.includes('gpu') || lower.includes('placa de vídeo')) {
      const isWindows = navigator.platform.includes('Win');
      return {
        comando: isWindows ? 'Get-WmiObject Win32_VideoController | Select-Object Name, AdapterRAM, DriverVersion' : 'lspci | grep -i vga; nvidia-smi 2>/dev/null',
        shell: isWindows ? 'powershell' : 'bash',
        descricao: 'Informações da GPU'
      };
    }

    // === DADOS / BANCO ===
    if (lower.includes('banco') || lower.includes('database') || lower.includes('sql')) {
      return { 
        comando: 'which mysql sqlite3 psql 2>/dev/null; echo "---"; sqlite3 --version 2>/dev/null || echo "SQLite não encontrado"',
        shell: 'bash',
        descricao: 'Bancos de dados disponíveis'
      };
    }

    // === FALLBACK: COMANDO DIRETO ===
    // Se parece um comando direto, executar como está
    if (this.eComandoDireto(entrada)) {
      return {
        comando: entrada,
        shell: this.detectarShell(entrada),
        descricao: 'Comando direto'
      };
    }

    // Consulta geral
    return {
      comando: 'uname -a && whoami && date',
      shell: 'bash',
      descricao: 'Informações gerais do sistema'
    };
  },

  // Extrair caminho de arquivo da entrada
  extrairCaminho(entrada) {
    // Windows paths
    const winPath = entrada.match(/[A-Z]:\\[^\s"']+|\/mnt\/[^\s"']+|~\/[^\s"']+|\.\/[^\s"']+|\/[^\s"']+/i);
    if (winPath) return winPath[0].replace(/\\/g, '/');
    
    // After prepositions
    const afterPrep = entrada.match(/(?:em|no|na|de|do|da|para)\s+([^\s,]+)/i);
    if (afterPrep) return afterPrep[1];
    
    return null;
  },

  // Verificar se é comando direto
  eComandoDireto(entrada) {
    const comuns = ['ls', 'cd', 'cat', 'grep', 'find', 'mkdir', 'rm', 'cp', 'mv', 'chmod', 'chown',
                     'ps', 'top', 'kill', 'df', 'du', 'tar', 'zip', 'unzip', 'wget', 'curl',
                     'ssh', 'scp', 'rsync', 'git', 'npm', 'pip', 'docker', 'systemctl', 'service',
                     'Get-', 'Set-', 'New-', 'Remove-', 'Start-', 'Stop-'];
    return comuns.some(c => entrada.startsWith(c));
  },

  // Detectar shell pelo comando
  detectarShell(comando) {
    if (comando.startsWith('Get-') || comando.startsWith('Set-') || comando.includes('| Select-Object')) {
      return 'powershell';
    }
    if (comando.startsWith('cmd') || comando.includes('dir ') || comando.includes('type ')) {
      return 'cmd';
    }
    return 'bash';
  },

  // ===== INTERPRETAR RESULTADO =====
  interpretarResultado(tipoAgente, comando, resultado, intencao) {
    if (!resultado) {
      return `${this.getIcon(tipoAgente)} Sem conexão com o sistema. Verifique se o servidor local ou remoto está ativo.`;
    }

    if (!resultado.success && resultado.output?.includes('Não conectado')) {
      return `${this.getIcon(tipoAgente)} Não foi possível executar: sistema não conectado. Use \`remote status\` ou \`sysadmin connect\`.`;
    }

    const perfil = ParallelEngine.profiles[tipoAgente];
    const saida = resultado.output || '(sem output)';
    const exitCode = resultado.exitCode;
    const elapsed = resultado.elapsed || '?';

    // Interpretação com personalidade do agente
    const interpretacoes = {
      analyst: () => {
        if (saida.length > 500) return `📊 Análise concluída (${saida.length} chars, ${elapsed}). Dados coletados com sucesso.`;
        if (exitCode !== 0) return `📊 Execução com código ${exitCode}. Tempo: ${elapsed}. Output limitado.`;
        return `📊 Dados processados em ${elapsed}. Métricas coletadas.`;
      },
      coder: () => {
        if (exitCode === 0) return `🤖 Executado em ${elapsed}. Código funcionou.`;
        return `🤖 Erro (exit ${elapsed}). Precisa de correção.`;
      },
      guardian: () => {
        if (comando.perigoso) return `🛡️ Comando destrutivo executado. Risco: ALTO. Tempo: ${elapsed}.`;
        if (exitCode === 0) return `🛡️ Operação segura concluída em ${elapsed}.`;
        return `🛡️ Operação falhou (exit ${exitCode}). Sistema protegido.`;
      },
      engineer: () => {
        return `⚙️ Executado. ${elapsed}. Exit: ${exitCode}.`;
      },
      healer: () => {
        if (exitCode === 0) return `🌿 Sistema saudável. Operação bem-sucedida em ${elapsed}.`;
        return `🌿 Anomalia detectada (exit ${exitCode}). Diagnóstico necessário.`;
      }
    };

    const interpretar = interpretacoes[tipoAgente] || (() => `${perfil.icon} ${perfil.nome}: Operação concluída.`);
    return interpretar();
  },

  // ===== SUGERIR PRÓXIMO PASSO =====
  sugerirProximo(tipoAgente, resultado, intencao) {
    if (!resultado || !resultado.success) return null;

    const saida = resultado.output || '';
    const sugestoes = [];

    // Sugestões baseadas no tipo de resultado
    if (intencao.acao === 'info_sistema') {
      if (saida.includes('high') || saida.includes('90%') || saida.includes('critic')) {
        sugestoes.push('⚠️ Recursos críticos detectados. Quer investigar processos específicos?');
      }
      sugestoes.push('📊 Quer detalhar algum aspecto específico? (memória, disco, rede, processos)');
    }

    if (intencao.acao === 'gerenciar_arquivos') {
      sugestoes.push('📁 Quer ler, copiar ou modificar algum arquivo específico?');
      sugestoes.push('🔍 Quer buscar por conteúdo dentro dos arquivos?');
    }

    if (intencao.acao === 'desenvolvimento') {
      sugestoes.push('🔧 Quer executar testes ou fazer build?');
      sugestoes.push('📦 Quer gerenciar dependências?');
    }

    if (intencao.acao === 'rede') {
      sugestoes.push('🌐 Quer testar conectividade ou verificar portas?');
      sugestoes.push('🔒 Quer verificar configurações de firewall?');
    }

    // Sempre oferecer opção de aprofundar
    if (sugestoes.length === 0) {
      sugestoes.push('🔮 Quer aprofundar ou executar outro comando?');
    }

    return sugestoes[0];
  },

  // ===== FORMATAR RESPOSTA =====
  formatarResposta(respostas, intencao) {
    if (respostas.length === 0) {
      return '🔮 Crystal Ball: Nenhum agente conseguiu processar a solicitação.';
    }

    let output = `🔮 **Crystal Ball — ${intencao.categoria.toUpperCase()}**\n\n`;

    for (const r of respostas) {
      if (!r) continue;

      output += `${r.icone} **${r.agente}**\n`;
      output += `📋 Comando: \`${r.comando}\`\n`;

      if (r.resultado) {
        // Truncar output longo
        let saida = r.resultado.output || '(sem output)';
        if (saida.length > 500) {
          saida = saida.substring(0, 500) + '\n... [output truncado]';
        }
        output += `📤 Resultado:\n\`\`\`\n${saida}\n\`\`\`\n`;
        output += `⏱️ ${r.resultado.elapsed || '?'} | Exit: ${r.resultado.exitCode || 0}\n`;
      } else {
        output += `⚠️ Não conectado ao sistema\n`;
      }

      output += `💬 ${r.interpretacao}\n`;

      if (r.sugestao) {
        output += `💡 ${r.sugestao}\n`;
      }

      output += '\n';
    }

    return output;
  },

  // ===== HELPERS =====
  getIcon(tipo) {
    const icons = {
      coder: '🤖', researcher: '📚', alchemist: '⚗️', guardian: '🛡️',
      mystic: '✨', messenger: '🌈', healer: '🌿', transmuter: '🔄',
      weaver: '🕸️', architect: '🏛️', diviner: '🔮', engineer: '⚙️',
      analyst: '📐', combinator: '🎲', enigma: '🗝️'
    };
    return icons[tipo] || '❓';
  },

  // Status
  status() {
    return {
      ativo: this.ativo,
      sessao: this.sessaoId,
      operacoes: this.historico.length,
      ultimaOperacao: this.historico.length > 0 ? this.historico[this.historico.length - 1] : null
    };
  }
};
