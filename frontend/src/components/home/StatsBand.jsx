import { useEffect, useState } from 'react';
import { useInView } from '../../hooks/useInView';
import Reveal from '../common/Reveal';

const STATS = [
  { target: 25, suffix: '+', label: 'Years of Experience' },
  { target: 9, suffix: 'K+', label: 'Events Catered' },
];

function Counter({ target, suffix, isVisible, duration = 1500 }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isVisible) return undefined;
    let raf;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isVisible, target, duration]);

  return <>{value}{suffix}</>;
}

export default function StatsBand() {
  const { ref, isVisible } = useInView({ threshold: 0.4 });

  return (
    <section className="bg-ivory py-16 border-t border-border-beige">
      <div ref={ref} className="container-page">
        <Reveal className="grid grid-cols-2 divide-x divide-border-beige max-w-lg mx-auto text-center">
          {STATS.map((stat) => (
            <div key={stat.label} className="px-6">
              <p className="font-display text-4xl sm:text-5xl font-bold text-maroon">
                <Counter target={stat.target} suffix={stat.suffix} isVisible={isVisible} />
              </p>
              <p className="mt-2 text-sm uppercase tracking-widest text-brown-muted">{stat.label}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
