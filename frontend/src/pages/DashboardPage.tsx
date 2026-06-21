import { useMemo, useState } from 'react';
import { Brain, ListX, Play, Square, Timer, TrendingUp } from 'lucide-react';
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { api } from '../api/endpoints';
import { InlineState, PageHeader, Panel } from '../components/State';
import { formatDateTime, formatDuration, getErrorMessage, getSessionDuration } from '../lib/format';
import { useAsync } from '../hooks/useAsync';

export function DashboardPage() {
  const active = useAsync(api.activeSession);
  const pie = useAsync(api.weeklyPie);
  const heatmap = useAsync(api.monthHeatmap);
  const blocklist = useAsync(api.blocklist);
  const reports = useAsync(api.reports);
  const [sessionBusy, setSessionBusy] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);

  const weeklyTotal = useMemo(
    () => (pie.data || []).reduce((sum, item) => sum + item.totalSeconds, 0),
    [pie.data],
  );

  async function handleSession(action: 'start' | 'end') {
    setSessionBusy(true);
    setSessionError(null);

    try {
      await (action === 'start' ? api.startSession() : api.endSession());
      await active.reload();
    } catch (err) {
      setSessionError(getErrorMessage(err));
    } finally {
      setSessionBusy(false);
    }
  }

  const maxHeat = Math.max(...(heatmap.data || []).map((item) => item.totalSeconds), 1);
  const heatByDate = new Map((heatmap.data || []).map((item) => [item.date, item.totalSeconds]));
  const days = Array.from({ length: 30 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - index));
    const key = date.toISOString().slice(0, 10);
    return { date: key, totalSeconds: heatByDate.get(key) || 0 };
  });

  return (
    <>
      <PageHeader
        title="Дашборд"
        description="Сессии, статистика и последний AI-отчет."
        action={
          active.data ? (
            <button
              type="button"
              disabled={sessionBusy}
              onClick={() => void handleSession('end')}
              className="button-danger"
            >
              <Square size={17} />
              Завершить сессию
            </button>
          ) : (
            <button
              type="button"
              disabled={sessionBusy}
              onClick={() => void handleSession('start')}
              className="button-primary"
            >
              <Play size={17} />
              Начать сессию
            </button>
          )
        }
      />

      {sessionError ? <div className="mb-4 state-box border-danger/30 text-danger">{sessionError}</div> : null}

      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric icon={Timer} label="Активная сессия" value={active.data ? formatDuration(getSessionDuration(active.data.startTime, null)) : 'Нет'} />
        <Metric icon={TrendingUp} label="За неделю" value={formatDuration(weeklyTotal)} />
        <Metric icon={ListX} label="Сайтов в блоклисте" value={String(blocklist.data?.length || 0)} />
        <Metric icon={Brain} label="AI-отчетов" value={String(reports.data?.length || 0)} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <Panel>
          <h3 className="mb-4 text-lg font-semibold">Неделя по категориям</h3>
          <InlineState loading={pie.loading} error={pie.error} empty={!pie.data?.length && 'Пока нет данных для графика'}>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pie.data || []} dataKey="totalSeconds" nameKey="name" innerRadius={70} outerRadius={105} paddingAngle={2}>
                    {(pie.data || []).map((item) => (
                      <Cell key={item.name} fill={item.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatDuration(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </InlineState>
        </Panel>

        <Panel>
          <h3 className="mb-4 text-lg font-semibold">Последний AI-отчет</h3>
          <InlineState loading={reports.loading} error={reports.error} empty={!reports.data?.length && 'AI-отчетов пока нет'}>
            <p className="leading-7 text-subtle">{reports.data?.[0]?.feedback}</p>
            <p className="mt-4 text-xs text-subtle">{formatDateTime(reports.data?.[0]?.createdAt || null)}</p>
          </InlineState>
        </Panel>
      </div>

      <Panel className="mt-6">
        <h3 className="mb-4 text-lg font-semibold">Активность за 30 дней</h3>
        <InlineState loading={heatmap.loading} error={heatmap.error}>
          <div
            className="grid gap-2"
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(24px, 1fr))',
            }}
          >
            {days.map((day) => {
              const opacity = day.totalSeconds ? 0.18 + (day.totalSeconds / maxHeat) * 0.82 : 0.08;
              return (
                <div
                  key={day.date}
                  title={`${day.date}: ${formatDuration(day.totalSeconds)}`}
                  className="aspect-square rounded"
                  style={{ backgroundColor: `rgb(var(--color-primary) / ${opacity})` }}
                />
              );
            })}
          </div>
        </InlineState>
      </Panel>
    </>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <Panel>
      <Icon className="mb-3 text-primary" size={22} />
      <p className="text-sm text-subtle">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </Panel>
  );
}
