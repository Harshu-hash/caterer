import { useState } from 'react';
import ConfirmDialog from '../common/ConfirmDialog';
import { useToast } from '../common/Toast';
import { extractErrorMessage } from '../../services/apiClient';

export default function RowActions({ onEdit, onDelete, itemLabel = 'this record' }) {
  const { showToast } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleConfirmDelete() {
    setIsDeleting(true);
    try {
      await onDelete();
      showToast('Deleted successfully');
    } catch (err) {
      showToast(extractErrorMessage(err, 'Unable to delete this record.'), 'error');
    } finally {
      setIsDeleting(false);
      setConfirmOpen(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" onClick={onEdit} className="text-maroon font-medium hover:underline">
        Edit
      </button>
      <button type="button" onClick={() => setConfirmOpen(true)} className="text-error font-medium hover:underline">
        Delete
      </button>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete record?"
        description={`This will permanently delete ${itemLabel}. This cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
        confirmLabel={isDeleting ? 'Deleting...' : 'Delete'}
      />
    </div>
  );
}
