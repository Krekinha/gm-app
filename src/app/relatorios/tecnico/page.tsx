import { ClipboardList, Download, BarChart3, TrendingUp } from "lucide-react"

export default function RelatoriosTecnicoPage() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Relatório de Produtividade</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Análise de produtividade por funcionário e departamento
          </p>
          <div className="flex gap-2">
            <button className="text-sm text-primary hover:underline">
              Visualizar →
            </button>
            <button className="text-sm text-green-600 hover:underline">
              Download PDF
            </button>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold">Relatório Financeiro</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Análise financeira e indicadores de performance
          </p>
          <div className="flex gap-2">
            <button className="text-sm text-primary hover:underline">
              Visualizar →
            </button>
            <button className="text-sm text-green-600 hover:underline">
              Download PDF
            </button>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex items-center gap-2 mb-2">
            <ClipboardList className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold">Relatório de Qualidade</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Métricas de qualidade e conformidade
          </p>
          <div className="flex gap-2">
            <button className="text-sm text-primary hover:underline">
              Visualizar →
            </button>
            <button className="text-sm text-green-600 hover:underline">
              Download PDF
            </button>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="h-5 w-5 text-orange-600" />
            <h3 className="text-lg font-semibold">Relatório de Recursos Humanos</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Análise de RH, turnover e satisfação dos funcionários
          </p>
          <div className="flex gap-2">
            <button className="text-sm text-primary hover:underline">
              Visualizar →
            </button>
            <button className="text-sm text-green-600 hover:underline">
              Download PDF
            </button>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-red-600" />
            <h3 className="text-lg font-semibold">Relatório de Vendas</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Performance de vendas e análise de mercado
          </p>
          <div className="flex gap-2">
            <button className="text-sm text-primary hover:underline">
              Visualizar →
            </button>
            <button className="text-sm text-green-600 hover:underline">
              Download PDF
            </button>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex items-center gap-2 mb-2">
            <ClipboardList className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-semibold">Relatório de Operações</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Análise operacional e eficiência dos processos
          </p>
          <div className="flex gap-2">
            <button className="text-sm text-primary hover:underline">
              Visualizar →
            </button>
            <button className="text-sm text-green-600 hover:underline">
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
