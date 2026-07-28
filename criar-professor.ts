import "dotenv/config";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const senha = await bcrypt.hash("123456", 10);

  await prisma.professor.create({
    data: {
      nome: "Alex",
      email: "alex@email.com",
      senha,
    },
  });

  console.log("Professor criado!");
}

main();