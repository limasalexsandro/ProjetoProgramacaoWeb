import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verificarToken } from "@/lib/auth";
import DashboardHeader from "@/app/components/dashboardHeader";
import Link from "next/link";
import {prisma} from "@/lib/prisma";


export default async function TurmasPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/");

  const dadosToken = verificarToken(token);
 
  if (!dadosToken) redirect("/");

       const turmas = await prisma.turma.findMany({
        orderBy: {
        createdAt: "desc",
        },
      });

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

        <Link href="/turmas/nova" >
           <button type="button" className="primary-button">
             + Nova Turma
           </button>
       </Link>

        {/* Conteúdo da página */}
        
      {turmas.length === 0 ? (
        
        <p> Você ainda não possui nenhuma turma cadastrada!</p>
      ) : (
        turmas.map((turma) => (
          <div key={turma.id}>
            <h3>{turma.nome}</h3>
            <p>{turma.codigo}</p>
            <p>{turma.semestre}</p>
          </div>
        ))
      )}
      </section>
      

      
    </main>
  );
}