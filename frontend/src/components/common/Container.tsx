import React from 'react';
import clsx from 'clsx';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  size?: 'default' | 'narrow' | 'wide';
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className,
  size = 'default',
  style,
  ...props
}) => {
  const maxWidth = size === 'narrow' ? '960px' : size === 'wide' ? '1440px' : 'var(--container-max)';

  return (
    <div
      className={clsx('container', className)}
      style={{
        maxWidth,
        margin: '0 auto',
        paddingLeft: 'var(--container-pad)',
        paddingRight: 'var(--container-pad)',
        width: '100%',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};
