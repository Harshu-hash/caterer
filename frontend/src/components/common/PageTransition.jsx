import { useLayoutEffect, useRef } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';

// Keys the outlet by pathname so each route change re-triggers a short
// fade/slide-in, and scrolls to top so the transition always starts clean.
export default function PageTransition() {
  const location = useLocation();
  const outlet = useOutlet();
  const isFirstRender = useRef(true);

  useLayoutEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }, [location.pathname]);

  return (
    <div key={location.pathname} className="animate-page-in">
      {outlet}
    </div>
  );
}
