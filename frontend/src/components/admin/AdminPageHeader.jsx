export default function AdminPageHeader({ title, description, action }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="font-display text-2xl text-espresso">{title}</h1>
        {description && <p className="text-sm text-brown-muted mt-1">{description}</p>}
      </div>
      {action}
    </div>
  );
}
