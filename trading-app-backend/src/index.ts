import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { MarketDataService } from './services/mockApi.service.js';

// Import routes
import authRoutes from './api/auth/auth.routes.js';
import marketRoutes from './api/market/market.routes.js';
import watchlistRoutes from './api/watchlist/watchlist.routes.js'; // New watchlist route

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 8080;

// Initialize and start the market data simulation service
MarketDataService.getInstance();

// Secure CORS Policy
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));



// Standard Middleware
app.use(express.json());

app.use('/health', (req: Request, res: Response) => {
  return res.json(
    { status: 'OK', timestamp: new Date().toISOString() }
  );
});

// Load OpenAPI spec from the YAML file
const swaggerDocument = YAML.load(path.join(process.cwd(), 'src/openapi.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/watchlist', watchlistRoutes); // Mount new watchlist routes

// Handle 404 Not Found errors
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});