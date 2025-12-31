// src/repositories/walletRepository.ts
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

export const walletRepository = {
  create: async (shardUrl: string, userId: number) => {
    // ... (Your existing create logic, keep it here) ...
    // If you need me to paste the create logic again, let me know, 
    // but you can just append the 'deposit' function below.
    const pool = new Pool({ connectionString: shardUrl });
    const adapter = new PrismaPg(pool);
    const client = new PrismaClient({ adapter });
    
    try {
      await client.$connect();
      return await client.wallet.create({
        data: { userId, balance: 0.0 },
      });
    } finally {
      await client.$disconnect();
      await pool.end();
    }
  },

  // NEW: Atomic Deposit Logic
  deposit: async (shardUrl: string, userId: number, amount: number) => {
    const pool = new Pool({ connectionString: shardUrl });
    const adapter = new PrismaPg(pool);
    const client = new PrismaClient({ adapter });

    try {
      await client.$connect();

      // We use $transaction to ensure both happen or neither happens
      return await client.$transaction(async (tx) => {
        
        // 1. Find the wallet (and lock it if we were being super strict, but simple for now)
        const wallet = await tx.wallet.findUniqueOrThrow({
          where: { userId },
        });

        // 2. Update Balance
        const updatedWallet = await tx.wallet.update({
          where: { userId },
          data: { balance: { increment: amount } },
        });

        // 3. Create Transaction Record
        const transactionRecord = await tx.transaction.create({
          data: {
            amount,
            type: 'DEPOSIT',
            walletId: wallet.id,
          },
        });

        return { wallet: updatedWallet, transaction: transactionRecord };
      });

    } finally {
      await client.$disconnect();
      await pool.end();
    }
  }
};