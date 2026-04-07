'use client';
import { COLORS as c } from '@/constants/colors';

export interface TopicStat {
  topic:    string;
  correct:  number;
  total:    number;
  accuracy: number;
}

export default function TopicHeatmap({ stats }: { stats: TopicStat[] }) {
  if (!stats.length) {
    return (
      <p className="text-xs text-center py-4" style={{ color: c.muted }}>
        لا توجد بيانات بعد
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {stats.map((s) => {
        const col = s.accuracy >= 70 ? c.green : s.accuracy >= 50 ? c.gold : c.red;
        const bg  = s.accuracy >= 70
          ? 'rgba(0,232,122,.08)'
          : s.accuracy >= 50
          ? 'rgba(255,201,64,.08)'
          : 'rgba(255,77,109,.08)';

        return (
          <div
            key={s.topic}
            className="rounded-lg p-3"
            style={{ background: bg, border: `1px solid ${col}33` }}
          >
            <div
              className="text-[11px] font-medium leading-tight mb-1 truncate"
              style={{ color: c.text }}
            >
              {s.topic}
            </div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-sm" style={{ color: col }}>{s.accuracy}%</span>
              <span className="font-mono text-[9px]" style={{ color: c.muted }}>
                {s.correct}/{s.total}
              </span>
            </div>
            <div className="h-1 rounded-full" style={{ background: c.s2 }}>
              <div
                className="h-full rounded-full"
                style={{ width: `${s.accuracy}%`, background: col }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
