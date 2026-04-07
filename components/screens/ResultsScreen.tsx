'use client';
import { useState, useEffect } from 'react';
import { COLORS as c } from '@/constants/colors';
import { ALL_TOPICS } from '@/constants/topics';
import { computeScore } from '@/lib/utils/exam-helpers';
import type { Score } from '@/types/exam';

interface Props {
  score:           Score;
  qNum:            number;
  streakRef:       React.MutableRefObject<number>;
  topicsUsedCount: number;
  onResume():  void;
  onRestart(): void;
}

export default function ResultsScreen({ score, qNum, streakRef, topicsUsedCount, onResume, onRestart }: Props) {
  const { points, total, accuracy } = computeScore(score);
  const grade    = accuracy >= 90 ? 'A' : accuracy >= 80 ? 'B' : accuracy >= 70 ? 'C' : accuracy >= 60 ? 'D' : 'F';
  const gradeCol = accuracy >= 80 ? c.green : accuracy >= 60 ? c.gold : c.red;
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const key = typeof window !== 'undefined' ? (localStorage.getItem('rx-exam-gemini-key') ?? '') : '';
    fetch('/api/motivate', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': key },
      body:    JSON.stringify({ accuracy, total }),
    })
      .then((r) => r.json())
      .then((d) => setMsg(d.message))
      .catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const stats: [string, string, string, string][] = [
    ['🔥', 'أطول سلسلة',    `${streakRef.current}`,                     c.gold],
    ['📊', 'الدقة',          `${accuracy}%`,                             accuracy >= 60 ? c.green : c.red],
    ['📚', 'مواضيع',         `${topicsUsedCount}/${ALL_TOPICS.length}`,  c.green],
    ['❓', 'الأسئلة',        `${total}`,                                 c.muted],
  ];

  return (
    <div className="flex-1 flex flex-col gap-4 py-2">
      {/* Grade card */}
      <div className="text-center rounded-xl p-6" style={{ background: c.s1, border: `1px solid ${c.border}` }}>
        <div className="font-mono text-[10px] tracking-widest uppercase mb-3" style={{ color: c.muted }}>
          نتائج الجولة · سؤال #{qNum}
        </div>
        <div className="text-7xl font-black leading-none mb-2" style={{ color: gradeCol }}>{grade}</div>
        <div className="text-3xl font-bold mb-1" style={{ color: c.text }}>
          {points % 1 === 0 ? points : points.toFixed(1)}/{total}
        </div>
        <div className="text-sm" style={{ color: c.muted }}>
          {score.c} صحيح · {score.p} جزئي · {score.w} خطأ
        </div>
        {msg && <div className="mt-3 text-sm" style={{ color: c.gold }}>{msg}</div>}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {stats.map(([ic, lbl, val, col]) => (
          <div key={lbl} className="rounded-xl p-4" style={{ background: c.s1, border: `1px solid ${c.border}` }}>
            <div className="text-lg mb-1">{ic}</div>
            <div className="font-mono text-[9px] tracking-widest uppercase mb-1" style={{ color: c.muted }}>{lbl}</div>
            <div className="text-base font-bold" style={{ color: col }}>{val}</div>
          </div>
        ))}
      </div>

      <button
        onClick={onResume}
        className="w-full py-3.5 font-bold text-sm rounded-xl"
        style={{ background: c.green, color: '#000' }}
      >
        تابع الاختبار ←
      </button>
      <button
        onClick={onRestart}
        className="w-full py-3 rounded-xl text-sm"
        style={{ border: `1px solid ${c.border}`, color: c.muted }}
      >
        ابدأ من جديد ↺
      </button>
    </div>
  );
}
