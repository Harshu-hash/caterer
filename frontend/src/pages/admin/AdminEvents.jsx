import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { eventsApi } from '../../services/adminApi';
import { getMenuItems } from '../../services/publicApi';
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

// Lets the admin search the real menu catalog and attach specific dishes
// (with their real images) to an event, instead of typing free-text names.
function DishPicker({ selected, onChange }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return undefined;
    }
    setIsSearching(true);
    const handle = setTimeout(() => {
      getMenuItems({ search: query, limit: 8 })
        .then((res) => setResults(res.data))
        .catch(() => setResults([]))
        .finally(() => setIsSearching(false));
    }, 300);
    return () => clearTimeout(handle);
  }, [query]);

  function addDish(item) {
    if (selected.some((d) => d._id === item._id)) return;
    onChange([...selected, item]);
    setQuery('');
    setResults([]);
  }

  function removeDish(id) {
    onChange(selected.filter((d) => d._id !== id));
  }

  return (
    <div>
      <div className="relative">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search dishes to add (e.g. Paneer Tikka)..."
          className="form-input"
        />
        {query.trim() && (
          <div className="absolute z-10 left-0 right-0 mt-1 bg-white border border-border-beige shadow-lg max-h-56 overflow-y-auto">
            {isSearching && <p className="px-3 py-2 text-sm text-brown-muted">Searching...</p>}
            {!isSearching && results.length === 0 && <p className="px-3 py-2 text-sm text-brown-muted">No dishes found.</p>}
            {!isSearching && results.map((item) => (
              <button
                key={item._id}
                type="button"
                onClick={() => addDish(item)}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-ivory text-left text-sm"
              >
                {item.image && <img src={item.image} alt="" className="w-8 h-8 object-cover shrink-0" />}
                <span className="truncate">{item.name}</span>
                {item.categoryId?.name && <span className="text-xs text-brown-muted ml-auto shrink-0">{item.categoryId.name}</span>}
              </button>
            ))}
          </div>
        )}
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
    onSubmit({
      ...values,
      endDateTime: values.endDateTime || undefined,
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
