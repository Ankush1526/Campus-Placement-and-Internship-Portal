import React, { useEffect, useRef, useState } from 'react';

const StickmanCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [prevScrollY, setPrevScrollY] = useState(0);
  const [walkAngle, setWalkAngle] = useState(0);
  const [walkSpeed, setWalkSpeed] = useState(0);
  const [stickmanX] = useState(40); // start further left
  const [stickmanOpacity, setStickmanOpacity] = useState(1);
  const [fadeOut, setFadeOut] = useState(false);
  const [isDoorClosing, setIsDoorClosing] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isScrolling, setIsScrolling] = useState(false);
  const [isSitting, setIsSitting] = useState(false);
  const scrollTimeoutRef = useRef<number | null>(null); // Changed to number for browser environment
  const animationRef = useRef<number>();

  const stickman = {
    y: 0, // Will be set based on canvas height
    size: 1,
    color: "#FBBF24" // yellow-400
  };

  const drawStickman = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    angle: number,
    isSittingPos = false,
    mouseAngle = 0
  ) => {
    if (stickmanOpacity <= 0) return;

    ctx.save();
    ctx.globalAlpha = stickmanOpacity;
    ctx.strokeStyle = stickman.color;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";

    // Head tracks mouse a bit to make the tracker obvious
    const headOffsetX = 8 * Math.cos(mouseAngle);
    const headOffsetY = 8 * Math.sin(mouseAngle);
    // Head
    ctx.beginPath();
    ctx.arc(x + headOffsetX, y - 60 + headOffsetY, 15, 0, Math.PI * 2);
    ctx.stroke();

    // Body
    ctx.beginPath();
    ctx.moveTo(x, y - 45);
    ctx.lineTo(x, y + (isSittingPos ? 0 : 10));
    ctx.stroke();

    if (isSittingPos) {
      // Sitting position
      ctx.beginPath();
      ctx.moveTo(x, y - 30);
      ctx.lineTo(x + 30 * Math.cos(mouseAngle), y - 30 + 30 * Math.sin(mouseAngle));
      ctx.moveTo(x, y - 30);
      ctx.lineTo(x - 20, y - 10);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - 15, y + 30);
      ctx.lineTo(x - 25, y + 30);
      ctx.moveTo(x, y);
      ctx.lineTo(x + 15, y + 30);
      ctx.lineTo(x + 25, y + 30);
      ctx.stroke();
    } else {
      // Walking position
      ctx.beginPath();
      ctx.moveTo(x, y - 30);
      ctx.lineTo(x - 20 * Math.cos(angle), y - 30 + 20 * Math.sin(angle));
      ctx.moveTo(x, y - 30);
      ctx.lineTo(x + 20 * Math.cos(angle), y - 30 - 20 * Math.sin(angle));
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x, y + 10);
      ctx.lineTo(x - 15 * Math.sin(angle), y + 60);
      ctx.moveTo(x, y + 10);
      ctx.lineTo(x + 15 * Math.sin(angle), y + 60);
      ctx.stroke();
    }

    ctx.restore();
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const newWalkAngle = walkAngle + walkSpeed;
    setWalkAngle(newWalkAngle);

    const doorX = window.innerWidth - 100;
    const startX = stickmanX;
    const targetX = doorX - 40; // stop a bit before the door edge
    const maxScrollable = Math.max(document.body.scrollHeight - window.innerHeight, 1);
    const progress = Math.min(Math.max(scrollY / maxScrollable, 0), 1);

    // Move proportionally with scroll so he reaches the door at page end
    const baseX = startX + (targetX - startX) * progress;
    const exitOffset = isDoorClosing ? Math.min(40, (1 - stickmanOpacity) * 80) : 0;
    const currentX = baseX + exitOffset;

    const reachedEnd = window.innerHeight + window.scrollY >= document.body.scrollHeight - 10;

    if (reachedEnd && !isDoorClosing) {
      setFadeOut(true);
      setIsDoorClosing(true);
      const door = document.getElementById("door");
      if (door) {
        door.classList.add("closed");
      }
    }

    if (fadeOut && stickmanOpacity > 0) {
      setStickmanOpacity(prev => prev - 0.02);
    }

    if (!fadeOut) setStickmanOpacity(1);

    const dx = mousePosition.x - (currentX + 20);
    const dy = mousePosition.y - (stickman.y - 60);
    const mouseAngle = Math.atan2(dy, dx);

    const shouldSit = !isScrolling && scrollY < document.body.scrollHeight - window.innerHeight;

    if (shouldSit) {
      setIsSitting(true);
      drawStickman(ctx, startX + 85, stickman.y, 0, true, mouseAngle);
    } else {
      setIsSitting(false);
      drawStickman(ctx, currentX, stickman.y, Math.sin(newWalkAngle), false, mouseAngle);
    }

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stickman.y = canvas.height - 120;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handleScroll = () => {
      setIsScrolling(true);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

      scrollTimeoutRef.current = window.setTimeout(() => {
        setIsScrolling(false);
      }, 500);

      const newScrollY = window.scrollY;
      setScrollY(newScrollY);
      const delta = newScrollY - prevScrollY;
      setWalkSpeed(Math.abs(delta) > 0 ? 0.15 : 0);
      setPrevScrollY(newScrollY);

      if (newScrollY < document.body.scrollHeight - window.innerHeight) {
        setFadeOut(false);
        setIsDoorClosing(false);
        const door = document.getElementById("door");
        if (door) {
          door.classList.remove("closed");
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    // Start animation
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [scrollY, prevScrollY, walkAngle, walkSpeed, stickmanOpacity, fadeOut, isDoorClosing, mousePosition, isScrolling, isSitting]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full z-[2] pointer-events-none"
      />
    </>
  );
};

export default StickmanCanvas;