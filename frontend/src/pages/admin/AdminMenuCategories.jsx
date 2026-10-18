import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { menuCategoriesApi } from '../../services/adminApi';
import { useAdminResource } from '../../hooks/useAdminResource';
import { useToast } from '../../components/common/Toast';
import { extractErrorMessage } from '../../services/apiClient';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminTable from '../../components/admin/AdminTable';
import Pagination from '../../components/admin/Pagination';
import Modal from '../../components/admin/Modal';
import RowActions from '../../components/admin/RowActions';
import FormField from '../../components/admin/FormField';
import { LoadingState, ErrorState } from '../../components/common/States';

export default function AdminMenuCategories() {
  const resource = useAdminResource(menuCategoriesApi);
  const { showToast } = useToast();

  return (
    <div>
      <AdminPageHeader
        title="Menu Categories"
        description="Organize menu items into categories such as Starters, Main Course, and Desserts."
        action={<button type="button" onClick={resource.openCreateForm} className="btn-primary">Add Category</button>}
      />

      {resource.error && <ErrorState message={resource.error} onRetry={resource.reload} />}
      {!resource.error && !resource.items && <LoadingState label="Loading categories..." />}
      {resource.items && (
        <>
          <AdminTable
            columns={[
              { key: 'name', header: 'Name' },
              { key: 'isActive', header: 'Status', render: (r) => (r.isActive ? 'Active' : 'Inactive') },
              {
                key: 'actions', header: '', render: (r) => (
                  <RowActions onEdit={() => resource.openEditForm(r)} onDelete={() => resource.deleteItem(r._id)} itemLabel={r.name} />
                ),
              },
            ]}
            rows={resource.items}
            emptyLabel="No categories yet. Add your first category."
          />
          <Pagination pagination={resource.pagination} onPageChange={resource.setPage} />
        </>
      )}

      <Modal open={resource.isFormOpen} title={resource.editingItem ? 'Edit Category' : 'Add Category'} onClose={resource.closeForm}>
        <CategoryForm
          initialValues={resource.editingItem}
          onCancel={resource.closeForm}
          onSubmit={async (values) => {
            try {
              await resource.saveItem(values);
              showToast('Category saved successfully');
            } catch (err) {
              showToast(extractErrorMessage(err, 'Unable to save category.'), 'error');
            }
          }}
        />
      </Modal>
    </div>
  );
}

function CategoryForm({ initialValues, onSubmit, onCancel }) {
  const { register, handleSubmit, setValue, formState: { isSubmitting } } = useForm({
    defaultValues: { name: '', description: '', sortOrder: 0, isActive: true },
  });

  useEffect(() => {
    if (initialValues) {
      setValue('name', initialValues.name || '');
      setValue('description', initialValues.description || '');
      setValue('sortOrder', initialValues.sortOrder ?? 0);
      setValue('isActive', initialValues.isActive ?? true);
    }
  }, [initialValues, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField label="Name"><input {...register('name', { required: true })} className="form-input" /></FormField>
      <FormField label="Description"><textarea {...register('description')} rows={3} className="form-input" /></FormField>
      <FormField label="Sort Order"><input type="number" {...register('sortOrder')} className="form-input" /></FormField>
      <label className="flex items-center gap-2 text-sm text-espresso">
        <input type="checkbox" {...register('isActive')} /> Active
      </label>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
        <button type="submit" disabled={isSubmitting} className="btn-primary disabled:opacity-60">
          {isSubmitting ? 'Saving...' : 'Save Category'}
        </button>
      </div>
    </form>
  );
}
