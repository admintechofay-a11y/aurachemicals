import React from 'react';
import clsx from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
  padding?: 'normal' | 'dense' | 'none';
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverable = false,
  padding = 'normal',
  className,
  style,
  ...props
}) => {
  const paddingStyles: Record<string, string> = {
    normal: 'var(--space-6)',
    dense: 'var(--space-4)',
    none: '0',
  };

  return (
    <div
      className={clsx('card', hoverable && 'card-hoverable', className)}
      style={{
        backgroundColor: 'var(--color-bg)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: paddingStyles[padding],
        transition: hoverable ? 'all 0.2s ease' : undefined,
        boxShadow: hoverable ? 'var(--shadow-sm)' : undefined,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};
