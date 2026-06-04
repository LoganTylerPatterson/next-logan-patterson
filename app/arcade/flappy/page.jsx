'use client';
import { useState, useEffect, useRef } from "react";
import styles from "./flappy.module.css";

export default function Flappy() {
  const canvasRef = useRef(null);
  const scoreDisplayRef = useRef(null);
  const [gameState, setGameState] = useState('START'); // START, PLAYING, GAMEOVER
  const [title, setTitle] = useState('NEON FLAP');
  const [startBtnText, setStartBtnText] = useState('Init system [Tap]');

  const gameStateRef = useRef('START');
  const scoreRef = useRef(0);
  const framesRef = useRef(0);
  const animationIdRef = useRef(null);

  const lastTimeRef = useRef(0);

  const birdRef = useRef({
    x: 0,
    y: 0,
    width: 32,
    height: 32,
    velocity: 0,
    gravity: 0.4,
    jump: -6,
  });

  const pipesRef = useRef({
    items: [],
    width: 70,
    gap: 100,
    dx: 4,
    spawnTimer: 0,
  });

  // Sync state with refs safely
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const syncScoreDisplay = (value) => {
    scoreRef.current = value;
    if (scoreDisplayRef.current) {
      scoreDisplayRef.current.textContent = String(value);
    }
  };

  const handleResize = () => {
    if (canvasRef.current) {
      const container = canvasRef.current.parentElement;
      canvasRef.current.width = container.clientWidth;
      canvasRef.current.height = container.clientHeight;

      // Calibrate baseline positioning
      birdRef.current.x = canvasRef.current.width * 0.2;
      if (gameStateRef.current === 'START') {
        birdRef.current.y = canvasRef.current.height / 2;
      }
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);

    // Fire up game loop immediately just like the HTML script does
    animationIdRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationIdRef.current);
    };
  }, []);

  const startGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    gameStateRef.current = "PLAYING";
    setGameState("PLAYING");
    syncScoreDisplay(0);
    birdRef.current.y = canvas.height / 2;
    birdRef.current.velocity = 0;
    pipesRef.current.items = [];
    pipesRef.current.spawnTimer = 0; // Reset timer here
    framesRef.current = 0;
  };
  const gameOver = () => {
    if (gameStateRef.current !== "PLAYING") return;
    gameStateRef.current = "GAMEOVER";
    setGameState("GAMEOVER");
    setTitle("SYSTEM FAIL");
    setStartBtnText("GO AGAIN [Tap]");
  };

  const update = (dtScale) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const bird = birdRef.current;
    // Apply 60FPS-normalized delta time to baseline values
    bird.velocity += bird.gravity * dtScale;
    bird.y += bird.velocity * dtScale;

    // Bottom collision
    if (bird.y + bird.height >= canvas.height - 10) {
      bird.y = canvas.height - 10 - bird.height;
      gameOver();
    }
    // Ceiling collision
    if (bird.y <= 0) {
      bird.y = 0;
      bird.velocity = 0;
    }

    const pipes = pipesRef.current;

    // Track spawning using time scale instead of raw frames
    pipes.spawnTimer += dtScale;
    if (pipes.spawnTimer >= 90) {
      pipes.spawnTimer -= 90; // Reset timer while preserving overflow

      const minTop = 100;
      const maxTop = canvas.height - pipes.gap - 100;
      const topPosition = Math.max(minTop, Math.min(maxTop, Math.random() * (canvas.height - pipes.gap - 100)));

      pipes.items.push({
        x: canvas.width,
        top: topPosition,
        bottom: canvas.height - (topPosition + pipes.gap),
        passed: false,
      });
    }

    for (let i = 0; i < pipes.items.length; i++) {
      const p = pipes.items[i];
      // Scale pipe movement by delta time
      p.x -= pipes.dx * dtScale;

      // Tight alignment box matching the original vector hit borders
      const birdPadding = 4;
      if (
        bird.x + bird.width - birdPadding > p.x &&
        bird.x + birdPadding < p.x + pipes.width
      ) {
        if (
          bird.y + birdPadding < p.top ||
          bird.y + bird.height - birdPadding > canvas.height - p.bottom
        ) {
          gameOver();
        }
      }

      // Track scores
      if (p.x + pipes.width < bird.x && !p.passed) {
        syncScoreDisplay(scoreRef.current + 1);
        p.passed = true;
      }

      // Cleanup elements passing off-canvas boundary
      if (p.x + pipes.width < -20) {
        pipes.items.splice(i, 1);
        i--;
      }
    }
  };

  const loop = (timestamp) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      animationIdRef.current = requestAnimationFrame(loop);
      return;
    }

    // Fix the first-frame timestamp jump bug
    if (!lastTimeRef.current) {
      lastTimeRef.current = timestamp;
    }

    const dt = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;

    // Normalize delta time to a 60 FPS baseline (16.67ms per frame)
    const dtScale = dt / 16.67;

    const ctx = canvas.getContext('2d');

    if (gameStateRef.current === "PLAYING") {
      update(dtScale);
    }

    draw(ctx);

    // Keep frames incrementing purely for the visual background neon pulse animation
    framesRef.current += dtScale;
    animationIdRef.current = requestAnimationFrame(loop);
  };

  const draw = (ctx) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const frames = framesRef.current;

    // 1. Draw Neon Tech Grid Background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#0a001a");
    gradient.addColorStop(1, "#000000");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = `rgba(100, 0, 100, ${Math.sin(frames * 0.05) * 0.2 + 0.3})`;
    ctx.lineWidth = 1;
    const gridSpacing = 50;
    const speedOffset = (frames * pipesRef.current.dx) % gridSpacing;

    for (let x = gridSpacing - speedOffset; x < canvas.width; x += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = gridSpacing; y < canvas.height; y += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // 2. Ground Outer Glow Line
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#ff0055";
    ctx.strokeStyle = "#ff0055";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 5);
    ctx.lineTo(canvas.width, canvas.height - 5);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // 3. Draw Pipes Vector Glow Elements
    const pipes = pipesRef.current;
    pipes.items.forEach(p => {
      ctx.shadowBlur = 20;
      ctx.shadowColor = "#00f2ff";
      ctx.strokeStyle = "#00f2ff";
      ctx.lineWidth = 4;

      // Top components
      ctx.strokeRect(p.x, -10, pipes.width, p.top + 10);
      ctx.strokeRect(p.x - 5, p.top - 25, pipes.width + 10, 25);

      // Bottom components
      ctx.strokeRect(p.x, canvas.height - p.bottom, pipes.width, p.bottom + 10);
      ctx.strokeRect(p.x - 5, canvas.height - p.bottom, pipes.width + 10, 25);

      ctx.shadowBlur = 0;
    });

    // 4. Draw Vector Character
    const bird = birdRef.current;
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#ff00ff";
    ctx.fillStyle = "#fff";
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
    ctx.strokeStyle = "#ff00ff";
    ctx.lineWidth = 3;
    ctx.strokeRect(bird.x, bird.y, bird.width, bird.height);

    // Retro style eye & wing lines
    ctx.fillStyle = "#000";
    ctx.fillRect(bird.x + bird.width - 12, bird.y + 8, 6, 6);
    ctx.beginPath();
    ctx.moveTo(bird.x + 5, bird.y + bird.height / 2);
    ctx.lineTo(bird.x + 15, bird.y + bird.height / 2);
    ctx.stroke();
    ctx.shadowBlur = 0;
  };

  const handleInput = (e) => {
    // Intercept default screen responses
    if (e.type === "keydown" && e.code !== "Space") return;
    e.preventDefault();

    if (gameStateRef.current === "PLAYING") {
      birdRef.current.velocity = birdRef.current.jump;
    } else {
      startGame();
    }
  };

  useEffect(() => {
    window.addEventListener('pointerdown', handleInput, { passive: false });
    window.addEventListener('keydown', handleInput);
    return () => {
      window.removeEventListener('pointerdown', handleInput);
      window.removeEventListener('keydown', handleInput);
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.gameContainer}>
        <canvas ref={canvasRef} className={styles.canvas}></canvas>
        <div className={styles.ui}>
          <p ref={scoreDisplayRef} className={styles.scoreDisplay}>0</p>
          {(gameState === "START" || gameState === "GAMEOVER") && (
            <div className={styles.menu}>
              <h1 className={gameState === "GAMEOVER" ? styles.titleFail : styles.title}>
                {title}
              </h1>
              <div className={styles.blinkText} onClick={startGame}>
                {startBtnText}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
