import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { extractErrorMessage } from '../../services/apiClient';
import BokehLights from '../../components/common/BokehLights';
import logo from '../../assets/logo-optimized.png';

export default function AdminLogin() {
  const { admin, isLoading, login } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  if (!isLoading && admin) {
    return <Navigate to={location.state?.from?.pathname || '/admin'} replace />;
  }

  async function onSubmit(values) {
    setServerError('');
    try {
      await login(values);
      navigate(location.state?.from?.pathname || '/admin', { replace: true });
    } catch (err) {
      setServerError(extractErrorMessage(err, 'Invalid email or password'));
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center wine-surface px-4 overflow-hidden">
      <BokehLights opacity={0.7} />
      <form onSubmit={handleSubmit(onSubmit)} className="relative bg-white w-full max-w-sm p-8 shadow-2xl" noValidate>
        <img src={logo} alt="" className="h-16 w-16 object-contain mx-auto mb-4" />
        <h1 className="font-display text-2xl text-espresso mb-1 text-center">Admin Login</h1>
        <p className="text-sm text-brown-muted mb-6 text-center">Sign in to manage website content.</p>

        <label className="block mb-4">
          <span className="block text-sm font-medium text-espresso mb-1.5">Email</span>
          <input
            type="email"
            {...register('email', { required: 'Email is required' })}
            className="form-input"
            aria-invalid={!!errors.email}
          />
          {errors.email && <span className="block text-xs text-error mt-1">{errors.email.message}</span>}
        </label>

        <label className="block mb-6">
          <span className="block text-sm font-medium text-espresso mb-1.5">Password</span>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password', { required: 'Password is required' })}
              className="form-input pr-10"
              aria-invalid={!!errors.password}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-brown-muted hover:text-espresso"
            >
              {showPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3l18 18" strokeLinecap="round" />
                  <path
                    d="M10.58 10.58a2 2 0 0 0 2.83 2.83M9.36 5.3A10.4 10.4 0 0 1 12 5c6 0 9.5 5.5 9.5 7a11.9 11.9 0 0 1-2.6 3.4M6.6 6.6C3.9 8.3 2.5 11 2.5 12c0 1.5 3.5 7 9.5 7 1.2 0 2.3-.2 3.3-.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path
                    d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          {errors.password && <span className="block text-xs text-error mt-1">{errors.password.message}</span>}
        </label>

        {serverError && <p role="alert" className="text-error text-sm mb-4">{serverError}</p>}

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full disabled:opacity-60">
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
