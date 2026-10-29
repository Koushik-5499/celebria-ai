import { Router, Request, Response } from 'express';
import { GeneratePlanRequestSchema } from '../schemas/validation.js';
import { generateEventPlanWithAI } from '../services/gemini.js';
import { z } from 'zod';

export const aiRouter = Router();

aiRouter.post('/generate-plan', async (req: Request, res: Response) => {
  try {
    const validatedData = GeneratePlanRequestSchema.parse(req.body);
    const result = await generateEventPlanWithAI(
      validatedData.event,
      validatedData.customInstructions
    );

    res.json({
      success: true,
      plan: result.plan,
      generationMode: result.generationMode,
      message: result.message,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors.map(e => `${e.path.join('.')}: ${e.message}`),
      });
      return;
    }

    console.error('[Celebria Server] AI route error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate event plan',
      message: error?.message || 'Internal server error',
    });
  }
});
