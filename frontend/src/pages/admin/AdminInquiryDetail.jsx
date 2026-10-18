import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { inquiriesApi } from '../../services/adminApi';
import { extractErrorMessage } from '../../services/apiClient';
import { useToast } from '../../components/common/Toast';
import { LoadingState, ErrorState } from '../../components/common/States';
import { StatusPill } from './AdminInquiries';

const STATUS_FLOW = ['new', 'contacted', 'quoted', 'confirmed', 'completed', 'cancelled'];

export default function AdminInquiryDetail() {
  const { id } = useParams();
  const { showToast } = useToast();

  const [inquiry, setInquiry] = useState(null);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [note, setNote] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  function load() {
    setError('');
    inquiriesApi.get(id)
      .then((data) => {
        setInquiry(data);
        setStatus(data.status);
        setInternalNotes(data.internalNotes || '');
      })
      .catch((err) => setError(extractErrorMessage(err, 'Unable to load this inquiry.')));
  }

  useEffect(load, [id]);

  async function handleSave() {
    setIsSaving(true);
    try {
      const updated = await inquiriesApi.update(id, { status, note, internalNotes });
      setInquiry(updated.data);
      setNote('');
      showToast('Inquiry updated successfully');
    } catch (err) {
      showToast(extractErrorMessage(err, 'Unable to update this inquiry.'), 'error');
    } finally {
      setIsSaving(false);
    }
  }

  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!inquiry) return <LoadingState label="Loading inquiry..." />;

  return (
    <div className="max-w-4xl">
      <Link to="/admin/inquiries" className="text-sm text-maroon hover:underline">&larr; Back to Inquiries</Link>

      <div className="flex flex-wrap items-center justify-between gap-3 mt-4 mb-6">
        <h1 className="font-display text-2xl text-espresso break-words">{inquiry.name}</h1>
        <StatusPill status={inquiry.status} />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <InfoCard title="Contact">
          <InfoRow label="Phone" value={<a href={`tel:${inquiry.phone}`} className="text-maroon hover:underline">{inquiry.phone}</a>} />
          {inquiry.email && <InfoRow label="Email" value={<a href={`mailto:${inquiry.email}`} className="text-maroon hover:underline">{inquiry.email}</a>} />}
          <InfoRow label="WhatsApp" value={<a href={`https://wa.me/${inquiry.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-success hover:underline">Message on WhatsApp</a>} />
        </InfoCard>

        <InfoCard title="Event Details">
          <InfoRow label="Event Type" value={inquiry.eventType} />
          <InfoRow label="Event Date" value={inquiry.eventDate ? new Date(inquiry.eventDate).toLocaleDateString() : '-'} />
          <InfoRow label="Guest Count" value={inquiry.guestCount || '-'} />
          <InfoRow label="Location" value={inquiry.location || '-'} />
          <InfoRow label="Budget" value={inquiry.budgetRange || '-'} />
        </InfoCard>
      </div>

      {inquiry.selectedItems?.length > 0 && (
        <InfoCard title="Selected Items" className="mb-8">
          <ul className="list-disc list-inside text-sm text-brown-muted">
            {inquiry.selectedItems.map((item, i) => <li key={i}>{item.name}</li>)}
          </ul>
        </InfoCard>
      )}

      {inquiry.message && (
        <InfoCard title="Message" className="mb-8">
          <p className="text-sm text-brown-muted whitespace-pre-line">{inquiry.message}</p>
        </InfoCard>
      )}

      <InfoCard title="Status & Internal Notes" className="mb-8">
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <label className="block">
            <span className="block text-sm font-medium text-espresso mb-1.5">Status</span>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="form-input">
              {STATUS_FLOW.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-espresso mb-1.5">Status Change Note (optional)</span>
            <input value={note} onChange={(e) => setNote(e.target.value)} className="form-input" />
          </label>
        </div>
        <label className="block mb-4">
          <span className="block text-sm font-medium text-espresso mb-1.5">Internal Notes (not visible to customer)</span>
          <textarea value={internalNotes} onChange={(e) => setInternalNotes(e.target.value)} rows={4} className="form-input" />
        </label>
        <button type="button" onClick={handleSave} disabled={isSaving} className="btn-primary disabled:opacity-60">
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </InfoCard>

      {inquiry.statusHistory?.length > 0 && (
        <InfoCard title="Status History">
          <ul className="space-y-2 text-sm text-brown-muted">
            {inquiry.statusHistory.map((entry, i) => (
              <li key={i} className="flex justify-between border-b border-border-beige last:border-0 pb-2">
                <span>{entry.status}{entry.note ? ` — ${entry.note}` : ''}</span>
                <span>{new Date(entry.changedAt).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </InfoCard>
      )}
    </div>
  );
}

function InfoCard({ title, children, className = '' }) {
  return (
    <div className={`bg-white border border-border-beige p-6 ${className}`}>
      <h2 className="font-display text-lg text-espresso mb-4">{title}</h2>
      {children}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 text-sm py-1.5 border-b border-border-beige last:border-0">
      <span className="text-brown-muted shrink-0">{label}</span>
      <span className="text-espresso font-medium text-right break-words min-w-0">{value}</span>
    </div>
  );
}
