import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reviewFormSchema } from '../../utils/reviewSchema';
import { submitReview } from '../../services/publicApi';
import { extractErrorMessage, extractFieldErrors } from '../../services/apiClient';
import { StarRatingInput } from './StarRating';

export default function ReviewForm() {
  const [submitState, setSubmitState] = useState({ status: 'idle', message: '' });

  const {
    register,
    handleSubmit,
    reset,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: { name: '', rating: 0, reviewText: '', honeypot: '' },
  });

  async function onSubmit(values) {
    setSubmitState({ status: 'idle', message: '' });
    try {
      const res = await submitReview(values);
      setSubmitState({ status: 'success', message: res.message || 'Thank you for your review!' });
      reset();
    } catch (err) {
      const fieldErrors = extractFieldErrors(err);
      Object.entries(fieldErrors).forEach(([field, message]) => {
        setError(field, { type: 'server', message });
      });
      if (Object.keys(fieldErrors).length === 0) {
        setSubmitState({ status: 'error', message: extractErrorMessage(err, 'Unable to submit your review. Please try again.') });
      }
    }
  }

  if (submitState.status === 'success') {
    return (
      <div className="bg-white border border-success/30 p-8 text-center" role="status">
        <h3 className="font-display text-2xl text-espresso mb-2">Thank You!</h3>
        <p className="text-brown-muted">{submitState.message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-border-beige p-6 md:p-8 space-y-5" noValidate>
      <input type="text" {...register('honeypot')} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <label className="block">
        <span className="block text-sm font-medium text-espresso mb-1.5">Your Name</span>
        <input {...register('name')} className="form-input" aria-invalid={!!errors.name} />
        {errors.name && <span className="block text-xs text-error mt-1">{errors.name.message}</span>}
      </label>

      <div>
        <span className="block text-sm font-medium text-espresso mb-1.5">Your Rating</span>
        <Controller
          name="rating"
          control={control}
          render={({ field }) => (
            <StarRatingInput value={field.value} onChange={field.onChange} error={errors.rating?.message} />
          )}
        />
      </div>

      <label className="block">
        <span className="block text-sm font-medium text-espresso mb-1.5">Your Review</span>
        <textarea
          {...register('reviewText')}
          rows={4}
          placeholder="Tell us about your experience with our catering..."
          className="form-input"
          aria-invalid={!!errors.reviewText}
        />
        {errors.reviewText && <span className="block text-xs text-error mt-1">{errors.reviewText.message}</span>}
      </label>

      {submitState.status === 'error' && (
        <p role="alert" className="text-error text-sm">{submitState.message}</p>
      )}

      <button type="submit" disabled={isSubmitting} className="btn-primary w-full disabled:opacity-60">
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}
