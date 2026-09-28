import React from 'react';
import clsx from 'clsx';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '20px',
  borderRadius = 'var(--radius-sm)',
  className,
  style,
}) => {
  return (
    <div
      className={clsx('skeleton-loader skeleton-pulse', className)}
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: 'var(--color-surface-hover)',
        border: '1px solid var(--color-border)',
        boxSizing: 'border-box',
        ...style,
      }}
    />
  );
};
