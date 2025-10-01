#!/bin/bash

# Script para inicializar o banco de dados PostgreSQL
# Execute este script após subir o Docker Compose

echo "🚀 Inicializando banco de dados PostgreSQL..."

# Verificar se o banco está rodando
echo "📡 Verificando conexão com PostgreSQL..."
until pg_isready -h localhost -p 5432 -U postgres; do
  echo "⏳ Aguardando PostgreSQL estar disponível..."
  sleep 2
done

echo "✅ PostgreSQL está disponível!"

# Criar banco se não existir
echo "🗄️ Criando banco de dados se necessário..."
createdb -h localhost -p 5432 -U postgres gm_app 2>/dev/null || echo "Banco já existe"

# Executar migrações do Prisma
echo "🔄 Executando migrações do Prisma..."
npx prisma migrate dev --name init

# Gerar cliente Prisma
echo "⚙️ Gerando cliente Prisma..."
npx prisma generate

# Inicializar dados padrão
echo "📊 Inicializando dados padrão..."
curl -X POST http://localhost:3001/api/contratos/inicializar

echo "🎉 Banco de dados inicializado com sucesso!"
echo ""
echo "📋 Próximos passos:"
echo "1. Configure as variáveis de ambiente no arquivo .env"
echo "2. Execute: pnpm dev"
echo "3. Acesse: http://localhost:3001/relatorios/relatorio-tecnico"
