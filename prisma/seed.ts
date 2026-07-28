//salvando um novo professor e seu login fazendo a criptografia da senha
import bcrypt from "bcryptjs";
import "dotenv/config";
import { prisma } from "../lib/prisma";

async function main() {
  const senhaCriptografada = await bcrypt.hash("123456", 10); // a senha que o usuario escolheu + 10 salts que geram o hash da senha

  //atualizando a senha ou criando se nao existir -> update + insert
  const professor = await prisma.professor.upsert({
    where: {
      email: "professor1@email.com",
    },
    update: {},
    create: {
      nome: "Professor 1",
      email: "professor@email.com",
      senha: senhaCriptografada,
    },
  });

  console.log("Professor criado com sucesso:");
  console.log({
    id: professor.id,
    nome: professor.nome,
    email: professor.email,
  });
}

main()
  .catch((erro) => {
    console.error("Erro ao criar professor:", erro);
    process.exit(1);
  })
  .finally(async () => { // fechando conexao com o banco
    await prisma.$disconnect();
  });