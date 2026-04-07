import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { safeParseJSON } from '@/lib/utils/parse-json';
import { G_SYS } from '@/lib/ai/prompts';

export async function POST(req: NextRequest) {
  try {
    const { question, correct, userAnswer, type } = await req.json();
    const apiKey = req.headers.get('x-api-key') || process.env.GEMINI_API_KEY || '';

    if (!apiKey) {
      return NextResponse.json({ error: 'No API key', code: 'NO_KEY' }, { status: 401 });
    }

    const model = new GoogleGenerativeAI(apiKey).getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: G_SYS,
    });

    const res = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [{ text: `Question: ${question}\nExpected: ${correct}\nStudent: "${userAnswer}"\nType: ${type}` }],
      }],
      generationConfig: { maxOutputTokens: 400, temperature: 0.3 },
    });

    const grading = safeParseJSON(res.response.text().trim());
    return NextResponse.json({ grading });

  } catch (err: unknown) {
    const m = err instanceof Error ? err.message : '';
    if (m.includes('429'))
      return NextResponse.json({ error: 'Rate limit', code: 'RATE_LIMIT' }, { status: 429 });
    return NextResponse.json({ error: 'Grading failed', code: 'SERVER_ERROR' }, { status: 500 });
  }
}
