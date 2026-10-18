import { Link } from 'react-router-dom';

export default function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="container-page py-4 text-sm text-brown-muted">
      <ol className="flex items-center gap-2 flex-wrap">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true">/</span>}
            {item.to && i !== items.length - 1 ? (
              <Link to={item.to} className="hover:text-maroon">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-espresso">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
