import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { packagesApi } from '../../services/adminApi';
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

export default function AdminPackages() {
  const resource = useAdminResource(packagesApi);
  const { showToast } = useToast();

  return (
    <div>
      <AdminPageHeader
        title="Packages"
        description="Manage configurable catering packages."
        action={<button type="button" onClick={resource.openCreateForm} className="btn-primary">Add Package</button>}
      />

      {resource.error && <ErrorState message={resource.error} onRetry={resource.reload} />}
      {!resource.error && !resource.items && <LoadingState label="Loading packages..." />}
      {resource.items && (
        <>
          <AdminTable
            columns={[
              { key: 'image', header: '', render: (r) => <img src={r.image} alt="" className="w-14 h-14 object-cover" /> },
              { key: 'name', header: 'Name' },
              { key: 'startingPrice', header: 'Starting Price', render: (r) => (r.startingPrice ? `₹${r.startingPrice}` : 'Quote only') },
              { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
              {
                key: 'actions', header: '', render: (r) => (
                  <RowActions onEdit={() => resource.openEditForm(r)} onDelete={() => resource.deleteItem(r._id)} itemLabel={r.name} />
                ),
              },
            ]}
            rows={resource.items}
            emptyLabel="No packages yet. Add your first package."
          />
          <Pagination pagination={resource.pagination} onPageChange={resource.setPage} />
        </>
      )}

      <Modal open={resource.isFormOpen} title={resource.editingItem ? 'Edit Package' : 'Add Package'} onClose={resource.closeForm}>
        <PackageForm
          initialValues={resource.editingItem}
          onCancel={resource.closeForm}
          onSubmit={async (values) => {
            try {
              await resource.saveItem(values);
              showToast('Package saved successfully');
            } catch (err) {
              showToast(extractErrorMessage(err, 'Unable to save package.'), 'error');
            }
          }}
        />
      </Modal>
    </div>
  );
}

function PackageForm({ initialValues, onSubmit, onCancel }) {
  const { register, handleSubmit, setValue, watch, formState: { isSubmitting } } = useForm({
    defaultValues: {
      name: '', description: '', startingPrice: '', minGuests: '', image: '', status: 'draft',
      inclusions: '', addOns: '',
    },
  });

  useEffect(() => {
    if (initialValues) {
      setValue('name', initialValues.name || '');
      setValue('description', initialValues.description || '');
      setValue('startingPrice', initialValues.startingPrice ?? '');
      setValue('minGuests', initialValues.minGuests ?? '');
      setValue('image', initialValues.image || '');
      setValue('status', initialValues.status || 'draft');
      setValue('inclusions', (initialValues.inclusions || []).join('\n'));
      setValue('addOns', (initialValues.addOns || []).join('\n'));
    }
  }, [initialValues, setValue]);

  const image = watch('image');

  function submit(values) {
    onSubmit({
      ...values,
      startingPrice: values.startingPrice === '' ? undefined : Number(values.startingPrice),
      minGuests: values.minGuests === '' ? undefined : Number(values.minGuests),
      inclusions: values.inclusions.split('\n').map((v) => v.trim()).filter(Boolean),
      addOns: values.addOns.split('\n').map((v) => v.trim()).filter(Boolean),
    });
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <FormField label="Name"><input {...register('name', { required: true })} className="form-input" /></FormField>
      <FormField label="Description"><textarea {...register('description')} rows={3} className="form-input" /></FormField>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Starting Price (optional)"><input type="number" {...register('startingPrice')} className="form-input" /></FormField>
        <FormField label="Minimum Guests (optional)"><input type="number" {...register('minGuests')} className="form-input" /></FormField>
      </div>
      <FormField label="Inclusions (one per line)"><textarea {...register('inclusions')} rows={3} className="form-input" /></FormField>
      <FormField label="Add-ons (one per line)"><textarea {...register('addOns')} rows={3} className="form-input" /></FormField>
      <ImageUploadField label="Package Image" value={image} onChange={(url) => setValue('image', url)} />
      <FormField label="Status">
        <select {...register('status')} className="form-input">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </FormField>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
        <button type="submit" disabled={isSubmitting} className="btn-primary disabled:opacity-60">
          {isSubmitting ? 'Saving...' : 'Save Package'}
        </button>
      </div>
    </form>
  );
}
