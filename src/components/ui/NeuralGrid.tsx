'use client';

import { useEffect, useRef } from 'react';

export default function NeuralGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationFrameId: number;
    
    // Grid configuration
    const gridSize = 40;
    const pointSize = 1.5;
    const connectionDistance = 100;
    const mouseInfluenceRadius = 200;
    
    let mouseX = -1000;
    let mouseY = -1000;

    // Resize handler
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    handleResize();

    // Grid points
    const points: { x: number; y: number; originX: number; originY: number }[] = [];

    const initPoints = () => {
      points.length = 0;
      for (let x = 0; x <= width; x += gridSize) {
        for (let y = 0; y <= height; y += gridSize) {
          points.push({
            x,
            y,
            originX: x,
            originY: y,
          });
        }
      }
    };

    initPoints();
    // Re-init points on resize to fill screen
    window.addEventListener('resize', initPoints);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Update points based on mouse
      points.forEach(point => {
        const dx = mouseX - point.originX;
        const dy = mouseY - point.originY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouseInfluenceRadius) {
          const angle = Math.atan2(dy, dx);
          const force = (mouseInfluenceRadius - distance) / mouseInfluenceRadius;
          const moveDistance = force * 20; // Max displacement
          
          point.x = point.originX - Math.cos(angle) * moveDistance;
          point.y = point.originY - Math.sin(angle) * moveDistance;
        } else {
          // Return to origin with easing
          point.x += (point.originX - point.x) * 0.1;
          point.y += (point.originY - point.y) * 0.1;
        }
      });

      // Draw grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      
      // Horizontal lines
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        // Connect to right neighbor
        if (i + 1 < points.length && points[i+1].originX > p.originX) {
             ctx.moveTo(p.x, p.y);
             ctx.lineTo(points[i+1].x, points[i+1].y);
        }
        // Connect to bottom neighbor
        // We need to find the point directly below. 
        // Since we iterate x then y loops in init, the structure is column-major or row-major?
        // Actually init loop was x then y. So points are vertical strips.
        // points[i+1] is the next point in the same column (y + gridSize).
        
        // Wait, let's check init loop:
        // for x... for y...
        // So consecutive points in array are varying Y (same X).
        // So points[i+1] is the point below (if not end of column).
        
        const numRows = Math.floor(height / gridSize) + 1;
        
        // Draw vertical line (to next point in array)
        if ((i + 1) % numRows !== 0 && i + 1 < points.length) {
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(points[i+1].x, points[i+1].y);
        }

        // Draw horizontal line (to point in next column)
        // The point in the next column is at index i + numRows
        if (i + numRows < points.length) {
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(points[i+numRows].x, points[i+numRows].y);
        }
      }
      ctx.stroke();

      // Draw active points near mouse
      points.forEach(point => {
        const dx = mouseX - point.x;
        const dy = mouseY - point.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
            const opacity = 1 - (distance / 150);
            ctx.fillStyle = `rgba(0, 255, 255, ${opacity * 0.5})`;
            ctx.beginPath();
            ctx.arc(point.x, point.y, pointSize, 0, Math.PI * 2);
            ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', initPoints);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
}
