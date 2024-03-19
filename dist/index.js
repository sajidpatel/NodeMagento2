"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
console.log('Environment variables loaded. Application starting...');
// Error handling for missing .env configurations
if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME || !process.env.REDIS_HOST || !process.env.REDIS_PORT || !process.env.PORT) {
    console.error('Missing required environment variables. Please check your .env file.');
    process.exit(1); // Exit the application if configuration is missing
}
else {
    console.log('All required environment variables are present.');
}
try {
    require('./app');
    console.log('Express server has been started successfully.');
}
catch (error) {
    console.error('Failed to start the Express server:', error);
    process.exit(1); // Exit the application if the server fails to start
}
