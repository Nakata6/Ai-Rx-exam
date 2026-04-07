'use client';

export default function Dots() {
  return (
    <div className="flex gap-1.5">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: 'var(--rx-green)', animation: `bk 1.2s ${i * 0.2}s infinite` }}
        />
      ))}
    </div>
  );
}
