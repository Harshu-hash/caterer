export default function AdminPageHeader({ title, description, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
      <div className="min-w-0">
        <h1 className="font-display text-2xl text-espresso">{title}</h1>
        {description && <p className="text-sm text-brown-muted mt-1">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
