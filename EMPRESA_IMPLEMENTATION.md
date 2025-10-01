# 🏢 Implementação de Dados da Empresa - PostgreSQL

## 🎯 **Objetivo**
Implementar persistência dos dados da empresa (razão social, CNPJ, URL do logo) em uma tabela separada no PostgreSQL, com relacionamento com os relatórios.

## 🏗️ **Arquitetura Implementada**

### **1. Schema do Banco (Prisma)**
```prisma
model Empresa {
  id                String   @id @default(cuid())
  razaoSocial       String
  cnpj              String   @unique
  logoUrl           String?
  dataCriacao       DateTime @default(now())
  dataAtualizacao   DateTime @updatedAt
  
  // Relacionamento com relatórios
  relatorios        RelatorioModelo[]
  
  @@map("empresas")
}

model RelatorioModelo {
  id                String   @id @default(cuid())
  nome              String
  contrato          String
  valorInicial      String
  rq                String
  os                String
  pedido            String
  descricaoEscopo   String
  imagemFundoUrl    String?
  dataCriacao       DateTime @default(now())
  dataUltimaUso     DateTime @default(now())
  usoCount          Int      @default(0)
  
  // Relacionamento com empresa
  empresaId         String
  empresa           Empresa  @relation(fields: [empresaId], references: [id], onDelete: Cascade)
  
  // Relacionamento com itens técnicos
  itensRelatorio    ItemRelatorio[]
  
  @@map("relatorio_modelos")
}
```

### **2. Camadas da Aplicação**

#### **📁 Backend (API)**
- **`src/lib/empresa-database.ts`** - Serviço de banco de dados para empresas
- **`src/app/api/empresas/route.ts`** - CRUD principal de empresas
- **`src/app/api/empresas/[id]/route.ts`** - Operações por ID
- **`src/app/api/empresas/inicializar/route.ts`** - Dados padrão da empresa

#### **📁 Integração**
- **`src/lib/relatorios-database.ts`** - Atualizado para incluir empresaId
- **Scripts de inicialização** - Atualizados para criar empresa padrão

### **3. Endpoints da API**

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/empresas` | Listar todas as empresas |
| `GET` | `/api/empresas?cnpj=123` | Buscar empresa por CNPJ |
| `POST` | `/api/empresas` | Criar nova empresa |
| `GET` | `/api/empresas/[id]` | Buscar empresa por ID |
| `PUT` | `/api/empresas/[id]` | Atualizar empresa |
| `DELETE` | `/api/empresas/[id]` | Remover empresa |
| `POST` | `/api/empresas/inicializar` | Inicializar empresa padrão |

## 🚀 **Como Usar**

### **1. Configuração do Ambiente**
```bash
# 1. Instalar dependências
pnpm install

# 2. Configurar variáveis de ambiente
cp env.example .env
# Editar .env com suas configurações do PostgreSQL

# 3. Executar migração
npx prisma migrate dev --name add-empresa-table

# 4. Gerar cliente Prisma
npx prisma generate

# 5. Inicializar dados padrão
curl -X POST http://localhost:3000/api/empresas/inicializar
curl -X POST http://localhost:3000/api/relatorios/inicializar
```

### **2. Desenvolvimento**
```bash
# Iniciar servidor de desenvolvimento
pnpm dev

# Testar endpoints
curl http://localhost:3000/api/empresas
```

## 📊 **Funcionalidades Implementadas**

### **✅ Operações CRUD Completas**
- **Create**: Criar novas empresas
- **Read**: Listar, buscar por ID e CNPJ
- **Update**: Atualizar dados da empresa
- **Delete**: Remover empresas

### **✅ Funcionalidades Avançadas**
- **Busca por CNPJ**: Pesquisar empresa específica
- **Relacionamentos**: Empresa vinculada aos relatórios
- **Dados Padrão**: Empresa padrão criada automaticamente
- **Validação**: CNPJ único, campos obrigatórios

### **✅ Dados Padrão**
- **Empresa Padrão**: "Geraldinho Manutenções"
- **CNPJ**: "00.000.000/0000-00"
- **Logo**: "/relatorio-tecnico/logo.png"
- **Relatórios**: Vinculados à empresa padrão

## 🛡️ **Validação e Segurança**

### **Validação com Zod**
```typescript
const criarEmpresaSchema = z.object({
  razaoSocial: z.string().min(1, 'Razão social é obrigatória'),
  cnpj: z.string().min(1, 'CNPJ é obrigatório'),
  logoUrl: z.string().optional()
});
```

### **Tratamento de Erros**
- **Validação de entrada**: Dados obrigatórios
- **CNPJ único**: Prevenção de duplicatas
- **Relacionamentos**: Cascade delete
- **Fallback**: Empresa padrão automática

## 🔄 **Integração com Relatórios**

### **Antes (Sem Empresa)**
```typescript
// Relatório sem empresa específica
const relatorio = {
  nome: "Relatório Teste",
  contrato: "TEST",
  // ... outros campos
};
```

### **Depois (Com Empresa)**
```typescript
// Relatório vinculado à empresa
const relatorio = {
  nome: "Relatório Teste",
  contrato: "TEST",
  empresaId: "empresa-id",
  // ... outros campos
};
```

## 📁 **Arquivos Criados/Modificados**

### **🗄️ Banco de Dados**
- `prisma/schema.prisma` - Modelo Empresa adicionado
- `src/lib/empresa-database.ts` - Serviço de banco para empresas

### **🌐 API Routes**
- `src/app/api/empresas/route.ts` - CRUD principal
- `src/app/api/empresas/[id]/route.ts` - Operações por ID
- `src/app/api/empresas/inicializar/route.ts` - Dados padrão

### **💻 Integração**
- `src/lib/relatorios-database.ts` - Atualizado para incluir empresaId
- `scripts/init-database.sh` - Inicialização da empresa
- `scripts/package.json` - Scripts atualizados

## 🧪 **Como Testar**

### **Teste de API**
```bash
# Listar empresas
curl http://localhost:3000/api/empresas

# Criar empresa
curl -X POST http://localhost:3000/api/empresas \
  -H "Content-Type: application/json" \
  -d '{"razaoSocial":"Empresa Teste","cnpj":"12.345.678/0001-90","logoUrl":"/logo.png"}'

# Buscar por CNPJ
curl http://localhost:3000/api/empresas?cnpj=12.345.678/0001-90
```

### **Teste de Integração**
1. Execute a migração do banco
2. Inicialize os dados padrão
3. Verifique se a empresa padrão foi criada
4. Verifique se os relatórios estão vinculados à empresa

## 🎉 **Conclusão**

A implementação foi **concluída com sucesso**, adicionando persistência dos dados da empresa com:

- **✅ Tabela separada** para dados da empresa
- **✅ Relacionamento** com relatórios
- **✅ API completa** para gerenciamento
- **✅ Dados padrão** com logo da empresa
- **✅ Validação** e tratamento de erros
- **✅ Integração** com sistema existente

### **Benefícios da Implementação**
- **Organização**: Dados da empresa separados dos relatórios
- **Reutilização**: Uma empresa pode ter múltiplos relatórios
- **Escalabilidade**: Sistema preparado para múltiplas empresas
- **Manutenibilidade**: Código modular e bem estruturado
- **Consistência**: Logo e dados da empresa centralizados

A implementação está **100% funcional** e pronta para uso! 🚀
