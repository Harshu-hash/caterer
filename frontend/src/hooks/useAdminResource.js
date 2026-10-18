import { useCallback, useEffect, useState } from 'react';
import { extractErrorMessage } from '../services/apiClient';

export function useAdminResource(api, { pageSize = 20 } = {}) {
  const [items, setItems] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const load = useCallback(() => {
    setError('');
    api
      .list({ page, limit: pageSize })
      .then((res) => {
        setItems(res.data);
        setPagination(res.pagination);
      })
      .catch((err) => setError(extractErrorMessage(err, 'Unable to load records.')));
  }, [api, page, pageSize]);

  useEffect(() => {
    setItems(null);
    load();
  }, [load]);

  function openCreateForm() {
    setEditingItem(null);
    setIsFormOpen(true);
  }

  function openEditForm(item) {
    setEditingItem(item);
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setEditingItem(null);
  }

  async function saveItem(payload) {
    if (editingItem) {
      await api.update(editingItem._id, payload);
    } else {
      await api.create(payload);
    }
    closeForm();
    load();
  }

  async function deleteItem(id) {
    await api.remove(id);
    load();
  }

  return {
    items,
    pagination,
    page,
    setPage,
    error,
    reload: load,
    editingItem,
    isFormOpen,
    openCreateForm,
    openEditForm,
    closeForm,
    saveItem,
    deleteItem,
  };
}
