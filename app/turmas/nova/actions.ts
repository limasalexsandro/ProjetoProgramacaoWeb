"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function criarTurma(formData: FormData) {
  const nome = formData.get("nome") as string;
  const codigo = formData.get("codigo") as string;
  const semestre = formData.get("semestre") as string;

  await prisma.turma.create({
    data: {
      nome,
      codigo,
      semestre,
    },
  });

  redirect("/turmas");
}