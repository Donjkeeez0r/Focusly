import { FormEvent, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { api } from '../api/endpoints';
import { InlineState, PageHeader, Panel, SubmitButton } from '../components/State';
import { getErrorMessage } from '../lib/format';
import { useAsync } from '../hooks/useAsync';

export function CategoriesPage() {
  const categories = useAsync(api.categories);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#22c55e');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await api.createCategory({ name: name.trim(), color });
      setName('');
      setColor('#22c55e');
      await categories.reload();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    await api.deleteCategory(id);
    await categories.reload();
  }

  return (
    <>
      <PageHeader
        title="Категории"
        description="Категории используются в логах, статистике и блоклисте."
      />

      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <Panel>
          <h3 className="mb-4 text-lg font-semibold">Новая категория</h3>
          <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4">
            <div>
              <label className="label" htmlFor="category-name">
                Название
              </label>
              <input
                id="category-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="field"
                required
                placeholder="Работа"
              />
            </div>
            <div>
              <label className="label" htmlFor="category-color">
                Цвет
              </label>
              <div className="flex gap-3">
                <input
                  id="category-color"
                  type="color"
                  value={color}
                  onChange={(event) => setColor(event.target.value)}
                  className="h-10 w-14 rounded-md border border-border bg-panel p-1"
                />
                <input value={color} onChange={(event) => setColor(event.target.value)} className="field" />
              </div>
            </div>
            {error ? <div className="state-box border-danger/30 text-danger">{error}</div> : null}
            <SubmitButton loading={saving} disabled={!name.trim()}>
              <Plus size={17} />
              Создать
            </SubmitButton>
          </form>
        </Panel>

        <Panel>
          <h3 className="mb-4 text-lg font-semibold">Список</h3>
          <InlineState
            loading={categories.loading}
            error={categories.error}
            empty={!categories.data?.length && 'Категорий пока нет'}
          >
            <div className="grid gap-3 md:grid-cols-2">
              {(categories.data || []).map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between gap-3 rounded-md border border-border bg-muted/40 p-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className="h-4 w-4 shrink-0 rounded"
                      style={{ backgroundColor: category.color }}
                    />
                    <div className="min-w-0">
                      <p className="truncate font-medium">{category.name}</p>
                      <p className="text-xs text-subtle">{category.color}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleDelete(category.id)}
                    className="icon-button"
                    aria-label="Удалить категорию"
                    title="Удалить категорию"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              ))}
            </div>
          </InlineState>
        </Panel>
      </div>
    </>
  );
}
