import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { reviewsApi } from '../../services/adminApi';
import { useAdminResource } from '../../hooks/useAdminResource';
import { useToast } from '../../components/common/Toast';
import { extractErrorMessage } from '../../services/apiClient';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminTable from '../../components/admin/AdminTable';
import Pagination from '../../components/admin/Pagination';
import Modal from '../../components/admin/Modal';
import RowActions from '../../components/admin/RowActions';
import FormField from '../../components/admin/FormField';
import { StarRatingDisplay, StarRatingInput } from '../../components/reviews/StarRating';
import { LoadingState, ErrorState } from '../../components/common/States';

const STATUS_STYLES = {
  pending: 'bg-gold/15 text-espresso',
  approved: 'bg-success/10 text-success',
  rejected: 'bg-error/10 text-error',
};

function ReviewStatusBadge({ status }) {
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 capitalize ${STATUS_STYLES[status] || ''}`}>
      {status}
    </span>
  );
}

export default function AdminReviews() {
  const resource = useAdminResource(reviewsApi);
  const { showToast } = useToast();
  const [actioningId, setActioningId] = useState(null);

  async function quickSetStatus(id, status) {
    setActioningId(id);
    try {
      await reviewsApi.update(id, { status });
      showToast(`Review ${status}`);
      resource.reload();
    } catch (err) {
      showToast(extractErrorMessage(err, 'Unable to update review.'), 'error');
    } finally {
      setActioningId(null);
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Reviews"
        description="Visitor reviews publish immediately. Reject or delete any that shouldn't be shown."
        action={<button type="button" onClick={resource.openCreateForm} className="btn-primary">Add Review</button>}
      />

      {resource.error && <ErrorState message={resource.error} onRetry={resource.reload} />}
      {!resource.error && !resource.items && <LoadingState label="Loading reviews..." />}
      {resource.items && (
        <>
          <AdminTable
            columns={[
              { key: 'name', header: 'Name' },
              { key: 'rating', header: 'Rating', render: (r) => <StarRatingDisplay rating={r.rating} /> },
              { key: 'reviewText', header: 'Review', render: (r) => <span className="line-clamp-2 max-w-xs block">{r.reviewText}</span> },
              { key: 'status', header: 'Status', render: (r) => <ReviewStatusBadge status={r.status} /> },
              {
                key: 'actions',
                header: '',
                render: (r) => (
                  <div className="flex items-center gap-3">
                    {r.status !== 'approved' && (
                      <button
                        type="button"
                        disabled={actioningId === r._id}
                        onClick={() => quickSetStatus(r._id, 'approved')}
                        className="text-success font-medium hover:underline disabled:opacity-50"
                      >
                        Approve
                      </button>
                    )}
                    {r.status !== 'rejected' && (
                      <button
                        type="button"
                        disabled={actioningId === r._id}
                        onClick={() => quickSetStatus(r._id, 'rejected')}
                        className="text-error font-medium hover:underline disabled:opacity-50"
                      >
                        Reject
                      </button>
                    )}
                    <RowActions onEdit={() => resource.openEditForm(r)} onDelete={() => resource.deleteItem(r._id)} itemLabel={r.name} />
                  </div>
                ),
              },
            ]}
            rows={resource.items}
            emptyLabel="No reviews yet."
          />
          <Pagination pagination={resource.pagination} onPageChange={resource.setPage} />
        </>
      )}

      <Modal open={resource.isFormOpen} title={resource.editingItem ? 'Edit Review' : 'Add Review'} onClose={resource.closeForm}>
        <ReviewForm
          initialValues={resource.editingItem}
          onCancel={resource.closeForm}
          onSubmit={async (values) => {
            try {
              await resource.saveItem(values);
              showToast('Review saved successfully');
            } catch (err) {
              showToast(extractErrorMessage(err, 'Unable to save review.'), 'error');
            }
          }}
        />
      </Modal>
    </div>
  );
}

function ReviewForm({ initialValues, onSubmit, onCancel }) {
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { name: '', rating: 0, reviewText: '', status: 'pending' },
  });

  useEffect(() => {
    if (initialValues) {
      setValue('name', initialValues.name || '');
      setValue('rating', initialValues.rating || 0);
      setValue('reviewText', initialValues.reviewText || '');
      setValue('status', initialValues.status || 'pending');
    }
  }, [initialValues, setValue]);

  const rating = watch('rating');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField label="Name" error={errors.name?.message}>
        <input {...register('name', { required: 'Name is required' })} className="form-input" />
      </FormField>

      <FormField label="Rating">
        <StarRatingInput value={rating} onChange={(v) => setValue('rating', v)} />
      </FormField>

      <FormField label="Review" error={errors.reviewText?.message}>
        <textarea {...register('reviewText', { required: 'Review text is required' })} rows={4} className="form-input" />
      </FormField>

      <FormField label="Status">
        <select {...register('status')} className="form-input">
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </FormField>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
        <button type="submit" disabled={isSubmitting} className="btn-primary disabled:opacity-60">
          {isSubmitting ? 'Saving...' : 'Save Review'}
        </button>
      </div>
    </form>
  );
}
