"use client";
import { useEffect, useRef } from "react";

export default function ParticleNetwork() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    const container = canvas.parentElement;

    let width = canvas.width = container?.clientWidth || window.innerWidth;
    let height = canvas.height = container?.clientHeight || window.innerHeight;

    const PARTICLE_COUNT = 45;
    const CONNECT_DISTANCE = 140;

    // The radius where particles + lines become visible
    let RADIUS = width * 0.15; // 15% of page width

    // Animated focal point that moves slowly across the screen
    let time = 0;
    const SPEED = 0.0005; // How fast the point moves

    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
    }));

    function draw() {
      time += SPEED;
      
      // Move the focal point in a smooth pattern across the canvas
      const focalX = width * 0.5 + Math.cos(time) * width * 0.3;
      const focalY = height * 0.5 + Math.sin(time * 0.7) * height * 0.3;
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        const dx = p.x - focalX;
        const dy = p.y - focalY;
        const dToFocal = Math.sqrt(dx * dx + dy * dy);

        // Only render particles close to focal point
        if (dToFocal < RADIUS) {
          const opacity = 1 - dToFocal / RADIUS;

          // Draw the particle
          ctx.fillStyle = `rgba(80, 60, 40, ${0.4 * opacity})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
          ctx.fill();

          // Connect lines to nearby particles
          particles.forEach((other) => {
            const dx2 = p.x - other.x;
            const dy2 = p.y - other.y;
            const dist = Math.sqrt(dx2 * dx2 + dy2 * dy2);

            if (dist < CONNECT_DISTANCE && dToFocal < RADIUS) {
              ctx.strokeStyle = `rgba(80, 60, 40, ${
                (1 - dist / CONNECT_DISTANCE) * opacity * 0.3
              })`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(other.x, other.y);
              ctx.stroke();
            }
          });
        }

        // Move particle
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      });

      requestAnimationFrame(draw);
    }

    draw();

    const handleResize = () => {
      width = canvas.width = container.clientWidth;
      height = canvas.height = container.clientHeight;
      RADIUS = width * 0.15;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
      }}
    />
  );
}
