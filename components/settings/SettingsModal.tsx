'use client';
import { useState, useEffect } from 'react';
import { COLORS as c } from '@/constants/colors';

const KEY = 'rx-exam-gemini-key';

export default function SettingsModal({ onClose }: { onClose(): void }) {
  const [key,   setKey]   = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setKey(localStorage.getItem(KEY) ?? '');
  }, []);

  const save = () => {
    if (key.trim()) localStorage.setItem(KEY, key.trim());
    else localStorage.removeItem(KEY);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,.75)' }}
      onClick={onClose}
    >
      <div
        className="rounded-xl p-5 w-full max-w-sm mx-4 space-y-4"
        style={{ background: c.s1, border: `1px solid ${c.border}` }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="font-mono text-[10px] tracking-widest uppercase" style={{ color: c.muted }}>
          ⚙ Settings — API Key (BYOK)
        </div>

        <div>
          <div className="text-xs mb-1.5" style={{ color: c.muted }}>Gemini API Key</div>
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && save()}
            placeholder="AIzaSy..."
            className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
            style={{
              background: c.s2,
              border:     `1px solid ${c.border}`,
              color:      c.text,
              direction:  'ltr',
              fontFamily: 'monospace',
            }}
          />
          <p className="text-[10px] mt-1.5 leading-relaxed" style={{ color: c.muted }}>
            Stored in your browser only. Sent as a request header to Gemini — never logged server-side.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={save}
            className="flex-1 py-2 font-bold text-sm rounded-lg transition-opacity"
            style={{ background: c.green, color: '#000', opacity: saved ? 0.75 : 1 }}
          >
            {saved ? '✓ Saved' : 'Save Key'}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm"
            style={{ border: `1px solid ${c.border}`, color: c.muted }}
          >
            ✕
          </button>
        </div>

        <a
          href="https://aistudio.google.com/app/apikey"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] underline block text-center"
          style={{ color: c.muted }}
        >
          Get a free Gemini API key →
        </a>
      </div>
    </div>
  );
}
