import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { HINT_SYS } from '@/lib/ai/prompts';

export async function POST(req: NextRequest) {
  try {
    const { question, hintNumber, previousHints = [] } = await req.json();
    const apiKey = req.headers.get('x-api-key') || process.env.GEMINI_API_KEY || '';

    if (!apiKey) {
      return NextResponse.json({ error: 'No API key' }, { status: 401 });
    }

    const model = new GoogleGenerativeAI(apiKey).getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: HINT_SYS,
    });

    const prev = (previousHints as string[]).length
      ? `Previous hints: ${(previousHints as string[]).join(' | ')} — give a DIFFERENT, more revealing hint.`
      : '';

    const res = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [{ text: `Question: "${question}"\nHint #${hintNumber}/3. ${prev}\nDo NOT reveal the answer. Match question language. Max 2 sentences.` }],
      }],
      generationConfig: { maxOutputTokens: 150, temperature: 0.7 },
    });

    return NextResponse.json({ hint: res.response.text().trim() });

  } catch {
    return NextResponse.json({ error: 'Hint failed' }, { status: 500 });
  }
}
