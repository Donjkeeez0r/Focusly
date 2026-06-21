import { FormEvent, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { api } from '../api/endpoints';
import { InlineState, PageHeader, Panel, SubmitButton } from '../components/State';
import { formatDateTime, formatDuration, getErrorMessage, normalizeUrl } from '../lib/format';
import { useAsync } from '../hooks/useAsync';

type LogRow = {
  url: string;
  minutes: string;
  categoryId: string;
};

const emptyRow: LogRow = { url: '', minutes: '', categoryId: '' };

export function LogsPage() {
  const logs = useAsync(api.logs);
  const categories = useAsync(api.categories);
  const [rows, setRows] = useState<LogRow[]>([{ ...emptyRow }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateRow(index: number, patch: Partial<LogRow>) {
    setRows((current) =>
      current.map((row, rowIndex) => (rowIndex === index ? { ...row, ...patch } : row)),
    );
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await api.saveLogs(
        rows
          .filter((row) => row.url.trim() && Number(row.minutes) > 0)
          .map((row) => ({
            url: normalizeUrl(row.url),
            duration: Math.round(Number(row.minutes) * 60),
            categoryId: row.categoryId || undefined,
          })),
      );
      setRows([{ ...emptyRow }]);
      await logs.reload();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader title="Логи времени" description="Добавляй посещения сайтов и смотри историю активности." />

      <div className="grid gap-6 xl:grid-cols-[480px_1fr]">
        <Panel>
          <h3 className="mb-4 text-lg font-semibold">Добавить логи</h3>
          <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4">
            <div className="space-y-3">
              {rows.map((row, index) => (
                <div key={index} className="grid gap-3 rounded-md border border-border bg-muted/30 p-3">
                  <input value={row.url} onChange={(event) => updateRow(index, { url: event.target.value })} className="field" required placeholder="github.com" />
                  <div className="grid grid-cols-[1fr_1fr_auto] gap-3">
                    <input type="number" min="1" value={row.minutes} onChange={(event) => updateRow(index, { minutes: event.target.value })} className="field" required placeholder="Минуты" />
                    <select value={row.categoryId} onChange={(event) => updateRow(index, { categoryId: event.target.value })} className="field">
                      <option value="">Без категории</option>
                      {(categories.data || []).map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <button type="button" onClick={() => setRows((current) => current.filter((_, rowIndex) => rowIndex !== index))} className="icon-button" disabled={rows.length === 1} aria-label="Удалить строку" title="Удалить строку">
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={() => setRows((current) => [...current, { ...emptyRow }])} className="button-secondary">
                <Plus size={17} />
                Строка
              </button>
              <SubmitButton loading={saving}>Сохранить</SubmitButton>
            </div>
            {error ? <div className="state-box border-danger/30 text-danger">{error}</div> : null}
          </form>
        </Panel>

        <Panel>
          <h3 className="mb-4 text-lg font-semibold">История</h3>
          <InlineState loading={logs.loading} error={logs.error} empty={!logs.data?.length && 'Логов пока нет'}>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Сайт</th>
                    <th>Длительность</th>
                    <th>Категория</th>
                    <th>Дата</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {(logs.data || []).map((log) => (
                    <tr key={log.id}>
                      <td className="font-medium">{log.url}</td>
                      <td>{formatDuration(log.duration)}</td>
                      <td>
                        {log.category ? (
                          <span className="inline-flex items-center gap-2">
                            <span className="h-3 w-3 rounded" style={{ backgroundColor: log.category.color }} />
                            {log.category.name}
                          </span>
                        ) : (
                          <span className="text-subtle">Без категории</span>
                        )}
                      </td>
                      <td>{formatDateTime(log.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </InlineState>
        </Panel>
      </div>
    </>
  );
}
