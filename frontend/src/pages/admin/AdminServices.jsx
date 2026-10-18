import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { servicesApi } from '../../services/adminApi';
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

export default function AdminServices() {
  const resource = useAdminResource(servicesApi);
  const { showToast } = useToast();

  return (
    <div>
      <AdminPageHeader
        title="Services"
        description="Manage the catering services shown on the public website."
        action={
          <button type="button" onClick={resource.openCreateForm} className="btn-primary">
            Add Service
          </button>
        }
      />

      {resource.error && <ErrorState message={resource.error} onRetry={resource.reload} />}
      {!resource.error && !resource.items && <LoadingState label="Loading services..." />}
      {resource.items && (
        <>
          <AdminTable
            columns={[
              { key: 'image', header: '', render: (r) => <img src={r.image} alt="" className="w-14 h-14 object-cover" /> },
              { key: 'title', header: 'Title' },
              { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
              {
                key: 'actions',
                header: '',
                render: (r) => (
                  <RowActions
                    onEdit={() => resource.openEditForm(r)}
                    onDelete={() => resource.deleteItem(r._id)}
                    itemLabel={r.title}
                  />
                ),
              },
            ]}
            rows={resource.items}
            emptyLabel="No services yet. Add your first service."
          />
          <Pagination pagination={resource.pagination} onPageChange={resource.setPage} />
        </>
      )}

      <Modal open={resource.isFormOpen} title={resource.editingItem ? 'Edit Service' : 'Add Service'} onClose={resource.closeForm}>
        <ServiceForm
          initialValues={resource.editingItem}
          onCancel={resource.closeForm}
          onSubmit={async (values) => {
            try {
              await resource.saveItem(values);
              showToast('Service saved successfully');
            } catch (err) {
              showToast(extractErrorMessage(err, 'Unable to save service.'), 'error');
            }
          }}
        />
      </Modal>
    </div>
  );
}

function ServiceForm({ initialValues, onSubmit, onCancel }) {
  const { register, handleSubmit, setValue, watch, formState: { isSubmitting } } = useForm({
    defaultValues: {
      title: '', summary: '', description: '', image: '', status: 'draft',
      features: '',
    },
  });

  useEffect(() => {
    if (initialValues) {
      setValue('title', initialValues.title || '');
      setValue('summary', initialValues.summary || '');
      setValue('description', initialValues.description || '');
      setValue('image', initialValues.image || '');
      setValue('status', initialValues.status || 'draft');
      setValue('features', (initialValues.features || []).join('\n'));
    }
  }, [initialValues, setValue]);

  const image = watch('image');

  function submit(values) {
    onSubmit({
      ...values,
      features: values.features.split('\n').map((f) => f.trim()).filter(Boolean),
    });
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <FormField label="Title"><input {...register('title', { required: true })} className="form-input" /></FormField>
      <FormField label="Summary"><input {...register('summary', { required: true })} className="form-input" /></FormField>
      <FormField label="Description"><textarea {...register('description')} rows={4} className="form-input" /></FormField>
      <FormField label="Features (one per line)"><textarea {...register('features')} rows={3} className="form-input" /></FormField>
      <ImageUploadField label="Service Image" value={image} onChange={(url) => setValue('image', url)} />
      <FormField label="Status">
        <select {...register('status')} className="form-input">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </FormField>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
        <button type="submit" disabled={isSubmitting} className="btn-primary disabled:opacity-60">
          {isSubmitting ? 'Saving...' : 'Save Service'}
        </button>
      </div>
    </form>
  );
}
