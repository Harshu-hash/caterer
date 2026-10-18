import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { galleryApi } from '../../services/adminApi';
import { useAdminResource } from '../../hooks/useAdminResource';
import { useToast } from '../../components/common/Toast';
import { extractErrorMessage } from '../../services/apiClient';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminTable from '../../components/admin/AdminTable';
import Pagination from '../../components/admin/Pagination';
import Modal from '../../components/admin/Modal';
import RowActions from '../../components/admin/RowActions';
import StatusBadge from '../../components/admin/StatusBadge';
import ImageUploadField from '../../components/admin/ImageUploadField';
import FormField from '../../components/admin/FormField';
import { LoadingState, ErrorState } from '../../components/common/States';

const CATEGORIES = ['Weddings', 'Buffet Setups', 'Food', 'Live Counters', 'Desserts'];

export default function AdminGallery() {
  const resource = useAdminResource(galleryApi);
  const { showToast } = useToast();

  return (
    <div>
      <AdminPageHeader
        title="Gallery"
        description="Manage photos shown in the public gallery."
        action={<button type="button" onClick={resource.openCreateForm} className="btn-primary">Add Photo</button>}
      />

      {resource.error && <ErrorState message={resource.error} onRetry={resource.reload} />}
      {!resource.error && !resource.items && <LoadingState label="Loading gallery..." />}
      {resource.items && (
        <>
          <AdminTable
            columns={[
              { key: 'imageUrl', header: '', render: (r) => <img src={r.imageUrl} alt="" className="w-14 h-14 object-cover" /> },
              { key: 'title', header: 'Title' },
              { key: 'category', header: 'Category' },
              { key: 'published', header: 'Status', render: (r) => <StatusBadge status={r.published} /> },
              {
                key: 'actions', header: '', render: (r) => (
                  <RowActions onEdit={() => resource.openEditForm(r)} onDelete={() => resource.deleteItem(r._id)} itemLabel={r.title} />
                ),
              },
            ]}
            rows={resource.items}
            emptyLabel="No photos yet. Add your first photo."
          />
          <Pagination pagination={resource.pagination} onPageChange={resource.setPage} />
        </>
      )}

      <Modal open={resource.isFormOpen} title={resource.editingItem ? 'Edit Photo' : 'Add Photo'} onClose={resource.closeForm}>
        <GalleryForm
          initialValues={resource.editingItem}
          onCancel={resource.closeForm}
          onSubmit={async (values) => {
            try {
              await resource.saveItem(values);
              showToast('Photo saved successfully');
            } catch (err) {
              showToast(extractErrorMessage(err, 'Unable to save photo.'), 'error');
            }
          }}
        />
      </Modal>
    </div>
  );
}

function GalleryForm({ initialValues, onSubmit, onCancel }) {
  const { register, handleSubmit, setValue, watch, formState: { isSubmitting } } = useForm({
    defaultValues: { title: '', category: '', caption: '', altText: '', imageUrl: '', published: false },
  });

  useEffect(() => {
    if (initialValues) {
      setValue('title', initialValues.title || '');
      setValue('category', initialValues.category || '');
      setValue('caption', initialValues.caption || '');
      setValue('altText', initialValues.altText || '');
      setValue('imageUrl', initialValues.imageUrl || '');
      setValue('published', initialValues.published ?? false);
    }
  }, [initialValues, setValue]);

  const imageUrl = watch('imageUrl');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField label="Title"><input {...register('title', { required: true })} className="form-input" /></FormField>
      <FormField label="Category">
        <select {...register('category', { required: true })} className="form-input">
          <option value="">Select category</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </FormField>
      <ImageUploadField label="Photo" value={imageUrl} onChange={(url) => setValue('imageUrl', url)} />
      <FormField label="Caption"><input {...register('caption')} className="form-input" /></FormField>
      <FormField label="Alt Text (for accessibility)"><input {...register('altText', { required: true })} className="form-input" /></FormField>
      <label className="flex items-center gap-2 text-sm text-espresso">
        <input type="checkbox" {...register('published')} /> Published
      </label>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
        <button type="submit" disabled={isSubmitting} className="btn-primary disabled:opacity-60">
          {isSubmitting ? 'Saving...' : 'Save Photo'}
        </button>
      </div>
    </form>
  );
}
