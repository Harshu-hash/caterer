import { useEffect, useRef, useState } from 'react';
import { mediaApi } from '../../services/adminApi';
import { useToast } from '../../components/common/Toast';
import { extractErrorMessage } from '../../services/apiClient';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import Pagination from '../../components/admin/Pagination';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { LoadingState, ErrorState, EmptyState } from '../../components/common/States';

export default function AdminMedia() {
  const { showToast } = useToast();
  const fileInputRef = useRef(null);

  const [items, setItems] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  function load() {
    setError('');
    mediaApi
      .list({ page, limit: 24 })
      .then((res) => { setItems(res.data); setPagination(res.pagination); })
      .catch((err) => setError(extractErrorMessage(err, 'Unable to load media library.')));
  }

  useEffect(() => { setItems(null); load(); }, [page]);

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      await mediaApi.upload(file);
      showToast('Image uploaded successfully');
      load();
    } catch (err) {
      showToast(extractErrorMessage(err, 'Upload failed.'), 'error');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function handleDelete() {
    try {
      await mediaApi.remove(pendingDeleteId);
      showToast('Image deleted successfully');
      load();
    } catch (err) {
      showToast(extractErrorMessage(err, 'Unable to delete this image.'), 'error');
    } finally {
      setPendingDeleteId(null);
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Media Library"
        description="Upload and manage images used across the website."
        action={
          <label className="btn-primary cursor-pointer">
            {isUploading ? 'Uploading...' : 'Upload Image'}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleUpload}
              disabled={isUploading}
              className="hidden"
            />
          </label>
        }
      />

      {error && <ErrorState message={error} onRetry={load} />}
      {!error && !items && <LoadingState label="Loading media..." />}
      {items && items.length === 0 && <EmptyState title="No images uploaded yet" />}
      {items && items.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {items.map((media) => (
              <div key={media._id} className="bg-white border border-border-beige p-2">
                <img src={media.url} alt="" className="w-full aspect-square object-cover mb-2" />
                <button
                  type="button"
                  onClick={() => setPendingDeleteId(media._id)}
                  className="w-full text-xs text-error hover:underline"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
          <Pagination pagination={pagination} onPageChange={setPage} />
        </>
      )}

      <ConfirmDialog
        open={!!pendingDeleteId}
        title="Delete this image?"
        description="If this image is still used by published content, deletion will be blocked."
        onConfirm={handleDelete}
        onCancel={() => setPendingDeleteId(null)}
      />
    </div>
  );
}
