export default function FormField({ label, children, error }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-espresso mb-1.5">{label}</span>
      {children}
      {error && <span className="block text-xs text-error mt-1">{error}</span>}
    </label>
  );
}
