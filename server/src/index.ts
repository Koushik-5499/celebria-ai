import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { app } from './app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 5000;

// Serve static frontend in production (for containerized / Node.js host execution)
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

app.listen(PORT, () => {
  console.log(`✨ Celebria AI Server running at http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🤖 AI Provider: ${process.env.GEMINI_API_KEY ? 'Configured (Live Gemini)' : 'Demo Mode Fallback'}`);
});
