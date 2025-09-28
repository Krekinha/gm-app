import { Users, UserPlus, FileText } from "lucide-react"

export default function DocumentosFuncionariosPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Users className="h-8 w-8" />
          Documentos dos Funcionários
        </h2>
        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
          <UserPlus className="mr-2 h-4 w-4" />
          Novo Funcionário
        </button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-2">Contratos de Trabalho</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Contratos CLT e documentos trabalhistas
          </p>
          <button className="text-sm text-primary hover:underline">
            Visualizar →
          </button>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-2">Fichas Funcionais</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Dados pessoais e profissionais dos funcionários
          </p>
          <button className="text-sm text-primary hover:underline">
            Visualizar →
          </button>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-2">Documentos Pessoais</h3>
          <p className="text-sm text-muted-foreground mb-4">
            RG, CPF, carteira de trabalho e outros documentos
          </p>
          <button className="text-sm text-primary hover:underline">
            Visualizar →
          </button>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-2">Avaliações</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Avaliações de desempenho e feedback
          </p>
          <button className="text-sm text-primary hover:underline">
            Visualizar →
          </button>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-2">Treinamentos</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Certificados e registros de treinamentos
          </p>
          <button className="text-sm text-primary hover:underline">
            Visualizar →
          </button>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-2">Folha de Pagamento</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Histórico de pagamentos e benefícios
          </p>
          <button className="text-sm text-primary hover:underline">
            Visualizar →
          </button>
        </div>
      </div>
    </div>
  )
}
