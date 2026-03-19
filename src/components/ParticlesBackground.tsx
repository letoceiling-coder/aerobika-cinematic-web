import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
}

const ParticlesBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const particles: Particle[] = [];

    // Purple/blue colors with transparency
    const colors = [
      'rgba(138, 43, 226, 0.15)', // BlueViolet
      'rgba(75, 0, 130, 0.2)',    // Indigo
      'rgba(72, 61, 139, 0.18)',  // DarkSlateBlue
      'rgba(123, 104, 238, 0.15)', // MediumSlateBlue
      'rgba(106, 90, 205, 0.17)',  // SlateBlue
    ];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const createParticle = () => {
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + Math.random() * 50, // Start from bottom
        vx: (Math.random() - 0.5) * 0.3, // Slow horizontal drift
        vy: -(Math.random() * 0.8 + 0.3), // Slow upward movement (different speeds)
        size: Math.random() * 22 + 8, // 8px to 30px
        opacity: Math.random() * 0.1 + 0.15, // 15-25% opacity
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    };

    // Create initial particles
    for (let i = 0; i < 15; i++) {
      createParticle();
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create new particles occasionally
      if (Math.random() < 0.2) {
        createParticle();
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Remove particles that are off screen
        if (p.y < -p.size || p.x < -p.size || p.x > canvas.width + p.size) {
          particles.splice(i, 1);
          continue;
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        // Extract RGB from color and apply particle opacity
        const rgbMatch = p.color.match(/rgba\((\d+),\s*(\d+),\s*(\d+)/);
        if (rgbMatch) {
          const [, r, g, b] = rgbMatch;
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.opacity})`;
        } else {
          ctx.fillStyle = p.color;
        }
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
};

export default ParticlesBackground;
