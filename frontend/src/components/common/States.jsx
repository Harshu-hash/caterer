export function LoadingState({ label = 'Loading...' }) {
  return (
    <div role="status" className="flex items-center justify-center py-16 text-brown-muted">
      <span className="inline-block h-5 w-5 border-2 border-gold border-t-transparent rounded-full animate-spin mr-3" />
      {label}
    </div>
  );
}

export function EmptyState({ title = 'Nothing here yet', description, action }) {
  return (
    <div className="text-center py-16 px-6 border border-border-beige bg-white">
      <h3 className="font-display text-xl text-espresso mb-2">{title}</h3>
      {description && <p className="text-brown-muted mb-4">{description}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div role="alert" className="text-center py-16 px-6 border border-error/30 bg-white">
      <p className="text-error font-medium mb-4">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn-secondary">
          Try again
        </button>
      )}
    </div>
  );
}
