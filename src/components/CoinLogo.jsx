import React from "react";

// Standalone coin logo component for KYNW
const CoinLogo = ({ size = 48, className = "", style = {} }) => (
  <div className={`flex-shrink-0 ${className}`} style={style}>
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Gold coin gradient */}
        <radialGradient id="coinGradient" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="40%" stopColor="#fbbf24" />
          <stop offset="80%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </radialGradient>
        
        {/* Inner surface gradient */}
        <radialGradient id="innerGradient" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#fffbeb" />
          <stop offset="70%" stopColor="#fef3c7" />
          <stop offset="100%" stopColor="#fde68a" />
        </radialGradient>
        
        {/* Text gradient */}
        <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#92400e" />
          <stop offset="100%" stopColor="#451a03" />
        </linearGradient>
        
        {/* Shadow gradient */}
        <radialGradient id="shadowGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(0,0,0,0.1)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.3)" />
        </radialGradient>
      </defs>
      
      {/* Drop shadow */}
      <circle cx="25" cy="25" r="22" fill="url(#shadowGradient)"/>
      
      {/* Outer coin edge with metallic look */}
      <circle cx="24" cy="24" r="22" fill="url(#coinGradient)" stroke="#b45309" strokeWidth="1.5"/>
      
      {/* Inner coin surface */}
      <circle cx="24" cy="24" r="18" fill="url(#innerGradient)" stroke="#f59e0b" strokeWidth="0.5"/>
      
      {/* Decorative rim pattern */}
      <circle cx="24" cy="24" r="16" fill="none" stroke="url(#textGradient)" strokeWidth="0.3" strokeDasharray="1,0.5"/>
      
      {/* KYNW text in center */}
      <text 
        x="24" 
        y="28" 
        fontFamily="'Segoe UI', Arial, sans-serif" 
        fontWeight="900" 
        fontSize="11" 
        fill="url(#textGradient)" 
        textAnchor="middle"
        letterSpacing="1.2"
      >
        KYNW
      </text>
      
      {/* Decorative corner elements */}
      <circle cx="24" cy="10" r="0.8" fill="url(#textGradient)"/>
      <circle cx="24" cy="38" r="0.8" fill="url(#textGradient)"/>
      <circle cx="10" cy="24" r="0.8" fill="url(#textGradient)"/>
      <circle cx="38" cy="24" r="0.8" fill="url(#textGradient)"/>
      
      {/* Additional decorative elements */}
      <circle cx="24" cy="6" r="0.5" fill="url(#textGradient)"/>
      <circle cx="24" cy="42" r="0.5" fill="url(#textGradient)"/>
      <circle cx="6" cy="24" r="0.5" fill="url(#textGradient)"/>
      <circle cx="42" cy="24" r="0.5" fill="url(#textGradient)"/>
    </svg>
  </div>
);

export default CoinLogo;

