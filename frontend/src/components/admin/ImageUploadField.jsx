import { useState } from 'react';
import { mediaApi } from '../../services/adminApi';
import { extractErrorMessage } from '../../services/apiClient';

export default function ImageUploadField({ label, value, onChange }) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setError('');
    try {
      const media = await mediaApi.upload(file);
      onChange(media.url);
    } catch (err) {
      setError(extractErrorMessage(err, 'Upload failed. Please try a different image.'));
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <label className="block">
      <span className="block text-sm font-medium text-espresso mb-1.5">{label}</span>
      {value && (
        <img src={value} alt="" className="w-full h-40 object-cover mb-2 border border-border-beige" />
      )}
      <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} className="form-input" />
      {isUploading && <span className="block text-xs text-brown-muted mt-1">Uploading...</span>}
      {error && <span className="block text-xs text-error mt-1">{error}</span>}
    </label>
  );
}
