import { NextResponse } from "next/server";
import { z } from "zod"; // biblioteca de validaçao usada no projeto
import bcrypt from "bcryptjs"; // para comparar a senha digitada com a senha crciptografada
import { prisma } from "@/lib/prisma"; // usado para procurar o prof no postgres
import jwt from "jsonwebtoken";


// lógica de login: email e senha são obrigatórios e senha deve ter pelo menos 6 caracteres
const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "O email é obrigatório.")
    .email("Informe um email válido."),

  senha: z
    .string()
    .min(1, "A senha é obrigatória.")
    .min(6, "A senha deve possuir pelo menos 6 caracteres."),
});

// função que lida com o envio do login para a API
// se os dados de login estiverem errados, a api retorna status code 400
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const resultado = loginSchema.safeParse(body);

    if (!resultado.success) {
      return NextResponse.json(
        {
          mensagem: "Dados inválidos.",
          erros: resultado.error.flatten().fieldErrors,
        },
        {
          status: 400,
        }
      );
    }

    const { email, senha } = resultado.data;

    //procura um professor pelo email
    const professor = await prisma.professor.findUnique({
      where: {
        email,
      },
    });

    if (!professor) {
      return NextResponse.json(
        {
          mensagem: "Email ou senha inválidos.",
        },
        {
          status: 401,
        }
      );
    }

    const senhaCorreta = await bcrypt.compare(senha, professor.senha);

    if (!senhaCorreta) {
      return NextResponse.json(
        {
          mensagem: "Email ou senha inválidos.",
        },
        {
          status: 401,
        }
      );
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
    throw new Error("A variável JWT_SECRET não foi definida.");
    }

    const token = jwt.sign(
    {
        professorId: professor.id,
        nome: professor.nome,
        email: professor.email,
    },
    jwtSecret,
    {
        expiresIn: "1d",
    }
    );

    const response = NextResponse.json({
    mensagem: "Login realizado com sucesso!",
    professor: {
        id: professor.id,
        nome: professor.nome,
        email: professor.email,
    },
    });

    response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
        path: "/",
    });

    return response;

  } catch (erro) {
    console.error("Erro ao realizar login:", erro);

    return NextResponse.json(
      {
        mensagem: "Erro interno do servidor.",
      },
      {
        status: 500,
      }
    );
  }
}