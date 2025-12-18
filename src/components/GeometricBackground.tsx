import React from 'react';

export function GeometricBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Enhanced grid pattern overlay */}
      <div className="absolute inset-0 grid-pattern" />
      
      {/* Animated floating geometric shapes */}
      <div className="absolute top-20 right-20 w-64 h-64 border-2 border-white opacity-10 rotate-45 animate-move-diagonal-1" />
      <div className="absolute top-1/4 left-10 w-48 h-48 border-2 border-white opacity-8 animate-move-diagonal-2" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 border-2 border-white opacity-10 rounded-full animate-pulse-slow" />
      <div className="absolute bottom-20 left-20 w-56 h-56 border-2 border-white opacity-8 rotate-12 animate-move-diagonal-3" />
      
      {/* Additional animated circles */}
      <div className="absolute top-1/3 right-1/4 w-72 h-72 border border-white opacity-5 rounded-full animate-float-1" />
      <div className="absolute bottom-1/3 left-1/3 w-40 h-40 border-2 border-white opacity-6 rounded-full animate-float-2" />
      <div className="absolute top-2/3 right-1/2 w-32 h-32 border border-white opacity-5 rounded-full animate-float-3" />
      
      {/* Animated diagonal lines */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 diagonal-lines animate-slide-diagonal-1" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 diagonal-lines animate-slide-diagonal-2" />
      
      {/* Subtle particle effect */}
      <div className="absolute inset-0 particle-field" />
      
      {/* Glitch effect overlay */}
      <div className="absolute inset-0 glitch-overlay" />
    </div>
  );
}