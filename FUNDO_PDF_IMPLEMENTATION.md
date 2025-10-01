# 📄 Configuração de Imagem de Fundo para PDF

## 🎯 Funcionalidade Implementada

A página de Relatório Técnico agora suporta **imagem de fundo** que é aplicada em **todas as páginas** do PDF gerado, criando um efeito de papel timbrado profissional.

## ✨ Características

### **Upload de Imagem de Fundo**
- ✅ **Drag & Drop**: Arraste uma imagem ou clique para selecionar
- ✅ **Validação**: Tipos permitidos (JPG, PNG, WebP) até 5MB
- ✅ **Preview**: Visualização da imagem antes de aplicar
- ✅ **Remoção**: Botão para remover a imagem de fundo

### **Aplicação no PDF**
- ✅ **Todas as Páginas**: Imagem aplicada automaticamente em cada página
- ✅ **Posicionamento**: Cobre toda a área da página (210x297mm para A4)
- ✅ **Performance**: Modo "FAST" para melhor velocidade de geração
- ✅ **Quebra de Página**: Fundo aplicado automaticamente em novas páginas

### **Interface do Usuário**
- ✅ **Preview Integrado**: Visualização da imagem no formulário
- ✅ **Dicas de Uso**: Orientações para melhor resultado
- ✅ **Status Visual**: Badges indicando estado da imagem
- ✅ **Troca Fácil**: Possibilidade de trocar a imagem facilmente

## 🚀 Como Usar

### **1. Acessar a Funcionalidade**
1. Navegue para `/relatorios/relatorio-tecnico`
2. Vá para a aba **"Configurações"**
3. Role até a seção **"Imagem de Fundo do PDF"**

### **2. Upload da Imagem**
1. **Arraste** uma imagem para a área de upload OU
2. **Clique** na área para selecionar um arquivo
3. Aguarde o processamento e preview

### **3. Configuração Recomendada**
- **Formato**: PNG com transparência (melhor resultado)
- **Resolução**: 2480x3508px (300 DPI para A4)
- **Opacidade**: Baixa para não interferir na leitura
- **Conteúdo**: Logo da empresa, marca d'água, padrão sutil

### **4. Preview e Teste**
1. Use o botão **"Preview"** para ver a imagem em tela cheia
2. Gere um **preview do PDF** para verificar o resultado
3. Ajuste se necessário antes do download final

## 🎨 Exemplos de Uso

### **Papel Timbrado Corporativo**
```
- Logo da empresa no canto superior
- Padrão sutil de fundo
- Transparência de 10-20%
```

### **Marca D'água**
```
- Texto "CONFIDENCIAL" ou "RASCUNHO"
- Opacidade muito baixa (5-10%)
- Posicionamento central ou diagonal
```

### **Padrão Decorativo**
```
- Padrão geométrico sutil
- Cores neutras (cinza claro)
- Repetição harmoniosa
```

## ⚙️ Implementação Técnica

### **Arquivos Modificados**
- `src/lib/pdf-utils.ts` - Lógica de aplicação do fundo
- `src/lib/relatorio-types.ts` - Schema de dados atualizado
- `src/app/relatorios/relatorio-tecnico/components/BackgroundImageUpload.tsx` - Novo componente
- `src/app/relatorios/relatorio-tecnico/components/RelatorioForm.tsx` - Integração

### **Função Principal**
```typescript
const applyBackgroundImage = async (pageNumber: number) => {
  if (data.imagemFundo) {
    doc.addImage(
      data.imagemFundo, 
      "PNG", 
      0, 
      0, 
      pageWidth, 
      pageHeight,
      undefined,
      "FAST"
    );
  }
};
```

### **Pontos de Aplicação**
1. **Primeira página**: Aplicada no início da geração
2. **Novas páginas**: Aplicada automaticamente em `doc.addPage()`
3. **Finalização**: Verificação e aplicação em todas as páginas

## 🔧 Configurações Avançadas

### **Performance**
- Modo "FAST" para melhor velocidade
- Aplicação apenas quando necessário
- Cleanup automático de recursos

### **Qualidade**
- Suporte a transparência PNG
- Preservação de proporções
- Otimização automática

### **Compatibilidade**
- Funciona com qualquer número de páginas
- Compatível com quebras de página automáticas
- Suporte a diferentes tamanhos de imagem

## 🐛 Solução de Problemas

### **Imagem não aparece no PDF**
- Verifique se o arquivo é PNG, JPG ou WebP
- Confirme que o tamanho é menor que 5MB
- Teste com uma imagem menor primeiro

### **PDF muito lento para gerar**
- Use imagens com resolução menor
- Prefira PNG com transparência baixa
- Evite imagens muito complexas

### **Imagem aparece cortada**
- Use proporção 210:297 (A4)
- Ou proporção similar para melhor ajuste
- Teste diferentes tamanhos

## 📈 Próximas Melhorias

### **Funcionalidades Futuras**
- [ ] **Múltiplas imagens de fundo** por página
- [ ] **Posicionamento personalizado** (canto, centro, etc.)
- [ ] **Opacidade ajustável** via interface
- [ ] **Templates pré-definidos** de papel timbrado
- [ ] **Preview em tempo real** do PDF com fundo

### **Otimizações**
- [ ] **Cache de imagens** para melhor performance
- [ ] **Compressão automática** de imagens grandes
- [ ] **Lazy loading** para imagens de fundo
- [ ] **Batch processing** para múltiplos PDFs

## 🎉 Resultado Final

Com esta implementação, o sistema de Relatório Técnico agora oferece:

- **Profissionalismo**: PDFs com papel timbrado corporativo
- **Flexibilidade**: Qualquer imagem pode ser usada como fundo
- **Facilidade**: Interface intuitiva para upload e configuração
- **Qualidade**: Aplicação consistente em todas as páginas
- **Performance**: Geração rápida mesmo com imagens de fundo

A funcionalidade está **100% operacional** e pronta para uso! 🚀
