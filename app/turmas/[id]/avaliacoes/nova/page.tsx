import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

import DashboardHeader from "@/app/components/dashboardHeader";
import { verificarToken } from "@/lib/auth";
import { criarAvaliacao } from "./actions";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function NovaAvaliacaoPage({
  params,
}: PageProps) {
  const { id } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/");

  const usuario = verificarToken(token);

  if (!usuario) redirect("/");

  return (
    <main>
      <DashboardHeader
        nome={usuario.nome}
        email={usuario.email}
      />

      <section className="dashboard-content">

        <div className="welcome-card">
          <h2>Criar Nova Avaliação</h2>
          <p>Preencha os dados da avaliação.</p>
        </div>

        <form action={criarAvaliacao} className="turma-form">

          <input
            type="hidden"
            name="turmaId"
            value={id}
          />

          <label htmlFor="titulo">
            Título
          </label>

          <input
            id="titulo"
            name="titulo"
            type="text"
            required
            placeholder="Ex: Prova 1"
          />

          <label htmlFor="descricao">
            Descrição
          </label>

          <textarea
            id="descricao"
            name="descricao"
            rows={4}
            placeholder="Descrição da avaliação"
          />

          <label htmlFor="data">
            Data
          </label>

          <input
            id="data"
            name="data"
            type="date"
            required
          />

          <div className="button-group">

            <button
              type="submit"
              className="primary-button"
            >
              Criar Avaliação
            </button>

            <Link
              href={`/turmas/${id}`}
              className="secondary-button"
            >
              Cancelar
            </Link>

          </div>

        </form>

      </section>
    </main>
  );
}