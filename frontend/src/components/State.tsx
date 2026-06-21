import { Loader2 } from 'lucide-react';

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-normal">{title}</h2>
        {description ? <p className="mt-1 text-sm text-subtle">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="grid min-h-screen place-items-center bg-page text-text">
      <Loader2 className="animate-spin text-primary" size={32} />
    </div>
  );
}

export function Panel({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={`panel ${className}`}>{children}</section>;
}

export function InlineState({
  loading,
  error,
  empty,
  children,
}: {
  loading?: boolean;
  error?: string | null;
  empty?: string | false | null;
  children: React.ReactNode;
}) {
  if (loading) {
    return <div className="state-box">Загрузка...</div>;
  }

  if (error) {
    return <div className="state-box border-danger/30 text-danger">{error}</div>;
  }

  if (empty) {
    return <div className="state-box">{empty}</div>;
  }

  return <>{children}</>;
}

export function SubmitButton({
  loading,
  children,
  className = '',
  disabled,
}: {
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className={`button-primary ${className}`}
    >
      {loading ? <Loader2 className="animate-spin" size={17} /> : null}
      {children}
    </button>
  );
}
