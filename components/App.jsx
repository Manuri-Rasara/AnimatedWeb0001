"use client";
import React, { useEffect, useState, useRef } from "react";

const lerp = (a, b, t) => a + (b - a) * t;
const smoothstep = (t) => t * t * (3 - 2 * t);

const frames = Array.from({ length: 11 }, (_, i) => `/frames/${i + 1}.png`);
const frameScales = [2.4, 2.4, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2, 2.2,2.2];


const sectionsData = [
  // { title: "Somewhere in the digital void...", subtitle: "01 / 13" },
  // { title: "Something is coming closer", subtitle: "02 / 13" },
  // { title: "Focused. Locked in.", subtitle: "03 / 13" },
  { title: "Adaptable to any workflow", subtitle: "01 / 13" },
  { title: "Caffeinated and ready", subtitle: "02 / 13" },
  { title: "Always online. Always creative.", subtitle: "03 / 13" },
  { title: "Deep in the details", subtitle: "04 / 13" },
  { title: "Hello! I've been waiting for you 👋",subtitle: "05 / 13" },
  { title: "Let's connect",  subtitle: "06 / 13" },
  { title: "Let's connect", subtitle: "07 / 13" },
  { title: "Watching. Learning. Adapting.", subtitle: "08 / 13" },
  { title: "The stage is yours →", subtitle: "09 / 13" },
  // { title: "The stage is yours →", subtitle: "10 / 13" }
];

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeFrame, setActiveFrame] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [cursorDotPos, setCursorDotPos] = useState({ x: -100, y: -100 });
  const [isLoaded, setIsLoaded] = useState(false);
  
  const containerRef = useRef(null);
  const requestRef = useRef();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    // Initial load animation
    const loadTimeout = setTimeout(() => setIsLoaded(true), 100);
    return () => {
      window.removeEventListener("resize", checkMobile);
      clearTimeout(loadTimeout);
    };
  }, []);

  // Custom Cursor Logic
  useEffect(() => {
    if (isMobile) return;
    
    let dotX = -100, dotY = -100;
    let ringX = -100, ringY = -100;
    let mouseX = -100, mouseY = -100;
    
    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);
    
    const renderCursor = () => {
      dotX = lerp(dotX, mouseX, 0.5);
      dotY = lerp(dotY, mouseY, 0.5);
      ringX = lerp(ringX, mouseX, 0.15);
      ringY = lerp(ringY, mouseY, 0.15);
      setCursorDotPos({ x: dotX, y: dotY });
      setCursorPos({ x: ringX, y: ringY });
      requestRef.current = requestAnimationFrame(renderCursor);
    };
    requestRef.current = requestAnimationFrame(renderCursor);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isMobile]);

  // Scroll Tracking Logic
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking && containerRef.current) {
        window.requestAnimationFrame(() => {
          const { top, height } = containerRef.current.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          const maxScroll = height - windowHeight;
          
          let progress = -top / maxScroll;
          progress = Math.max(0, Math.min(1, progress));
          setScrollProgress(progress);
          
          const frame = Math.floor(progress * 13);
          setActiveFrame(Math.min(12, Math.max(0, frame)));
          
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // init
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Compute Eased Progress
  const smoothP = smoothstep(scrollProgress);

  // Depth Lighting Effect (0% to 50% to 100%)
  let brightness = lerp(0.7, 1.0, smoothP * 2);
  if (smoothP > 0.5) brightness = lerp(1.0, 1.08, (smoothP - 0.5) * 2);

  let contrast = lerp(1.1, 1.0, smoothP * 2);
  if (smoothP > 0.5) contrast = lerp(1.0, 0.97, (smoothP - 0.5) * 2);

  const blurAmt = lerp(0.5, 0, smoothP);
  const shadowY = lerp(0, 30, smoothP);
  const shadowBlur = lerp(0, 60, smoothP);
  const shadowOpacity = lerp(0, 0.25, smoothP);

  // 3D Transforms Interpolation
  let rotateY = 0;
  if (smoothP <= 0.5) {
    rotateY = lerp(-25, 0, smoothP * 2);
  } else {
    rotateY = lerp(0, 15, (smoothP - 0.5) * 2);
  }

  const rotateX = lerp(8, 0, smoothP);

  let rotateZ = 0;
  if (smoothP <= 0.5) {
    rotateZ = lerp(-2, 0, smoothP * 2);
  } else {
    rotateZ = lerp(0, 1, (smoothP - 0.5) * 2);
  }

  let translateZ = 0;
  if (smoothP <= 0.5) {
    translateZ = lerp(-120, 0, smoothP * 2);
  } else {
    translateZ = lerp(0, 20, (smoothP - 0.5) * 2);
  }

  let translateX = 0;
  if (smoothP <= 0.5) {
    translateX = lerp(-60, 0, smoothP * 2);
  } else {
    translateX = lerp(0, 10, (smoothP - 0.5) * 2);
  }

  let scale = 1.0;
  if (smoothP <= 0.5) {
    scale = lerp(0.82, 1.0, smoothP * 2);
  } else {
    scale = lerp(1.0, 1.03, (smoothP - 0.5) * 2);
  }

  // Load animation override
  const loadTransform = `rotateY(-40deg) translateZ(-200px) scale(0.6)`;
  const activeTransform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) translateZ(${translateZ}px) translateX(${translateX}px) scale(${scale})`;
  
  const transformStyle = isMobile 
    ? `scale(${scale}) translateX(${translateX}px)` // simplified for mobile
    : isLoaded ? activeTransform : loadTransform;

  return (
    <div 
      ref={containerRef} 
      className="relative h-[700vh] flex flex-col md:flex-row bg-black text-white font-sans overflow-clip w-full"
    >
      <style>{`
        @keyframes float {
          0%   { transform: translateY(0px); }
          50%  { transform: translateY(-14px); }
          100% { transform: translateY(0px); }
        }
        @keyframes shadowPulse {
          0%   { transform: scaleX(1.0); opacity: 0.4; }
          50%  { transform: scaleX(0.6); opacity: 0.1; }
          100% { transform: scaleX(1.0); opacity: 0.4; }
        }
        .float-anim {
          animation: float 3.5s ease-in-out infinite;
        }
        .shadow-anim {
          animation: shadowPulse 3.5s ease-in-out infinite;
        }
        html, body {
          /* Only hide cursor if on desktop */
          @media (min-width: 768px) {
            cursor: none;
          }
        }
      `}</style>
      
      {/* Parallax Layers */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{ perspective: '1000px' }}>
        {/* Depth Grid Floor */}
        <div 
          className="absolute inset-x-0 bottom-[-50vh] h-[150vh] w-[200vw] left-[-50vw]"
          style={{
            transformOrigin: 'top',
            transform: 'rotateX(75deg)',
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 49px, #1a1a2e 50px), repeating-linear-gradient(90deg, transparent, transparent 49px, #1a1a2e 50px)`,
            backgroundSize: '50px 50px',
            backgroundPosition: `0px ${scrollProgress * 200}px`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-black/80 to-black pointer-events-none" />
      </div>

      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden">
        {/* Layer 1: Slow blurred purple orb */}
        <div 
          className="absolute w-[600px] h-[600px] rounded-full bg-purple-900/20 blur-[100px]"
          style={{ transform: `translateY(${scrollProgress * 100}px)` }}
        />
        {/* Layer 2: Medium indigo ring */}
        <div 
          className="absolute w-[400px] h-[400px] rounded-full border-[40px] border-indigo-900/10 blur-[20px]"
          style={{ transform: `translateY(${scrollProgress * -150}px) scale(${1 + scrollProgress * 0.5})` }}
        />
        {/* Layer 3: Fast subtle light flare */}
        <div 
          className="absolute bottom-1/4 w-[300px] h-[100px] rounded-full bg-indigo-500/10 blur-[50px]"
          style={{ transform: `translateY(${scrollProgress * -300}px)` }}
        />
      </div>

      {/* Split Screen Layout */}
      {/* Left 55%: Sticky 3D Character Scene */}
      <div className="w-full md:w-[55%] sticky top-0 h-screen overflow-hidden flex items-center justify-center z-10 pointer-events-none">
        <div 
          className="relative w-full max-w-[600px] aspect-square md:aspect-auto md:h-[800px] flex items-center justify-center"
          style={{ perspective: "0px" }}
        >
          {/* Anti-gravity floating wrapper */}
          <div className="relative w-full h-full flex flex-col items-center justify-center float-anim">
            {/* 3D Transform wrapper */}
            <div 
              className="relative w-full h-full flex items-center justify-center transition-transform duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                transformStyle: "preserve-3d",
                transform: transformStyle
              }}
            >
              {frames.map((src, idx) => (
                <img
                  key={src}
                  src={src}
                  alt={`Pose ${idx + 1}`}
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none transition-opacity duration-0"
                  style={{
                    opacity: activeFrame === idx ? 1 : 0,
                    mixBlendMode: "screen",
                    transform: `scale(${frameScales[idx]})`,
                   
                  }}
                />
              ))}
            </div>
            {/* Ground shadow ellipse */}
            <div className="absolute bottom-4 md:-bottom-10 w-48 md:w-64 h-6 md:h-8 bg-indigo-500/40 rounded-[100%] blur-xl shadow-anim" />
          </div>
        </div>
      </div>

      {/* Right 45%: Scrollable Content Sections */}
      <div className="w-full md:w-[45%] relative z-10 pointer-events-none pb-[50vh]">
        <div className="absolute top-0 w-full h-full">
          {sectionsData.map((section, idx) => {
            const isActive = activeFrame === idx;
            // Position exactly where it should center when active
            const scrollRange = 700 - 100; // 600vh scroll space
            const progressForMidpoint = (idx + 0.5) / 13;
            const topPosition = progressForMidpoint * scrollRange + 50; 

            return (
              <div 
                key={idx} 
                className="absolute w-full px-8 md:pl-0 md:pr-16 flex flex-col justify-center items-start"
                style={{
                  top: `calc(${topPosition}vh)`,
                  transform: 'translateY(-50%)'
                }}
              >
                <div 
                  className={`flex flex-col transition-all duration-[800ms] ease-out ${
                    isActive 
                      ? "opacity-100 translate-x-0" 
                      : "opacity-0 translate-x-[40px]"
                  }`}
                >
                  <p className="text-indigo-400 font-mono text-sm md:text-base tracking-widest mb-4">
                    {section.subtitle}
                  </p>
                  <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight text-white/90 drop-shadow-2xl">
                    {section.title}
                  </h2>
                  
                  {/* CTA on last frame */}
                  {idx === 12 && (
                    <button className="mt-12 pointer-events-auto bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-full font-semibold tracking-wide transition-all duration-300 shadow-[0_0_30px_rgba(99,102,241,0.5)] hover:shadow-[0_0_50px_rgba(99,102,241,0.8)] self-start flex items-center gap-3 group">
                      Let's Build Together
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vertical Scroll Progress Bar */}
      <div className="fixed right-0 top-0 bottom-0 w-1 bg-white/5 z-50">
        <div 
          className="w-full bg-indigo-500 origin-top shadow-[0_0_10px_rgba(99,102,241,0.8)]"
          style={{ height: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Custom Cursor Ring & Dot */}
      {!isMobile && (
        <>
          <div 
            className="fixed top-0 left-0 w-8 h-8 border border-indigo-500 rounded-full pointer-events-none z-[100] mix-blend-screen transition-transform duration-75"
            style={{ 
              transform: `translate(${cursorPos.x - 16}px, ${cursorPos.y - 16}px)` 
            }}
          />
          <div 
            className="fixed top-0 left-0 w-2 h-2 bg-indigo-400 rounded-full pointer-events-none z-[100]"
            style={{ 
              transform: `translate(${cursorDotPos.x - 4}px, ${cursorDotPos.y - 4}px)` 
            }}
          />
        </>
      )}
    </div>
  );
}
