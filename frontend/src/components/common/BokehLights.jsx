// Decorative gold bokeh + glitter overlay for dark wine-maroon sections.
// Built from real circular elements (not a stretched SVG) so each light
// stays round and reads as a glowing bulb, not a flat oval.
const GLOW_DOTS = [
  { left: 8, top: 12, size: 70, o: 0.9, dur: 4.2, delay: 0 },
  { left: 22, top: 6, size: 46, o: 1, dur: 3.6, delay: 0.4 },
  { left: 34, top: 18, size: 80, o: 0.75, dur: 5, delay: 0.8 },
  { left: 47, top: 5, size: 42, o: 0.95, dur: 3.9, delay: 1.2 },
  { left: 58, top: 15, size: 64, o: 0.8, dur: 4.6, delay: 0.2 },
  { left: 71, top: 7, size: 50, o: 1, dur: 3.4, delay: 1.6 },
  { left: 83, top: 19, size: 74, o: 0.75, dur: 5.2, delay: 0.6 },
  { left: 93, top: 9, size: 44, o: 0.9, dur: 4, delay: 1 },
  { left: 15, top: 30, size: 36, o: 0.55, dur: 4.8, delay: 1.4 },
  { left: 64, top: 27, size: 32, o: 0.5, dur: 3.7, delay: 0.3 },
];

const GLITTER_DOTS = Array.from({ length: 50 }, (_, i) => {
  const seed = i * 97.17;
  const left = (seed * 1.37) % 100;
  const top = ((seed * 2.11) % 72) + 2;
  const size = 2 + ((seed * 0.73) % 3);
  const o = 0.4 + ((seed * 0.41) % 0.5);
  const dur = 2.2 + ((seed * 0.19) % 2.6);
  const delay = (seed * 0.07) % 3;
  return { left, top, size, o, dur, delay, key: i };
});

export default function BokehLights({ className = '', opacity = 1 }) {
  return (
    <div aria-hidden="true" className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} style={{ opacity }}>
      {GLOW_DOTS.map((dot, i) => (
        <span
          key={i}
          className="absolute rounded-full animate-float-slow"
          style={{
            left: `${dot.left}%`,
            top: `${dot.top}%`,
            width: dot.size,
            height: dot.size,
            background:
              'radial-gradient(circle, #fff7df 0%, var(--color-gold-bright) 28%, var(--color-gold) 55%, transparent 75%)',
            filter: 'blur(1px)',
            animation: `twinkle ${dot.dur}s ease-in-out ${dot.delay}s infinite, float-slow ${dot.dur + 2}s ease-in-out ${dot.delay}s infinite`,
            '--twinkle-min': dot.o * 0.55,
            '--twinkle-max': dot.o,
          }}
        />
      ))}
      {GLITTER_DOTS.map((dot) => (
        <span
          key={dot.key}
          className="absolute rounded-full"
          style={{
            left: `${dot.left}%`,
            top: `${dot.top}%`,
            width: dot.size,
            height: dot.size,
            background: 'var(--color-gold-bright)',
            boxShadow: '0 0 6px 1px var(--color-gold-bright)',
            animation: `twinkle ${dot.dur}s ease-in-out ${dot.delay}s infinite`,
            '--twinkle-min': dot.o * 0.25,
            '--twinkle-max': dot.o,
          }}
        />
      ))}
    </div>
  );
}
