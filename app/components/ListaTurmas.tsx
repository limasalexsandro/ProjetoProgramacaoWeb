import TurmaCard from "./TurmaCard";

interface Turma {
  id: number;
  nome: string;
  codigo: string;
  semestre: string;
}

interface ListaTurmasProps {
  turmas: Turma[];
}

export default function ListaTurmas({ turmas }: ListaTurmasProps) {
  if (turmas.length === 0) {
    return (
      <p>Você ainda não possui nenhuma turma cadastrada!</p>
    );
  }

  return (
    <div className="lista-turmas">
      {turmas.map((turma) => (
        <TurmaCard
          key={turma.id}
          turma={turma}
        />
      ))}
    </div>
  );
}