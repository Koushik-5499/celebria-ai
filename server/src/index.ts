import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import rateLimit from 'express-rate-limit';
import { healthRouter } from './routes/health.js';
import { aiRouter } from './routes/ai.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Middlewares
app.use(helmet({
  contentSecurityPolicy: false, // Allows flexible modern SPA font/asset loading
  crossOriginEmbedderPolicy: false,
}));
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));

// Rate limiting for AI endpoints
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 60, // Limit each IP to 60 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many plan generation requests from this IP, please try again after 15 minutes.',
  },
});

// API Routes
app.use('/api/health', healthRouter);
app.use('/api/ai', aiLimiter, aiRouter);

// Serve static frontend in production
const clientDist = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(clientDist)) {
  console.log(`[Celebria Server] Serving static client build from ${clientDist}`);
  app.use(express.static(clientDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDist, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({
      message: 'Celebria AI API Server is running. Client build not found at client/dist. Run `npm run dev` for development or build client.',
      health: '/api/health',
    });
  });
}

// 404 for unmatched API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Celebria Server] Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message,
  });
});

app.listen(PORT, () => {
  console.log(`✨ Celebria AI Server running at http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🤖 AI Provider: ${process.env.GEMINI_API_KEY ? 'Configured (Live Gemini)' : 'Demo Mode Fallback'}`);
});
