import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verificarToken } from "@/lib/auth";
import DashboardHeader from "@/app/components/dashboardHeader";
import Link from "next/link";

export default async function TurmasPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/");

  const dadosToken = verificarToken(token);

  if (!dadosToken) redirect("/");

  return (
    <main className="dashboard-page">
      <DashboardHeader
        nome={dadosToken.nome}
        email={dadosToken.email}
      />

      <section className="dashboard-content">
        <div className="welcome-card">
          <h2>Minhas Turmas</h2>
          <p>Gerencie as suas turmas cadastradas.</p>
        </div>

        {/* Conteúdo da página */}
      </section>
      <Link href="/turmas/novas">
        <button >+ Nova Turma</button>
      </Link>

      
    </main>
  );
}