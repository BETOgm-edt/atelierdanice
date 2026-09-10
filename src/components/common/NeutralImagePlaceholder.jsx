import React from 'react';
import { Sparkles } from 'lucide-react';

export const NeutralImagePlaceholder = ({
  title = 'Atelier Nice',
  subtitle = 'Alta Costura',
  height = '100%',
  aspectRatio = '3/4'
}) => {
  return (
    <div
      style={{
        width: '100%',
        height: height,
        aspectRatio: aspectRatio,
        background: 'linear-gradient(145deg, #F8E5DF 0%, #F3D8CF 50%, #E8C8BE 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        textAlign: 'center',
        color: '#B67068',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Subtle Luxury Pattern Watermark */}
      <svg
        width="120"
        height="120"
        viewBox="0 0 100 100"
        fill="none"
        style={{
          position: 'absolute',
          opacity: 0.12,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) scale(1.5)'
        }}
      >
        <circle cx="50" cy="50" r="45" stroke="#B67068" strokeWidth="1" strokeDasharray="4 4" />
        <path d="M50 15 C30 35 30 65 50 85 C70 65 70 35 50 15 Z" stroke="#B67068" strokeWidth="1" />
      </svg>

      {/* Center Monogram / Brand Icon */}
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: '50%',
          border: '1.5px solid #B67068',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '0.75rem',
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
          backdropFilter: 'blur(4px)',
          boxShadow: '0 4px 12px rgba(182, 112, 104, 0.15)'
        }}
      >
        <Sparkles size={22} color="#B67068" />
      </div>

      <span
        style={{
          fontFamily: 'var(--font-editorial, serif)',
          fontSize: '1rem',
          fontWeight: 600,
          letterSpacing: '0.04em',
          color: '#291613',
          lineHeight: 1.2,
          marginBottom: '0.25rem'
        }}
      >
        {title}
      </span>

      <span
        style={{
          fontSize: '0.72rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: '#B67068',
          fontWeight: 600
        }}
      >
        {subtitle}
      </span>
    </div>
  );
};
