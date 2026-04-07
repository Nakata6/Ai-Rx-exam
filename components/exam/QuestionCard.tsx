'use client';
import { BADGE, STRIPE, DIFF, COLORS as c } from '@/constants/colors';
import Dots from '@/components/layout/Dots';
import type { Question } from '@/types/exam';

interface Props {
  q:             Question | null;
  qNum:          number;
  loading:       boolean;
  loadTxt:       string;
  answered:      boolean;
  selOpt:        string | null;
  fillVal:       string;
  setFillVal(v:  string): void;
  expVal:        string;
  setExpVal(v:   string): void;
  canSubmit:     boolean;
  listening:     boolean;
  isBookmarked:  boolean;
  onToggleBookmark(): void;
  onSubmitMCQ(o: string): void;
  onSubmitTF(v:  string): void;
  onSubmitOpen(): void;
  onToggleVoice(): void;
}

export default function QuestionCard(p: Props) {
  if (!p.q && !p.loading) return null;
  const { q } = p;

  return (
    <div
      className="rounded-xl p-5 relative overflow-hidden fade-in"
      style={{ background: c.s1, border: `1px solid ${c.border}` }}
    >
      {/* Type accent stripe */}
      {q && !q.error && (
        <div
          className="absolute top-0 right-0 w-0.5 h-full"
          style={{ background: STRIPE[q.type] || c.green }}
        />
      )}

      {/* Meta row */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {q && !q.error && (() => {
          const [lbl, col, bc, bg] = BADGE[q.type] ?? BADGE.mcq;
          const [dLbl, dCol]       = DIFF[q.difficulty] ?? ['', ''];
          return (
            <>
              <span
                className="font-mono text-[9px] tracking-widest uppercase px-2.5 py-1 rounded"
                style={{ border: `1px solid ${bc}`, color: col, background: bg, fontWeight: 600 }}
              >
                {lbl}
              </span>
              <span
                className="text-[11px] px-2.5 py-1 rounded"
                style={{ background: c.s2, border: `1px solid ${c.border}`, color: c.muted }}
              >
                {q.topic}
              </span>
              <span className="text-xs" style={{ color: dCol, marginInlineStart: 'auto' }}>{dLbl}</span>
              <button
                onClick={p.onToggleBookmark}
                className="text-base leading-none"
                style={{ color: p.isBookmarked ? c.gold : c.muted }}
                title={p.isBookmarked ? 'Remove bookmark' : 'Bookmark'}
              >
                {p.isBookmarked ? '🔖' : '☆'}
              </button>
            </>
          );
        })()}
        <span className="font-mono text-[10px]" style={{ color: c.muted }}>#{p.qNum}</span>
      </div>

      {/* Question text / loading / error */}
      {p.loading && !q ? (
        <div className="flex items-center gap-3 font-mono text-xs mb-2" style={{ color: c.muted }}>
          <Dots />{p.loadTxt}
        </div>
      ) : q?.error ? (
        <div className="text-sm mb-2" style={{ color: c.red }}>⚠️ {q.error}</div>
      ) : (
        <div className="text-base font-semibold leading-relaxed mb-5" style={{ direction: 'auto' }}>
          {q?.question}
        </div>
      )}

      {/* Answer inputs */}
      {q && !q.error && (
        <>
          {/* ── MCQ ── */}
          {q.type === 'mcq' && ['A', 'B', 'C', 'D'].map((l, i) => {
            const isSel = l === p.selOpt;
            const isC   = p.answered && l === q.correct;
            const isW   = p.answered && l === p.selOpt && l !== q.correct;
            return (
              <button
                key={l}
                onClick={() => !p.answered && p.onSubmitMCQ(l)}
                disabled={p.answered}
                className="flex items-start gap-3 w-full text-right rounded-lg p-3 mb-2 text-sm transition-all"
                style={{
                  background: isC  ? 'rgba(0,232,122,.12)'
                            : isW  ? 'rgba(255,77,109,.12)'
                            : isSel? 'rgba(91,159,255,.12)'
                            : c.s2,
                  border: `1px solid ${isC ? c.green : isW ? c.red : isSel ? '#5b9fff' : c.border}`,
                  cursor:     p.answered ? 'default' : 'pointer',
                  color:      c.text,
                  fontFamily: 'inherit',
                }}
              >
                <span className="font-mono text-[9px] shrink-0 mt-0.5" style={{ color: c.muted }}>{l}</span>
                <span className="flex-1 leading-relaxed text-right" style={{ direction: 'auto' }}>
                  {(q.options?.[i] ?? '').replace(/^[A-D]\.\s*/, '')}
                </span>
              </button>
            );
          })}

          {/* ── T/F ── */}
          {q.type === 'tf' && (
            <div className="grid grid-cols-2 gap-3">
              {([['صحيح', '✓', 'true'], ['خطأ', '✗', 'false']] as const).map(([lbl, ic, val]) => {
                const isC = p.answered && val === q.correct;
                const isW = p.answered && val !== q.correct;
                return (
                  <button
                    key={val}
                    onClick={() => !p.answered && p.onSubmitTF(val)}
                    disabled={p.answered}
                    className="py-4 rounded-lg flex flex-col items-center gap-1 font-bold text-base transition-all"
                    style={{
                      border:     `1px solid ${isC ? c.green : isW ? c.red : c.border}`,
                      background: isC ? 'rgba(0,232,122,.12)' : isW ? 'rgba(255,77,109,.12)' : c.s2,
                      color:      isC ? c.green : isW ? c.red : c.text,
                      cursor:     p.answered ? 'default' : 'pointer',
                    }}
                  >
                    <span className="text-2xl">{ic}</span>
                    {lbl}
                  </button>
                );
              })}
            </div>
          )}

          {/* ── Fill ── */}
          {q.type === 'fill' && (
            <input
              value={p.fillVal}
              onChange={(e) => p.setFillVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && p.fillVal.trim() && p.onSubmitOpen()}
              placeholder="اكتب إجابتك..."
              disabled={p.answered}
              className="w-full px-4 py-3 rounded-lg text-sm outline-none"
              style={{
                background: c.s2,
                border:     `1px solid ${c.border}`,
                color:      c.text,
                direction:  'auto',
                fontFamily: 'inherit',
              }}
            />
          )}

          {/* ── Explain / Case ── */}
          {(q.type === 'explain' || q.type === 'case') && (
            <textarea
              value={p.expVal}
              onChange={(e) => p.setExpVal(e.target.value)}
              placeholder={q.type === 'case' ? 'اكتب تقييمك السريري…' : 'اشرح إجابتك…'}
              disabled={p.answered}
              rows={4}
              className="w-full px-4 py-3 rounded-lg text-sm outline-none resize-y leading-relaxed"
              style={{
                background: c.s2,
                border:     `1px solid ${c.border}`,
                color:      c.text,
                direction:  'auto',
                fontFamily: 'inherit',
                minHeight:  110,
              }}
            />
          )}

          {/* ── Submit row (fill / explain / case) ── */}
          {q.type !== 'tf' && q.type !== 'mcq' && (
            <div className="flex gap-2 mt-3 flex-wrap">
              <button
                onClick={p.onSubmitOpen}
                disabled={!p.canSubmit}
                className="flex-1 min-w-[100px] py-3 font-bold text-sm rounded-lg"
                style={{
                  background: c.green,
                  color:      '#000',
                  opacity:    p.canSubmit ? 1 : 0.35,
                  cursor:     p.canSubmit ? 'pointer' : 'default',
                }}
              >
                تحقق ←
              </button>
              <button
                onClick={p.onToggleVoice}
                className="px-3 py-3 rounded-lg text-sm"
                style={{
                  background: p.listening ? 'rgba(0,232,122,.1)' : c.s2,
                  border:     `1px solid ${p.listening ? c.green : c.border}`,
                  color:      p.listening ? c.green : c.muted,
                }}
              >
                {p.listening ? '🔴' : '🎤'}
              </button>
            </div>
          )}

          {/* ── Voice row (mcq / tf) ── */}
          {(q.type === 'mcq' || q.type === 'tf') && !p.answered && (
            <div className="flex gap-2 mt-2">
              <button
                onClick={p.onToggleVoice}
                className="px-3 py-2 rounded-lg text-xs"
                style={{
                  background: p.listening ? 'rgba(0,232,122,.1)' : c.s2,
                  border:     `1px solid ${p.listening ? c.green : c.border}`,
                  color:      p.listening ? c.green : c.muted,
                }}
              >
                {p.listening ? '🔴 جارٍ الاستماع…' : '🎤 إجابة صوتية'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
