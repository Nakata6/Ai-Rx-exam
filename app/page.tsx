'use client';
import { useState } from 'react';
import { useAuth }           from '@/contexts/AuthContext';
import { useSpeech }         from '@/hooks/useSpeech';
import { useExamEngine }     from '@/hooks/useExamEngine';
import { useBookmarks }      from '@/hooks/useBookmarks';
import AuthScreen            from '@/components/screens/AuthScreen';
import WelcomeScreen         from '@/components/screens/WelcomeScreen';
import ResultsScreen         from '@/components/screens/ResultsScreen';
import ExamScreen            from '@/components/exam/ExamScreen';
import Header                from '@/components/layout/Header';
import Toast                 from '@/components/layout/Toast';
import BookmarksPanel        from '@/components/exam/BookmarksPanel';
import SettingsModal         from '@/components/settings/SettingsModal';
import AnalyticsDashboard    from '@/components/dashboard/AnalyticsDashboard';
import { COLORS as c }       from '@/constants/colors';

export default function Page() {
  const { user, isGuest, isLoading } = useAuth();
  const { ttsEnabled, setTtsEnabled, speakText } = useSpeech();
  const engine    = useExamEngine(speakText);
  const bookmarks = useBookmarks();

  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showSettings,  setShowSettings]  = useState(false);

  /* ── Loading splash ── */
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: c.bg }}>
        <span className="font-mono text-xs" style={{ color: c.muted }}>loading…</span>
      </div>
    );
  }

  /* ── Auth gate ── */
  if (!user && !isGuest) return <AuthScreen />;

  /* ── Main app ── */
  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ background: c.bg, color: c.text, fontFamily: 'Cairo,sans-serif' }}>

      {/* Decorative grid */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `linear-gradient(${c.border} 1px,transparent 1px),linear-gradient(90deg,${c.border} 1px,transparent 1px)`,
          backgroundSize:  '36px 36px',
          opacity:         0.3,
        }}
      />

      {/* Radial glow */}
      <div
        className="fixed pointer-events-none z-0"
        style={{
          top:       -100,
          left:      '50%',
          transform: 'translateX(-50%)',
          width:     500,
          height:    280,
          background: 'radial-gradient(ellipse,rgba(0,232,122,.06) 0%,transparent 70%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-xl mx-auto px-4 py-5 pb-12 flex flex-col gap-4 min-h-screen">

        <Header
          phase={engine.phase}
          score={engine.score}
          sessionStats={engine.sessionStats}
          ttsEnabled={ttsEnabled}
          setTtsEnabled={setTtsEnabled}
          onOpenAnalytics={() => setShowAnalytics(true)}
          onOpenBookmarks={() => setShowBookmarks(true)}
          onOpenSettings={() => setShowSettings(true)}
          bookmarkCount={bookmarks.bookmarks.length}
        />

        {/* Progress bar */}
        {engine.phase === 'exam' && (
          <div className="h-0.5 rounded-full overflow-hidden flex" style={{ background: c.s2 }}>
            <div
              className="h-full transition-all duration-500"
              style={{ width: `${engine.total ? (engine.score.c / engine.total) * 100 : 0}%`, background: c.green }}
            />
            <div
              className="h-full transition-all duration-500"
              style={{ width: `${engine.total ? (engine.score.p / engine.total) * 50 : 0}%`, background: c.gold }}
            />
            <div
              className="h-full transition-all duration-500"
              style={{ width: `${engine.total ? (engine.score.w / engine.total) * 100 : 0}%`, background: c.red }}
            />
          </div>
        )}

        {/* Stats bar */}
        {engine.phase === 'exam' && (
          <div
            className="flex justify-between font-mono text-[10px] px-2 py-1.5 rounded-lg"
            style={{ background: c.s2, color: c.muted }}
          >
            <span>📊 {engine.sessionStats.accuracy}%</span>
            <span>📚 {engine.sessionStats.topicsUsed}/{engine.sessionStats.totalTopics}</span>
            <span>💾 {engine.questionPool.current.length} cached</span>
          </div>
        )}

        {/* Guest banner */}
        {isGuest && engine.phase !== 'welcome' && (
          <div
            className="text-[10px] font-mono text-center py-1.5 rounded-lg"
            style={{ background: 'rgba(255,201,64,.07)', border: '1px solid rgba(255,201,64,.25)', color: c.gold }}
          >
            أنت تلعب كضيف — سجّل لحفظ تقدمك
          </div>
        )}

        {/* Screens */}
        {engine.phase === 'welcome' && <WelcomeScreen onStart={engine.start} />}

        {engine.phase === 'results' && (
          <ResultsScreen
            score={engine.score}
            qNum={engine.qNum}
            streakRef={engine.streakRef}
            topicsUsedCount={engine.sessionStats.topicsUsed}
            onResume={engine.resumeFromResults}
            onRestart={() => engine.setPhase('welcome')}
          />
        )}

        {engine.phase === 'exam' && (
          <ExamScreen engine={engine} bookmarks={bookmarks} />
        )}
      </div>

      {/* Toast */}
      <Toast toast={engine.toast} />

      {/* Overlays */}
      {showAnalytics && <AnalyticsDashboard onClose={() => setShowAnalytics(false)} />}
      {showBookmarks && <BookmarksPanel bookmarks={bookmarks} onClose={() => setShowBookmarks(false)} />}
      {showSettings  && <SettingsModal  onClose={() => setShowSettings(false)} />}
    </div>
  );
}
