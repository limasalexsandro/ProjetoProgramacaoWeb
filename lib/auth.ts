import jwt from "jsonwebtoken";

export type TokenPayload = {
  professorId: number;
  nome: string;
  email: string;
};

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