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
          <input
            type="password"
            {...register('password', { required: 'Password is required' })}
            className="form-input"
            aria-invalid={!!errors.password}
          />
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
