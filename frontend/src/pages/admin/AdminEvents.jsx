import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { eventsApi, mediaApi } from '../../services/adminApi';
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
              {
                key: 'dishes',
                header: 'Dishes',
                render: (r) => r.dishSections?.reduce((sum, s) => sum + (s.dishes?.length || 0), 0) || 0,
              },
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

// Compact inline image uploader for a single dish row (ImageUploadField's
// own preview is full-width/h-40, too large to repeat per dish here).
function DishThumbUpload({ value, onChange }) {
  const [isUploading, setIsUploading] = useState(false);

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const media = await mediaApi.upload(file);
      onChange(media.url);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  }

  return (
    <label className="shrink-0 w-14 h-14 border border-dashed border-border-beige bg-ivory flex items-center justify-center cursor-pointer overflow-hidden relative">
      {value && <img src={value} alt="" className="w-full h-full object-cover" />}
      {!value && <span className="text-[10px] text-brown-muted text-center px-1">{isUploading ? '...' : 'Photo'}</span>}
      <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} className="sr-only" />
    </label>
  );
}

// Lets the admin build the event's own menu display from scratch: any
// number of custom sections (e.g. "Starters", "Main Course"), each with its
// own heading and its own list of dishes typed in with a name + photo —
// not tied to the shared menu catalog.
function DishSectionsEditor({ sections, onChange }) {
  function updateSection(index, patch) {
    onChange(sections.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  }

  function removeSection(index) {
    onChange(sections.filter((_, i) => i !== index));
  }

  function addSection() {
    onChange([...sections, { heading: '', dishes: [] }]);
  }

  function addDish(sectionIndex) {
    updateSection(sectionIndex, { dishes: [...sections[sectionIndex].dishes, { name: '', image: '' }] });
  }

  function updateDish(sectionIndex, dishIndex, patch) {
    const dishes = sections[sectionIndex].dishes.map((d, i) => (i === dishIndex ? { ...d, ...patch } : d));
    updateSection(sectionIndex, { dishes });
  }

  function removeDish(sectionIndex, dishIndex) {
    updateSection(sectionIndex, { dishes: sections[sectionIndex].dishes.filter((_, i) => i !== dishIndex) });
  }

  return (
    <div className="space-y-4">
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="border border-border-beige bg-ivory/40 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <input
              value={section.heading}
              onChange={(e) => updateSection(sectionIndex, { heading: e.target.value })}
              placeholder="Section heading (e.g. Starters, Main Course)"
              className="form-input flex-1 font-medium"
            />
            <button
              type="button"
              onClick={() => removeSection(sectionIndex)}
              aria-label="Remove section"
              className="text-error text-sm font-semibold px-2 shrink-0"
            >
              Remove
            </button>
          </div>

          <div className="space-y-2">
            {section.dishes.map((dish, dishIndex) => (
              <div key={dishIndex} className="flex items-center gap-2">
                <DishThumbUpload value={dish.image} onChange={(url) => updateDish(sectionIndex, dishIndex, { image: url })} />
                <input
                  value={dish.name}
                  onChange={(e) => updateDish(sectionIndex, dishIndex, { name: e.target.value })}
                  placeholder="Dish name"
                  className="form-input flex-1"
                />
                <button
                  type="button"
                  onClick={() => removeDish(sectionIndex, dishIndex)}
                  aria-label={`Remove ${dish.name || 'dish'}`}
                  className="text-error font-bold px-2 shrink-0"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>

          <button type="button" onClick={() => addDish(sectionIndex)} className="btn-secondary text-sm">
            + Add Dish
          </button>
        </div>
      ))}

      <button type="button" onClick={addSection} className="btn-secondary text-sm">
        + Add Dish Section
      </button>
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
  const [dishSections, setDishSections] = useState([]);

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
      setDishSections(initialValues.dishSections || []);
    } else {
      setDishSections([]);
    }
  }, [initialValues, setValue]);

  const image = watch('image');

  function submit(values) {
    return onSubmit({
      ...values,
      startDateTime: toIST(values.startDateTime),
      endDateTime: toIST(values.endDateTime),
      menuHighlights: values.menuHighlights.split('\n').map((v) => v.trim()).filter(Boolean),
      dishSections: dishSections
        .filter((s) => s.heading.trim())
        .map((s) => ({ heading: s.heading.trim(), dishes: s.dishes.filter((d) => d.name.trim()) })),
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

      <FormField label="Dish Sections (optional — organize dishes under custom headings)">
        <DishSectionsEditor sections={dishSections} onChange={setDishSections} />
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
