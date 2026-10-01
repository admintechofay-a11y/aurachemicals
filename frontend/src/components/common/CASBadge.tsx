import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CASBadgeProps {
  cas: string;
  showCopy?: boolean;
  className?: string;
}

export const CASBadge: React.FC<CASBadgeProps> = ({ cas, showCopy = true, className = '' }) => {
  const [copied, setCopied] = useState(false);

  if (!cas) return null;

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(cas).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <span className={`cas-badge ${className}`} title={`Chemical Abstracts Service Registry Number: ${cas}`}>
      <span>CAS {cas}</span>
      {showCopy && (
        <button
          type="button"
          onClick={handleCopy}
          className="cas-badge-copy-btn"
          aria-label={copied ? 'CAS Number Copied' : `Copy CAS Number ${cas}`}
        >
          {copied ? <Check size={12} color="var(--color-teal)" /> : <Copy size={12} />}
        </button>
      )}
    </span>
  );
};
