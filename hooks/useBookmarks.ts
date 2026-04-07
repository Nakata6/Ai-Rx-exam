'use client';
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Bookmark, Question } from '@/types/exam';

const LS_KEY = 'rx-exam-bookmarks';

export function useBookmarks() {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const sb = createClient();

  useEffect(() => {
    if (user) {
      sb.from('bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .then(({ data }) => data && setBookmarks(data as Bookmark[]));
    } else {
      try {
        const raw = localStorage.getItem(LS_KEY);
        if (raw) setBookmarks(JSON.parse(raw));
      } catch {}
    }
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const persist = useCallback((bms: Bookmark[]) => {
    if (!user) {
      try { localStorage.setItem(LS_KEY, JSON.stringify(bms)); } catch {}
    }
  }, [user]);

  const isBookmarked = useCallback(
    (text: string) => bookmarks.some((b) => b.question_text === text),
    [bookmarks]
  );

  const addBookmark = useCallback(async (q: Question) => {
    const bm = {
      question_text:  q.question,
      correct_answer: q.correct,
      topic:          q.topic,
      difficulty:     q.difficulty,
      question_type:  q.type,
    };

    if (user) {
      const { data } = await sb
        .from('bookmarks')
        .insert({ ...bm, user_id: user.id })
        .select()
        .single();
      if (data) setBookmarks((p) => [data as Bookmark, ...p]);
    } else {
      const updated = [{ ...bm, id: Date.now().toString(), created_at: new Date().toISOString() }, ...bookmarks];
      setBookmarks(updated);
      persist(updated);
    }
  }, [user, bookmarks, sb, persist]);

  const removeBookmark = useCallback(async (id: string) => {
    if (user) await sb.from('bookmarks').delete().eq('id', id);
    const updated = bookmarks.filter((b) => b.id !== id);
    setBookmarks(updated);
    persist(updated);
  }, [user, bookmarks, sb, persist]);

  const clearAll = useCallback(async () => {
    if (user) await sb.from('bookmarks').delete().eq('user_id', user.id);
    setBookmarks([]);
    persist([]);
  }, [user, sb, persist]);

  const toggleBookmark = useCallback(async (q: Question) => {
    const existing = bookmarks.find((b) => b.question_text === q.question);
    if (existing?.id) await removeBookmark(existing.id);
    else await addBookmark(q);
  }, [bookmarks, removeBookmark, addBookmark]);

  return { bookmarks, isBookmarked, addBookmark, removeBookmark, clearAll, toggleBookmark };
}
