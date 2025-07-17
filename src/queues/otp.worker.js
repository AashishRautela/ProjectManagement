import { Worker } from 'bullmq';
import redis from '../services/redis.service.js';
import { sendEmail } from '../services/mail.service.js';

const worker = new Worker(
  'otpQueue',
  async (job) => {
    console.log('worker called--');
    const { email, otp } = job.data;
    console.log(`Sending OTP to ${email}...`);
    await sendEmail({ email, otp });
  },
  { connection: redis }
);

worker.on('active', (job) => {
  console.log(`Processing job ${job.id}`);
});

worker.on('completed', (job) => {
  console.log(`${job.id} has completed!`);
});

worker.on('failed', (job, err) => {
  console.log(`${job.id} has failed with ${err.message}`);
});
