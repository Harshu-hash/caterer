export default function Modal({ open, title, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] bg-maroon-deep/50 flex items-center justify-center px-4 py-8 overflow-y-auto animate-fade-in">
      <div className="bg-white w-full max-w-2xl p-6 md:p-8 max-h-full overflow-y-auto shadow-2xl animate-modal-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl text-espresso">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="text-2xl leading-none text-brown-muted">
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
