import { requireProfessor } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
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
    where: {
      id: bancoId,
    },
    include: {
      questoes: true,
    },
  });

  if (!banco || banco.professorId !== usuario.professorId) {
    return NextResponse.json({ mensagem: "Banco não encontrado." }, { status: 404 });
  }

  return NextResponse.json(banco);
}

export async function POST(request: Request) {
  const usuario = await requireProfessor();

  if (!usuario) {
    return NextResponse.json({ mensagem: "Não autorizado." }, { status: 401 });
  }

  const body = await request.json();
  const { bancoId, tipo, enunciado, peso, gabarito } = body;

  if (!bancoId || typeof bancoId !== "number") {
    return NextResponse.json({ mensagem: "O banco de destino é obrigatório." }, { status: 400 });
  }

  if (!tipo || !["DISCURSIVA", "MULTIPLA_ESCOLHA"].includes(tipo)) {
    return NextResponse.json({ mensagem: "O tipo de questão é inválido." }, { status: 400 });
  }

  if (!enunciado || typeof enunciado !== "string") {
    return NextResponse.json({ mensagem: "O enunciado é obrigatório." }, { status: 400 });
  }

  if (!peso || typeof peso !== "number") {
    return NextResponse.json({ mensagem: "O peso é obrigatório." }, { status: 400 });
  }

  if (!gabarito || typeof gabarito !== "string") {
    return NextResponse.json({ mensagem: "O gabarito é obrigatório." }, { status: 400 });
  }

  if (!bancoId || isNaN(bancoId)) {
    return NextResponse.json({ mensagem: "BancoId é obrigatório e deve ser um número válido." }, { status: 400 });
  }

  const banco = await prisma.bancoQuestao.findUnique({
    where: {
      id: bancoId,
    },
  });

  if (!banco || banco.professorId !== usuario.professorId) {
    return NextResponse.json({ mensagem: "Banco não encontrado." }, { status: 404 });
  }

  const questao = await prisma.questao.create({
    data: {
      bancoId,
      tipo,
      enunciado,
      peso,
      gabarito,
    },
  });

  return NextResponse.json(questao, { status: 201 });
}

export async function DELETE(request: Request) {
  const usuario = await requireProfessor();

  if (!usuario) {
    return NextResponse.json({ mensagem: "Não autorizado." }, { status: 401 });
  }

  const url = new URL(request.url);
  const questaoId = Number(url.searchParams.get("questaoId"));

  if (!questaoId || isNaN(questaoId)) {
    return NextResponse.json({ mensagem: "QuestaoId é obrigatório e deve ser um número válido." }, { status: 400 });
  }

  const questao = await prisma.questao.findUnique({
    where: { id: questaoId },
    include: { banco: true },
  });

  if (!questao) {
    return NextResponse.json({ mensagem: "Questão não encontrada." }, { status: 404 });
  }

  if (questao.banco.professorId !== usuario.professorId) {
    return NextResponse.json({ mensagem: "Não autorizado." }, { status: 403 });
  }

  await prisma.questao.delete({
    where: { id: questaoId },
  });

  return NextResponse.json({ mensagem: "Questão deletada com sucesso." });
}
