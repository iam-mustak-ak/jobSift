import dotenv from "dotenv";
dotenv.config();

import Redis from "ioredis";

console.log(process.env.REDIS_CONNECTION_URI!);

const redis = new Redis(process.env.REDIS_CONNECTION_URI!);

export default redis;
