import { scheduler } from '$lib/automation/scheduler.js';

let initialized = false;

export async function handle({ event, resolve }) {
  // Initialize scheduler on first request
  if (!initialized && process.env.NODE_ENV === 'production') {
    try {
      scheduler.start();
      initialized = true;
      console.log('AI Revenue Optimizer scheduler started');
    } catch (error) {
      console.error('Failed to start scheduler:', error);
    }
  }

  const response = await resolve(event);
  return response;
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Shutting down scheduler...');
  scheduler.stop();
});

process.on('SIGINT', () => {
  console.log('Shutting down scheduler...');
  scheduler.stop();
});