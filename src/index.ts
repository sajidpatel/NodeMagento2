import dotenv from 'dotenv';
import app from './app';

dotenv.config();
console.log('Environment variables loaded. Application starting...');

// Error handling for missing .env configurations
if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME || !process.env.REDIS_HOST || !process.env.REDIS_PORT || !process.env.PORT) {
  console.error('Missing required environment variables. Please check your .env file.');
  process.exit(1); // Exit the application if configuration is missing
} else {
  console.log('All required environment variables are present.');
}