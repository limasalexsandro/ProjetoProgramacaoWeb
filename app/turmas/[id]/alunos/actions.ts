"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function removerAluno(formData: FormData) {
  const id = Number(formData.get("id"));
  const turmaId = Number(formData.get("turmaId"));

  try {
    await prisma.aluno.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    console.error("Erro ao remover aluno:", error);
  }

  redirect(`/turmas/${turmaId}/alunos`);
}