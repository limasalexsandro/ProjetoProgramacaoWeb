"use server";

"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function criarTurma(formData: FormData) {
  const nome = formData.get("nome") as string;
  const codigo = formData.get("codigo") as string;
  const semestre = formData.get("semestre") as string;

  const turmaExistente = await prisma.turma.findUnique({
    where: { codigo },
  });

  if (turmaExistente) {
    redirect("/turmas/nova?erro=codigo");
  }

  await prisma.turma.create({
    data: {
      nome,
      codigo,
      semestre,
    },
  });

  redirect("/turmas");
}