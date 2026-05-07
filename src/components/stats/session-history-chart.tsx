import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { DailyActivity } from '../../hooks/use-stats';

interface Props {
  data: DailyActivity[];
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function SessionHistoryChart({ data }: Props) {
  const hasData = data.some((d) => d.known > 0 || d.forgot > 0);
  const chartData = data.map((d) => ({ ...d, date: formatDate(d.date) }));

  if (!hasData) {
    return (
      <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800 flex items-center justify-center h-[220px]">
        <span className="text-gray-500 text-sm">No study sessions yet</span>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <XAxis
            dataKey="date"
            tick={{ fill: '#6b7280', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: '#6b7280', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
            width={0}
          />
          <Tooltip
            contentStyle={{
              background: '#111827',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#f3f4f6',
            }}
            labelStyle={{ color: '#f3f4f6' }}
            itemStyle={{ color: '#f3f4f6' }}
          />
          <Bar dataKey="known" name="Known" stackId="a" fill="#22c55e" radius={[0, 0, 0, 0]} />
          <Bar dataKey="forgot" name="Forgot" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
