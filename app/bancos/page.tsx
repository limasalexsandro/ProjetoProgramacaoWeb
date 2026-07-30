import { verificarToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardHeader from "@/app/components/dashboardHeader";
import BancoCard from "./banco-card";

async function loadBancos() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return null;
  }

  const dadosToken = verificarToken(token);

  if (!dadosToken) {
    return null;
  }

  const bancos = await prisma.bancoQuestao.findMany({
    where: {
      professorId: dadosToken.professorId,
    },
    select: {
      id: true,
      nome: true,
      descricao: true,
      questoes: {
        select: {
          id: true,
        },
      },
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    dadosToken,
    bancos,
  };
}

export default async function BancosPage() {
  const resultado = await loadBancos();

  if (!resultado) {
    redirect("/");
  }

  const { dadosToken, bancos } = resultado;

  return (
    <main className="dashboard-page">

      <DashboardHeader
        nome={dadosToken.nome}
        email={dadosToken.email}
      />

      <section className="dashboard-content">

        <div className="welcome-card">
          <h2>Banco de Questões</h2>
          <p>
            Veja seus acervos de questões e crie novos bancos para organizar seu conteúdo.
          </p>
        </div>

        <a
          className="primary-button"
          href="/bancos/novo"
        >
          + Novo Banco
        </a>

        <section className="card-grid">
          {bancos.length === 0 ? (
            <div className="bank-card">
              <h3>Nenhum banco cadastrado</h3>
              <p>
                Crie um novo banco para começar a cadastrar questões.
              </p>
            </div>
          ) : (
            bancos.map((banco) => (
              <BancoCard
                key={banco.id}
                id={banco.id}
                nome={banco.nome}
                descricao={banco.descricao}
                questoesCount={banco.questoes.length}
                createdAt={banco.createdAt}
              />
            ))
          )}
        </section>

      </section>

    </main>
  );
}