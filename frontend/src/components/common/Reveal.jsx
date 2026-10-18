import { useInView } from '../../hooks/useInView';

/**
 * Fades/slides children in once they scroll into view. `delay` is in ms,
 * useful for staggering items in a grid (e.g. delay={index * 60}).
 */
export default function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const { ref, isVisible } = useInView();

  return (
    <Tag
      ref={ref}
      className={`reveal ${isVisible ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: isVisible ? `${delay}ms` : '0ms' }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
