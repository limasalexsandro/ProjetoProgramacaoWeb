import { verificarToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import LogoutButton from "./logout-button";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/");
  }

  const dadosToken = verificarToken(token);

  if (!dadosToken) {
    redirect("/");
  }

  const totalAlunos = await prisma.aluno.count();
  const totalAvaliacoes = await prisma.avaliacao.count();
  const turmasRecentes = await prisma.turma.findMany({
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <span className="dashboard-label">PGA</span>
          <h1>Plataforma de Gerenciamento de Avaliações</h1>
        </div>

        <div className="dashboard-user">
          <div>
            <strong>{dadosToken.nome}</strong>
            <span>{dadosToken.email}</span>
          </div>

          <LogoutButton />
        </div>
      </header>

      <section className="dashboard-content">
        <div className="welcome-card overview-card">
          <p className="welcome-label">Visão geral</p>
          <h2>Bem-vindo, {dadosToken.nome}!</h2>
          <p>
            Utilize a plataforma para organizar disciplinas, avaliações e
            resultados acadêmicos. Acesse o Banco de Questões e outros módulos
            abaixo.
          </p>

          <div className="overview-stats">
            <div className="overview-stat">
              <span>Total de alunos ativos</span>
              <strong>{totalAlunos}</strong>
            </div>
            <div className="overview-stat">
              <span>Total de avaliações criadas</span>
              <strong>{totalAvaliacoes}</strong>
            </div>
          </div>

          <div className="overview-recent">
            <div className="overview-recent-header">
              <h3>Turmas recentes</h3>
            </div>
            <ul className="recent-turmas-list">
              {turmasRecentes.map((turma) => (
                <li key={turma.id}>
                  <Link href={`/turmas/${turma.id}`} className="recent-turma-link">
                    <strong>{turma.nome}</strong>
                    <span>{new Date(turma.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="dashboard-grid">
          <article className="dashboard-card">
            <h3>Minhas Turmas</h3>
            <p>Cadastre e gerencie suas disciplinas.</p>

            <Link href="/turmas">
              <button type="button">
                Abrir módulo
              </button>
            </Link>
          </article>

          

          <article className="dashboard-card">
            <h3>Banco de Questões</h3>
            <p>Gerencie os acervos de questões e adicione novos itens.</p>
            <Link href="/bancos">
              <button type="button">
                Abrir módulo
              </button>
            </Link>
          </article>

        </div>
      </section>
    </main>
  );
}