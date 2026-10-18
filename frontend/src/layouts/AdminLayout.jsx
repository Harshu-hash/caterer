import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import logo from '../assets/logo-optimized.png';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/inquiries', label: 'Inquiries' },
  { to: '/admin/services', label: 'Services' },
  { to: '/admin/menu-categories', label: 'Menu Categories' },
  { to: '/admin/menu-items', label: 'Menu Items' },
  { to: '/admin/packages', label: 'Packages' },
  { to: '/admin/events', label: 'Events' },
  { to: '/admin/gallery', label: 'Gallery' },
  { to: '/admin/testimonials', label: 'Testimonials' },
  { to: '/admin/reviews', label: 'Reviews' },
  { to: '/admin/media', label: 'Media Library' },
  { to: '/admin/settings', label: 'Website Settings' },
];

export default function AdminLayout() {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/admin/login');
  }

  return (
    <div className="h-screen flex bg-ivory overflow-hidden">
      <aside className="w-64 h-screen overflow-y-auto wine-surface text-ivory flex flex-col shrink-0">
        <div className="px-5 py-6 border-b border-gold/15 flex items-center gap-3">
          <img src={logo} alt="" className="h-10 w-10 object-contain shrink-0" />
          <p className="font-display text-xl gold-shine-text">Admin Panel</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1" aria-label="Admin navigation">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `block px-3 py-2 text-sm rounded transition-colors ${
                  isActive
                    ? 'bg-gradient-to-r from-gold-bright to-gold text-maroon-deep font-semibold shadow-sm'
                    : 'text-ivory/85 hover:bg-ivory/10'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-gold/15 text-sm">
          <p className="text-ivory/70 mb-2 truncate">{admin?.email}</p>
          <button type="button" onClick={handleLogout} className="text-gold hover:underline">
            Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 h-screen overflow-y-auto overflow-x-hidden">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
