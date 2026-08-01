import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import BotaoExcluir from "./BotaoExcluir";
import DashboardHeader from "@/app/components/dashboardHeader";
import { verificarToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { removerAluno } from "./actions";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AlunosPage({ params }: PageProps) {

  const { id } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/");

  const usuario = verificarToken(token);

  if (!usuario) redirect("/");

  const turma = await prisma.turma.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      alunos: true,
    },
  });

  if (!turma) redirect("/turmas");

  return (
    <main>

      <DashboardHeader
        nome={usuario.nome}
        email={usuario.email}
      />

      <section className="dashboard-content">

        <div className="welcome-card">
          <h2>Gerenciar Alunos</h2>

          <p>
            Turma: {turma.nome}
          </p>
        </div>

        <div className="button-group">

          <Link
            href={`/turmas/${turma.id}/alunos/novo`}
            className="primary-button"
          >
            Novo Aluno
          </Link>

          <Link
            href={`/turmas/${turma.id}`}
            className="secondary-button"
          >
            Voltar
          </Link>

        </div>

        <table className="table">

          <thead>

            <tr>
              <th>Matrícula</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Ações</th>
            </tr>

          </thead>

          <tbody>

            {turma.alunos.length === 0 ? (

              <tr>
                <td colSpan={4}>
                  Nenhum aluno cadastrado.
                </td>
              </tr>

            ) : (

              turma.alunos.map((aluno) => (

                <tr key={aluno.id}>

                  <td>{aluno.matricula}</td>

                  <td>{aluno.nome}</td>

                  <td>{aluno.email}</td>

                  <td>

                    <form action={removerAluno}>

                      <input
                        type="hidden"
                        name="id"
                        value={aluno.id}
                      />

                      <input
                        type="hidden"
                        name="turmaId"
                        value={turma.id}
                      />

                      <BotaoExcluir />

                    </form>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </section>

    </main>
  );
}