import { memo } from 'react';

// Memoized to prevent unnecessary re-renders - this is a static decorative component
export const GeometricBackground = memo(function GeometricBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden contain-strict" aria-hidden="true">
      {/* NOTE: 'fixed' is used instead of 'absolute' to ensure this background
         covers the entire viewport as a global background
      */}

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Floating geometric shapes - GPU accelerated */}
      <div className="absolute top-20 right-20 w-64 h-64 border-2 border-white/10 rotate-45 gpu-accelerate" />
      <div className="absolute top-1/4 left-10 w-48 h-48 border-2 border-white/5 gpu-accelerate" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 border-2 border-white/10 rounded-full gpu-accelerate" />
      <div className="absolute bottom-20 left-20 w-56 h-56 border-2 border-white/5 rotate-12 gpu-accelerate" />

      {/* Additional circles */}
      <div className="absolute top-1/3 right-1/4 w-72 h-72 border border-white/5 rounded-full" />
      <div className="absolute bottom-1/3 left-1/3 w-40 h-40 border-2 border-white/5 rounded-full" />
      <div className="absolute top-2/3 right-1/2 w-32 h-32 border border-white/5 rounded-full" />

      {/* Diagonal lines (Implemented via CSS gradient to remove external CSS dependency) */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#fff_10px,#fff_11px)]" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 opacity-10 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#fff_10px,#fff_11px)]" />
    </div>
  );
});