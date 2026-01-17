import { useEffect, useRef } from 'react';

const BackgroundLayers = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Fog blobs
    const blobs = Array.from({ length: 5 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: 150 + Math.random() * 200,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
    }));

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      blobs.forEach((blob) => {
        blob.x += blob.vx;
        blob.y += blob.vy;

        if (blob.x < -blob.radius) blob.x = canvas.width + blob.radius;
        if (blob.x > canvas.width + blob.radius) blob.x = -blob.radius;
        if (blob.y < -blob.radius) blob.y = canvas.height + blob.radius;
        if (blob.y > canvas.height + blob.radius) blob.y = -blob.radius;

        const gradient = ctx.createRadialGradient(
          blob.x, blob.y, 0,
          blob.x, blob.y, blob.radius
        );
        gradient.addColorStop(0, 'rgba(60, 60, 60, 0.15)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="hidden dark:block">
      {/* Layer 1: Fog Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full z-0 opacity-60 pointer-events-none"
      />

      {/* Layer 2: Grid Pattern */}
      <div 
        className="fixed inset-0 z-[1] pointer-events-none"
        style={{
          backgroundSize: '40px 40px',
          backgroundImage: `
            linear-gradient(to right, rgba(128, 128, 128, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(128, 128, 128, 0.15) 1px, transparent 1px)
          `
        }}
      />

      {/* Layer 3: Ambient Spotlight */}
      <div 
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full z-[2] pointer-events-none animate-spotlight"
        style={{
          background: 'radial-gradient(circle, rgba(80, 80, 80, 0.08) 0%, rgba(0, 0, 0, 0) 70%)',
          filter: 'blur(100px)',
        }}
      />

      {/* Layer 4: Gradient Mesh */}
      <div 
        className="fixed inset-0 z-[3] pointer-events-none opacity-30"
        style={{
          background: `
            radial-gradient(at 20% 30%, rgba(30, 30, 30, 0.4) 0%, transparent 50%),
            radial-gradient(at 80% 70%, rgba(20, 20, 20, 0.4) 0%, transparent 50%),
            radial-gradient(at 50% 50%, rgba(40, 40, 40, 0.2) 0%, transparent 70%)
          `
        }}
      />

      {/* Layer 5: Texture Overlay */}
      <div 
        className="fixed inset-0 z-[50] pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter2)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Layer 6: Vignette */}
      <div 
        className="fixed inset-0 z-[100] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(0, 0, 0, 0.4) 100%)'
        }}
      />

      {/* Layer 7: Scanlines */}
      <div 
        className="fixed inset-0 z-[101] pointer-events-none opacity-[0.02]"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.15),
            rgba(0, 0, 0, 0.15) 1px,
            transparent 1px,
            transparent 2px
          )`
        }}
      />

      {/* Layer 8: Noise */}
      <div 
        className="fixed inset-0 z-[9999] pointer-events-none opacity-[0.08]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
    </div>
  );
};

export default BackgroundLayers;
