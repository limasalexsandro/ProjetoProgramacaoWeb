import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export type TokenPayload = {
  professorId: number;
  nome: string;
  email: string;
};

export async function requireProfessor() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return null;
  }

  return verificarToken(token);
}

//a funcao abaixo recebe o JWT armazenado no cookie e verifica se ele foi assinado com a chave correta, se ele nao foi alterado, se nao expirou, etc
export function verificarToken(token: string): TokenPayload | null {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("A variável JWT_SECRET não foi definida.");
  }

  try {
    return jwt.verify(token, jwtSecret) as TokenPayload;
  } catch {
    return null;
  }
}