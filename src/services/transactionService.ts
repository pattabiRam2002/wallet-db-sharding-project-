import { userRepository } from '../repositories/userRepository.js';
import { walletRepository } from '../repositories/walletRepository.js';
import { getShardIndex, getShardUrl } from '../utils/shardManager.js';

export const transactionService = {
  deposit: async (email: string, amount: number) => {
    console.log(`\n--- Initiating Deposit for ${email} ---`);

    // 1. Get User ID (Central DB)
    const user = await userRepository.findByEmail(email);
    if (!user) throw new Error("User not found");
    
    // 2. Calculate Shard Location (No DB Query needed for this part!)
    const shardIndex = getShardIndex(user.id);
    const shardUrl = getShardUrl(shardIndex);

    console.log(`📍 Calculated: User ID ${user.id} is on Shard ${shardIndex}`);

    // 3. Execute
    const result = await walletRepository.deposit(shardUrl, user.id, amount);
    return result;
  }
};