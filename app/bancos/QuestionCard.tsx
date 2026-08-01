"use client";

import { useRouter } from "next/navigation";

type Props = {
  id: number;
  tipo: string;
  peso: number;
  gabarito: string;
  bancoId: number;
};

export default function QuestionCard({ id, tipo, peso, gabarito, bancoId }: Props) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja deletar esta questão? Esta ação não pode ser desfeita.")) return;

    try {
      const res = await fetch(`/api/questoes?questaoId=${id}`, { method: "DELETE" });
      const dados = await res.json();
      if (!res.ok) {
        alert(dados.mensagem || 'Erro ao deletar questão.');
        return;
      }
      // refresh the page to reflect deletion
      router.refresh();
    } catch (err) {
      alert("Erro ao deletar questão.");
    }
  };

  return (
    <div className="question-card-content">
      <div>
        <h3>Questão #{id}</h3>
        <p className="label-small">Tipo: {tipo === "DISCURSIVA" ? "Discursiva" : "Múltipla escolha"}</p>
        <p className="label-small">Peso: {peso}</p>
        <p>Gabarito: {gabarito}</p>
      </div>

      <div className="question-actions-inline">
        <a className="edit-button" href={`/questoes/novo?bancoId=${bancoId}&questaoId=${id}`}>Editar</a>
        <button className="delete-button" onClick={handleDelete}>Deletar</button>
      </div>
    </div>
  );
}
