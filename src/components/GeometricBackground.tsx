import React from 'react';

export function GeometricBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 opacity-30">
      {/* Simple grid pattern */}
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
      
      {/* Fewer geometric shapes */}
      <div className="absolute top-1/4 right-1/4 w-32 h-32 border border-white/10 rounded-full" />
      <div className="absolute bottom-1/3 left-1/4 w-24 h-24 border border-white/10 rotate-45" />
    </div>
  );
}