import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

import { verificarToken } from "@/lib/auth";
import DashboardHeader from "@/app/components/dashboardHeader";
import { criarTurma } from "./actions";

export default async function NovaTurmaPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/");

  const dadosToken = verificarToken(token);

  if (!dadosToken) redirect("/");

  return (
    <main>
      <DashboardHeader
        nome={dadosToken.nome}
        email={dadosToken.email}
      />

      <section className="dashboard-content">
        <div className="welcome-card">
          <h2>Criar Nova Turma</h2>
          <p>
            Preencha os dados abaixo para cadastrar uma nova turma.
          </p>
        </div>

        <form action={criarTurma} className="turma-form">

          <label htmlFor="nome">
            Nome da turma
          </label>
          <input
            id="nome"
            type="text"
            name="nome"
            placeholder="Ex: Programação Web"
            required
          />


          <label htmlFor="codigo">
            Código da disciplina/turma
          </label>
          <input
            id="codigo"
            type="text"
            name="codigo"
            placeholder="Ex: PW2026"
            required
          />


          <label htmlFor="semestre">
            Semestre/Período letivo
          </label>
          <input
            id="semestre"
            type="text"
            name="semestre"
            placeholder="Ex: 2026.1"
            required
          />


          <div className="button-group">



            <Link href="/turmas">
              <button
                type="button"
                className="secondary-button"
              >
                Cancelar
              </button>

              <button
              type="submit"
              className="primary-button"
            >
              Criar Turma
            </button>
            </Link>

          </div>

        </form>

      </section>

    </main>
  );
}