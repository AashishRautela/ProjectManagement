import { Queue } from 'bullmq';
import redis from '../services/redis.service.js';

export const otpQueue = new Queue('otpQueue', {
  connection: redis
});

// Function to add job
export const sendOtpJob = async (data) => {
  console.log('data at send otp job', data);

  console.log('called otp->');
  await otpQueue.add('sendOtp', data);
  console.log('job added->');
};
