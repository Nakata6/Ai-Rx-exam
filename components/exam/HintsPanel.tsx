'use client';
import { COLORS as c } from '@/constants/colors';

interface Props {
  hints:      string[];
  loading:    boolean;
  onGetHint(): void;
}

export default function HintsPanel({ hints, loading, onGetHint }: Props) {
  return (
    <div className="space-y-2">
      {hints.length > 0 && (
        <div
          className="rounded-lg p-3 space-y-2.5"
          style={{ background: 'rgba(255,201,64,.07)', border: '1px solid rgba(255,201,64,.3)' }}
        >
          <div className="font-mono text-[9px] tracking-widest uppercase" style={{ color: c.gold }}>
            💡 Hints ({hints.length}/3)
          </div>
          {hints.map((h, i) => (
            <div key={i} className="flex gap-2">
              <span className="font-mono text-[9px] mt-0.5 shrink-0" style={{ color: c.gold }}>
                {i + 1}.
              </span>
              <p className="text-sm leading-relaxed" style={{ color: '#e8d47a', direction: 'auto' }}>
                {h}
              </p>
            </div>
          ))}
        </div>
      )}

      {hints.length < 3 && (
        <button
          onClick={onGetHint}
          disabled={loading}
          className="text-xs px-3 py-1.5 rounded-lg"
          style={{
            border:     `1px solid ${c.border}`,
            color:      c.muted,
            background: c.s2,
            opacity:    loading ? 0.5 : 1,
            cursor:     loading ? 'default' : 'pointer',
          }}
        >
          {loading ? '⏳ جارٍ…' : `💡 ${hints.length === 0 ? 'تلميح' : 'تلميح آخر'} (${hints.length}/3)`}
        </button>
      )}
    </div>
  );
}
