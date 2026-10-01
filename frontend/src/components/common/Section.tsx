import React from 'react';
import clsx from 'clsx';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  variant?: 'default' | 'surface' | 'navy';
  background?: 'default' | 'surface' | 'navy' | 'paper' | 'white' | 'muted' | string;
  className?: string;
  padding?: 'normal' | 'dense' | 'hero' | 'none';
}

export const Section: React.FC<SectionProps> = ({
  children,
  variant = 'default',
  background,
  padding = 'normal',
  className,
  style,
  ...props
}) => {
  const bgStyles: Record<string, string> = {
    default: 'var(--color-bg)',
    surface: 'var(--color-surface)',
    muted: 'var(--color-surface)',
    white: 'var(--color-card)',
    paper: 'var(--color-paper)',
    navy: 'var(--color-primary)',
  };

  const resolvedBg = background
    ? bgStyles[background] || background
    : bgStyles[variant];

  const textStyles: Record<string, string> = {
    default: 'inherit',
    surface: 'inherit',
    navy: 'var(--color-text-inverse)',
  };

  const paddingStyles: Record<string, string> = {
    normal: 'clamp(64px, 8vw, 100px) 0',
    dense: 'clamp(40px, 5vw, 64px) 0',
    hero: 'clamp(80px, 10vw, 120px) 0',
    none: '0',
  };

  return (
    <section
      className={clsx('section', `section-${variant}`, className)}
      style={{
        backgroundColor: resolvedBg,
        color: textStyles[variant],
        padding: paddingStyles[padding],
        position: 'relative',
        ...style,
      }}
      {...props}
    >
      {children}
    </section>
  );
};
