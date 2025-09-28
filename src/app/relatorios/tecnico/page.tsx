import { ClipboardList, Download, BarChart3, TrendingUp } from "lucide-react"

export default function RelatoriosTecnicoPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <ClipboardList className="h-8 w-8" />
          Relatórios Técnicos
        </h2>
        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
          <Download className="mr-2 h-4 w-4" />
          Gerar Relatório
        </button>
      </div>
      
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
