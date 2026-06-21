import { Navigate } from 'react-router-dom';
import { Chrome, ShieldCheck, Timer, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export function LoginPage() {
  const { token, loginWithGoogle } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <main className="grid min-h-screen bg-page px-4 py-8 text-text">
      <div className="mx-auto grid w-full max-w-5xl items-center gap-10 lg:grid-cols-[1fr_420px]">
        <section>
          <div className="mb-8 inline-flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary text-white">
              <Timer size={22} />
            </div>
            <div>
              <p className="text-sm text-subtle">Focus Ledger</p>
              <h1 className="text-3xl font-semibold">Трекер продуктивности</h1>
            </div>
          </div>

          <p className="max-w-2xl text-lg leading-8 text-subtle">
            Следи за рабочими сессиями, блокируй отвлекающие сайты, смотри
            статистику по категориям и получай короткие AI-отчеты по неделе.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { icon: ShieldCheck, text: 'Google-only вход' },
              { icon: TrendingUp, text: 'Графики и heatmap' },
              { icon: Timer, text: 'Сессии и логи' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="panel">
                <Icon className="mb-3 text-primary" size={22} />
                <p className="text-sm font-medium">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Вход</h2>
              <p className="mt-1 text-sm text-subtle">Только через Google OAuth</p>
            </div>
            <button type="button" onClick={toggleTheme} className="button-secondary">
              {theme === 'dark' ? 'Светлая' : 'Темная'}
            </button>
          </div>

          <button
            type="button"
            onClick={loginWithGoogle}
            className="button-primary w-full"
          >
            <Chrome size={18} />
            Войти через Google
          </button>
        </section>
      </div>
    </main>
  );
}
