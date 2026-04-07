'use client';
import { COLORS as c } from '@/constants/colors';
import type { useBookmarks } from '@/hooks/useBookmarks';

interface Props {
  bookmarks: ReturnType<typeof useBookmarks>;
  onClose():  void;
}

export default function BookmarksPanel({ bookmarks: bk, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex" style={{ background: 'rgba(0,0,0,.75)' }}>
      <div
        className="ms-auto w-full max-w-lg h-full overflow-y-auto flex flex-col"
        style={{ background: c.bg }}
      >
        {/* Header */}
        <div
          className="sticky top-0 flex items-center justify-between px-4 py-3"
          style={{ background: c.s1, borderBottom: `1px solid ${c.border}` }}
        >
          <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: c.muted }}>
            🔖 Bookmarks ({bk.bookmarks.length})
          </span>
          <div className="flex gap-3">
            {bk.bookmarks.length > 0 && (
              <button
                onClick={bk.clearAll}
                className="font-mono text-[10px]"
                style={{ color: c.red }}
              >
                حذف الكل
              </button>
            )}
            <button onClick={onClose} className="font-mono text-[10px]" style={{ color: c.muted }}>
              ✕ إغلاق
            </button>
          </div>
        </div>

        {/* Body */}
        {bk.bookmarks.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-sm" style={{ color: c.muted }}>
            لا توجد إشارات مرجعية بعد
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {bk.bookmarks.map((b, i) => (
              <div
                key={b.id ?? i}
                className="rounded-xl p-4 space-y-2"
                style={{ background: c.s1, border: `1px solid ${c.border}` }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex gap-1.5 flex-wrap">
                    <span
                      className="font-mono text-[9px] px-2 py-0.5 rounded"
                      style={{ color: c.muted, background: c.s2 }}
                    >
                      {b.question_type}
                    </span>
                    <span
                      className="font-mono text-[9px] px-2 py-0.5 rounded"
                      style={{ color: c.muted, background: c.s2 }}
                    >
                      {b.topic}
                    </span>
                    <span
                      className="font-mono text-[9px] px-2 py-0.5 rounded"
                      style={{ color: c.muted, background: c.s2 }}
                    >
                      {b.difficulty}
                    </span>
                  </div>
                  <button
                    onClick={() => b.id && bk.removeBookmark(b.id)}
                    className="text-[10px] shrink-0"
                    style={{ color: c.red }}
                  >
                    ✕
                  </button>
                </div>

                <p className="text-sm leading-relaxed" style={{ direction: 'auto' }}>
                  {b.question_text}
                </p>

                <div
                  className="text-xs pt-2"
                  style={{ color: c.green, borderTop: `1px solid ${c.border}` }}
                >
                  ✓ {b.correct_answer}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
