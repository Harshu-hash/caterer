import { useEffect, useState } from 'react';

function getRemaining(target) {
  const diff = Math.max(0, new Date(target).getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    done: diff <= 0,
  };
}

const UNITS = [
  ['days', 'Days'],
  ['hours', 'Hrs'],
  ['minutes', 'Min'],
  ['seconds', 'Sec'],
];

// Live ticking countdown to a target date/time, used to build anticipation
// for the next upcoming event in the Events page hero.
export default function EventCountdown({ target, className = '' }) {
  const [remaining, setRemaining] = useState(() => getRemaining(target));

  useEffect(() => {
    const id = setInterval(() => setRemaining(getRemaining(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (remaining.done) return null;

  return (
    <div className={`flex items-center gap-3 sm:gap-4 ${className}`}>
      {UNITS.map(([key, label]) => (
        <div key={key} className="flex flex-col items-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center bg-ivory/10 border border-gold/30 backdrop-blur-sm overflow-hidden">
            <span
              key={remaining[key]}
              className="font-display text-2xl sm:text-3xl gold-shine-text font-bold tabular-nums animate-digit-tick"
            >
              {String(remaining[key]).padStart(2, '0')}
            </span>
          </div>
          <span className="mt-1.5 text-[11px] uppercase tracking-widest text-ivory/70">{label}</span>
        </div>
      ))}
    </div>
  );
}
