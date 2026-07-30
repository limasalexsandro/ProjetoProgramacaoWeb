import { requireProfessor } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const usuario = await requireProfessor();

  if (!usuario) {
    return NextResponse.json({ mensagem: "Não autorizado." }, { status: 401 });
  }

  const bancos = await prisma.bancoQuestao.findMany({
    where: { professorId: usuario.professorId },
    select: {
      id: true,
      nome: true,
      descricao: true,
      questoes: { select: { id: true } },
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(
    bancos.map((banco) => ({
      id: banco.id,
      nome: banco.nome,
      descricao: banco.descricao,
      totalQuestoes: banco.questoes.length,
      createdAt: banco.createdAt,
    }))
  );
}

export async function POST(request: Request) {
  const usuario = await requireProfessor();

  if (!usuario) {
    return NextResponse.json({ mensagem: "Não autorizado." }, { status: 401 });
  }

  const body = await request.json();
  const { nome, descricao } = body;

  if (!nome || typeof nome !== "string") {
    return NextResponse.json(
      { mensagem: "O nome do banco é obrigatório." },
      { status: 400 }
    );
  }

  const banco = await prisma.bancoQuestao.create({
    data: {
      nome,
      descricao: descricao ?? null,
      professorId: usuario.professorId,
    },
  });

  return NextResponse.json(banco, { status: 201 });
}

export async function DELETE(request: Request) {
  const usuario = await requireProfessor();

  if (!usuario) {
    return NextResponse.json({ mensagem: "Não autorizado." }, { status: 401 });
  }

  const url = new URL(request.url);
  const bancoId = Number(url.searchParams.get("bancoId"));

  if (!bancoId || isNaN(bancoId)) {
    return NextResponse.json({ mensagem: "BancoId é obrigatório e deve ser um número válido." }, { status: 400 });
  }

  const banco = await prisma.bancoQuestao.findUnique({
    where: { id: bancoId },
  });

  if (!banco) {
    return NextResponse.json({ mensagem: "Banco não encontrado." }, { status: 404 });
  }

  if (banco.professorId !== usuario.professorId) {
    return NextResponse.json({ mensagem: "Não autorizado." }, { status: 403 });
  }

  await prisma.bancoQuestao.delete({
    where: { id: bancoId },
  });

  return NextResponse.json({ mensagem: "Banco deletado com sucesso." });
}
