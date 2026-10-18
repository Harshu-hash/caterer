import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { eventsApi } from '../../services/adminApi';
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

const DATE_FMT = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' });

// datetime-local inputs need "YYYY-MM-DDTHH:mm" in local time.
function toInputValue(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function AdminEvents() {
  const resource = useAdminResource(eventsApi);
  const { showToast } = useToast();

  return (
    <div>
      <AdminPageHeader
        title="Events"
        description="Manage live and upcoming events, venues, and featured menus."
        action={<button type="button" onClick={resource.openCreateForm} className="btn-primary">Add Event</button>}
      />

      {resource.error && <ErrorState message={resource.error} onRetry={resource.reload} />}
      {!resource.error && !resource.items && <LoadingState label="Loading events..." />}
      {resource.items && (
        <>
          <AdminTable
            columns={[
              { key: 'title', header: 'Title' },
              { key: 'startDateTime', header: 'Date & Time', render: (r) => DATE_FMT.format(new Date(r.startDateTime)) },
              { key: 'venueName', header: 'Venue' },
              { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
              {
                key: 'actions', header: '', render: (r) => (
                  <RowActions onEdit={() => resource.openEditForm(r)} onDelete={() => resource.deleteItem(r._id)} itemLabel={r.title} />
                ),
              },
            ]}
            rows={resource.items}
            emptyLabel="No events yet. Add your first event."
          />
          <Pagination pagination={resource.pagination} onPageChange={resource.setPage} />
        </>
      )}

      <Modal open={resource.isFormOpen} title={resource.editingItem ? 'Edit Event' : 'Add Event'} onClose={resource.closeForm}>
        <EventForm
          initialValues={resource.editingItem}
          onCancel={resource.closeForm}
          onSubmit={async (values) => {
            try {
              await resource.saveItem(values);
              showToast('Event saved successfully');
            } catch (err) {
              showToast(extractErrorMessage(err, 'Unable to save event.'), 'error');
            }
          }}
        />
      </Modal>
    </div>
  );
}

function EventForm({ initialValues, onSubmit, onCancel }) {
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      title: '', eventType: '', startDateTime: '', endDateTime: '',
      venueName: '', venueAddress: '', description: '', menuHighlights: '',
      image: '', status: 'draft',
    },
  });

  useEffect(() => {
    if (initialValues) {
      setValue('title', initialValues.title || '');
      setValue('eventType', initialValues.eventType || '');
      setValue('startDateTime', toInputValue(initialValues.startDateTime));
      setValue('endDateTime', toInputValue(initialValues.endDateTime));
      setValue('venueName', initialValues.venueName || '');
      setValue('venueAddress', initialValues.venueAddress || '');
      setValue('description', initialValues.description || '');
      setValue('menuHighlights', (initialValues.menuHighlights || []).join('\n'));
      setValue('image', initialValues.image || '');
      setValue('status', initialValues.status || 'draft');
    }
  }, [initialValues, setValue]);

  const image = watch('image');

  function submit(values) {
    onSubmit({
      ...values,
      endDateTime: values.endDateTime || undefined,
      menuHighlights: values.menuHighlights.split('\n').map((v) => v.trim()).filter(Boolean),
    });
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <FormField label="Title" error={errors.title?.message}>
        <input {...register('title', { required: 'Title is required' })} className="form-input" />
      </FormField>
      <FormField label="Event Type (optional)"><input {...register('eventType')} className="form-input" placeholder="e.g. Wedding, Exhibition" /></FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Starts At" error={errors.startDateTime?.message}>
          <input type="datetime-local" {...register('startDateTime', { required: 'Start date/time is required' })} className="form-input" />
        </FormField>
        <FormField label="Ends At (optional)">
          <input type="datetime-local" {...register('endDateTime')} className="form-input" />
        </FormField>
      </div>

      <FormField label="Venue Name" error={errors.venueName?.message}>
        <input {...register('venueName', { required: 'Venue name is required' })} className="form-input" />
      </FormField>
      <FormField label="Venue Address (optional)"><input {...register('venueAddress')} className="form-input" /></FormField>

      <FormField label="Description (optional)"><textarea {...register('description')} rows={3} className="form-input" /></FormField>
      <FormField label="Menu Highlights (one dish per line)"><textarea {...register('menuHighlights')} rows={3} className="form-input" /></FormField>

      <ImageUploadField label="Event Image (optional)" value={image} onChange={(url) => setValue('image', url)} />

      <FormField label="Status">
        <select {...register('status')} className="form-input">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </FormField>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
        <button type="submit" disabled={isSubmitting} className="btn-primary disabled:opacity-60">
          {isSubmitting ? 'Saving...' : 'Save Event'}
        </button>
      </div>
    </form>
  );
}
