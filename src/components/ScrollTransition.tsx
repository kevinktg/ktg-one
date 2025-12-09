"use client";

import Image from "next/image";

// 14 Haki Images
const hakiImages = Array.from({ length: 14 }, (_, i) => ({
  src: `/assets/art/Colours-of-Haki-${i + 1}.webp`,
  title: `Synthesia_0${i + 1}`
}));

export function GalleryFormation() {
  return (
    <section className="relative py-8 bg-black text-white z-30">

      {/* Header */}
      <div className="w-full text-center mb-6">
        <h2 className="text-3xl md:text-4xl font-syne font-bold lowercase tracking-tighter">
          explorations
        </h2>
        <p className="font-mono text-[10px] opacity-50 mt-1 tracking-[0.5em] uppercase">
          Nothing left unseen
        </p>
      </div>

      <div className="relative w-full flex items-center justify-center">

        {/* THE GRID: 3 Columns (Portrait Mode) */}
        <div
            className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-6xl px-4 md:px-8"
        >
            {hakiImages.map((item, index) => (
                <div
                    key={index}
                    className="relative aspect-[3/4] w-full bg-[#111] overflow-hidden border border-white/10 group rounded-sm"
                >
                    <Image
                        src={item.src}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                        sizes="(max-width: 768px) 100vw, 33vw"
                    />

                    {/* Minimal Hover Label */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <span className="font-mono text-[10px] tracking-widest uppercase bg-black/80 text-white px-2 py-1">
                            {item.title}
                        </span>
                    </div>
                </div>
            ))}
        </div>

      </div>
    </section>
  );
}