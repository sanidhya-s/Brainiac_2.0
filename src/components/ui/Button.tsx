import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  className?: string;
  children: React.ReactNode;
}

export function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    borderRadius: '12px',
    fontSize: '0.95rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease-out',
    padding: '0.75rem 1.5rem',
    border: 'none',
    outline: 'none',
  };

  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'primary':
        return {
          background: 'var(--accent)',
          color: 'var(--accent-foreground)',
          boxShadow: 'var(--shadow-sm)',
        };
      case 'secondary':
        return {
          background: 'transparent',
          color: 'var(--foreground)',
          border: '1px solid var(--border)',
        };
      case 'ghost':
        return {
          background: 'transparent',
          color: 'var(--muted-foreground)',
        };
      default:
        return {};
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <button
      className={`ui-btn ui-btn-${variant} ${className}`}
      style={{ ...baseStyles, ...variantStyles }}
      {...props}
    >
      {children}
    </button>
  );
}
