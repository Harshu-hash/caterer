import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { menuItemsApi, menuCategoriesApi } from '../../services/adminApi';
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

const DIET_TAGS = ['veg', 'non-veg', 'egg', 'jain', 'vegan'];

export default function AdminMenuItems() {
  const resource = useAdminResource(menuItemsApi);
  const { showToast } = useToast();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    menuCategoriesApi.list({ limit: 100 }).then((res) => setCategories(res.data));
  }, []);

  return (
    <div>
      <AdminPageHeader
        title="Menu Items"
        description="Manage dishes shown in the public menu catalog."
        action={<button type="button" onClick={resource.openCreateForm} className="btn-primary">Add Dish</button>}
      />

      {resource.error && <ErrorState message={resource.error} onRetry={resource.reload} />}
      {!resource.error && !resource.items && <LoadingState label="Loading menu items..." />}
      {resource.items && (
        <>
          <AdminTable
            columns={[
              { key: 'image', header: '', render: (r) => <img src={r.image} alt="" className="w-14 h-14 object-cover" /> },
              { key: 'name', header: 'Name' },
              { key: 'category', header: 'Category', render: (r) => r.categoryId?.name || '-' },
              { key: 'price', header: 'Price', render: (r) => (r.price ? `₹${r.price}` : 'On request') },
              { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
              {
                key: 'actions', header: '', render: (r) => (
                  <RowActions onEdit={() => resource.openEditForm(r)} onDelete={() => resource.deleteItem(r._id)} itemLabel={r.name} />
                ),
              },
            ]}
            rows={resource.items}
            emptyLabel="No dishes yet. Add your first dish."
          />
          <Pagination pagination={resource.pagination} onPageChange={resource.setPage} />
        </>
      )}

      <Modal open={resource.isFormOpen} title={resource.editingItem ? 'Edit Dish' : 'Add Dish'} onClose={resource.closeForm}>
        <MenuItemForm
          categories={categories}
          initialValues={resource.editingItem}
          onCancel={resource.closeForm}
          onSubmit={async (values) => {
            try {
              await resource.saveItem(values);
              showToast('Dish saved successfully');
            } catch (err) {
              showToast(extractErrorMessage(err, 'Unable to save dish.'), 'error');
            }
          }}
        />
      </Modal>
    </div>
  );
}

function MenuItemForm({ categories, initialValues, onSubmit, onCancel }) {
  const { register, handleSubmit, setValue, watch, formState: { isSubmitting } } = useForm({
    defaultValues: {
      name: '', categoryId: '', description: '', image: '', cuisine: '', price: '',
      availability: true, status: 'draft', dietaryTags: [],
    },
  });

  useEffect(() => {
    if (initialValues) {
      setValue('name', initialValues.name || '');
      setValue('categoryId', initialValues.categoryId?._id || initialValues.categoryId || '');
      setValue('description', initialValues.description || '');
      setValue('image', initialValues.image || '');
      setValue('cuisine', initialValues.cuisine || '');
      setValue('price', initialValues.price ?? '');
      setValue('availability', initialValues.availability ?? true);
      setValue('status', initialValues.status || 'draft');
      setValue('dietaryTags', initialValues.dietaryTags || []);
    }
  }, [initialValues, setValue]);

  const image = watch('image');
  const selectedTags = watch('dietaryTags');

  function toggleTag(tag) {
    const current = selectedTags || [];
    setValue('dietaryTags', current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag]);
  }

  function submit(values) {
    return onSubmit({ ...values, price: values.price === '' ? undefined : Number(values.price) });
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <FormField label="Name"><input {...register('name', { required: true })} className="form-input" /></FormField>
      <FormField label="Category">
        <select {...register('categoryId', { required: true })} className="form-input">
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
      </FormField>
      <FormField label="Description"><textarea {...register('description')} rows={3} className="form-input" /></FormField>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Cuisine"><input {...register('cuisine')} className="form-input" /></FormField>
        <FormField label="Price (optional)"><input type="number" {...register('price')} className="form-input" /></FormField>
      </div>

      <FormField label="Dietary Tags">
        <div className="flex flex-wrap gap-2">
          {DIET_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1.5 text-xs border ${selectedTags?.includes(tag) ? 'bg-maroon text-ivory border-maroon' : 'border-border-beige'}`}
            >
              {tag}
            </button>
          ))}
        </div>
      </FormField>

      <ImageUploadField label="Dish Image" value={image} onChange={(url) => setValue('image', url)} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="flex items-center gap-2 text-sm text-espresso">
          <input type="checkbox" {...register('availability')} /> Available
        </label>
        <FormField label="Status">
          <select {...register('status')} className="form-input">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </FormField>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
        <button type="submit" disabled={isSubmitting} className="btn-primary disabled:opacity-60">
          {isSubmitting ? 'Saving...' : 'Save Dish'}
        </button>
      </div>
    </form>
  );
}
