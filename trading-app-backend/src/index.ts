import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { openapiyaml } from './openapiyaml.js';
// Import routes with .js extension (even though they are .ts files)
import authRoutes from './api/auth/auth.routes.js';
import marketRoutes from './api/market/market.routes.js';
import portfolioRoutes from './api/portfolio/portfolio.routes.js';
import userRoutes from './api/user/user.routes.js';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 8080;

// Load Swagger document - make sure the path is correct
const swaggerDocument = YAML.parse(openapiyaml);
// Middleware
app.use(cors());
app.use(express.json());

app.get('/',(_,res:Response)=> res.send(
  `<h1>Welcome to VyaparTrade API</h1> `
));

// API Documentation Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API Routes
app.get('/api', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to VyaparTrade API!' });
});

// Mount Routers
app.use('/api/auth', authRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/user', userRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});