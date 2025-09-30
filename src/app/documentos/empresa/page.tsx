export default function DocumentosEmpresaPage() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-2">Estatuto Social</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Documentos constitutivos da empresa
          </p>
          <button
            type="button"
            className="text-sm text-primary hover:underline"
          >
            Visualizar →
          </button>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-2">Contratos</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Contratos comerciais e de prestação de serviços
          </p>
          <button
            type="button"
            className="text-sm text-primary hover:underline"
          >
            Visualizar →
          </button>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-2">Licenças</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Licenças e autorizações de funcionamento
          </p>
          <button
            type="button"
            className="text-sm text-primary hover:underline"
          >
            Visualizar →
          </button>
        </div>
      </div>
    </div>
  );
}
