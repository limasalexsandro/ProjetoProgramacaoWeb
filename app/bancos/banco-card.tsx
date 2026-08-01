"use client";

import { useRouter } from "next/navigation";

type BancoCardProps = {
  id: number;
  nome: string;
  descricao: string | null;
  questoesCount: number;
  createdAt: Date;
};

export default function BancoCard({
  id,
  nome,
  descricao,
  questoesCount,
  createdAt,
}: BancoCardProps) {
  const router = useRouter();

  const handleAbrir = () => {
    console.log("✅ Clicou no banco ID:", id);
    const url = `/bancos/${id}`;
    console.log("🔗 Navegando para:", url);
    router.push(url);
  };

  return (
    <article className="bank-card">
      <h3>{nome}</h3>
      <p>{descricao || "Sem descrição"}</p>
      <p className="label-small">Questões: {questoesCount}</p>
      <p className="label-small">Criado em: {new Date(createdAt).toLocaleDateString()}</p>
      <p className="label-small" style={{ color: "#666" }}>
        ID: {id}
      </p>
      <button
        className="botao-abrir"
        onClick={handleAbrir}
        
      >
        Abrir banco
      </button>
    </article>
  );
}
