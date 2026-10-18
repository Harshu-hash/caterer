import { Link } from 'react-router-dom';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import WhatsAppCTA from '../common/WhatsAppCTA';
import SocialLinks from '../common/SocialLinks';
import BokehLights from '../common/BokehLights';
import Reveal from '../common/Reveal';
import logo from '../../assets/logo-optimized.png';

export default function Footer() {
  const { settings } = useSiteSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden wine-surface text-ivory">
      <BokehLights opacity={0.6} />
      <div className="container-page relative py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <Reveal>
          <img src={logo} alt="" className="h-28 w-28 object-contain mb-3" />
          <h3 className="font-display text-xl mb-3">{settings.businessName}</h3>
          <p className="text-sm text-ivory/80 leading-relaxed">
            {settings.footer?.aboutText || 'Premium Indian catering for weddings and celebrations.'}
          </p>
        </Reveal>

        <Reveal delay={80}>
          <h4 className="eyebrow text-gold mb-4">Explore</h4>
          <ul className="space-y-2 text-sm text-ivory/80">
            <li><Link to="/about" className="hover:text-gold transition-colors">About Us</Link></li>
            <li><Link to="/services" className="hover:text-gold transition-colors">Services</Link></li>
            <li><Link to="/menu" className="hover:text-gold transition-colors">Menu</Link></li>
            <li><Link to="/packages" className="hover:text-gold transition-colors">Packages</Link></li>
            <li><Link to="/events" className="hover:text-gold transition-colors">Events</Link></li>
            <li><Link to="/gallery" className="hover:text-gold transition-colors">Gallery</Link></li>
          </ul>
        </Reveal>

        <Reveal delay={160}>
          <h4 className="eyebrow text-gold mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-ivory/80">
            <li><Link to="/reviews" className="hover:text-gold transition-colors">Reviews</Link></li>
            <li><Link to="/testimonials" className="hover:text-gold transition-colors">Testimonials</Link></li>
            <li><Link to="/contact" className="hover:text-gold transition-colors">Contact</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-gold transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-gold transition-colors">Terms</Link></li>
          </ul>
        </Reveal>

        <Reveal delay={240}>
          <h4 className="eyebrow text-gold mb-4">Contact</h4>
          <ul className="space-y-2 text-sm text-ivory/80">
            {settings.contact?.phone && <li>{settings.contact.phone}</li>}
            {settings.contact?.email && <li>{settings.contact.email}</li>}
            {settings.address && <li>{settings.address}</li>}
            <li><WhatsAppCTA className="text-gold" /></li>
          </ul>
          <SocialLinks className="mt-4" />
        </Reveal>
      </div>

      <div className="relative border-t border-gold/15 py-5 text-center text-xs text-ivory/60">
        &copy; {year} {settings.businessName}. All rights reserved.
      </div>
    </footer>
  );
}
