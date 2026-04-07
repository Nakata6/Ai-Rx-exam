'use client';
import { COLORS as c } from '@/constants/colors';
import { ALL_TOPICS } from '@/constants/topics';

const TAGS = [
  'ANS', 'CVS', 'CNS', 'Antibiotics', 'Oncology',
  'Endocrine', 'Renal', 'Cases', 'PK/PD', 'Toxicology',
  'Dermatology', 'Vaccines',
];

export default function WelcomeScreen({ onStart }: { onStart(): void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center gap-5 py-8">
      <div className="text-5xl">⬡</div>

      <div>
        <div className="text-4xl font-black tracking-tight" style={{ color: c.text }}>
          Rx <span style={{ color: c.green }}>Exam</span>
        </div>
        <div className="font-mono text-[10px] tracking-widest uppercase mt-1.5" style={{ color: c.muted }}>
          Pharmacist · Clinical · AI-Powered
        </div>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {TAGS.map((t) => (
          <span
            key={t}
            className="px-3 py-1 rounded-full text-xs"
            style={{ border: `1px solid ${c.border}`, background: c.s1, color: c.muted }}
          >
            {t}
          </span>
        ))}
      </div>

      <div className="text-xs leading-relaxed max-w-[280px]" style={{ color: c.muted }}>
        أسئلة متنوعة · تصحيح فوري بالذكاء الاصطناعي<br />
        MCQ · T/F · Fill · Explain · Cases<br />
        <span className="font-mono">{ALL_TOPICS.length}+ topic</span>
      </div>

      <button
        onClick={onStart}
        className="w-full max-w-xs py-4 font-bold text-base rounded-xl hover:opacity-90 transition-opacity"
        style={{ background: c.green, color: '#000' }}
      >
        ابدأ الاختبار ←
      </button>
    </div>
  );
}
