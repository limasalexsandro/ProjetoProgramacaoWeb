"use client";

export default function BotaoExcluir() {
  return (
    <button
      type="submit"
      className="secondary-button"
      onClick={(e) => {
        if (!window.confirm("Deseja realmente excluir este aluno?")) {
          e.preventDefault();
        }
      }}
    >
      Excluir
    </button>
  );
}