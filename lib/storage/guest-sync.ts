import { createClient } from '@/lib/supabase/client';
import type { Bookmark } from '@/types/exam';

export async function syncGuestBookmarks(userId: string): Promise<number> {
  const sb = createClient();
  try {
    const raw = localStorage.getItem('rx-exam-bookmarks');
    if (!raw) return 0;
    const bookmarks: Bookmark[] = JSON.parse(raw);
    if (!bookmarks.length) return 0;

    const rows = bookmarks.map(({ question_text, correct_answer, topic, difficulty, question_type }) => ({
      user_id: userId,
      question_text,
      correct_answer,
      topic,
      difficulty,
      question_type,
    }));

    const { data, error } = await sb
      .from('bookmarks')
      .upsert(rows, { onConflict: 'user_id,question_text', ignoreDuplicates: true })
      .select();

    if (!error && data) {
      localStorage.removeItem('rx-exam-bookmarks');
      return data.length;
    }
  } catch {}
  return 0;
}
