import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  animate?: boolean;
}

export function Badge({ children, animate = true }: BadgeProps) {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.75rem',
      borderRadius: '9999px',
      border: '1px solid rgba(16, 185, 129, 0.3)',
      backgroundColor: 'rgba(16, 185, 129, 0.05)',
      padding: '0.5rem 1.25rem',
      marginBottom: '1rem',
    }}>
      <span 
        className={animate ? 'animate-pulse-dot' : ''}
        style={{
          height: '8px',
          width: '8px',
          borderRadius: '50%',
          backgroundColor: 'var(--accent)',
          display: 'inline-block'
        }} 
      />
      <span style={{
        fontFamily: 'var(--font-mono), monospace',
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: '0.15em',
        color: 'var(--accent)',
        fontWeight: 600,
      }}>
        {children}
      </span>
    </div>
  );
}
