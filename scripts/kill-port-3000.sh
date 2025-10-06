#!/bin/bash

# Script para parar processos na porta 3000
# Uso: ./kill-port-3000.sh

echo "🔍 Procurando processos na porta 3000..."

# Encontrar processos na porta 3000
PROCESSES=$(ss -tulpn | grep :3000)

if [ -z "$PROCESSES" ]; then
    echo "✅ Nenhum processo encontrado na porta 3000"
    echo "✅ A porta 3000 está livre!"
    exit 0
fi

echo "📋 Processos encontrados na porta 3000:"
echo "$PROCESSES"
echo ""

# Extrair PIDs dos processos
PIDS=$(echo "$PROCESSES" | grep -o 'pid=[0-9]*' | cut -d'=' -f2)

if [ -z "$PIDS" ]; then
    echo "❌ Não foi possível extrair PIDs dos processos"
    exit 1
fi

echo "🎯 PIDs encontrados: $PIDS"
echo ""

# Confirmar antes de matar
read -p "⚠️  Deseja parar todos os processos na porta 3000? (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔄 Parando processos..."
    
    for PID in $PIDS; do
        echo "   🛑 Parando processo PID: $PID"
        kill -9 $PID 2>/dev/null
        
        if [ $? -eq 0 ]; then
            echo "   ✅ Processo $PID parado com sucesso"
        else
            echo "   ❌ Erro ao parar processo $PID"
        fi
    done
    
    echo ""
    echo "🔍 Verificando se a porta está livre..."
    sleep 1
    
    # Verificar se ainda há processos
    REMAINING=$(ss -tulpn | grep :3000)
    if [ -z "$REMAINING" ]; then
        echo "✅ Sucesso! A porta 3000 está livre!"
    else
        echo "⚠️  Ainda há processos na porta 3000:"
        echo "$REMAINING"
    fi
else
    echo "❌ Operação cancelada"
fi
