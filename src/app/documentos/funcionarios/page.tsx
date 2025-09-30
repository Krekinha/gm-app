export default function DocumentosFuncionariosPage() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-2">Contratos de Trabalho</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Contratos CLT e documentos trabalhistas
          </p>
          <button
            type="button"
            className="text-sm text-primary hover:underline"
          >
            Visualizar →
          </button>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-2">Fichas Funcionais</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Dados pessoais e profissionais dos funcionários
          </p>
          <button
            type="button"
            className="text-sm text-primary hover:underline"
          >
            Visualizar →
          </button>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-2">Documentos Pessoais</h3>
          <p className="text-sm text-muted-foreground mb-4">
            RG, CPF, carteira de trabalho e outros documentos
          </p>
          <button
            type="button"
            className="text-sm text-primary hover:underline"
          >
            Visualizar →
          </button>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-2">Avaliações</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Avaliações de desempenho e feedback
          </p>
          <button
            type="button"
            className="text-sm text-primary hover:underline"
          >
            Visualizar →
          </button>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-2">Treinamentos</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Certificados e registros de treinamentos
          </p>
          <button
            type="button"
            className="text-sm text-primary hover:underline"
          >
            Visualizar →
          </button>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-2">Folha de Pagamento</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Histórico de pagamentos e benefícios
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
