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

        <div className="form-card">

          <h2
            style={{
              fontSize: "30px",
              marginBottom: "30px",
              color: "#111827",
            }}
          >
            {avaliacao.titulo}
          </h2>

          <div className="form-field">
            <label>Turma</label>
            <div>{avaliacao.turma.nome}</div>
          </div>

          <div className="form-field">
            <label>Data da Avaliação</label>
            <div>
              {new Date(avaliacao.data).toLocaleDateString("pt-BR")}
            </div>
          </div>

          <div className="form-field">
            <label>Descrição</label>

            <div
              style={{
                background: "#f9fafb",
                border: "1px solid #d1d5db",
                borderRadius: "12px",
                padding: "16px",
                minHeight: "120px",
                lineHeight: "1.7",
                color: "#374151",
              }}
            >
              {avaliacao.descricao || "Sem descrição."}
            </div>
          </div>

          <div className="submit-area">

            <Link
              href={`/turmas/${id}`}
              className="secondary-button"
            >
              Voltar
            </Link>

          </div>

        </div>

      </section>
    </main>
  );
}