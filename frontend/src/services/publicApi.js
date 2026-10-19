import { apiClient } from './apiClient';

export const getSiteSettings = () => apiClient.get('/site-settings').then((r) => r.data.data);

export const getServices = () => apiClient.get('/services').then((r) => r.data.data);

export const getServiceBySlug = (slug) => apiClient.get(`/services/${slug}`).then((r) => r.data.data);

export const getMenuCategories = () => apiClient.get('/menu-categories').then((r) => r.data.data);

export const getMenuItems = (params) => apiClient.get('/menu-items', { params }).then((r) => r.data);

export const getPackages = () => apiClient.get('/packages').then((r) => r.data.data);

export const getGalleryItems = (params) => apiClient.get('/gallery', { params }).then((r) => r.data);

export const getEvents = (params) => apiClient.get('/events', { params }).then((r) => r.data);

export const getEventById = (id) => apiClient.get(`/events/${id}`).then((r) => r.data.data);

export const getReviews = (params) => apiClient.get('/reviews', { params }).then((r) => r.data);

export const submitInquiry = (payload) => apiClient.post('/inquiries', payload).then((r) => r.data);

export const submitReview = (payload) => apiClient.post('/reviews', payload).then((r) => r.data);
