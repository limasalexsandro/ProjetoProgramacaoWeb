//

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client"; 


const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const connectionString = process.env.DATABASE_URL;

//if que verifica se existe a url do banco 
if (!connectionString) {
  throw new Error("A variável DATABASE_URL não foi definida.");
}

//o adapter serve para comunicação com o postgres
const adapter = new PrismaPg({
  connectionString,
});

//criando ou conectando com o prismaclient pra evitar conexoes desnecessarias e possiveis erros
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

  //salvando a conexão em tempo de desenvolvimento
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}