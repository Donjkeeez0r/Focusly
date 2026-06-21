import { NavLink, Outlet } from 'react-router-dom';
import {
  BarChart3,
  Brain,
  Clock3,
  FolderKanban,
  ListX,
  LogOut,
  Moon,
  Sun,
  Timer,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const links = [
  { to: '/dashboard', label: 'Дашборд', icon: BarChart3 },
  { to: '/categories', label: 'Категории', icon: FolderKanban },
  { to: '/blocklist', label: 'Блоклист', icon: ListX },
  { to: '/logs', label: 'Логи', icon: Clock3 },
  { to: '/sessions', label: 'Сессии', icon: Timer },
  { to: '/ai-reports', label: 'AI-отчеты', icon: Brain },
];

export function AppLayout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-page text-text">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-border bg-panel px-4 py-5 lg:block">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-white">
            <Timer size={21} />
          </div>
          <div>
            <p className="text-sm text-subtle">Focus Ledger</p>
            <h1 className="text-lg font-semibold">Продуктивность</h1>
          </div>
        </div>

        <nav className="space-y-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-subtle hover:bg-muted hover:text-text'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-border bg-panel/90 backdrop-blur">
          <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 px-4 py-3 lg:px-8">
            <nav className="flex gap-1 overflow-x-auto lg:hidden">
              {links.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  aria-label={label}
                  className={({ isActive }) =>
                    `grid h-10 w-10 shrink-0 place-items-center rounded-md ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-subtle hover:bg-muted hover:text-text'
                    }`
                  }
                >
                  <Icon size={18} />
                </NavLink>
              ))}
            </nav>

            <div className="ml-auto flex items-center gap-3">
              <button
                type="button"
                onClick={toggleTheme}
                className="icon-button"
                aria-label="Переключить тему"
                title="Переключить тему"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <div className="hidden items-center gap-3 sm:flex">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt=""
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-muted text-sm font-semibold">
                    {user?.name?.[0] || 'U'}
                  </div>
                )}
                <div className="max-w-44">
                  <p className="truncate text-sm font-medium">{user?.name}</p>
                  <p className="truncate text-xs text-subtle">{user?.email}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={logout}
                className="icon-button"
                aria-label="Выйти"
                title="Выйти"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
