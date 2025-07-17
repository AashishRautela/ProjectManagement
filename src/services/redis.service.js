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
export const setOtpInRedis = async (email, otp, expiryInSeconds = 300) => {
  try {
    const response = await redis.set(email, otp, 'EX', expiryInSeconds);
    return response; // Returns "OK" on success
  } catch (error) {
    console.error('❌ Redis SET error:', error);
    throw error;
  }
};

// Get OTP
export const getOtpFromRedis = async (email) => {
  try {
    return await redis.get(email);
  } catch (error) {
    console.error('❌ Redis GET error:', error);
    throw error;
  }
};

// Delete OTP after verification
export const deleteOtpFromRedis = async (email) => {
  try {
    return await redis.del(email);
  } catch (error) {
    console.error('❌ Redis DEL error:', error);
    throw error;
  }
};

export default redis;
