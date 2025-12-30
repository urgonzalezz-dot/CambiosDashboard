import { memo } from 'react';
import Styles from './Button.module.scss';

const ButtonComponent = ({
  children,
  startIcon,
  variant = 'primary',
  size = 'md',
  className = '',
  ...rest
}) => {
  const classes = [
    Styles.button,
    Styles[`button--${variant}`],
    Styles[`button--${size}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} {...rest}>
      {startIcon && <span className={Styles.icon}>{startIcon}</span>}
      {children}
    </button>
  );
};

const Button = memo(ButtonComponent);

Button.displayName = 'Button';
export { Button };
