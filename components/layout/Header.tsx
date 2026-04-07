'use client';
import { useState } from 'react';
import { COLORS as c } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from './ThemeToggle';
import type { Score, SessionStats } from '@/types/exam';

interface Props {
  phase:           string;
  score:           Score;
  sessionStats:    SessionStats;
  ttsEnabled:      boolean;
  setTtsEnabled:   (fn: (v: boolean) => boolean) => void;
  onOpenAnalytics(): void;
  onOpenBookmarks(): void;
  onOpenSettings():  void;
  bookmarkCount:   number;
}

export default function Header({
  phase, score, sessionStats, ttsEnabled, setTtsEnabled,
  onOpenAnalytics, onOpenBookmarks, onOpenSettings, bookmarkCount,
}: Props) {
  const { user, signOut } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="flex items-center justify-between gap-2 flex-wrap">
      {/* Logo */}
      <div
        className="flex items-center gap-2 font-mono text-[11px] tracking-widest uppercase"
        style={{ color: c.green }}
      >
        <div
          className="w-2 h-2 rounded-full"
          style={{ background: c.green, boxShadow: `0 0 6px ${c.green}` }}
        />
        Rx Exam
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        <ThemeToggle />

        {/* TTS */}
        <button
          onClick={() => setTtsEnabled((v) => !v)}
          className="px-2.5 py-1 rounded-full font-mono text-[10px]"
          style={{
            border:     `1px solid ${ttsEnabled ? c.green : c.border}`,
            color:      ttsEnabled ? c.green : c.muted,
            background: ttsEnabled ? 'rgba(0,232,122,.12)' : 'transparent',
          }}
        >
          {ttsEnabled ? '🔊' : '🔇'}
        </button>

        {/* Analytics */}
        <button
          onClick={onOpenAnalytics}
          className="px-2.5 py-1 rounded-full font-mono text-[10px]"
          style={{ border: `1px solid ${c.border}`, color: c.muted }}
        >
          📊
        </button>

        {/* Bookmarks */}
        <button
          onClick={onOpenBookmarks}
          className="px-2.5 py-1 rounded-full font-mono text-[10px]"
          style={{ border: `1px solid ${c.border}`, color: c.muted }}
        >
          🔖{bookmarkCount > 0 && <span style={{ color: c.gold }}> {bookmarkCount}</span>}
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          className="px-2.5 py-1 rounded-full font-mono text-[10px]"
          style={{ border: `1px solid ${c.border}`, color: c.muted }}
        >
          ⚙
        </button>

        {/* Score — exam only */}
        {phase === 'exam' && (
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-[11px]"
            style={{ background: c.s1, border: `1px solid ${c.border}` }}
          >
            <span style={{ color: c.green,  fontWeight: 700 }}>{score.c}</span>
            <span style={{ color: c.border }}>·</span>
            <span style={{ color: c.red,    fontWeight: 700 }}>{score.w}</span>
            {score.p > 0 && <span style={{ color: c.gold }}>+{score.p}p</span>}
            {sessionStats.streak >= 3 && (
              <span style={{ color: c.gold }}>🔥{sessionStats.streak}</span>
            )}
          </div>
        )}

        {/* User menu */}
        {user && (
          <div className="relative">
            <button
              onClick={() => setShowMenu((m) => !m)}
              className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs"
              style={{ background: c.green, color: '#000' }}
            >
              {user.email?.[0]?.toUpperCase() ?? 'U'}
            </button>
            {showMenu && (
              <div
                className="absolute left-0 mt-1 min-w-[140px] rounded-lg overflow-hidden z-50"
                style={{ background: c.s1, border: `1px solid ${c.border}` }}
              >
                <div className="px-3 py-2 text-[10px] font-mono truncate" style={{ color: c.muted }}>
                  {user.email}
                </div>
                <button
                  onClick={() => { signOut(); setShowMenu(false); }}
                  className="w-full text-right px-3 py-2 text-sm"
                  style={{ color: c.red, background: 'transparent' }}
                >
                  تسجيل الخروج
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
