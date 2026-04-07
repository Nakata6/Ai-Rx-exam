'use client';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { COLORS as c } from '@/constants/colors';

export interface DailyStat { date: string; accuracy: number; count: number; }
export interface TypeStat  { type: string; accuracy: number; count: number;  }

const TT: React.CSSProperties = {
  background:   '#0e1612',
  border:       '1px solid #1c2e22',
  borderRadius: 6,
  fontSize:     11,
};

export function DailyChart({ data }: { data: DailyStat[] }) {
  if (!data.length) return <p className="text-xs text-center py-6" style={{ color: c.muted }}>لا توجد بيانات</p>;
  return (
    <ResponsiveContainer width="100%" height={160}>
      <LineChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -25 }}>
        <XAxis dataKey="date" tick={{ fontSize: 9, fill: c.muted }} tickLine={false} axisLine={false} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: c.muted }} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={TT} formatter={(v: number) => [`${v}%`, 'Accuracy']} />
        <Line type="monotone" dataKey="accuracy" stroke={c.green} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function DailyBarChart({ data }: { data: DailyStat[] }) {
  if (!data.length) return null;
  return (
    <ResponsiveContainer width="100%" height={120}>
      <BarChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -25 }}>
        <XAxis dataKey="date" tick={{ fontSize: 9, fill: c.muted }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 9, fill: c.muted }} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={TT} />
        <Bar dataKey="count" fill={c.green} radius={[2, 2, 0, 0]} opacity={0.75} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function TypePieChart({ data }: { data: TypeStat[] }) {
  const PIE_COLORS = [c.green, '#5b9fff', c.gold, '#c084fc', '#fb923c'];
  return (
    <div className="flex items-center gap-4">
      <ResponsiveContainer width={120} height={120}>
        <PieChart>
          <Pie data={data} dataKey="count" nameKey="type" cx="50%" cy="50%" outerRadius={55} innerRadius={30}>
            {data.map((_, i) => (
              <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={TT} />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-1.5">
        {data.map((d, i) => (
          <div key={d.type} className="flex items-center gap-2 text-[11px]">
            <div className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
            <span style={{ color: c.muted }}>{d.type}</span>
            <span className="font-mono font-bold" style={{ color: c.text }}>{d.accuracy}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
