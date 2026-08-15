import React from 'react';

type CardVariant = 'default' | 'elevated' | 'featured';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  children: React.ReactNode;
}

export function Card({ variant = 'default', className = '', children, ...props }: CardProps) {
  const isFeatured = variant === 'featured';

  const innerCard = (
    <div
      className={`ui-card ui-card-${variant} ${className}`}
      style={{
        backgroundColor: 'var(--card)',
        borderRadius: isFeatured ? 'calc(12px - 2px)' : '12px',
        padding: '1.5rem',
        border: isFeatured ? 'none' : '1px solid var(--border)',
        boxShadow: variant === 'elevated' ? 'var(--shadow-lg)' : 'var(--shadow-md)',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        height: '100%',
      }}
      {...props}
    >
      <div className="card-hover-overlay" style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to bottom right, rgba(16, 185, 129, 0.05), transparent)',
        opacity: 0,
        transition: 'opacity 0.3s ease',
        pointerEvents: 'none'
      }} />
      {children}
    </div>
  );

  if (isFeatured) {
    return (
      <div style={{
        borderRadius: '16px',
        background: 'var(--accent)',
        padding: '2px',
      }}>
        {innerCard}
      </div>
    );
  }

  return innerCard;
}
