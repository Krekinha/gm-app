export default function HomePage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Home</h1>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-2">Bem-vindo ao GM-App</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Sistema de Gestão para sua empresa
          </p>
          <button className="text-sm text-primary hover:underline">
            Começar →
          </button>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-2">Documentos</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Gerencie documentos da empresa e funcionários
          </p>
          <button className="text-sm text-primary hover:underline">
            Acessar →
          </button>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-2">Relatórios</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Visualize relatórios técnicos e análises
          </p>
          <button className="text-sm text-primary hover:underline">
            Ver Relatórios →
          </button>
        </div>
      </div>
    </div>
  )
}
