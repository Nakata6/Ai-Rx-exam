import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { safeParseJSON } from '@/lib/utils/parse-json';
import { pharmacyGuard } from '@/lib/ai/pharmacy-guard';
import { Q_SYS } from '@/lib/ai/prompts';
import type { Question } from '@/types/exam';

interface GenerateRequest {
  topic: string;
  type: string;
  difficulty: string;
  questionNumber: number;
  usedTopics: string[];
}

export async function POST(req: NextRequest) {
  try {
    const body: GenerateRequest = await req.json();
    const { topic, type, difficulty, questionNumber, usedTopics } = body;

    if (!topic || !type || !difficulty) {
      return NextResponse.json(
        { error: 'Missing required fields: topic, type, difficulty' },
        { status: 400 }
      );
    }

    const guard = pharmacyGuard(topic);
    if (!guard.valid) {
      return NextResponse.json(
        { error: '🔬 This app is for pharmacy topics only.', code: 'PHARMACY_GUARD' },
        { status: 422 }
      );
    }

    const byokKey = req.headers.get('x-api-key');
    const apiKey  = byokKey || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'No API key configured. Add your Gemini key in Settings.', code: 'NO_KEY' },
        { status: 401 }
      );
    }

    const recentTopics = usedTopics.slice(-20).join(', ');
    const contextNote  = recentTopics
      ? `Previously used topics (DO NOT repeat): ${recentTopics}.`
      : 'This is the first question.';

    const userPrompt = [
      `Generate exam question #${questionNumber}.`,
      `REQUIRED TYPE: ${type}`,
      `REQUIRED TOPIC: ${topic}`,
      `REQUIRED DIFFICULTY: ${difficulty}`,
      contextNote,
      'Be creative, clinically relevant, and pharmacology-focused.',
    ].join('\n');

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: Q_SYS,
    });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      generationConfig: { maxOutputTokens: 800, temperature: 0.9 },
    });

    const raw    = result.response.text().trim();
    const parsed = safeParseJSON<Question>(raw);

    if (!parsed.question || !parsed.correct || !parsed.type) {
      return NextResponse.json(
        { error: 'AI returned an unexpected format. Please try again.', code: 'INVALID_JSON' },
        { status: 422 }
      );
    }

    if (parsed.type === 'mcq' && (!parsed.options || parsed.options.length !== 4)) {
      return NextResponse.json(
        { error: 'AI returned malformed MCQ options.', code: 'INVALID_MCQ' },
        { status: 422 }
      );
    }

    return NextResponse.json({ question: parsed }, { status: 200 });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    if (message.includes('429'))
      return NextResponse.json({ error: 'Rate limit exceeded. Wait a moment.', code: 'RATE_LIMIT' }, { status: 429 });
    if (message.includes('401'))
      return NextResponse.json({ error: 'Invalid API key.', code: 'AUTH_ERROR' }, { status: 401 });
    if (message.includes('quota'))
      return NextResponse.json({ error: 'API quota exhausted.', code: 'QUOTA' }, { status: 402 });

    console.error('[generate-question]', message);
    return NextResponse.json({ error: 'AI service error. Please try again.', code: 'SERVER_ERROR' }, { status: 500 });
  }
}
