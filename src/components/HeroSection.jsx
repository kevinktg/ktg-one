"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef, forwardRef, useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

export const HeroSection = forwardRef((props, ref) => {
  const heroRef = useRef(null);
  const internalRef = ref || heroRef;
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const imageRef = useRef(null);
  const maskRef = useRef(null);
  const canvasRef = useRef(null);
  const textWrapperRef = useRef(null);

  useGSAP(() => {
    // 1. INTERACTIVE FLOATING SHAPES - Follow mouse with parallax using quickSetter
    const shapes = [
      { el: '.hero-shape-1', speedX: 20, speedY: 20 },
      { el: '.hero-shape-2', speedX: -30, speedY: 15 },
      { el: '.hero-shape-3', speedX: 15, speedY: -25 },
      { el: '.hero-shape-4', speedX: -25, speedY: 20 },
    ];

    // Create quickSetters for performance
    const setters = shapes.map(({ el, speedX, speedY }) => {
      const element = document.querySelector(el);
      if (!element) return null;
      return {
        x: gsap.quickSetter(element, 'x', 'px'),
        y: gsap.quickSetter(element, 'y', 'px'),
        speedX,
        speedY
      };
    }).filter(Boolean);

    // Animate on mouse move (outside GSAP context)
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      setters.forEach(({ x: setX, y: setY, speedX, speedY }) => {
        setX(x * speedX);
        setY(y * speedY);
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };

    // 2. ENTRANCE ANIMATION
    const tl = gsap.timeline();

    if (titleRef.current) {
      tl.from(titleRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
      });
    }

    if (subtitleRef.current) {
      tl.from(subtitleRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
      }, "-=0.4");
    }

    if (imageRef.current) {
      tl.from(imageRef.current, {
        scale: 0.9,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
      }, "-=0.4");
    }

    // 3. SCROLL TRANSITION TO EXPERTISE SECTION
    // Fade out later to let expertise shutter animation play out fully
    const tl2 = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top 10%",
        end: "bottom 10%", // Fade out over last 90% of hero section
        scrub: true,
      }
    });

    tl2.to(heroRef.current, {
      opacity: 0,
      scale: 1.2,
      y: -60,
      ease: "power2.inOut"
    });

  }, { scope: heroRef });

  // BLOB CURSOR EFFECT
  useEffect(() => {
    const canvas = canvasRef.current;
    const mask = maskRef.current;
    const textWrapper = textWrapperRef.current;

    console.log('Blob cursor effect initializing...', { canvas, mask, textWrapper });

    if (!canvas || !mask || !textWrapper) {
      console.error('Missing refs:', { canvas: !!canvas, mask: !!mask, textWrapper: !!textWrapper });
      return;
    }

    console.log('Blob cursor effect starting!');

    const ctx = canvas.getContext('2d');
    let rafId;
    let lastMouseMove = Date.now();

    // Blob state
    const blob = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const trailBlobs = [];
    const revealedAreas = [];

    // Constants
    const BLOB_SIZE = 180;
    const TRAIL_SIZE = 100;
    const MAX_TRAILS = 8;
    const EASING = 0.15;
    const FADE_RADIUS = 200;

    // Setup canvas
    const setupCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setupCanvas();

    // Mouse tracking
    const handleMouseMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
      lastMouseMove = Date.now();

      // Spawn trail blob
      if (trailBlobs.length < MAX_TRAILS) {
        trailBlobs.push({
          x: blob.x,
          y: blob.y,
          size: TRAIL_SIZE,
          opacity: 0.6,
          age: 0
        });
      }
    };

    // Update text opacity based on blob proximity
    const updateTextFade = () => {
      if (!titleRef.current || !subtitleRef.current) return;

      const textBounds = textWrapper.getBoundingClientRect();
      const textCenterX = textBounds.left + textBounds.width / 2;
      const textCenterY = textBounds.top + textBounds.height / 2;

      const distance = Math.hypot(blob.x - textCenterX, blob.y - textCenterY);

      if (distance < FADE_RADIUS) {
        const opacity = 0.2 + (0.8 * (distance / FADE_RADIUS));
        titleRef.current.style.opacity = opacity;
        subtitleRef.current.style.opacity = opacity;
      } else {
        titleRef.current.style.opacity = 1;
        subtitleRef.current.style.opacity = 1;
      }
    };

    // Apply clip-path masking
    const updateMask = () => {
      // Simple approach: build path of circles to exclude
      if (revealedAreas.length === 0) return;

      // Create a path that excludes revealed circles
      const circles = revealedAreas.map(area =>
        `circle(${area.radius}px at ${area.x}px ${area.y}px)`
      ).join(', ');

      // Apply mask to hide logo where blob has been
      mask.style.webkitMaskImage = circles;
      mask.style.maskImage = circles;
      mask.style.webkitMaskComposite = 'xor';
      mask.style.maskComposite = 'exclude';
    };

    // Animation loop
    let frameCount = 0;
    const animate = () => {
      frameCount++;
      if (frameCount % 60 === 0) {
        console.log('Blob animating at 60fps, blob pos:', blob);
      }

      // Update blob position with easing
      blob.x += (target.x - blob.x) * EASING;
      blob.y += (target.y - blob.y) * EASING;

      // Add current blob position to revealed areas
      revealedAreas.push({
        x: blob.x,
        y: blob.y,
        radius: BLOB_SIZE / 2
      });

      // Limit revealed areas (keep last 100)
      if (revealedAreas.length > 100) {
        revealedAreas.shift();
      }

      // Update trail blobs
      trailBlobs.forEach((trail, index) => {
        trail.age += 1;
        trail.opacity -= 0.015;
        trail.size *= 0.98;

        if (trail.opacity <= 0) {
          trailBlobs.splice(index, 1);
        }
      });

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Set composite mode for metaball effect
      ctx.globalCompositeOperation = 'lighter';

      // Draw trail blobs
      trailBlobs.forEach(trail => {
        const gradient = ctx.createRadialGradient(
          trail.x, trail.y, 0,
          trail.x, trail.y, trail.size
        );
        gradient.addColorStop(0, `rgba(138, 43, 226, ${trail.opacity})`);
        gradient.addColorStop(0.5, `rgba(138, 43, 226, ${trail.opacity * 0.5})`);
        gradient.addColorStop(1, 'rgba(138, 43, 226, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(trail.x, trail.y, trail.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw main blob
      const mainGradient = ctx.createRadialGradient(
        blob.x, blob.y, 0,
        blob.x, blob.y, BLOB_SIZE
      );
      mainGradient.addColorStop(0, 'rgba(138, 43, 226, 0.8)');
      mainGradient.addColorStop(0.5, 'rgba(138, 43, 226, 0.4)');
      mainGradient.addColorStop(1, 'rgba(138, 43, 226, 0)');

      ctx.fillStyle = mainGradient;
      ctx.beginPath();
      ctx.arc(blob.x, blob.y, BLOB_SIZE, 0, Math.PI * 2);
      ctx.fill();

      // Update effects
      updateTextFade();
      updateMask();

      rafId = requestAnimationFrame(animate);
    };

    // Start animation
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', setupCanvas);
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', setupCanvas);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section ref={internalRef} className="hero relative min-h-screen flex items-center justify-center px-6 overflow-hidden z-20 bg-black">

      {/* Layer 1: Revealed Background (shown when logo is wiped away) */}
      <div className="absolute inset-0 z-10">
        <div className="cyberpunk-background" />
        <Image
          src="/assets/profile.svg"
          alt="cyberpunk avatar"
          width={400}
          height={400}
          className="avatar-revealed"
          priority
        />
      </div>

      {/* Layer 2: Geometric Shapes */}
      <div className="absolute inset-0 pointer-events-none" style={{ contain: "strict" }}>
        <div className="hero-shape-1 absolute top-20 right-20 w-64 h-64 border-2 border-white/20 rotate-45 will-change-transform" />
        <div className="hero-shape-2 absolute top-1/4 left-10 w-48 h-48 border-2 border-white/10 will-change-transform" />
        <div className="hero-shape-3 absolute bottom-1/4 right-1/3 w-96 h-96 border-2 border-white/20 rounded-full will-change-transform" />
        <div className="hero-shape-4 absolute bottom-20 left-20 w-56 h-56 border-2 border-white/10 rotate-12 will-change-transform" />
      </div>

      {/* Layer 3: Logo Mask (will be clipped by blob cursor) - Sibling to section */}
      <div ref={maskRef} className="absolute inset-0 z-30 flex items-center justify-center" style={{ willChange: 'clip-path' }}>
        <Image
          src="/assets/ktg.svg"
          alt="ktg logo"
          width={800}
          height={800}
          className="w-auto h-[80vh] object-contain"
          priority
        />
      </div>

      {/* Layer 3.5: Blob Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 35 }}
      />

      {/* Layer 4: Text content (keep existing) */}
      <div ref={textWrapperRef} className="relative z-40 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="hero__title-wrapper space-y-6">
          <h1 ref={titleRef} className="hero__title tracking-tight font-syne font-bold text-5xl md:text-7xl lg:text-8xl lowercase text-white" style={{ transition: 'opacity 300ms ease-out' }}>
            <span className="block">top 0.01%</span>
            <span className="block mt-2 text-white/80">prompt</span>
            <span className="block mt-2">engineer</span>
          </h1>
          <p ref={subtitleRef} className="monospace text-xl md:text-2xl text-white/70 tracking-wide font-light" style={{ transition: 'opacity 300ms ease-out' }}>
            context continuation solve.<br />
            frameworks. arxiv-ready papers.
          </p>
          <div className="pt-8 flex gap-4 opacity-50">
            <div className="w-20 h-1 bg-white" />
            <div className="w-12 h-1 bg-white/50" />
            <div className="w-8 h-1 bg-white/30" />
          </div>
        </div>
      </div>
    </section>
  );
});

HeroSection.displayName = "HeroSection";
