export default function StatusBadge({ status }) {
  const isPublished = status === 'published' || status === true;
  return (
    <span
      className={`text-xs font-semibold px-2.5 py-1 ${
        isPublished ? 'bg-success/10 text-success' : 'bg-brown-muted/10 text-brown-muted'
      }`}
    >
      {isPublished ? 'Published' : 'Draft'}
    </span>
  );
}
