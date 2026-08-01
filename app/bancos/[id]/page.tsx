import { verificarToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import QuestionCard from "../QuestionCard";

export default async function BancoDetalhesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/");
  }

  const dadosToken = verificarToken(token);

  if (!dadosToken) {
    redirect("/");
  }

  const bancoId = Number(id);

  if (!bancoId || isNaN(bancoId)) {
    redirect("/bancos");
  }

  const banco = await prisma.bancoQuestao.findUnique({
    where: {
      id: bancoId,
    },
    include: {
      questoes: true,
    },
  });

  if (!banco || banco.professorId !== dadosToken.professorId) {
    redirect("/bancos");
  }

  return (
    <main className="bank-details-page">
      <header className="bank-header">
        <div className="bank-title">
          <h1>{banco.nome}</h1>
          <p>{banco.descricao || "Sem descrição disponível."}</p>
        </div>

        <div className="question-actions">
          <a className="primary-button" href={`/questoes/novo?bancoId=${banco.id}`}>
            Nova questão
          </a>
          <a className="secondary-button back-button" href="/bancos">
            Voltar aos bancos
          </a>
        </div>
      </header>

      <section className="questions-grid">
        {banco.questoes.length === 0 ? (
          <article className="question-card">
            <h3>Nenhuma questão</h3>
            <p>Cadastre a primeira questão para este banco.</p>
          </article>
          ) : (
          banco.questoes.map((questao) => (
            <article key={questao.id} className="question-card">
              <QuestionCard
                id={questao.id}
                tipo={questao.tipo}
                peso={questao.peso}
                gabarito={questao.gabarito}
                bancoId={banco.id}
              />
            </article>
          ))
        )}
      </section>
    </main>
  );
}
