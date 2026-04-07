'use client';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { COLORS as c } from '@/constants/colors';

export default function AuthScreen() {
  const { signIn, signUp, continueAsGuest } = useAuth();
  const [mode,    setMode]    = useState<'in' | 'up'>('in');
  const [email,   setEmail]   = useState('');
  const [pw,      setPw]      = useState('');
  const [err,     setErr]     = useState('');
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setErr('');
    setLoading(true);
    try {
      if (mode === 'in') {
        await signIn(email, pw);
      } else {
        const r = await signUp(email, pw);
        if (r.error) setErr(r.error);
        else setErr('✓ تحقق من بريدك الإلكتروني للتأكيد');
      }
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-5 px-5 py-10 min-h-screen"
      style={{ background: c.bg }}>
      <div className="text-5xl">⬡</div>

      <div className="text-center">
        <div className="text-4xl font-black" style={{ color: c.text }}>
          Rx <span style={{ color: c.green }}>Exam</span>
        </div>
        <div className="font-mono text-[10px] tracking-widest uppercase mt-1.5" style={{ color: c.muted }}>
          Pharmacist · AI-Powered
        </div>
      </div>

      <div className="w-full max-w-xs space-y-3">
        {/* Mode toggle */}
        <div className="flex rounded-lg overflow-hidden" style={{ border: `1px solid ${c.border}` }}>
          {(['in', 'up'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="flex-1 py-2.5 text-sm font-bold"
              style={{ background: mode === m ? c.green : c.s2, color: mode === m ? '#000' : c.muted }}
            >
              {m === 'in' ? 'تسجيل الدخول' : 'إنشاء حساب'}
            </button>
          ))}
        </div>

        {/* Inputs */}
        {[
          { val: email, set: setEmail, ph: 'البريد الإلكتروني', type: 'email' },
          { val: pw,    set: setPw,    ph: 'كلمة المرور',       type: 'password' },
        ].map((f) => (
          <input
            key={f.type}
            type={f.type}
            value={f.val}
            placeholder={f.ph}
            onChange={(e) => f.set(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handle()}
            className="w-full px-4 py-3 rounded-lg text-sm outline-none"
            style={{
              background: c.s2,
              border:     `1px solid ${c.border}`,
              color:      c.text,
              direction:  'ltr',
              fontFamily: 'inherit',
            }}
          />
        ))}

        {err && (
          <p className="text-xs text-center" style={{ color: err.startsWith('✓') ? c.green : c.red }}>
            {err}
          </p>
        )}

        <button
          onClick={handle}
          disabled={loading || !email || !pw}
          className="w-full py-3 font-bold text-sm rounded-lg"
          style={{ background: c.green, color: '#000', opacity: loading || !email || !pw ? 0.4 : 1 }}
        >
          {loading ? '...' : mode === 'in' ? 'دخول ←' : 'إنشاء حساب ←'}
        </button>

        <div className="flex items-center gap-2">
          <div className="flex-1 h-px" style={{ background: c.border }} />
          <span className="text-xs" style={{ color: c.muted }}>أو</span>
          <div className="flex-1 h-px" style={{ background: c.border }} />
        </div>

        <button
          onClick={continueAsGuest}
          className="w-full py-3 rounded-lg text-sm"
          style={{ border: `1px solid ${c.border}`, color: c.muted }}
        >
          متابعة كضيف
        </button>
      </div>
    </div>
  );
}
