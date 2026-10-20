import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { eventsApi } from '../../services/adminApi';
import { getMenuItems, getMenuCategories } from '../../services/publicApi';
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

const DATE_FMT = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Kolkata',
});

// All events are in India, so event times are always entered and displayed
// in IST — regardless of what timezone the admin's browser or the server
// happens to be in. Without this, a bare "2026-11-01T10:00" string (what
// datetime-local inputs give/expect) gets parsed as local-to-whatever-
// machine-runs-the-code, which on a UTC server shifts it by 5.5 hours.
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

// Stored UTC ISO string -> "YYYY-MM-DDTHH:mm" for the datetime-local input,
// rendered as IST regardless of the admin's own browser timezone.
function toInputValue(isoString) {
  if (!isoString) return '';
  const d = new Date(new Date(isoString).getTime() + IST_OFFSET_MS);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
}

// datetime-local value ("YYYY-MM-DDTHH:mm") -> explicit IST-offset ISO
// string, so the backend parses the exact intended instant no matter what
// timezone it's running in.
function toIST(value) {
  if (!value) return undefined;
  return `${value}:00+05:30`;
}

export default function AdminEvents() {
  const resource = useAdminResource(eventsApi);
  const { showToast } = useToast();

  return (
    <div>
      <AdminPageHeader
        title="Events"
        description="Manage live and upcoming events, venues, and featured dishes."
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
              { key: 'dishes', header: 'Dishes', render: (r) => r.dishes?.length || 0 },
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

// Lets the admin attach specific dishes (with their real images) to an
// event by first picking a menu category, then a dish within it — so
// dishes from many categories can be added quickly without typing.
function DishPicker({ selected, onChange }) {
  const [categories, setCategories] = useState([]);
  const [categorySlug, setCategorySlug] = useState('');
  const [items, setItems] = useState([]);
  const [isLoadingItems, setIsLoadingItems] = useState(false);

  useEffect(() => {
    getMenuCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (!categorySlug) {
      setItems([]);
      return undefined;
    }
    setIsLoadingItems(true);
    getMenuItems({ category: categorySlug, limit: 200 })
      .then((res) => setItems(res.data))
      .catch(() => setItems([]))
      .finally(() => setIsLoadingItems(false));
  }, [categorySlug]);

  function addDish(id) {
    const item = items.find((i) => i._id === id);
    if (!item || selected.some((d) => d._id === item._id)) return;
    onChange([...selected, item]);
  }

  function removeDish(id) {
    onChange(selected.filter((d) => d._id !== id));
  }

  const availableItems = items.filter((i) => !selected.some((d) => d._id === i._id));

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <select
          value={categorySlug}
          onChange={(e) => setCategorySlug(e.target.value)}
          className="form-input"
        >
          <option value="">Select category...</option>
          {categories.map((c) => (
            <option key={c._id} value={c.slug}>{c.name}</option>
          ))}
        </select>

        <select
          value=""
          onChange={(e) => addDish(e.target.value)}
          disabled={!categorySlug || isLoadingItems}
          className="form-input disabled:opacity-60"
        >
          <option value="">
            {!categorySlug ? 'Choose a category first' : isLoadingItems ? 'Loading dishes...' : 'Select dish to add...'}
          </option>
          {availableItems.map((item) => (
            <option key={item._id} value={item._id}>{item.name}</option>
          ))}
        </select>
      </div>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {selected.map((item) => (
            <span key={item._id} className="inline-flex items-center gap-1.5 bg-ivory border border-border-beige pl-1.5 pr-2 py-1 text-xs">
              {item.image && <img src={item.image} alt="" className="w-6 h-6 object-cover shrink-0" />}
              {item.name}
              <button type="button" onClick={() => removeDish(item._id)} aria-label={`Remove ${item.name}`} className="text-error font-bold ml-1">
                &times;
              </button>
            </span>
          ))}
        </div>
      )}
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
  const [dishes, setDishes] = useState([]);

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
      setDishes(initialValues.dishes || []);
    } else {
      setDishes([]);
    }
  }, [initialValues, setValue]);

  const image = watch('image');

  function submit(values) {
    return onSubmit({
      ...values,
      startDateTime: toIST(values.startDateTime),
      endDateTime: toIST(values.endDateTime),
      menuHighlights: values.menuHighlights.split('\n').map((v) => v.trim()).filter(Boolean),
      dishes: dishes.map((d) => d._id),
    });
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <FormField label="Title" error={errors.title?.message}>
        <input {...register('title', { required: 'Title is required' })} className="form-input" />
      </FormField>
      <FormField label="Event Type (optional)"><input {...register('eventType')} className="form-input" placeholder="e.g. Wedding, Exhibition" /></FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

      <FormField label="Dishes at This Event">
        <DishPicker selected={dishes} onChange={setDishes} />
      </FormField>

      <FormField label="Extra Menu Highlights (optional, one per line — for cuisines/notes not in the catalog)">
        <textarea {...register('menuHighlights')} rows={2} className="form-input" />
      </FormField>

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
