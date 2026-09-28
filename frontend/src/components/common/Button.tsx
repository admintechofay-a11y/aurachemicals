import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

interface ButtonBaseProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'navy';
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
  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: 600,
    borderRadius: 'var(--radius-sm)',
    transition: 'all 0.2s ease',
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    opacity: disabled || isLoading ? 0.65 : 1,
    whiteSpace: 'nowrap',
    textDecoration: 'none',
    border: '1px solid transparent',
    minHeight: size === 'sm' ? '36px' : size === 'lg' ? '50px' : '44px',
    padding: size === 'sm' ? '6px 14px' : size === 'lg' ? '12px 28px' : '10px 20px',
    fontSize: size === 'sm' ? '0.875rem' : size === 'lg' ? '1.0625rem' : '0.9375rem',
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: 'var(--color-accent)',
      color: '#FFFFFF',
      borderColor: 'var(--color-accent)',
    },
    secondary: {
      backgroundColor: 'var(--color-secondary)',
      color: '#FFFFFF',
      borderColor: 'var(--color-secondary)',
    },
    navy: {
      backgroundColor: 'var(--color-primary)',
      color: '#FFFFFF',
      borderColor: 'var(--color-primary)',
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'var(--color-primary)',
      borderColor: 'var(--color-border)',
    },
    text: {
      backgroundColor: 'transparent',
      color: 'var(--color-secondary)',
      padding: '4px 8px',
      minHeight: 'auto',
    },
  };

  const style = {
    ...baseStyles,
    ...variantStyles[variant],
    ...(props as any).style,
  };

  const content = (
    <>
      {isLoading && (
        <span
          style={{
            width: '16px',
            height: '16px',
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite',
          }}
        />
      )}
      {!isLoading && icon && iconPosition === 'left' && icon}
      <span>{children}</span>
      {!isLoading && icon && iconPosition === 'right' && icon}
    </>
  );

  if ('to' in props && props.to) {
    return (
      <Link
        to={props.to}
        className={clsx('btn', `btn-${variant}`, className)}
        style={style}
        {...(props as any)}
      >
        {content}
      </Link>
    );
  }

  if ('href' in props && props.href) {
    return (
      <a
        href={props.href}
        className={clsx('btn', `btn-${variant}`, className)}
        style={style}
        {...(props as any)}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      className={clsx('btn', `btn-${variant}`, className)}
      style={style}
      disabled={disabled || isLoading}
      {...(props as any)}
    >
      {content}
    </button>
  );
};
