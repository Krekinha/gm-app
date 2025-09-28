import { Building2 } from "lucide-react"

export default function DocumentosEmpresaPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Building2 className="h-8 w-8" />
          Documentos da Empresa
        </h2>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-2">Estatuto Social</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Documentos constitutivos da empresa
          </p>
          <button className="text-sm text-primary hover:underline">
            Visualizar →
          </button>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-2">Contratos</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Contratos comerciais e de prestação de serviços
          </p>
          <button className="text-sm text-primary hover:underline">
            Visualizar →
          </button>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-2">Licenças</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Licenças e autorizações de funcionamento
          </p>
          <button className="text-sm text-primary hover:underline">
            Visualizar →
          </button>
        </div>
      </div>
    </div>
  )
}
