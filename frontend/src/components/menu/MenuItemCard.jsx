const DIET_LABEL = { veg: 'Veg', 'non-veg': 'Non-Veg', egg: 'Egg', jain: 'Jain', vegan: 'Vegan' };
const DIET_COLOR = {
  veg: 'bg-success/10 text-success',
  'non-veg': 'bg-error/10 text-error',
  egg: 'bg-gold/20 text-espresso',
  jain: 'bg-success/10 text-success',
  vegan: 'bg-success/10 text-success',
};

export default function MenuItemCard({ item, selected = false, onToggleSelect }) {
  return (
    <div className="group bg-white border border-border-beige p-4 flex items-center justify-between gap-4 hover:border-gold transition-colors">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-display text-lg text-espresso truncate">{item.name}</h3>
          {item.dietaryTags?.map((tag) => (
            <span key={tag} className={`text-[11px] font-medium px-2 py-0.5 shrink-0 ${DIET_COLOR[tag] || ''}`}>
              {DIET_LABEL[tag] || tag}
            </span>
          ))}
        </div>
        {item.categoryId?.name && (
          <p className="text-xs text-gold mt-1 uppercase tracking-wide">{item.categoryId.name}</p>
        )}
        {item.description && <p className="text-sm text-brown-muted mt-1 line-clamp-2">{item.description}</p>}
      </div>

      <div className="flex flex-col items-end gap-2 shrink-0">
        {item.price ? (
          <span className="font-semibold text-espresso whitespace-nowrap">₹{item.price}</span>
        ) : (
          <span className="text-xs text-brown-muted whitespace-nowrap">On request</span>
        )}
        {onToggleSelect && (
          <button
            type="button"
            onClick={() => onToggleSelect(item)}
            className={`text-xs font-semibold px-3 py-1.5 border whitespace-nowrap transition-colors ${
              selected
                ? 'bg-maroon text-ivory border-maroon'
                : 'border-gold text-espresso hover:bg-gold hover:text-maroon-deep'
            }`}
          >
            {selected ? 'Added' : 'Add to Quote'}
          </button>
        )}
      </div>
    </div>
  );
}
