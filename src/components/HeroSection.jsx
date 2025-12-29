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

  // FLUID SPLASH CURSOR WITH PARTICLES
  useEffect(() => {
    const canvas = canvasRef.current;
    const mask = maskRef.current;
    if (!canvas || !mask) return;

    const ctx = canvas.getContext('2d');
    const particles = [];
    const revealedCircles = [];
    let mouse = { x: 0, y: 0, lastX: 0, lastY: 0 };

    // Setup canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Particle class for fluid effect
    class Particle {
      constructor(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.life = 1;
        this.size = Math.random() * 60 + 80; // Bigger particles
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.95; // Friction
        this.vy *= 0.95;
        this.life -= 0.015;
        this.size *= 0.98;
      }

      draw(ctx) {
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size
        );
        // Brighter, more visible purple particles
        gradient.addColorStop(0, `rgba(138, 43, 226, ${this.life})`);
        gradient.addColorStop(0.5, `rgba(138, 43, 226, ${this.life * 0.6})`);
        gradient.addColorStop(1, 'rgba(138, 43, 226, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Mouse tracking
    const handleMove = (e) => {
      mouse.lastX = mouse.x;
      mouse.lastY = mouse.y;
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      // Calculate mouse velocity
      const vx = (mouse.x - mouse.lastX) * 0.5;
      const vy = (mouse.y - mouse.lastY) * 0.5;

      // Spawn particles based on movement
      const speed = Math.sqrt(vx * vx + vy * vy);
      if (speed > 1) {
        const spawnCount = Math.min(3, Math.floor(speed / 2));
        for (let i = 0; i < spawnCount; i++) {
          const angle = Math.random() * Math.PI * 2;
          const velocity = Math.random() * 2;
          particles.push(new Particle(
            mouse.x,
            mouse.y,
            Math.cos(angle) * velocity + vx * 0.1,
            Math.sin(angle) * velocity + vy * 0.1
          ));
        }
      }

      // Add to revealed areas for masking
      revealedCircles.push({ x: mouse.x, y: mouse.y, r: 100 });
      if (revealedCircles.length > 100) {
        revealedCircles.shift();
      }
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw(ctx);

        if (particles[i].life <= 0) {
          particles.splice(i, 1);
        }
      }

      // Update mask
      if (revealedCircles.length > 0) {
        const circles = revealedCircles.map(c =>
          `circle(${c.r}px at ${c.x}px ${c.y}px)`
        ).join(', ');

        mask.style.webkitMaskImage = circles;
        mask.style.maskImage = circles;
        mask.style.webkitMaskComposite = 'xor';
        mask.style.maskComposite = 'exclude';
      }

      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMove);
    const raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      cancelAnimationFrame(raf);
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
          className="w-auto h-screen object-contain"
          priority
        />
      </div>

      {/* Layer 3.5: Blob Cursor Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 35 }}
      />

      {/* Layer 4: Text content (keep existing) */}
      <div className="relative z-40 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="hero__title-wrapper space-y-6">
          <h1 ref={titleRef} className="hero__title tracking-tight font-syne font-bold text-5xl md:text-7xl lg:text-8xl lowercase text-white">
            <span className="block">top 0.01%</span>
            <span className="block mt-2 text-white/80">prompt</span>
            <span className="block mt-2">engineer</span>
          </h1>
          <p ref={subtitleRef} className="monospace text-xl md:text-2xl text-white/70 tracking-wide font-light">
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
