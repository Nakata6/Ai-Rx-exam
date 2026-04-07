'use client';
import { COLORS as c } from '@/constants/colors';
import type { ToastState } from '@/types/exam';

export default function Toast({ toast }: { toast: ToastState }) {
  return (
    <div
      className="fixed bottom-6 left-1/2 px-5 py-2.5 rounded-full font-mono text-xs z-[999] max-w-[90vw] text-center whitespace-nowrap overflow-hidden text-ellipsis transition-transform duration-300"
      style={{
        background: c.s1,
        border:     `1px solid ${c.border}`,
        color:      c.muted,
        transform:  `translateX(-50%) translateY(${toast.show ? 0 : 80}px)`,
      }}
    >
      {toast.msg}
    </div>
  );
}
