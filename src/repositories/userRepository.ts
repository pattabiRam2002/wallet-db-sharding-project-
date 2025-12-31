import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const centralClient = new PrismaClient({ adapter });

export const userRepository = {
  // SIMPLIFIED: No shardId needed here anymore
  create: async (email: string, password: string) => {
    return await centralClient.user.create({
      data: {
        email,
        password,
      },
    });
  },

  findByEmail: async (email: string) => {
    return await centralClient.user.findUnique({
      where: { email },
    });
  }
};