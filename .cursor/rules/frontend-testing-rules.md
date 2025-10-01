# Regras de Teste Frontend e Comunicação com Usuário

## 🎯 Princípios Fundamentais

### **1. Prioridade Absoluta: MCP Chrome DevTools**
- **SEMPRE** usar MCP Chrome DevTools para testes de frontend
- **NUNCA** executar `pnpm build` ou comandos de build sem permissão explícita do usuário
- **SEMPRE** iniciar com `pnpm dev` para desenvolvimento e usar Chrome DevTools para testes

### **2. Protocolo de Fallback**
Quando MCP Chrome DevTools não estiver disponível:

1. **Detectar Indisponibilidade**: Identificar quando Chrome DevTools não responde ou não está acessível
2. **Comunicar ao Usuário**: Informar claramente sobre a indisponibilidade
3. **Apresentar Alternativas**: Listar métodos alternativos disponíveis
4. **Solicitar Decisão**: Pedir ao usuário para escolher entre:
   - Usar método alternativo disponível
   - Abortar a tarefa atual
   - Aguardar disponibilidade do Chrome DevTools

### **3. Métodos Alternativos Aceitáveis**
- **Teste Manual**: Instruções detalhadas para teste manual pelo usuário
- **Documentação**: Criar guias de teste passo a passo
- **Verificação de Código**: Análise estática do código implementado
- **Outros MCPs**: Se disponíveis e apropriados para a tarefa

## 📋 Regras Específicas

### **Regra 1: Teste Frontend**
```
ANTES de qualquer teste de frontend:
1. Verificar se MCP Chrome DevTools está disponível
2. Se SIM: Usar Chrome DevTools para navegação e testes
3. Se NÃO: Seguir protocolo de fallback
```

### **Regra 2: Build e Deploy**
```
NUNCA executar comandos de build sem permissão:
- pnpm build
- npm run build
- next build
- Qualquer comando de produção

SEMPRE solicitar permissão explícita antes de executar
```

### **Regra 3: Comunicação de Problemas**
```
Quando Chrome DevTools não estiver disponível:
1. Informar: "Chrome DevTools não está disponível no momento"
2. Explicar: Por que isso é importante para a tarefa
3. Apresentar: Alternativas disponíveis
4. Solicitar: Decisão do usuário sobre como proceder
```

### **Regra 4: Documentação de Testes**
```
Quando não puder testar diretamente:
1. Criar documentação detalhada de como testar
2. Incluir passos específicos e verificações
3. Explicar o que deve ser observado
4. Fornecer critérios de sucesso/falha
```

## 🔄 Fluxo de Decisão

### **Cenário 1: Chrome DevTools Disponível**
```
1. Usar Chrome DevTools para testes
2. Navegar para a página
3. Executar testes interativos
4. Reportar resultados
```

### **Cenário 2: Chrome DevTools Indisponível**
```
1. Detectar indisponibilidade
2. Informar ao usuário:
   "Chrome DevTools não está disponível no momento. 
   Para testar a funcionalidade de frontend, preciso de sua decisão:"
   
3. Apresentar opções:
   a) Criar guia de teste manual detalhado
   b) Analisar código implementado estaticamente
   c) Aguardar disponibilidade do Chrome DevTools
   d) Abortar a tarefa atual
   
4. Aguardar decisão do usuário
5. Executar conforme escolha
```

## 📝 Template de Comunicação

### **Template para Indisponibilidade**
```
⚠️ Chrome DevTools Indisponível

O MCP Chrome DevTools não está respondendo no momento, 
o que impede o teste direto da funcionalidade frontend.

Opções disponíveis:
1. 📋 Criar guia de teste manual detalhado
2. 🔍 Análise estática do código implementado  
3. ⏳ Aguardar disponibilidade do Chrome DevTools
4. ❌ Abortar a tarefa atual

Por favor, escolha como deseja proceder.
```

### **Template para Permissão de Build**
```
🔨 Solicitação de Permissão para Build

Para testar a funcionalidade implementada, preciso executar:
`pnpm build`

Posso prosseguir com o build? (S/N)
```

## 🎯 Aplicação das Regras

### **Em Todas as Interações**
- Verificar disponibilidade de ferramentas antes de usar
- Comunicar problemas de forma clara e proativa
- Sempre oferecer alternativas quando possível
- Respeitar a autonomia do usuário nas decisões

### **Em Desenvolvimento Frontend**
- Priorizar Chrome DevTools para testes
- Documentar funcionalidades quando não puder testar
- Criar guias detalhados para teste manual
- Manter foco na experiência do usuário

### **Em Comunicação**
- Ser transparente sobre limitações
- Explicar o impacto das limitações
- Oferecer soluções práticas
- Manter tom profissional e útil

## ✅ Checklist de Conformidade

Antes de qualquer ação de teste frontend:
- [ ] Chrome DevTools está disponível?
- [ ] Se não, comuniquei ao usuário?
- [ ] Apresentei alternativas?
- [ ] Aguardei decisão do usuário?
- [ ] Executei conforme escolha?

Antes de qualquer build:
- [ ] Solicitei permissão explícita?
- [ ] Expliquei o motivo do build?
- [ ] Aguardei confirmação do usuário?

## 🔄 Revisão e Atualização

Estas regras devem ser:
- Revisadas regularmente
- Atualizadas conforme novas ferramentas disponíveis
- Aplicadas consistentemente em todas as interações
- Comunicadas claramente ao usuário quando necessário

---

**Lembrete**: Estas regras garantem que sempre mantenha a melhor prática de teste frontend e comunicação transparente com o usuário, respeitando suas preferências e limitações técnicas.
