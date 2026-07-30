import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { verificarToken } from "@/lib/auth";
import DashboardHeader from "@/app/components/dashboardHeader";

interface PageProps {
  params: Promise<{
    id: string;
    avaliacaoId: string;
  }>;
}

export default async function VisualizarAvaliacao({
  params,
}: PageProps) {
  const { id, avaliacaoId } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/");

  const usuario = verificarToken(token);

  if (!usuario) redirect("/");

  const avaliacao = await prisma.avaliacao.findUnique({
    where: {
      id: Number(avaliacaoId),
    },
    include: {
      turma: true,
    },
  });

  if (!avaliacao) {
    redirect(`/turmas/${id}`);
  }

  return (
    <main>
      <DashboardHeader
        nome={usuario.nome}
        email={usuario.email}
      />

      <section className="dashboard-content">

        <div className="welcome-card">
          <h2>{avaliacao.titulo}</h2>

          <p>
            <strong>Turma:</strong> {avaliacao.turma.nome}
          </p>

          <p>
            <strong>Data:</strong>{" "}
            {new Date(avaliacao.data).toLocaleDateString("pt-BR")}
          </p>

          <p>
            <strong>Descrição:</strong>
          </p>

          <p>
            {avaliacao.descricao || "Sem descrição."}
          </p>
        </div>

        <Link
          href={`/turmas/${id}`}
          className="secondary-button"
        >
          Voltar
        </Link>

      </section>
    </main>
  );
}