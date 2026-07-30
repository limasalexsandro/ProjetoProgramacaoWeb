"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function criarAvaliacao(formData: FormData) {

  const titulo = formData.get("titulo") as string;
  const descricao = formData.get("descricao") as string;
  const data = formData.get("data") as string;
  const turmaId = Number(formData.get("turmaId"));

  await prisma.avaliacao.create({
    data: {
      titulo,
      descricao,
      data: new Date(data),
      turmaId,
    },
  });

  redirect(`/turmas/${turmaId}`);
}