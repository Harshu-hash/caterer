import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { quoteFormSchema, EVENT_TYPES, BUDGET_RANGES } from '../../utils/quoteSchema';
import { submitInquiry } from '../../services/publicApi';
import { extractErrorMessage, extractFieldErrors } from '../../services/apiClient';
import { useQuoteSelection } from '../../context/QuoteSelectionContext';

export default function QuoteForm() {
  const { selectedItems, clearSelection } = useQuoteSelection();
  const [submitState, setSubmitState] = useState({ status: 'idle', message: '', referenceId: '' });

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: { name: '', phone: '', email: '', eventType: '', eventDate: '', guestCount: '', location: '', budgetRange: '', message: '', honeypot: '' },
  });

  async function onSubmit(values) {
    setSubmitState({ status: 'idle', message: '', referenceId: '' });
    try {
      const payload = {
        ...values,
        guestCount: values.guestCount === '' ? undefined : Number(values.guestCount),
        selectedItems: selectedItems.map((i) => ({ name: i.name, type: i.type, refId: i.refId })),
      };
      const res = await submitInquiry(payload);
      setSubmitState({
        status: 'success',
        message: res.message || 'Inquiry submitted successfully.',
        referenceId: res.data?.inquiryId || '',
      });
      clearSelection();
      reset();
    } catch (err) {
      const fieldErrors = extractFieldErrors(err);
      Object.entries(fieldErrors).forEach(([field, message]) => {
        setError(field, { type: 'server', message });
      });
      if (Object.keys(fieldErrors).length === 0) {
        setSubmitState({ status: 'error', message: extractErrorMessage(err, 'Unable to submit your inquiry. Please try again.') });
      }
    }
  }

  if (submitState.status === 'success') {
    return (
      <div className="bg-white border border-success/30 p-8 text-center" role="status">
        <h3 className="font-display text-2xl text-espresso mb-2">Thank You!</h3>
        <p className="text-brown-muted mb-2">{submitState.message}</p>
        {submitState.referenceId && (
          <p className="text-xs text-brown-muted">Reference ID: {submitState.referenceId}</p>
        )}
        <p className="text-sm text-brown-muted mt-4">
          We've received your request and will contact you shortly. This confirms submission, not a
          confirmed booking.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-border-beige p-6 md:p-8 space-y-5" noValidate>
      {selectedItems.length > 0 && (
        <div className="bg-ivory border border-gold/40 px-4 py-3 text-sm text-espresso">
          Selected dishes: {selectedItems.map((i) => i.name).join(', ')}
        </div>
      )}

      <input type="text" {...register('honeypot')} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Full Name" error={errors.name?.message}>
          <input {...register('name')} className="form-input" aria-invalid={!!errors.name} />
        </Field>
        <Field label="Phone Number" error={errors.phone?.message}>
          <input {...register('phone')} type="tel" className="form-input" aria-invalid={!!errors.phone} />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Email (optional)" error={errors.email?.message}>
          <input {...register('email')} type="email" className="form-input" aria-invalid={!!errors.email} />
        </Field>
        <Field label="Event Type" error={errors.eventType?.message}>
          <select {...register('eventType')} className="form-input" aria-invalid={!!errors.eventType}>
            <option value="">Select event type</option>
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid sm:grid-cols-3 gap-5">
        <Field label="Event Date (optional)" error={errors.eventDate?.message}>
          <input {...register('eventDate')} type="date" className="form-input" />
        </Field>
        <Field label="Guest Count (optional)" error={errors.guestCount?.message}>
          <input {...register('guestCount')} type="number" min="1" className="form-input" />
        </Field>
        <Field label="Budget Range (optional)" error={errors.budgetRange?.message}>
          <select {...register('budgetRange')} className="form-input">
            <option value="">Select budget range</option>
            {BUDGET_RANGES.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Event Location (optional)" error={errors.location?.message}>
        <input {...register('location')} className="form-input" />
      </Field>

      <Field label="Additional Message (optional)" error={errors.message?.message}>
        <textarea {...register('message')} rows={4} className="form-input" />
      </Field>

      {submitState.status === 'error' && (
        <p role="alert" className="text-error text-sm">{submitState.message}</p>
      )}

      <button type="submit" disabled={isSubmitting} className="btn-primary w-full disabled:opacity-60">
        {isSubmitting ? 'Submitting...' : 'Request a Quote'}
      </button>
    </form>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-espresso mb-1.5">{label}</span>
      {children}
      {error && <span className="block text-xs text-error mt-1">{error}</span>}
    </label>
  );
}
