import { InlineState, PageHeader, Panel } from '../components/State';
import { formatDateTime, formatDuration, getSessionDuration } from '../lib/format';
import { useAsync } from '../hooks/useAsync';
import { api } from '../api/endpoints';

export function SessionsPage() {
  const sessions = useAsync(api.sessions);

  return (
    <>
      <PageHeader title="Сессии" description="История рабочих периодов и текущая активная сессия." />

      <Panel>
        <InlineState loading={sessions.loading} error={sessions.error} empty={!sessions.data?.length && 'Сессий пока нет'}>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Старт</th>
                  <th>Завершение</th>
                  <th>Длительность</th>
                  <th>Статус</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(sessions.data || []).map((session) => (
                  <tr key={session.id} className={!session.endTime ? 'bg-primary/8' : ''}>
                    <td>{formatDateTime(session.startTime)}</td>
                    <td>{formatDateTime(session.endTime)}</td>
                    <td>{formatDuration(getSessionDuration(session.startTime, session.endTime))}</td>
                    <td>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${session.endTime ? 'bg-muted text-subtle' : 'bg-success/15 text-success'}`}>
                        {session.endTime ? 'Завершена' : 'Активная'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </InlineState>
      </Panel>
    </>
  );
}
