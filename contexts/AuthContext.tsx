'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { syncGuestBookmarks } from '@/lib/storage/guest-sync';
import { COLORS } from '@/constants/colors';

interface AuthCtx {
  user: User | null;
  isGuest: boolean;
  isLoading: boolean;
  signIn(email: string, password: string): Promise<void>;
  signUp(email: string, password: string): Promise<{ error?: string }>;
  signOut(): Promise<void>;
  continueAsGuest(): void;
}

const AuthCtx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user,       setUser]       = useState<User | null>(null);
  const [isGuest,    setIsGuest]    = useState(false);
  const [isLoading,  setIsLoading]  = useState(true);
  const [syncPrompt, setSyncPrompt] = useState(false);
  const sb = createClient();

  useEffect(() => {
    sb.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    const { data: { subscription } } = sb.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (event === 'SIGNED_IN' && session?.user) {
        setIsGuest(false);
        if (typeof window !== 'undefined' && localStorage.getItem('rx-exam-bookmarks')) {
          setSyncPrompt(true);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const signIn = async (email: string, password: string) => {
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
  };

  const signUp = async (email: string, password: string): Promise<{ error?: string }> => {
    const { error } = await sb.auth.signUp({ email, password });
    return error ? { error: error.message } : {};
  };

  const signOut = async () => {
    await sb.auth.signOut();
    setIsGuest(false);
  };

  const continueAsGuest = () => setIsGuest(true);

  return (
    <AuthCtx.Provider value={{ user, isGuest, isLoading, signIn, signUp, signOut, continueAsGuest }}>
      {children}

      {syncPrompt && user && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,.75)' }}
        >
          <div
            className="rounded-xl p-5 w-80 text-center space-y-4"
            style={{ background: COLORS.s1, border: `1px solid ${COLORS.border}` }}
          >
            <div className="text-2xl">🔖</div>
            <p className="text-sm" style={{ color: COLORS.text }}>
              لديك إشارات مرجعية محفوظة كضيف. هل تريد نقلها لحسابك؟
            </p>
            <div className="flex gap-2">
              <button
                onClick={async () => { await syncGuestBookmarks(user.id); setSyncPrompt(false); }}
                className="flex-1 py-2 font-bold text-sm rounded-lg"
                style={{ background: COLORS.green, color: '#000' }}
              >
                نعم، انقل
              </button>
              <button
                onClick={() => setSyncPrompt(false)}
                className="flex-1 py-2 rounded-lg text-sm"
                style={{ border: `1px solid ${COLORS.border}`, color: COLORS.muted }}
              >
                تخطّ
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthCtx.Provider>
  );
}

export function useAuth(): AuthCtx {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
