import { apiClient } from './apiClient';

export const adminLogin = (payload) => apiClient.post('/admin/auth/login', payload).then((r) => r.data);
export const adminLogout = () => apiClient.post('/admin/auth/logout').then((r) => r.data);
export const adminMe = () => apiClient.get('/admin/auth/me').then((r) => r.data.data);

function buildResource(path) {
  return {
    list: (params) => apiClient.get(`/admin/${path}`, { params }).then((r) => r.data),
    get: (id) => apiClient.get(`/admin/${path}/${id}`).then((r) => r.data.data),
    create: (payload) => apiClient.post(`/admin/${path}`, payload).then((r) => r.data),
    update: (id, payload) => apiClient.patch(`/admin/${path}/${id}`, payload).then((r) => r.data),
    remove: (id) => apiClient.delete(`/admin/${path}/${id}`).then((r) => r.data),
  };
}

export const servicesApi = buildResource('services');
export const menuCategoriesApi = buildResource('menu-categories');
export const menuItemsApi = buildResource('menu-items');
export const packagesApi = buildResource('packages');
export const galleryApi = buildResource('gallery');
export const eventsApi = buildResource('events');
export const reviewsApi = buildResource('reviews');

export const inquiriesApi = {
  list: (params) => apiClient.get('/admin/inquiries', { params }).then((r) => r.data),
  get: (id) => apiClient.get(`/admin/inquiries/${id}`).then((r) => r.data.data),
  update: (id, payload) => apiClient.patch(`/admin/inquiries/${id}`, payload).then((r) => r.data),
  remove: (id) => apiClient.delete(`/admin/inquiries/${id}`).then((r) => r.data),
};

export const settingsApi = {
  get: () => apiClient.get('/admin/settings').then((r) => r.data.data),
  update: (payload) => apiClient.patch('/admin/settings', payload).then((r) => r.data),
};

export const mediaApi = {
  list: (params) => apiClient.get('/admin/media', { params }).then((r) => r.data),
  upload: (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient
      .post('/admin/media', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress,
      })
      .then((r) => r.data.data);
  },
  remove: (id) => apiClient.delete(`/admin/media/${id}`).then((r) => r.data),
};
