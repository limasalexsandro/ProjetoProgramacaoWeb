"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NovoBancoPage() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function criarBanco(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMensagem("");
    setCarregando(true);

    const response = await fetch("/api/bancos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, descricao }),
    });

    const dados = await response.json();

    if (!response.ok) {
      setMensagem(dados.mensagem || "Não foi possível criar o banco.");
      setCarregando(false);
      return;
    }

    router.push(`/bancos/${dados.id}`);
  }

  return (
    <main className="bancos-page">
      <header className="dashboard-content">
        <div className="welcome-card">
          <h1>Novo Banco de Questões</h1>
          <p>Cadastre um novo acervo para organizar suas questões.</p>
        </div>
      </header>

      <section className="form-card">
        <h3>Dados do banco</h3>
        <form onSubmit={criarBanco}>
          <div className="form-field">
            <label htmlFor="nome">Nome</label>
            <input
              id="nome"
              value={nome}
              onChange={(event) => setNome(event.target.value)}
              placeholder="Nome do banco"
            />
          </div>

          <div className="form-field">
            <label htmlFor="descricao">Descrição</label>
            <textarea
              id="descricao"
              value={descricao}
              onChange={(event) => setDescricao(event.target.value)}
              placeholder="Descrição opcional"
            />
          </div>

          {mensagem && <p className="error-text">{mensagem}</p>}

          <div className="submit-area">
            <button className="primary-button" disabled={carregando} type="submit">
              {carregando ? "Salvando..." : "Criar banco"}
            </button>
            <button
              type="button"
              className="secondary-button"
              
              onClick={() => router.back()}
              disabled={carregando}
            >
              Cancelar
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
