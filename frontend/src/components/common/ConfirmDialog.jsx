export default function ConfirmDialog({ open, title, description, onConfirm, onCancel, confirmLabel = 'Delete' }) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      className="fixed inset-0 z-[90] flex items-center justify-center bg-maroon-deep/50 px-4 animate-fade-in"
    >
      <div className="bg-white max-w-sm w-full p-6 shadow-2xl animate-modal-in">
        <h2 id="confirm-dialog-title" className="font-display text-xl text-espresso mb-2">
          {title}
        </h2>
        {description && <p className="text-brown-muted text-sm mb-6">{description}</p>}
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
          <button type="button" onClick={onConfirm} className="btn-primary btn-danger">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
