import 'dotenv/config';
const TOTAL_SHARDS = 2;

export const getShardIndex = (merchantId: number): number =>{
    if(!merchantId) throw new Error("merchant ID is required for sharding routing");
    return merchantId % TOTAL_SHARDS;
};

//dynamically constructs  the data bsee url from a specific shard this prevents us from hardcodeing connection strings in the code 

export const getShardUrl =(shardIndex: number): string =>{
    //this is the dynamic lookup
    const envKey = process.env[envKey];
    const url = process.env[envKey];

    if(!url) {
        throw new Error(`Configuration Error: ${envKey} is missing in .env`);

    }
    return url;

};