import { useEffect, useRef } from 'react';

export default function Spotlight() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    let mouseX = w / 2;
    let mouseY = h / 2;
    let currentX = w / 2;
    let currentY = h / 2;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('mousemove', onMove);

    let raf: number;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      currentX += (mouseX - currentX) * 0.08;
      currentY += (mouseY - currentY) * 0.08;

      ctx.clearRect(0, 0, w, h);

      // Main soft glow
      const g1 = ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, 400);
      g1.addColorStop(0, 'rgba(198, 40, 40, 0.04)');
      g1.addColorStop(0.5, 'rgba(198, 40, 40, 0.01)');
      g1.addColorStop(1, 'transparent');
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, w, h);

      // Tighter white core
      const g2 = ctx.createRadialGradient(currentX, currentY, 0, currentX, currentY, 120);
      g2.addColorStop(0, 'rgba(255, 255, 255, 0.025)');
      g2.addColorStop(1, 'transparent');
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, w, h);
    };

    animate();

    const onResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="spotlight-container"
    />
  );
}
