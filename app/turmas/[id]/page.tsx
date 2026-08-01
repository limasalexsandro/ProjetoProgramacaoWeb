import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { verificarToken } from "@/lib/auth";
import DashboardHeader from "@/app/components/dashboardHeader";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TurmaPage({ params }: PageProps) {
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
      avaliacoes: true,
    },
  });

  if (!turma) {
    redirect("/turmas");
  }

  return (
    <main>
      <DashboardHeader
        nome={usuario.nome}
        email={usuario.email}
      />

      <section className="dashboard-content">

        <div className="welcome-card">
          <h2>{turma.nome}</h2>

          <p>
            <strong>Código:</strong> {turma.codigo}
          </p>

          <p>
            <strong>Semestre:</strong> {turma.semestre}
          </p>
        </div>

        <div className="button-group">

          <Link
            href={`/turmas/${turma.id}/alunos`}
            className="primary-button"
          >
            Gerenciar Alunos
          </Link>

          <Link
            href={`/turmas/${turma.id}/avaliacoes/nova`}
            className="primary-button"
          >
            Criar Nova Avaliação
          </Link>

           <Link
            href="/turmas"
            className="secondary-button" >
            Voltar
           </Link>

        </div>

        <div className="lista-avaliacoes">

        <h2> Avaliações</h2>

          {turma.avaliacoes.length === 0 ? (

            <p>Nenhuma avaliação cadastrada.</p>

          ) : (

            <table className="table">

              <thead>
                <tr>
                  <th>Título</th>
                  <th>Data</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>

                {turma.avaliacoes.map((avaliacao) => (

                  <tr key={avaliacao.id}>

                    <td>{avaliacao.titulo}</td>

                    <td>
                      {new Date(avaliacao.data).toLocaleDateString("pt-BR")}
                    </td>

                    <td>
                      <Link
                        href={`/turmas/${turma.id}/avaliacoes/${avaliacao.id}`}
                        className="primary-button"
                      >
                        Abrir
                      </Link>
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          )}

        </div>

      </section>
    </main>
  );
}