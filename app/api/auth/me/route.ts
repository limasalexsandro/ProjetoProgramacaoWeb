import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verificarToken } from "@/lib/auth";

export async function GET() {
  const cookieStore = await cookies(); // await pq cookies() é assincrona
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      {
        mensagem: "Usuário não autenticado.",
      },
      {
        status: 401,
      }
    );
  }

  const dadosToken = verificarToken(token);

  if (!dadosToken) {
    return NextResponse.json(
      {
        mensagem: "Token inválido ou expirado.",
      },
      {
        status: 401,
      }
    );
  }

  return NextResponse.json({
    professor: {
      id: dadosToken.professorId,
      nome: dadosToken.nome,
      email: dadosToken.email,
    },
  });
}