import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { inquiriesApi } from '../../services/adminApi';
import { extractErrorMessage } from '../../services/apiClient';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminTable from '../../components/admin/AdminTable';
import Pagination from '../../components/admin/Pagination';
import { LoadingState, ErrorState, EmptyState } from '../../components/common/States';

const STATUS_OPTIONS = ['', 'new', 'contacted', 'quoted', 'confirmed', 'completed', 'cancelled'];

export default function AdminInquiries() {
  const [items, setItems] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  function load() {
    setError('');
    const params = { page, limit: 20 };
    if (status) params.status = status;
    if (search) params.search = search;
    inquiriesApi.list(params)
      .then((res) => { setItems(res.data); setPagination(res.pagination); })
      .catch((err) => setError(extractErrorMessage(err, 'Unable to load inquiries.')));
  }

  useEffect(() => { setItems(null); load(); }, [page, status, search]);

  return (
    <div>
      <AdminPageHeader title="Inquiries" description="Review and manage customer quote requests." />

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="search"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by name, phone, or email"
          className="form-input sm:max-w-xs"
        />
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="form-input sm:max-w-xs">
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s ? s[0].toUpperCase() + s.slice(1) : 'All statuses'}</option>
          ))}
        </select>
      </div>

      {error && <ErrorState message={error} onRetry={load} />}
      {!error && !items && <LoadingState label="Loading inquiries..." />}
      {items && items.length === 0 && <EmptyState title="No inquiries found" />}
      {items && items.length > 0 && (
        <>
          <AdminTable
            columns={[
              { key: 'name', header: 'Name' },
              { key: 'phone', header: 'Phone' },
              { key: 'eventType', header: 'Event Type' },
              { key: 'eventDate', header: 'Event Date', render: (r) => (r.eventDate ? new Date(r.eventDate).toLocaleDateString() : '-') },
              { key: 'status', header: 'Status', render: (r) => <StatusPill status={r.status} /> },
              { key: 'createdAt', header: 'Submitted', render: (r) => new Date(r.createdAt).toLocaleDateString() },
              { key: 'actions', header: '', render: (r) => <Link to={`/admin/inquiries/${r._id}`} className="text-maroon font-medium hover:underline">View</Link> },
            ]}
            rows={items}
          />
          <Pagination pagination={pagination} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}

const STATUS_COLORS = {
  new: 'bg-gold/20 text-espresso',
  contacted: 'bg-brown-muted/10 text-brown-muted',
  quoted: 'bg-success/10 text-success',
  confirmed: 'bg-success/20 text-success',
  completed: 'bg-success/20 text-success',
  cancelled: 'bg-error/10 text-error',
};

export function StatusPill({ status }) {
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 ${STATUS_COLORS[status] || ''}`}>
      {status}
    </span>
  );
}
