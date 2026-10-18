import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { settingsApi } from '../../services/adminApi';
import { useToast } from '../../components/common/Toast';
import { extractErrorMessage } from '../../services/apiClient';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import FormField from '../../components/admin/FormField';
import ImageUploadField from '../../components/admin/ImageUploadField';
import { LoadingState, ErrorState } from '../../components/common/States';

export default function AdminSettings() {
  const { showToast } = useToast();
  const [settings, setSettings] = useState(null);
  const [error, setError] = useState('');

  function load() {
    setError('');
    setSettings(null);
    settingsApi.get().then(setSettings).catch((err) => setError(extractErrorMessage(err, 'Unable to load settings.')));
  }

  useEffect(load, []);

  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!settings) return <LoadingState label="Loading settings..." />;

  return (
    <div>
      <AdminPageHeader title="Website Settings" description="Manage business details shown across the public website." />
      <SettingsForm
        initialValues={settings}
        onSubmit={async (values) => {
          try {
            const updated = await settingsApi.update(values);
            setSettings(updated.data);
            showToast('Settings updated successfully');
          } catch (err) {
            showToast(extractErrorMessage(err, 'Unable to save settings.'), 'error');
          }
        }}
      />
    </div>
  );
}

function SettingsForm({ initialValues, onSubmit }) {
  const { register, handleSubmit, setValue, watch, formState: { isSubmitting } } = useForm({
    defaultValues: {
      businessName: '', address: '', serviceArea: '', operatingHours: '',
      contact: { phone: '', email: '', whatsApp: '' },
      socialLinks: { instagram: '', facebook: '', youtube: '' },
      hero: { headline: '', subheading: '', image: '' },
      brandStory: { eyebrow: '', title: '', description: '', image: '' },
      footer: { aboutText: '' },
    },
  });

  useEffect(() => {
    if (initialValues) {
      setValue('businessName', initialValues.businessName || '');
      setValue('address', initialValues.address || '');
      setValue('serviceArea', initialValues.serviceArea || '');
      setValue('operatingHours', initialValues.operatingHours || '');
      setValue('contact', initialValues.contact || {});
      setValue('socialLinks', initialValues.socialLinks || {});
      setValue('hero', initialValues.hero || {});
      setValue('brandStory', initialValues.brandStory || {});
      setValue('footer', initialValues.footer || {});
    }
  }, [initialValues, setValue]);

  const heroImage = watch('hero.image');
  const brandStoryImage = watch('brandStory.image');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-3xl">
      <section className="bg-white border border-border-beige p-6 space-y-4">
        <h2 className="font-display text-xl text-espresso">Business Details</h2>
        <FormField label="Business Name"><input {...register('businessName')} className="form-input" /></FormField>
        <FormField label="Address"><input {...register('address')} className="form-input" /></FormField>
        <FormField label="Service Area"><input {...register('serviceArea')} className="form-input" /></FormField>
        <FormField label="Operating Hours"><input {...register('operatingHours')} className="form-input" /></FormField>
      </section>

      <section className="bg-white border border-border-beige p-6 space-y-4">
        <h2 className="font-display text-xl text-espresso">Contact</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <FormField label="Phone"><input {...register('contact.phone')} className="form-input" /></FormField>
          <FormField label="Email"><input {...register('contact.email')} className="form-input" /></FormField>
          <FormField label="WhatsApp Number"><input {...register('contact.whatsApp')} className="form-input" placeholder="+91XXXXXXXXXX" /></FormField>
        </div>
      </section>

      <section className="bg-white border border-border-beige p-6 space-y-4">
        <h2 className="font-display text-xl text-espresso">Social Links</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <FormField label="Instagram"><input {...register('socialLinks.instagram')} className="form-input" /></FormField>
          <FormField label="Facebook"><input {...register('socialLinks.facebook')} className="form-input" /></FormField>
          <FormField label="YouTube"><input {...register('socialLinks.youtube')} className="form-input" /></FormField>
        </div>
      </section>

      <section className="bg-white border border-border-beige p-6 space-y-4">
        <h2 className="font-display text-xl text-espresso">Homepage Hero</h2>
        <FormField label="Headline"><input {...register('hero.headline')} className="form-input" /></FormField>
        <FormField label="Subheading"><textarea {...register('hero.subheading')} rows={2} className="form-input" /></FormField>
        <ImageUploadField label="Hero Image" value={heroImage} onChange={(url) => setValue('hero.image', url)} />
      </section>

      <section className="bg-white border border-border-beige p-6 space-y-4">
        <h2 className="font-display text-xl text-espresso">Homepage Our Story Section</h2>
        <FormField label="Eyebrow"><input {...register('brandStory.eyebrow')} className="form-input" /></FormField>
        <FormField label="Title"><input {...register('brandStory.title')} className="form-input" /></FormField>
        <FormField label="Description"><textarea {...register('brandStory.description')} rows={4} className="form-input" /></FormField>
        <ImageUploadField label="Story Image" value={brandStoryImage} onChange={(url) => setValue('brandStory.image', url)} />
      </section>

      <section className="bg-white border border-border-beige p-6 space-y-4">
        <h2 className="font-display text-xl text-espresso">Footer</h2>
        <FormField label="About Text"><textarea {...register('footer.aboutText')} rows={3} className="form-input" /></FormField>
      </section>

      <button type="submit" disabled={isSubmitting} className="btn-primary disabled:opacity-60">
        {isSubmitting ? 'Saving...' : 'Save Settings'}
      </button>
    </form>
  );
}
