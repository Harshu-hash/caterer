import { PrimaryButton } from '../common/Buttons';

export default function PackageCard({ pkg }) {
  return (
    <div className="card-elevated group bg-white border border-border-beige flex flex-col">
      <div className="aspect-[16/10] overflow-hidden">
        <img
          src={pkg.image}
          alt={pkg.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="font-display text-xl text-espresso mb-2">{pkg.name}</h3>
        <p className="text-sm text-brown-muted mb-4">{pkg.description}</p>

        {pkg.minGuests && (
          <p className="text-xs text-gold uppercase tracking-wide mb-3">Minimum {pkg.minGuests} Guests</p>
        )}

        {pkg.inclusions?.length > 0 && (
          <ul className="space-y-1.5 mb-4 flex-1">
            {pkg.inclusions.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-brown-muted">
                <span className="text-gold mt-0.5">&#10003;</span>
                {item}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-border-beige">
          {pkg.startingPrice ? (
            <span className="font-semibold text-espresso">Starting ₹{pkg.startingPrice.toLocaleString('en-IN')}</span>
          ) : (
            <span className="text-sm text-brown-muted">Request a quote</span>
          )}
          <PrimaryButton to="/get-a-quote">Customize</PrimaryButton>
        </div>
      </div>
    </div>
  );
}
