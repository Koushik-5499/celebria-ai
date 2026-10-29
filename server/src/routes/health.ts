import { Router } from 'express';

export const healthRouter = Router();

healthRouter.get('/', (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  const isAiConfigured = Boolean(apiKey && apiKey.trim() !== '' && !apiKey.includes('YOUR_API_KEY'));

  res.json({
    status: 'ok',
    service: 'Celebria AI API',
    tagline: 'Every celebration, beautifully planned.',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    aiProvider: {
      provider: 'Google Gemini',
      configured: isAiConfigured,
      model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
      mode: isAiConfigured ? 'LIVE_AI' : 'DEMO_MODE',
    },
  });
});
