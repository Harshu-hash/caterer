// Drifting marigold-gold petals for the hero — festive, lightweight (pure CSS animation).
const PETALS = Array.from({ length: 16 }, (_, i) => {
  const seed = i * 53.371;
  const left = (seed * 1.9) % 100;
  const size = 10 + ((seed * 0.6) % 14);
  const dur = 9 + ((seed * 0.37) % 10);
  const delay = -((seed * 0.8) % dur);
  const drift = 40 + ((seed * 1.3) % 90) * (i % 2 === 0 ? 1 : -1);
  const spin = 180 + ((seed * 2.2) % 360);
  const hue = i % 3 === 0 ? 'var(--color-gold-bright)' : i % 3 === 1 ? 'var(--color-gold)' : 'var(--color-gold-light)';
  return { key: i, left, size, dur, delay, drift, spin, hue };
});

export default function FloatingPetals({ className = '' }) {
  return (
    <div aria-hidden="true" className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {PETALS.map((p) => (
        <span
          key={p.key}
          className="absolute top-[-8%] animate-petal-fall"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
            '--drift': `${p.drift}px`,
            '--spin': `${p.spin}deg`,
          }}
        >
          <svg viewBox="0 0 24 24" width="100%" height="100%" style={{ filter: 'drop-shadow(0 0 3px rgba(0,0,0,0.25))' }}>
            <path
              d="M12 2c3 2 4 5 4 8s-1 6-4 12c-3-6-4-9-4-12s1-6 4-8z"
              fill={p.hue}
              opacity="0.85"
            />
          </svg>
        </span>
      ))}
    </div>
  );
}
