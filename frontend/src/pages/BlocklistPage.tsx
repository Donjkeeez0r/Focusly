import { FormEvent, useState } from 'react';
import { Plus, Search, Trash2 } from 'lucide-react';
import { api } from '../api/endpoints';
import { InlineState, PageHeader, Panel, SubmitButton } from '../components/State';
import { getErrorMessage, normalizeUrl } from '../lib/format';
import { useAsync } from '../hooks/useAsync';

export function BlocklistPage() {
  const blocklist = useAsync(api.blocklist);
  const categories = useAsync(api.categories);
  const [url, setUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [checkingUrl, setCheckingUrl] = useState('');
  const [checkResult, setCheckResult] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await api.addBlockedSite({ url: normalizeUrl(url), categoryId });
      setUrl('');
      await blocklist.reload();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleCheck(event: FormEvent) {
    event.preventDefault();
    setChecking(true);
    setCheckResult(null);

    try {
      const result = await api.checkSite(normalizeUrl(checkingUrl));
      setCheckResult(result.isBlocked ? 'Заблокирован' : 'Разрешен');
    } catch (err) {
      setCheckResult(getErrorMessage(err));
    } finally {
      setChecking(false);
    }
  }

  return (
    <>
      <PageHeader title="Блоклист" description="Сайты, которые стоит держать подальше от рабочих сессий." />

      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <div className="space-y-6">
          <Panel>
            <h3 className="mb-4 text-lg font-semibold">Добавить сайт</h3>
            <form onSubmit={(event) => void handleAdd(event)} className="space-y-4">
              <div>
                <label className="label" htmlFor="blocked-url">
                  URL
                </label>
                <input id="blocked-url" value={url} onChange={(event) => setUrl(event.target.value)} className="field" required placeholder="youtube.com" />
              </div>
              <div>
                <label className="label" htmlFor="blocked-category">
                  Категория
                </label>
                <select id="blocked-category" value={categoryId} onChange={(event) => setCategoryId(event.target.value)} className="field" required>
                  <option value="">Выберите категорию</option>
                  {(categories.data || []).map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              {error ? <div className="state-box border-danger/30 text-danger">{error}</div> : null}
              <SubmitButton loading={saving} disabled={!url.trim() || !categoryId || !categories.data?.length}>
                <Plus size={17} />
                Добавить
              </SubmitButton>
            </form>
          </Panel>

          <Panel>
            <h3 className="mb-4 text-lg font-semibold">Проверить сайт</h3>
            <form onSubmit={(event) => void handleCheck(event)} className="space-y-4">
              <input value={checkingUrl} onChange={(event) => setCheckingUrl(event.target.value)} className="field" required placeholder="github.com" />
              <SubmitButton loading={checking} disabled={!checkingUrl.trim()}>
                <Search size={17} />
                Проверить
              </SubmitButton>
            </form>
            {checkResult ? <div className="mt-4 state-box">{checkResult}</div> : null}
          </Panel>
        </div>

        <Panel>
          <h3 className="mb-4 text-lg font-semibold">Заблокированные сайты</h3>
          <InlineState loading={blocklist.loading} error={blocklist.error} empty={!blocklist.data?.length && 'Заблокированных сайтов пока нет'}>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Сайт</th>
                    <th>Категория</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {(blocklist.data || []).map((item) => (
                    <tr key={item.id}>
                      <td className="font-medium">{item.url}</td>
                      <td>
                        <span className="inline-flex items-center gap-2">
                          <span className="h-3 w-3 rounded" style={{ backgroundColor: item.category.color }} />
                          {item.category.name}
                        </span>
                      </td>
                      <td className="text-right">
                        <button
                          type="button"
                          onClick={() => void api.deleteBlockedSite(item.id).then(blocklist.reload)}
                          className="icon-button ml-auto"
                          aria-label="Удалить сайт"
                          title="Удалить сайт"
                        >
                          <Trash2 size={17} />
                        </button>
                      </td>
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
