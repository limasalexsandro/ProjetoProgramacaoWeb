import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

import DashboardHeader from "@/app/components/dashboardHeader";
import { verificarToken } from "@/lib/auth";
import { criarAluno } from "./actions";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function NovoAlunoPage({
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
          <h2>Novo Aluno</h2>
        </div>

        <form action={criarAluno} className="turma-form">

          <input
            type="hidden"
            name="turmaId"
            value={id}
          />

          <label>Nome</label>

          <input
            name="nome"
            required
          />

          <label>Matrícula</label>

          <input
            name="matricula"
            required
          />

          <label>Email</label>

          <input
            type="email"
            name="email"
          />

          <div className="button-group">

            <button
              className="primary-button"
              type="submit"
            >
              Salvar
            </button>

            <Link
              href={`/turmas/${id}/alunos`}
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