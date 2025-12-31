import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

// Factory function to create a client for a specific URL
const createClient = (url: string | undefined, name: string) => {
  if (!url) throw new Error(`Missing URL for ${name}`);
  
  const pool = new Pool({ connectionString: url });
  const adapter = new PrismaPg(pool);
  
  // Return a new instance specific to this pool
  return new PrismaClient({ adapter });
};

// Initialize 3 separate clients
const centralDb = createClient(process.env.DATABASE_URL, 'Central');
const shard0    = createClient(process.env.SHARD0_URL, 'Shard 0');
const shard1    = createClient(process.env.SHARD1_URL, 'Shard 1');

async function main() {
  try {
    console.log("🚀 Starting Multi-DB Connection Test...");

    // 1. Test Central
    console.log("-----------------------------------");
    console.log("🔌 Connecting to Central DB...");
    await centralDb.$connect();
    const centralUser = await centralDb.user.create({ data: { email: `central_${Date.now()}@test.com` }});
    console.log(`✅ Central: Created User ID ${centralUser.id}`);

    // 2. Test Shard 0
    console.log("-----------------------------------");
    console.log("🔌 Connecting to Shard 0...");
    await shard0.$connect();
    const shard0User = await shard0.user.create({ data: { email: `shard0_${Date.now()}@test.com` }});
    console.log(`✅ Shard 0: Created User ID ${shard0User.id}`);

    // 3. Test Shard 1
    console.log("-----------------------------------");
    console.log("🔌 Connecting to Shard 1...");
    await shard1.$connect();
    const shard1User = await shard1.user.create({ data: { email: `shard1_${Date.now()}@test.com` }});
    console.log(`✅ Shard 1: Created User ID ${shard1User.id}`);

  } catch (error) {
    console.error("❌ Connection failed:", error);
  } finally {
    await centralDb.$disconnect();
    await shard0.$disconnect();
    await shard1.$disconnect();
  }
}

main();