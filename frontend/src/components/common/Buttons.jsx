import { Link } from 'react-router-dom';

export function PrimaryButton({ to, href, children, type = 'button', className = '', ...rest }) {
  const classes = `btn-primary ${className}`;
  if (to) return <Link to={to} className={classes} {...rest}>{children}</Link>;
  if (href) return <a href={href} className={classes} {...rest}>{children}</a>;
  return <button type={type} className={classes} {...rest}>{children}</button>;
}

export function SecondaryButton({ to, href, children, type = 'button', className = '', ...rest }) {
  const classes = `btn-secondary ${className}`;
  if (to) return <Link to={to} className={classes} {...rest}>{children}</Link>;
  if (href) return <a href={href} className={classes} {...rest}>{children}</a>;
  return <button type={type} className={classes} {...rest}>{children}</button>;
}
