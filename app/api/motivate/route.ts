import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  try {
    const { accuracy, total } = await req.json();
    const apiKey = req.headers.get('x-api-key') || process.env.GEMINI_API_KEY || '';

    if (!apiKey) {
      return NextResponse.json({ message: accuracy >= 70 ? 'أداء ممتاز! 🌟' : 'استمر في التعلم! 💊' });
    }

    const model = new GoogleGenerativeAI(apiKey).getGenerativeModel({
      model: 'gemini-2.0-flash',
    });

    const res = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [{ text: `Pharmacy student scored ${accuracy}% on ${total} questions. Write one motivational Arabic sentence. No quotes. No emojis except one at end.` }],
      }],
      generationConfig: { maxOutputTokens: 80, temperature: 0.9 },
    });

    return NextResponse.json({ message: res.response.text().trim() });

  } catch {
    return NextResponse.json({ message: 'استمر في التعلم والمراجعة! 💊' });
  }
}
