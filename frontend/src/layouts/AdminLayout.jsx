import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
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
  { to: '/admin/reviews', label: 'Reviews' },
  { to: '/admin/media', label: 'Media Library' },
  { to: '/admin/settings', label: 'Website Settings' },
];

export default function AdminLayout() {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close the mobile drawer whenever the route changes (e.g. after tapping a nav link).
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  async function handleLogout() {
    await logout();
    navigate('/admin/login');
  }

  return (
    <div className="lg:h-screen lg:flex bg-ivory lg:overflow-hidden">
      {/* Mobile top bar — only the sidebar toggle + logo, visible below lg */}
      <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between gap-3 px-4 h-14 wine-surface text-ivory shadow-sm">
        <div className="flex items-center gap-2.5 min-w-0">
          <img src={logo} alt="" className="h-8 w-8 object-contain shrink-0" />
          <p className="font-display text-base gold-shine-text truncate">Admin Panel</p>
        </div>
        <button
          type="button"
          onClick={() => setIsSidebarOpen(true)}
          aria-label="Open admin menu"
          aria-expanded={isSidebarOpen}
          className="shrink-0 p-2 text-ivory"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Backdrop, mobile only, while the drawer is open */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-maroon-deep/50 animate-fade-in"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[80vw] h-screen overflow-y-auto wine-surface text-ivory flex flex-col shrink-0 transition-transform duration-300 ease-out lg:static lg:z-auto lg:w-64 lg:max-w-none lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="px-5 py-6 border-b border-gold/15 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <img src={logo} alt="" className="h-10 w-10 object-contain shrink-0" />
            <p className="font-display text-xl gold-shine-text truncate">Admin Panel</p>
          </div>
          <button
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close admin menu"
            className="lg:hidden shrink-0 p-1 text-ivory/80 hover:text-gold"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
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

      <main className="flex-1 lg:h-screen overflow-y-auto overflow-x-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
