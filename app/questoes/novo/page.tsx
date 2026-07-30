"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Banco = {
  id: number;
  nome: string;
};

export default function NovaQuestaoPage() {
  const router = useRouter();
  const [bancos, setBancos] = useState<Banco[]>([]);
  const [bancoId, setBancoId] = useState<number>(0);
  const [tipo, setTipo] = useState("DISCURSIVA");
  const [enunciado, setEnunciado] = useState("");
  const [peso, setPeso] = useState(1);
  const [gabarito, setGabarito] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    async function loadBancos() {
      const params = new URLSearchParams(window.location.search);
      const bancoIdParam = params.get("bancoId");

      const response = await fetch("/api/bancos");
      const dados = await response.json();

      if (response.ok) {
        setBancos(dados);
        const defaultBancoId = bancoIdParam ? Number(bancoIdParam) : dados[0]?.id;
        if (defaultBancoId) {
          setBancoId(defaultBancoId);
        }
      }
    }

    loadBancos();
  }, []);

  async function criarQuestao(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMensagem("");
    setCarregando(true);

    const response = await fetch("/api/questoes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bancoId,
        tipo,
        enunciado,
        peso,
        gabarito,
      }),
    });

    const dados = await response.json();

    if (!response.ok) {
      setMensagem(dados.mensagem || "Não foi possível criar a questão.");
      setCarregando(false);
      return;
    }

    router.push(`/bancos/${bancoId}`);
  }

  return (
    <main className="bancos-page">
      <header className="bancos-header">
        <div className="bancos-title">
          <h1>Nova Questão</h1>
          <p>Cadastre uma questão para o banco selecionado.</p>
        </div>
      </header>

      <section className="form-card">
        <h3>Dados da questão</h3>
        <form onSubmit={criarQuestao}>
          <div className="form-field">
            <label htmlFor="banco">Banco de destino</label>
            <select
              id="banco"
              value={bancoId}
              onChange={(event) => setBancoId(Number(event.target.value))}
            >
              {bancos.map((banco) => (
                <option key={banco.id} value={banco.id}>
                  {banco.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="tipo">Tipo de questão</label>
            <select id="tipo" value={tipo} onChange={(event) => setTipo(event.target.value)}>
              <option value="DISCURSIVA">Discursiva</option>
              <option value="MULTIPLA_ESCOLHA">Múltipla escolha</option>
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="enunciado">Enunciado</label>
            <textarea
              id="enunciado"
              value={enunciado}
              onChange={(event) => setEnunciado(event.target.value)}
            />
          </div>

          <div className="form-field">
            <label htmlFor="peso">Peso</label>
            <input
              id="peso"
              type="number"
              min={1}
              value={peso}
              onChange={(event) => setPeso(Number(event.target.value))}
            />
          </div>

          <div className="form-field">
            <label htmlFor="gabarito">Gabarito</label>
            <textarea
              id="gabarito"
              value={gabarito}
              onChange={(event) => setGabarito(event.target.value)}
            />
          </div>

          {mensagem && <p className="error-text">{mensagem}</p>}

          <div className="submit-area">
            <button className="primary-button" disabled={carregando} type="submit">
              {carregando ? "Salvando..." : "Criar questão"}
            </button>
            <button
              className="secondary-button"
              type="button"
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
