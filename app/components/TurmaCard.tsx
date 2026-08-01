import Link from "next/link";

interface Turma {
  id: number;
  nome: string;
  codigo: string;
  semestre: string;
}

interface TurmaCardProps {
  turma: Turma;
}

export default function TurmaCard({ turma }: TurmaCardProps) {
  return (
    <div className="turma-card">
      <h3>{turma.nome}</h3>

      <p>
        <strong>Código:</strong> {turma.codigo}
      </p>

      <p>
        <strong>Semestre:</strong> {turma.semestre}
      </p>

      <div className="turma-card-botoes">

        <Link href={`/turmas/${turma.id}`}>
          <button type="button" className="botao-abrir">
            Abrir Turma
          </button>
        </Link>
      </div>
    </div>
  );
}