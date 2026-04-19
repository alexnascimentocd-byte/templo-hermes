# 🌍 Admin Remoto — Guia de Configuração

## Visão Geral

3 modos de operação:

| Modo | Quando usar | Requisitos |
|------|-------------|------------|
| 📡 **Local** | Mesma rede WiFi | Servidor rodando na porta 8081 |
| 🌐 **Remote** | Longe de casa, PC ligado | GitHub Token + Agent rodando |
| ☁️ **Cloud** | Longe de casa, PC desligado | GitHub Token + Actions |

---

## 📡 Modo Local (já configurado)

Quando você tá em casa, na mesma rede WiFi:

1. Inicie o servidor: `server\start-server.bat`
2. O Templo detecta automaticamente em `localhost:8081`

---

## 🌐 Modo Remote (GitHub Issues)

Quando você tá longe, mas o PC tá ligado:

### Passo 1: Criar Token GitHub

1. Vá em: https://github.com/settings/tokens
2. Clique "Generate new token (classic)"
3. Marque o escopo: **repo** (acesso completo)
4. Copie o token (começa com `ghp_`)

### Passo 2: Configurar o Agent (no PC)

```batch
cd remote
node github-agent.js config ghp_SEU_TOKEN alexnascimentocd-byte templo-hermes
```

Ou edite `remote/agent-config.json`:
```json
{
  "token": "ghp_xxxxx",
  "owner": "alexnascimentocd-byte",
  "repo": "templo-hermes",
  "pollInterval": 15000
}
```

### Passo 3: Iniciar o Agent

```batch
remote\start-agent.bat
```

O agent fica pollando o GitHub a cada 15 segundos por novos comandos.

### Passo 4: Configurar o Templo (web)

No console do Templo:
```
remote config ghp_SEU_TOKEN alexnascimentocd-byte templo-hermes
```

Ou pelo painel: Menu → 🌍 Admin Remoto → Configuração GitHub

### Como Funciona

1. Você executa `remote exec whoami` no Templo
2. Templo cria uma Issue no GitHub com o comando
3. O agent no seu PC detecta a Issue e executa o comando
4. O resultado é postado como comentário na Issue
5. Templo mostra o resultado

---

## ☁️ Modo Cloud (GitHub Actions)

Quando o PC tá desligado, os comandos rodam nos runners do GitHub (Ubuntu Linux):

### Configurar

1. Crie os labels no repo (uma vez só):
   - Vá em: https://github.com/alexnascimentocd-byte/templo-hermes/actions
   - Rode o workflow "🏷️ Setup Labels"

2. No console do Templo:
   ```
   remote config ghp_SEU_TOKEN alexnascimentocd-byte templo-hermes
   remote mode github-cloud
   ```

3. Execute comandos:
   ```
   remote cloud whoami
   remote cloud df -h
   remote cloud uname -a
   ```

### Limitações

- Roda em **Ubuntu Linux** (não Windows)
- Comandos como `powershell`, `cmd` não funcionam
- Tempo de execução: ~30-60s (inclui boot do runner)
- Gratuito: 2000 minutos/mês (GitHub Free)

---

## 🎛️ Comandos do Console

```
remote status          — Ver status da conexão
remote connect <url>   — Conectar localmente
remote config <t> <o> <r> — Configurar GitHub
remote mode <modo>     — Trocar modo (local/remote/github-cloud)
remote exec <cmd>      — Executar comando remoto
remote cloud <cmd>     — Executar no GitHub Actions
remote poll [seg]      — Iniciar polling de resultados
remote history         — Ver histórico de execuções
```

---

## 🔒 Segurança

- O token fica salvo no **localStorage** do navegador (criptografado pelo browser)
- O agent usa o mesmo token, salvo em `agent-config.json`
- **Não compartilhe** o token — ele dá acesso total ao seu GitHub
- Comandos perigosos (`rm -rf /`, `format`, etc.) são **bloqueados**
- Para revogar: https://github.com/settings/tokens

---

## 🛠️ Troubleshooting

**"Não conectado"**
- Verifique se o agent tá rodando (`start-agent.bat`)
- Confira o token e o nome do repo
- Teste: `curl http://localhost:8082/health`

**"Comando pendente" por muito tempo**
- Verifique se o agent tá rodando e pollando
- Confira se a Issue foi criada no GitHub (aba Issues)
- O agent loga no terminal quando executa comandos

**Cloud não executa**
- Verifique se o workflow tá habilitado (Actions → Allow workflows)
- Rode o "Setup Labels" primeiro
- Confira se a Issue tem o label "execute"

---

## 📁 Arquivos

```
.github/workflows/
  remote-executor.yml  — Executa comandos via Actions
  remote-status.yml    — Coleta status do sistema
  setup-labels.yml     — Cria labels necessários

js/
  remote-admin.js      — Módulo de conexão remota (web)

remote/
  github-agent.js      — Agente local (roda no PC)
  start-agent.bat      — Script de inicialização
  agent-config.json    — Configuração (criado após setup)
```
