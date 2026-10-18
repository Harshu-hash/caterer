import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { testimonialsApi } from '../../services/adminApi';
import { useAdminResource } from '../../hooks/useAdminResource';
import { useToast } from '../../components/common/Toast';
import { extractErrorMessage } from '../../services/apiClient';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminTable from '../../components/admin/AdminTable';
import Pagination from '../../components/admin/Pagination';
import Modal from '../../components/admin/Modal';
import RowActions from '../../components/admin/RowActions';
import StatusBadge from '../../components/admin/StatusBadge';
import FormField from '../../components/admin/FormField';
import { LoadingState, ErrorState } from '../../components/common/States';

export default function AdminTestimonials() {
  const resource = useAdminResource(testimonialsApi);
  const { showToast } = useToast();

  return (
    <div>
      <AdminPageHeader
        title="Testimonials"
        description="Manage approved customer reviews shown on the public website."
        action={<button type="button" onClick={resource.openCreateForm} className="btn-primary">Add Testimonial</button>}
      />

      {resource.error && <ErrorState message={resource.error} onRetry={resource.reload} />}
      {!resource.error && !resource.items && <LoadingState label="Loading testimonials..." />}
      {resource.items && (
        <>
          <AdminTable
            columns={[
              { key: 'customerName', header: 'Customer' },
              { key: 'eventType', header: 'Event Type' },
              { key: 'published', header: 'Status', render: (r) => <StatusBadge status={r.published} /> },
              {
                key: 'actions', header: '', render: (r) => (
                  <RowActions onEdit={() => resource.openEditForm(r)} onDelete={() => resource.deleteItem(r._id)} itemLabel={r.customerName} />
                ),
              },
            ]}
            rows={resource.items}
            emptyLabel="No testimonials yet. Add your first testimonial."
          />
          <Pagination pagination={resource.pagination} onPageChange={resource.setPage} />
        </>
      )}

      <Modal open={resource.isFormOpen} title={resource.editingItem ? 'Edit Testimonial' : 'Add Testimonial'} onClose={resource.closeForm}>
        <TestimonialForm
          initialValues={resource.editingItem}
          onCancel={resource.closeForm}
          onSubmit={async (values) => {
            try {
              await resource.saveItem(values);
              showToast('Testimonial saved successfully');
            } catch (err) {
              showToast(extractErrorMessage(err, 'Unable to save testimonial.'), 'error');
            }
          }}
        />
      </Modal>
    </div>
  );
}

function TestimonialForm({ initialValues, onSubmit, onCancel }) {
  const { register, handleSubmit, setValue, formState: { isSubmitting } } = useForm({
    defaultValues: { customerName: '', eventType: '', review: '', published: false },
  });

  useEffect(() => {
    if (initialValues) {
      setValue('customerName', initialValues.customerName || '');
      setValue('eventType', initialValues.eventType || '');
      setValue('review', initialValues.review || '');
      setValue('published', initialValues.published ?? false);
    }
  }, [initialValues, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField label="Customer Name"><input {...register('customerName', { required: true })} className="form-input" /></FormField>
      <FormField label="Event Type"><input {...register('eventType')} className="form-input" /></FormField>
      <FormField label="Review"><textarea {...register('review', { required: true })} rows={4} className="form-input" /></FormField>
      <label className="flex items-center gap-2 text-sm text-espresso">
        <input type="checkbox" {...register('published')} /> Published
      </label>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
        <button type="submit" disabled={isSubmitting} className="btn-primary disabled:opacity-60">
          {isSubmitting ? 'Saving...' : 'Save Testimonial'}
        </button>
      </div>
    </form>
  );
}
