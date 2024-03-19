import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import productRoutes from './routes/productRoutes';

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`Received ${req.method} request for ${req.path} with query parameters: ${JSON.stringify(req.query)}`);
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} request for ${req.path} completed with status ${res.statusCode} in ${duration}ms`);
    });
    next();
});

// Serve static files - This is the new middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

const port = process.env.PORT || 3001; // Fallback to 3001 if PORT is not specified in .env

// Health check route
app.get('/ping', (req, res) => {
    console.log('Received request on /ping route');
    res.status(200).json({ status: 'OK' });
});

// Product search routes
app.use('/api/products', productRoutes);

// Route handler for styles.css.map to prevent 404 errors in logs
app.get('/api/products/styles.css.map', (req: Request, res: Response) => {
    console.log('Request for /api/products/styles.css.map intercepted. File not served.');
    res.status(200).json({ message: 'This file is not served by the server.' });
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Global error handler middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(`An error occurred: ${err.message}\n${err.stack}`);
    res.status(500).json({ error: 'Internal server error' });
});

export default app;