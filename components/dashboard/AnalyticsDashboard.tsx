'use client';
import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { COLORS as c } from '@/constants/colors';
import TopicHeatmap, { type TopicStat } from './TopicHeatmap';
import { DailyChart, DailyBarChart, TypePieChart, type DailyStat, type TypeStat } from './PerformanceCharts';
import type { AttemptRecord } from '@/types/exam';

export default function AnalyticsDashboard({ onClose }: { onClose(): void }) {
  const { user, isGuest } = useAuth();
  const [attempts, setAttempts] = useState<AttemptRecord[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    if (isGuest || !user) { setLoading(false); return; }
    createClient()
      .from('question_attempts')
      .select('topic,result,question_type,difficulty,answered_at')
      .eq('user_id', user.id)
      .order('answered_at', { ascending: true })
      .then(({ data }) => {
        setAttempts((data ?? []) as AttemptRecord[]);
        setLoading(false);
      });
  }, [user?.id, isGuest]);

  const topicStats: TopicStat[] = useMemo(() => {
    const m = new Map<string, { c: number; t: number }>();
    for (const a of attempts) {
      const cur = m.get(a.topic) ?? { c: 0, t: 0 };
      m.set(a.topic, {
        c: cur.c + (a.result === 'correct' ? 1 : a.result === 'partial' ? 0.5 : 0),
        t: cur.t + 1,
      });
    }
    return Array.from(m.entries())
      .map(([topic, { c, t }]) => ({ topic, correct: c, total: t, accuracy: Math.round((c / t) * 100) }))
      .sort((a, b) => b.total - a.total);
  }, [attempts]);

  const dailyStats: DailyStat[] = useMemo(() => {
    const m   = new Map<string, { c: number; t: number }>();
    const cut = new Date();
    cut.setDate(cut.getDate() - 30);
    for (const a of attempts) {
      if (new Date(a.answered_at) < cut) continue;
      const d   = a.answered_at.slice(0, 10);
      const cur = m.get(d) ?? { c: 0, t: 0 };
      m.set(d, { c: cur.c + (a.result === 'correct' ? 1 : 0), t: cur.t + 1 });
    }
    return Array.from(m.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, { c, t }]) => ({ date: date.slice(5), accuracy: Math.round((c / t) * 100), count: t }));
  }, [attempts]);

  const typeStats: TypeStat[] = useMemo(() => {
    const m = new Map<string, { c: number; t: number }>();
    for (const a of attempts) {
      const cur = m.get(a.question_type) ?? { c: 0, t: 0 };
      m.set(a.question_type, { c: cur.c + (a.result === 'correct' ? 1 : 0), t: cur.t + 1 });
    }
    return Array.from(m.entries())
      .map(([type, { c, t }]) => ({ type, accuracy: Math.round((c / t) * 100), count: t }));
  }, [attempts]);

  const overall = useMemo(() => {
    if (!attempts.length) return 0;
    const pts = attempts.reduce((s, a) =>
      s + (a.result === 'correct' ? 1 : a.result === 'partial' ? 0.5 : 0), 0);
    return Math.round((pts / attempts.length) * 100);
  }, [attempts]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" style={{ background: c.bg }}>
      {/* Header */}
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-4 py-3"
        style={{ background: c.s1, borderBottom: `1px solid ${c.border}` }}
      >
        <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: c.muted }}>
          📊 إحصاءاتي
        </span>
        <button onClick={onClose} className="font-mono text-xs" style={{ color: c.muted }}>
          ✕ إغلاق
        </button>
      </div>

      <div className="max-w-xl mx-auto px-4 py-5 space-y-5">
        {/* Guest banner */}
        {isGuest && (
          <div
            className="text-xs text-center py-3 rounded-lg"
            style={{ background: 'rgba(255,201,64,.07)', border: '1px solid rgba(255,201,64,.3)', color: c.gold }}
          >
            سجّل حسابًا لعرض إحصاءاتك الكاملة عبر الجلسات
          </div>
        )}

        {loading ? (
          <div className="text-center py-10 font-mono text-xs" style={{ color: c.muted }}>
            جارٍ التحميل…
          </div>
        ) : (
          <>
            {/* Summary pills */}
            <div className="grid grid-cols-3 gap-2">
              {([
                ['إجمالي',    attempts.length.toString(), c.text],
                ['الدقة',     `${overall}%`,              overall >= 70 ? c.green : overall >= 50 ? c.gold : c.red],
                ['مواضيع',    topicStats.length.toString(), c.green],
              ] as [string, string, string][]).map(([lbl, val, col]) => (
                <div
                  key={lbl}
                  className="rounded-xl p-3 text-center"
                  style={{ background: c.s1, border: `1px solid ${c.border}` }}
                >
                  <div className="text-xl font-black" style={{ color: col }}>{val}</div>
                  <div className="font-mono text-[9px] mt-0.5" style={{ color: c.muted }}>{lbl}</div>
                </div>
              ))}
            </div>

            {/* Daily accuracy line chart */}
            {dailyStats.length > 0 && (
              <div className="rounded-xl p-4" style={{ background: c.s1, border: `1px solid ${c.border}` }}>
                <div className="font-mono text-[9px] tracking-widest uppercase mb-3" style={{ color: c.muted }}>
                  الدقة اليومية — آخر 30 يوم
                </div>
                <DailyChart data={dailyStats} />
              </div>
            )}

            {/* Questions per day bar chart */}
            {dailyStats.length > 0 && (
              <div className="rounded-xl p-4" style={{ background: c.s1, border: `1px solid ${c.border}` }}>
                <div className="font-mono text-[9px] tracking-widest uppercase mb-3" style={{ color: c.muted }}>
                  أسئلة يوميًا
                </div>
                <DailyBarChart data={dailyStats} />
              </div>
            )}

            {/* Question type breakdown */}
            {typeStats.length > 0 && (
              <div className="rounded-xl p-4" style={{ background: c.s1, border: `1px solid ${c.border}` }}>
                <div className="font-mono text-[9px] tracking-widest uppercase mb-3" style={{ color: c.muted }}>
                  أنواع الأسئلة
                </div>
                <TypePieChart data={typeStats} />
              </div>
            )}

            {/* Topic mastery heatmap */}
            {topicStats.length > 0 && (
              <div className="rounded-xl p-4" style={{ background: c.s1, border: `1px solid ${c.border}` }}>
                <div className="font-mono text-[9px] tracking-widest uppercase mb-3" style={{ color: c.muted }}>
                  إتقان المواضيع
                </div>
                <TopicHeatmap stats={topicStats} />
              </div>
            )}

            {/* Empty state */}
            {!attempts.length && !isGuest && (
              <div className="text-center py-10 text-sm" style={{ color: c.muted }}>
                أجب على بعض الأسئلة لترى إحصاءاتك هنا
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
