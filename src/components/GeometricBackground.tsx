import React from 'react';

export function GeometricBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 grid-pattern" />
      
      {/* Floating geometric shapes - more visible */}
      <div className="absolute top-20 right-20 w-64 h-64 border-2 border-white opacity-15 rotate-45" />
      <div className="absolute top-1/4 left-10 w-48 h-48 border-2 border-white opacity-12" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 border-2 border-white opacity-15 rounded-full" />
      <div className="absolute bottom-20 left-20 w-56 h-56 border-2 border-white opacity-12 rotate-12" />
      
      {/* Additional circles */}
      <div className="absolute top-1/3 right-1/4 w-72 h-72 border border-white opacity-8 rounded-full" />
      <div className="absolute bottom-1/3 left-1/3 w-40 h-40 border-2 border-white opacity-10 rounded-full" />
      <div className="absolute top-2/3 right-1/2 w-32 h-32 border border-white opacity-8 rounded-full" />
      
      {/* Diagonal lines */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 diagonal-lines" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 diagonal-lines" />
    </div>
  );
}