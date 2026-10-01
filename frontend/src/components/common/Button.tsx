import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

interface ButtonBaseProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'navy' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

type ButtonAsButton = ButtonBaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    to?: never;
    href?: never;
  };

type ButtonAsLink = ButtonBaseProps & {
  to: string;
  href?: never;
  disabled?: boolean;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>;

type ButtonAsExternal = ButtonBaseProps & {
  href: string;
  to?: never;
  disabled?: boolean;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;

export type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsExternal;

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className,
  icon,
  iconPosition = 'right',
  disabled,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: 500,
    borderRadius: 'var(--radius-sm)',
    transition: 'background-color var(--motion-duration-fast) var(--motion-ease), border-color var(--motion-duration-fast) var(--motion-ease), color var(--motion-duration-fast) var(--motion-ease), transform 100ms ease',
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    opacity: disabled || isLoading ? 0.65 : 1,
    whiteSpace: 'nowrap',
    textDecoration: 'none',
    border: '1px solid transparent',
    minHeight: size === 'sm' ? '36px' : size === 'lg' ? '50px' : '44px',
    padding: size === 'sm' ? '6px 14px' : size === 'lg' ? '12px 28px' : '10px 20px',
    fontSize: size === 'sm' ? '0.875rem' : size === 'lg' ? '1.0625rem' : '0.9375rem',
  };

  // Graphite & Mineral Button Rules:
  // Primary: ink background, paper text, hover ink-dark
  // Secondary: 1px ink outline, ink text, hover surface
  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: isHovered ? 'var(--color-ink-dark)' : 'var(--color-ink)',
      color: 'var(--color-paper)',
      borderColor: isHovered ? 'var(--color-ink-dark)' : 'var(--color-ink)',
    },
    secondary: {
      backgroundColor: isHovered ? 'var(--color-surface)' : 'transparent',
      color: 'var(--color-ink)',
      borderColor: 'var(--color-ink)',
    },
    navy: {
      backgroundColor: isHovered ? 'var(--color-ink-dark)' : 'var(--color-ink)',
      color: 'var(--color-paper)',
      borderColor: isHovered ? 'var(--color-ink-dark)' : 'var(--color-ink)',
    },
    outline: {
      backgroundColor: isHovered ? 'var(--color-surface)' : 'transparent',
      color: 'var(--color-ink)',
      borderColor: 'var(--color-rule)',
    },
    text: {
      backgroundColor: 'transparent',
      color: isHovered ? 'var(--color-ink)' : 'var(--color-brand)',
      padding: '4px 8px',
      minHeight: 'auto',
      textDecoration: isHovered ? 'underline' : 'none',
    },
    ghost: {
      backgroundColor: isHovered ? 'var(--color-surface)' : 'transparent',
      color: 'var(--color-ink)',
      borderColor: 'transparent',
    },
  };

  const style = {
    ...baseStyles,
    ...variantStyles[variant],
    ...(props as any).style,
  };

  const content = (
    <>
      {isLoading ? (
        <>
          <span
            aria-hidden="true"
            style={{
              display: 'inline-block',
              width: '16px',
              height: '16px',
              border: '2px solid currentColor',
              borderRightColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 0.75s linear infinite',
            }}
          />
          <span className="sr-only">Loading...</span>
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span style={{ display: 'inline-flex' }}>{icon}</span>}
          <span>{children}</span>
          {icon && iconPosition === 'right' && <span style={{ display: 'inline-flex' }}>{icon}</span>}
        </>
      )}
    </>
  );

  const hoverHandlers = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
  };

  if ('to' in props && props.to) {
    const { to, ...rest } = props as ButtonAsLink;
    return (
      <Link
        to={disabled || isLoading ? '#' : to}
        className={clsx('btn', `btn-${variant}`, className)}
        style={style}
        aria-disabled={disabled || isLoading}
        {...hoverHandlers}
        {...rest}
      >
        {content}
      </Link>
    );
  }

  if ('href' in props && props.href) {
    const { href, ...rest } = props as ButtonAsExternal;
    return (
      <a
        href={disabled || isLoading ? '#' : href}
        className={clsx('btn', `btn-${variant}`, className)}
        style={style}
        target="_blank"
        rel="noopener noreferrer"
        aria-disabled={disabled || isLoading}
        {...hoverHandlers}
        {...rest}
      >
        {content}
      </a>
    );
  }

  const { type = 'button', ...rest } = props as ButtonAsButton;
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={clsx('btn', `btn-${variant}`, className)}
      style={style}
      {...hoverHandlers}
      {...rest}
    >
      {content}
    </button>
  );
};
