import React from 'react';

/**
 * Standard legal/informational disclaimer component.
 * Reuse anywhere a non-legal-advice notice is required (UI footers, exports, etc.).
 */
export default function Disclaimer({ className = '', compact = false }) {
  return (
    <div
      className={`text-[10px] leading-snug text-gray-500 font-medium ${compact ? 'max-w-md mx-auto' : 'max-w-2xl mx-auto'} ${className}`}
      style={{ fontFamily: 'system-ui, sans-serif' }}
    >
      <p>
        Disclaimer: This application and the generated materials are provided for informational and organizational purposes only and do not constitute legal, financial, or tax advice. No attorney–client relationship is created by using this system. You should consult a qualified professional for advice regarding your specific situation. By continuing, you acknowledge full responsibility for how the information is used.
      </p>
    </div>
  );
}
