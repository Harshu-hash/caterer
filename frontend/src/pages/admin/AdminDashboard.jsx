import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { inquiriesApi } from '../../services/adminApi';
import { extractErrorMessage } from '../../services/apiClient';
import { LoadingState, ErrorState } from '../../components/common/States';
import Reveal from '../../components/common/Reveal';
import { StatusPill } from './AdminInquiries';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState(null);
  const [error, setError] = useState('');

  function load() {
    setError('');
    Promise.all([
      inquiriesApi.list({ status: 'new', limit: 1 }),
      inquiriesApi.list({ status: 'contacted', limit: 1 }),
      inquiriesApi.list({ status: 'quoted', limit: 1 }),
      inquiriesApi.list({ status: 'confirmed', limit: 1 }),
      inquiriesApi.list({ limit: 1 }),
      inquiriesApi.list({ limit: 5 }),
    ])
      .then(([newRes, contactedRes, quotedRes, confirmedRes, totalRes, recentRes]) => {
        setStats({
          new: newRes.pagination.total,
          contacted: contactedRes.pagination.total,
          quoted: quotedRes.pagination.total,
          confirmed: confirmedRes.pagination.total,
          total: totalRes.pagination.total,
        });
        setRecent(recentRes.data);
      })
      .catch((err) => setError(extractErrorMessage(err, 'Unable to load dashboard data.')));
  }

  useEffect(load, []);

  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!stats) return <LoadingState label="Loading dashboard..." />;

  const CARDS = [
    { label: 'Total Inquiries', value: stats.total },
    { label: 'New', value: stats.new },
    { label: 'Contacted', value: stats.contacted },
    { label: 'Quoted', value: stats.quoted },
    { label: 'Confirmed', value: stats.confirmed },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl text-espresso mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-10">
        {CARDS.map((card, i) => (
          <Reveal key={card.label} delay={i * 70}>
            <div className="card-elevated bg-white border border-border-beige p-5 text-center">
              <p className="text-3xl font-semibold text-maroon">{card.value}</p>
              <p className="text-xs text-brown-muted mt-1">{card.label}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl text-espresso">Recent Inquiries</h2>
        <Link to="/admin/inquiries" className="text-sm text-maroon hover:underline">View all</Link>
      </div>

      {recent.length === 0 ? (
        <div className="bg-white border border-border-beige p-8 text-center text-brown-muted">No inquiries yet.</div>
      ) : (
        <div className="bg-white border border-border-beige divide-y divide-border-beige">
          {recent.map((inquiry) => (
            <Link
              key={inquiry._id}
              to={`/admin/inquiries/${inquiry._id}`}
              className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-5 py-4 hover:bg-ivory/40"
            >
              <div className="min-w-0">
                <p className="font-medium text-espresso break-words">{inquiry.name}</p>
                <p className="text-xs text-brown-muted">
                  {inquiry.eventType} &middot; {inquiry.guestCount ? `${inquiry.guestCount} guests` : 'Guest count TBD'}
                </p>
              </div>
              <StatusPill status={inquiry.status} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
