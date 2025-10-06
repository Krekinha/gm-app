#!/bin/bash

# Script para parar processos em qualquer porta
# Uso: ./kill-port.sh <porta>
# Exemplo: ./kill-port.sh 3000

if [ $# -eq 0 ]; then
    echo "❌ Uso: $0 <porta>"
    echo "📝 Exemplo: $0 3000"
    exit 1
fi

PORT=$1

echo "🔍 Procurando processos na porta $PORT..."

# Encontrar processos na porta especificada
PROCESSES=$(ss -tulpn | grep ":$PORT ")

if [ -z "$PROCESSES" ]; then
    echo "✅ Nenhum processo encontrado na porta $PORT"
    echo "✅ A porta $PORT está livre!"
    exit 0
fi

echo "📋 Processos encontrados na porta $PORT:"
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
read -p "⚠️  Deseja parar todos os processos na porta $PORT? (y/N): " -n 1 -r
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
    REMAINING=$(ss -tulpn | grep ":$PORT ")
    if [ -z "$REMAINING" ]; then
        echo "✅ Sucesso! A porta $PORT está livre!"
    else
        echo "⚠️  Ainda há processos na porta $PORT:"
        echo "$REMAINING"
    fi
else
    echo "❌ Operação cancelada"
fi
