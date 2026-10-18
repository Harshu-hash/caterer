import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { SiteSettingsProvider } from './context/SiteSettingsContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { QuoteSelectionProvider } from './context/QuoteSelectionContext';
import { ToastProvider } from './components/common/Toast';

import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import AdminProtectedRoute from './routes/AdminProtectedRoute';

import Home from './pages/public/Home';
import About from './pages/public/About';
import Services from './pages/public/Services';
import ServiceDetail from './pages/public/ServiceDetail';
import WeddingCatering from './pages/public/WeddingCatering';
import Menu from './pages/public/Menu';
import Packages from './pages/public/Packages';
import Events from './pages/public/Events';
import Gallery from './pages/public/Gallery';
import Testimonials from './pages/public/Testimonials';
import Reviews from './pages/public/Reviews';
import Contact from './pages/public/Contact';
import GetAQuote from './pages/public/GetAQuote';
import PrivacyPolicy from './pages/public/PrivacyPolicy';
import Terms from './pages/public/Terms';
import NotFound from './pages/public/NotFound';

import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminInquiries from './pages/admin/AdminInquiries';
import AdminInquiryDetail from './pages/admin/AdminInquiryDetail';
import AdminServices from './pages/admin/AdminServices';
import AdminMenuCategories from './pages/admin/AdminMenuCategories';
import AdminMenuItems from './pages/admin/AdminMenuItems';
import AdminPackages from './pages/admin/AdminPackages';
import AdminEvents from './pages/admin/AdminEvents';
import AdminGallery from './pages/admin/AdminGallery';
import AdminTestimonials from './pages/admin/AdminTestimonials';
import AdminReviews from './pages/admin/AdminReviews';
import AdminMedia from './pages/admin/AdminMedia';
import AdminSettings from './pages/admin/AdminSettings';

export default function App() {
  return (
    <ToastProvider>
      <SiteSettingsProvider>
        <AdminAuthProvider>
          <QuoteSelectionProvider>
            <BrowserRouter>
              <Routes>
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/services/:slug" element={<ServiceDetail />} />
                  <Route path="/wedding-catering" element={<WeddingCatering />} />
                  <Route path="/menu" element={<Menu />} />
                  <Route path="/packages" element={<Packages />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/testimonials" element={<Testimonials />} />
                  <Route path="/reviews" element={<Reviews />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/get-a-quote" element={<GetAQuote />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="*" element={<NotFound />} />
                </Route>

                <Route path="/admin/login" element={<AdminLogin />} />

                <Route element={<AdminProtectedRoute />}>
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="inquiries" element={<AdminInquiries />} />
                    <Route path="inquiries/:id" element={<AdminInquiryDetail />} />
                    <Route path="services" element={<AdminServices />} />
                    <Route path="menu-categories" element={<AdminMenuCategories />} />
                    <Route path="menu-items" element={<AdminMenuItems />} />
                    <Route path="packages" element={<AdminPackages />} />
                    <Route path="events" element={<AdminEvents />} />
                    <Route path="gallery" element={<AdminGallery />} />
                    <Route path="testimonials" element={<AdminTestimonials />} />
                    <Route path="reviews" element={<AdminReviews />} />
                    <Route path="media" element={<AdminMedia />} />
                    <Route path="settings" element={<AdminSettings />} />
                  </Route>
                </Route>
              </Routes>
            </BrowserRouter>
          </QuoteSelectionProvider>
        </AdminAuthProvider>
      </SiteSettingsProvider>
    </ToastProvider>
  );
}
