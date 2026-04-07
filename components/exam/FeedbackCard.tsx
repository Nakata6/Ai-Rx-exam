'use client';
import { COLORS as c } from '@/constants/colors';
import type { Feedback } from '@/types/exam';

interface Props {
  fb:      Feedback;
  onNext(): void;
  loading: boolean;
}

export default function FeedbackCard({ fb, onNext, loading }: Props) {
  const isOk   = fb.t === 'ok';
  const isPart = fb.t === 'partial';

  const bdr = isOk   ? 'rgba(0,232,122,.35)'
            : isPart ? 'rgba(255,201,64,.35)'
                     : 'rgba(255,77,109,.35)';
  const bg  = isOk   ? 'rgba(0,232,122,.08)'
            : isPart ? 'rgba(255,201,64,.08)'
                     : 'rgba(255,77,109,.08)';
  const col  = isOk ? c.green : isPart ? c.gold : c.red;
  const icon = isOk ? '✓'    : isPart ? '◑'    : '✗';

  return (
    <div className="space-y-3 fade-in">
      <div className="rounded-xl p-4 space-y-3" style={{ border: `1px solid ${bdr}`, background: bg }}>
        {/* Header */}
        <div className="flex items-center gap-2.5">
          <span className="text-lg">{icon}</span>
          <span className="text-sm font-bold" style={{ color: col }}>{fb.title}</span>
        </div>

        {/* Explanation */}
        {fb.body && (
          <p className="text-sm leading-relaxed" style={{ direction: 'auto' }}>{fb.body}</p>
        )}

        {/* Fun fact */}
        {fb.fact && (
          <div
            className="rounded-lg p-3"
            style={{ background: 'rgba(255,201,64,.08)', border: '1px solid rgba(255,201,64,.3)' }}
          >
            <div className="font-mono text-[9px] tracking-widest uppercase mb-1" style={{ color: c.gold }}>
              ★ Did You Know
            </div>
            <p className="text-sm leading-relaxed" style={{ color: '#e8d47a', direction: 'auto' }}>
              {fb.fact}
            </p>
          </div>
        )}
      </div>

      {/* Next */}
      <button
        onClick={onNext}
        disabled={loading}
        className="w-full py-3 font-bold text-sm rounded-lg transition-opacity"
        style={{
          border:     `1px solid ${c.green}`,
          color:      c.green,
          background: 'transparent',
          opacity:    loading ? 0.5 : 1,
          cursor:     loading ? 'default' : 'pointer',
        }}
      >
        السؤال التالي ←
      </button>
    </div>
  );
}
