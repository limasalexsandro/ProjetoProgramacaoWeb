"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function criarAluno(formData: FormData) {

  const turmaId = Number(formData.get("turmaId"));

  await prisma.aluno.create({

    data: {

      nome: formData.get("nome") as string,

      matricula: formData.get("matricula") as string,

      email: formData.get("email") as string,

      turmaId,

    },

  });

  redirect(`/turmas/${turmaId}/alunos`);
}