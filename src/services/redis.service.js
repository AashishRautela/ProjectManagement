import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();
// Initialize Redis connection
console.log('process.env.REDIS_HOST', process.env.REDIS_HOST);
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
  enableReadyCheck: false
});

// Set OTP with expiry
export const setDataInRedis = async (key, value, expiryInSeconds = 300) => {
  try {
    const response = await redis.set(key, value, 'EX', expiryInSeconds);
    return response;
  } catch (error) {
    console.error('❌ Redis SET error:', error);
    throw error;
  }
};

// Get OTP
export const getDataFromRedis = async (key) => {
  try {
    return await redis.get(key);
  } catch (error) {
    console.error('❌ Redis GET error:', error);
    throw error;
  }
};

// Delete OTP after verification
export const deleteDataFromRedis = async (key) => {
  try {
    return await redis.del(key);
  } catch (error) {
    console.error('❌ Redis DEL error:', error);
    throw error;
  }
};

export default redis;
