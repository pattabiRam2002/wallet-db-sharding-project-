import { userRepository } from '../repositories/userRepository.js';
import { walletRepository } from '../repositories/walletRepository.js';
import { getShardIndex, getShardUrl } from '../utils/shardManager.js';

export const userService = {
  register: async (email: string, password: string) => {
    console.log(`\n--- Starting Registration for ${email} ---`);

    // 1. Create User first (Central DB)
    // We need the generated 'id' to know which shard to use.
    const user = await userRepository.create(email, password);
    console.log(`✅ Central DB: User created (ID: ${user.id})`);

    // 2. Calculate Shard using the Formula
    const shardIndex = getShardIndex(user.id);
    const shardUrl = getShardUrl(shardIndex);
    
    console.log(`📍 Formula (ID % 2): User ${user.id} goes to Shard ${shardIndex}`);

    // 3. Create Wallet (Shard DB)
    const wallet = await walletRepository.create(shardUrl, user.id);
    console.log(`✅ Shard DB (${shardIndex}): Wallet created`);

    return { user, wallet, shardIndex };
  }
};