# 🔒 Política de Segurança

## Proteções Ativas

- ✅ **Secret Scanning** — Detecta tokens/chaves em commits
- ✅ **Push Protection** — Bloqueia push com secrets
- ✅ **Branch Protection** — Protege branch main
- ✅ **Dependabot** — Alertas de vulnerabilidades
- ✅ **CODEOWNERS** — Arquivos críticos requerem review

## Reportar Vulnerabilidades

Se encontrar uma vulnerabilidade, **NÃO** abra uma Issue pública.
Contate: alexnascimentocd-byte via DM

## Tokens e Secrets

- Tokens NUNCA devem ser commitados no repositório
- Use GitHub Secrets para CI/CD
- O `.gitignore` protege `agent-config.json` e `config.local.js`
