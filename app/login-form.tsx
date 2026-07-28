"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type ErrosFormulario = {
  email?: string[];
  senha?: string[];
};

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erros, setErros] = useState<ErrosFormulario>({});
  const [carregando, setCarregando] = useState(false);

  async function realizarLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMensagem("");
    setErros({});
    setCarregando(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          senha,
        }),
      });

      const dados = await response.json();

      if (!response.ok) {
        setMensagem(dados.mensagem || "Não foi possível realizar o login.");
        setErros(dados.erros || {});
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setMensagem("Não foi possível conectar ao servidor.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-header">
          <span className="login-badge">PGA</span>

          <div>
            <h1>Plataforma de Avaliações</h1>
            <p>Acesse sua conta de professor</p>
          </div>
        </div>

        <form onSubmit={realizarLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">E-mail</label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="seuemail@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
            />

            {erros.email && (
              <span className="field-error">{erros.email[0]}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha</label>

            <input
              id="senha"
              name="senha"
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              autoComplete="current-password"
            />

            {erros.senha && (
              <span className="field-error">{erros.senha[0]}</span>
            )}
          </div>

          {mensagem && <div className="login-message">{mensagem}</div>}

          <button type="submit" disabled={carregando}>
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="login-footer">
          Sistema de gerenciamento de avaliações
        </p>
      </section>
    </main>
  );
}