'use client';
import { useTheme } from '@/contexts/ThemeContext';
import { COLORS as c } from '@/constants/colors';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      title="Toggle theme"
      className="px-2.5 py-1 rounded-full font-mono text-[10px]"
      style={{ border: `1px solid ${c.border}`, color: c.muted, background: 'transparent' }}
    >
      {theme === 'dark' ? '☀︎' : '☾'}
    </button>
  );
}
