import 'dotenv/config';

// CONSTANT: How many shards do we have?
const TOTAL_SHARDS = 2;

// THE FORMULA: Modulo Operator (%)
export const getShardIndex = (userId: number): number => {
  return userId % TOTAL_SHARDS;
};

export const getShardUrl = (shardIndex: number): string => {
  const shardMap: Record<number, string | undefined> = {
    0: process.env.SHARD0_URL,
    1: process.env.SHARD1_URL,
  };

  const url = shardMap[shardIndex];
  if (!url) throw new Error(`Shard ${shardIndex} URL is missing.`);
  return url;
};