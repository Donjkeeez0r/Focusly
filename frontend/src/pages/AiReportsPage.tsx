import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { api } from '../api/endpoints';
import { InlineState, PageHeader, Panel } from '../components/State';
import { formatDateTime, getErrorMessage } from '../lib/format';
import { useAsync } from '../hooks/useAsync';

export function AiReportsPage() {
  const reports = useAsync(api.reports);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setGenerating(true);
    setError(null);

    try {
      await api.generateReport();
      await reports.reload();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setGenerating(false);
    }
  }

  return (
    <>
      <PageHeader
        title="AI-отчеты"
        description="Короткая обратная связь по статистике за неделю."
        action={
          <button type="button" onClick={() => void handleGenerate()} disabled={generating} className="button-primary">
            <Sparkles size={17} />
            {generating ? 'Генерация...' : 'Сгенерировать отчет'}
          </button>
        }
      />

      {error ? <div className="mb-4 state-box border-danger/30 text-danger">{error}</div> : null}

      <InlineState loading={reports.loading} error={reports.error} empty={!reports.data?.length && 'AI-отчетов пока нет'}>
        <div className="grid gap-4 lg:grid-cols-2">
          {(reports.data || []).map((report) => (
            <Panel key={report.id}>
              <p className="leading-7 text-subtle">{report.feedback}</p>
              <p className="mt-4 text-xs text-subtle">{formatDateTime(report.createdAt)}</p>
            </Panel>
          ))}
        </div>
      </InlineState>
    </>
  );
}
