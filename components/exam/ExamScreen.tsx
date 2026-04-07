'use client';
import QuestionCard from './QuestionCard';
import FeedbackCard from './FeedbackCard';
import HintsPanel   from './HintsPanel';
import Dots         from '@/components/layout/Dots';
import { COLORS as c } from '@/constants/colors';
import type { useExamEngine }  from '@/hooks/useExamEngine';
import type { useBookmarks }   from '@/hooks/useBookmarks';

interface Props {
  engine:    ReturnType<typeof useExamEngine>;
  bookmarks: ReturnType<typeof useBookmarks>;
}

export default function ExamScreen({ engine: e, bookmarks: bk }: Props) {
  const isBookmarked = e.q ? bk.isBookmarked(e.q.question) : false;

  return (
    <>
      <QuestionCard
        q={e.q}                   qNum={e.qNum}
        loading={e.loading}       loadTxt={e.loadTxt}
        answered={e.answered}     selOpt={e.selOpt}
        fillVal={e.fillVal}       setFillVal={e.setFillVal}
        expVal={e.expVal}         setExpVal={e.setExpVal}
        canSubmit={e.canSubmit}   listening={e.listening}
        isBookmarked={isBookmarked}
        onToggleBookmark={() => e.q && bk.toggleBookmark(e.q)}
        onSubmitMCQ={e.submitMCQ} onSubmitTF={e.submitTF}
        onSubmitOpen={e.submitOpen} onToggleVoice={e.toggleVoice}
      />

      {/* Hints — visible before answer */}
      {e.q && !e.q.error && !e.answered && (
        <HintsPanel hints={e.hints} loading={e.hintLoading} onGetHint={e.getHint} />
      )}

      {/* Hints — persist after answer */}
      {e.q && !e.q.error && e.answered && e.hints.length > 0 && (
        <div
          className="rounded-lg p-3 space-y-2"
          style={{ background: 'rgba(255,201,64,.07)', border: '1px solid rgba(255,201,64,.3)' }}
        >
          <div className="font-mono text-[9px] tracking-widest uppercase" style={{ color: c.gold }}>
            💡 Hints used ({e.hints.length}/3)
          </div>
          {e.hints.map((h, i) => (
            <p key={i} className="text-sm leading-relaxed" style={{ color: '#e8d47a', direction: 'auto' }}>
              {i + 1}. {h}
            </p>
          ))}
        </div>
      )}

      {/* Grading loader */}
      {e.loading && e.q && !e.q.error && (
        <div
          className="flex items-center gap-3 rounded-xl p-4 font-mono text-xs"
          style={{ background: c.s1, border: `1px solid ${c.border}`, color: c.muted }}
        >
          <Dots />{e.loadTxt}
        </div>
      )}

      {e.fb && <FeedbackCard fb={e.fb} onNext={e.next} loading={e.loading} />}

      {/* Error state next button */}
      {e.q?.error && (
        <button
          onClick={e.next}
          className="w-full py-3 font-bold text-sm rounded-lg"
          style={{ border: `1px solid ${c.green}`, color: c.green, background: 'transparent' }}
        >
          السؤال التالي ←
        </button>
      )}
    </>
  );
}
