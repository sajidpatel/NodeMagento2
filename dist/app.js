"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3001; // Fallback to 3001 if PORT is not specified in .env
// Health check route
app.get('/ping', (req, res) => {
    console.log('Received request on /ping route');
    res.status(200).json({ status: 'OK' });
});
// Start the Express server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
app.use((err, req, res, next) => {
    console.error(`An error occurred: ${err.message}\n${err.stack}`);
    res.status(500).json({ error: 'Internal server error' });
});
