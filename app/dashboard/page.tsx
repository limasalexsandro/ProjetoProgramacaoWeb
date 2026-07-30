import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { verificarToken } from "@/lib/auth";
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
        <div className="welcome-card">
          <p className="welcome-label">Visão geral</p>
          <h2>Bem-vindo, {dadosToken.nome}!</h2>
          <p>
            Utilize a plataforma para organizar disciplinas, avaliações e
            resultados acadêmicos.
          </p>
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

          <article className="dashboard-card">
            <h3>Resultados</h3>
            <p>Acompanhe notas e desempenho das turmas.</p>
            <button type="button" disabled>
              Em breve
            </button>
          </article>
        </div>
      </section>
    </main>
  );
}