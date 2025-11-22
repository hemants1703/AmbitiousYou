"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

interface BrandColors {
  cyan: string;
  blue: string;
  teal: string;
  yellow: string;
  orange: string;
  pink: string;
  purple: string;
  lime: string;
}

interface StarConfig {
  count: number;
  minSize: number;
  maxSize: number;
  minSpeed: number;
  maxSpeed: number;
  minOpacity: number;
  maxOpacity: number;
  glowThreshold: number;
}

interface NebulaConfig {
  count: number;
  minSize: number;
  maxSize: number;
  minSpeed: number;
  maxSpeed: number;
  opacity: number;
}

interface ShootingStarConfig {
  minLength: number;
  maxLength: number;
  minSpeed: number;
  maxSpeed: number;
  spawnInterval: number;
  spawnProbability: number;
  opacity: number;
}

const LIGHT_MODE_CONFIG = {
  star: {
    count: 200,
    minSize: 0.5,
    maxSize: 3.5,
    minSpeed: 0.02,
    maxSpeed: 0.1,
    minOpacity: 0.4,
    maxOpacity: 1.0,
    glowThreshold: 0.7,
  } satisfies StarConfig,
  nebula: {
    count: 5,
    minSize: 100,
    maxSize: 250,
    minSpeed: 0.01,
    maxSpeed: 0.03,
    opacity: 0.15,
  } satisfies NebulaConfig,
  shootingStar: {
    minLength: 40,
    maxLength: 120,
    minSpeed: 10,
    maxSpeed: 18,
    spawnInterval: 120,
    spawnProbability: 0.98,
    opacity: 0.9,
  } satisfies ShootingStarConfig,
  canvasOpacity: 0.85,
};

const DARK_MODE_CONFIG = {
  star: {
    count: 180,
    minSize: 0.5,
    maxSize: 3,
    minSpeed: 0.02,
    maxSpeed: 0.08,
    minOpacity: 0.3,
    maxOpacity: 0.8,
    glowThreshold: 0.7,
  } satisfies StarConfig,
  nebula: {
    count: 5,
    minSize: 100,
    maxSize: 250,
    minSpeed: 0.01,
    maxSpeed: 0.03,
    opacity: 0.08,
  } satisfies NebulaConfig,
  shootingStar: {
    minLength: 40,
    maxLength: 120,
    minSpeed: 10,
    maxSpeed: 18,
    spawnInterval: 150,
    spawnProbability: 0.98,
    opacity: 0.7,
  } satisfies ShootingStarConfig,
  canvasOpacity: 0.7,
};

const getBrandColors = (isLight: boolean): BrandColors => ({
  cyan: isLight ? "rgba(3, 255, 255, 0.8)" : "rgba(3, 255, 255, 0.6)",
  blue: isLight ? "rgba(0, 144, 255, 0.8)" : "rgba(0, 144, 255, 0.6)",
  teal: isLight ? "rgba(100, 204, 197, 0.8)" : "rgba(100, 204, 197, 0.6)",
  yellow: isLight ? "rgba(252, 218, 3, 0.7)" : "rgba(252, 218, 3, 0.5)",
  orange: isLight ? "rgba(255, 119, 51, 0.7)" : "rgba(255, 119, 51, 0.5)",
  pink: isLight ? "rgba(255, 105, 180, 0.7)" : "rgba(255, 105, 180, 0.5)",
  purple: isLight ? "rgba(153, 102, 204, 0.7)" : "rgba(153, 102, 204, 0.5)",
  lime: isLight ? "rgba(50, 205, 50, 0.7)" : "rgba(50, 205, 50, 0.5)",
});

const random = (min: number, max: number): number => Math.random() * (max - min) + min;

const extractColorBase = (color: string): string => color.replace(/[\d.]+\)$/, "");

class Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: string;
  hasGlow: boolean;

  constructor(
    width: number,
    height: number,
    config: StarConfig,
    colorArray: string[],
    isLight: boolean
  ) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.size = random(config.minSize, config.maxSize);
    this.speed = random(config.minSpeed, config.maxSpeed);
    this.opacity = random(config.minOpacity, config.maxOpacity);
    this.twinkleSpeed = random(0.01, 0.04);
    this.twinklePhase = Math.random() * Math.PI * 2;
    this.color =
      Math.random() > 0.5
        ? isLight
          ? "rgba(0, 144, 255, "
          : "rgba(255, 255, 255, "
        : extractColorBase(colorArray[Math.floor(Math.random() * colorArray.length)]);
    this.hasGlow = Math.random() > config.glowThreshold;
  }

  update(width: number, height: number): void {
    this.y += this.speed;
    this.twinklePhase += this.twinkleSpeed;

    if (this.y > height + 10) {
      this.y = -10;
      this.x = Math.random() * width;
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const twinkle = Math.sin(this.twinklePhase) * 0.4 + 0.6;
    const finalOpacity = this.opacity * twinkle;

    // Draw glow effect
    if (this.hasGlow && this.size > 1.5) {
      const glowSize = this.size * 4;
      const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, glowSize);
      gradient.addColorStop(0, `${this.color}${finalOpacity * 0.6})`);
      gradient.addColorStop(0.5, `${this.color}${finalOpacity * 0.3})`);
      gradient.addColorStop(1, `${this.color}0)`);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(this.x, this.y, glowSize, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw star core
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `${this.color}${finalOpacity})`;
    ctx.fill();
  }
}

class ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;

  constructor(width: number, height: number, config: ShootingStarConfig, colorArray: string[]) {
    this.x = Math.random() * width;
    this.y = Math.random() * height * 0.5;
    this.length = random(config.minLength, config.maxLength);
    this.speed = random(config.minSpeed, config.maxSpeed);
    this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.5;
    this.opacity = config.opacity;
    this.color = colorArray[Math.floor(Math.random() * colorArray.length)];
    this.life = 0;
    this.maxLife = random(40, 80);
  }

  update(): void {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
    this.life++;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const lifeFade = 1 - this.life / this.maxLife;
    ctx.save();
    ctx.globalAlpha = this.opacity * lifeFade;

    const gradient = ctx.createLinearGradient(
      this.x,
      this.y,
      this.x - Math.cos(this.angle) * this.length,
      this.y - Math.sin(this.angle) * this.length
    );
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(1, this.color.replace(/[\d.]+\)$/, "0)"));

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(
      this.x - Math.cos(this.angle) * this.length,
      this.y - Math.sin(this.angle) * this.length
    );
    ctx.stroke();
    ctx.restore();
  }

  isDead(): boolean {
    return this.life >= this.maxLife;
  }
}

class Nebula {
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  opacity: number;
  phase: number;

  constructor(width: number, height: number, config: NebulaConfig, colorArray: string[]) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.size = random(config.minSize, config.maxSize);
    this.color = colorArray[Math.floor(Math.random() * colorArray.length)];
    this.speed = random(config.minSpeed, config.maxSpeed);
    this.opacity = config.opacity;
    this.phase = Math.random() * Math.PI * 2;
  }

  update(): void {
    this.phase += this.speed;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const pulse = Math.sin(this.phase) * 0.3 + 0.7;
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * pulse);
    gradient.addColorStop(0, this.color.replace(/[\d.]+\)$/, `${this.opacity * pulse})`));
    gradient.addColorStop(0.5, this.color.replace(/[\d.]+\)$/, `${this.opacity * 0.5 * pulse})`));
    gradient.addColorStop(1, this.color.replace(/[\d.]+\)$/, "0)"));

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * pulse, 0, Math.PI * 2);
    ctx.fill();
  }
}

export default function StarfieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const animationFrameRef = useRef<number | undefined>(undefined);
  const isVisibleRef = useRef<boolean>(true);
  const prefersReducedMotionRef = useRef<boolean>(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", {
      alpha: true,
      desynchronized: true, // Performance optimization
    });
    if (!ctx) return;

    // Determine theme mode
    const isLight = theme === "light";
    const config = isLight ? LIGHT_MODE_CONFIG : DARK_MODE_CONFIG;
    const brandColors = getBrandColors(isLight);
    const colorArray = Object.values(brandColors);

    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReducedMotionRef.current = mediaQuery.matches;

    const handleMotionChange = (e: MediaQueryListEvent) => {
      prefersReducedMotionRef.current = e.matches;
    };
    mediaQuery.addEventListener("change", handleMotionChange);

    // Handle canvas resize
    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const context = canvas.getContext("2d");
      if (context) {
        context.scale(dpr, dpr);
      }
    };

    // Initialize canvas size
    handleResize();
    window.addEventListener("resize", handleResize);

    // Get canvas dimensions
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Initialize animation elements
    const stars: Star[] = [];
    for (let i = 0; i < config.star.count; i++) {
      stars.push(new Star(width, height, config.star, colorArray, isLight));
    }

    const nebulas: Nebula[] = [];
    for (let i = 0; i < config.nebula.count; i++) {
      nebulas.push(new Nebula(width, height, config.nebula, colorArray));
    }

    const shootingStars: ShootingStar[] = [];
    let shootingStarTimer = 0;

    // Handle page visibility
    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Draw background gradient
    const drawBackground = (context: CanvasRenderingContext2D, w: number, h: number) => {
      const time = Date.now() * 0.0001;
      const gradient = context.createLinearGradient(0, 0, w, h);

      if (isLight) {
        gradient.addColorStop(0, `rgba(3, 255, 255, ${0.15 + Math.sin(time) * 0.08})`);
        gradient.addColorStop(0.3, `rgba(0, 144, 255, ${0.12 + Math.cos(time * 1.3) * 0.06})`);
        gradient.addColorStop(0.6, `rgba(153, 102, 204, ${0.1 + Math.sin(time * 0.9) * 0.05})`);
        gradient.addColorStop(1, `rgba(100, 204, 197, ${0.15 + Math.sin(time * 0.7) * 0.08})`);
      } else {
        gradient.addColorStop(0, `rgba(23, 107, 135, ${0.08 + Math.sin(time) * 0.04})`);
        gradient.addColorStop(0.5, `rgba(100, 204, 197, ${0.05 + Math.cos(time * 1.3) * 0.03})`);
        gradient.addColorStop(1, `rgba(0, 144, 255, ${0.08 + Math.sin(time * 0.7) * 0.04})`);
      }

      context.fillStyle = gradient;
      context.fillRect(0, 0, w, h);
    };

    // Animation loop
    const animate = () => {
      // Pause animation when tab is hidden or user prefers reduced motion
      if (!isVisibleRef.current || prefersReducedMotionRef.current) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      try {
        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw background gradient
        drawBackground(ctx, width, height);

        // Draw nebulas
        for (let i = 0; i < nebulas.length; i++) {
          nebulas[i].update();
          nebulas[i].draw(ctx);
        }

        // Draw stars
        for (let i = 0; i < stars.length; i++) {
          stars[i].update(width, height);
          stars[i].draw(ctx);
        }

        // Shooting stars logic
        shootingStarTimer++;
        if (
          shootingStarTimer > config.shootingStar.spawnInterval &&
          Math.random() > config.shootingStar.spawnProbability
        ) {
          shootingStars.push(new ShootingStar(width, height, config.shootingStar, colorArray));
          shootingStarTimer = 0;
        }

        // Draw shooting stars
        for (let i = shootingStars.length - 1; i >= 0; i--) {
          shootingStars[i].update();
          shootingStars[i].draw(ctx);
          if (shootingStars[i].isDead()) {
            shootingStars.splice(i, 1);
          }
        }
      } catch (error) {
        console.error("StarfieldBackground: Animation error", error);
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      mediaQuery.removeEventListener("change", handleMotionChange);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.85] dark:opacity-70"
      aria-hidden="true"
      role="presentation"
    />
  );
}
