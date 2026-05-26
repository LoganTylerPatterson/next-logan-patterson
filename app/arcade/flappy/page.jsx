'use client'
import { useState, useEffect, useRef } from "react";
import styles from "./flappy.module.css";

const TARGET_FPS = 60;
const PIPE_SPAWN_FRAMES = 100;
const BASE_HEIGHT = 600;

export default function Flappy() {
  const canvasRef = useRef(null);
  const scoreDisplayRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState('START'); // START, PLAYING, GAMEOVER
  const [title, setTitle] = useState('NEON FLAP');
  const [startBtnText, setStartBtnText] = useState('START');
  const [btnShouldBlink, setBtnShouldBlink] = useState(true);

  const gameStateRef = useRef(gameState);
  const scoreRef = useRef(0);
  const framesRef = useRef(0);
  const animationIdRef = useRef(null);
  const lastFrameTimeRef = useRef(0);
  const pipeSpawnAccumulatorRef = useRef(0);
  const useGlowRef = useRef(true);
  const lastTouchTimeRef = useRef(0);

  const birdRef = useRef({
    x: 50,
    y: 200,
    width: 32,
    height: 32,
    velocity: 0,
    gravity: 0.2,
    jump: -5.5,
  });

  const pipesRef = useRef({
    items: [],
    width: 70,
    gap: 160,
    dx: 2.5,
  });

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const syncScoreDisplay = (value) => {
    scoreRef.current = value;
    if (scoreDisplayRef.current) {
      scoreDisplayRef.current.textContent = String(value);
    }
  };

  const scalePhysicsToCanvas = (height) => {
    const scale = height / BASE_HEIGHT;
    const bird = birdRef.current;
    const pipes = pipesRef.current;
    bird.gravity = 0.2 * scale;
    bird.jump = -5.5 * scale;
    pipes.dx = 2.5 * scale;
    pipes.gap = 160 * scale;
    pipes.width = 70 * scale;
    bird.width = 32 * scale;
    bird.height = 32 * scale;
  };

  const handleResize = () => {
    if (canvasRef.current) {
      const container = canvasRef.current.parentElement;
      const width = container.clientWidth;
      const height = container.clientHeight;
      canvasRef.current.width = width;
      canvasRef.current.height = height;
      birdRef.current.x = width * 0.2;
      scalePhysicsToCanvas(height);
    }
  };

  useEffect(() => {
    useGlowRef.current = !window.matchMedia("(pointer: coarse)").matches;
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const startGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    gameStateRef.current = "PLAYING";
    setGameState("PLAYING");
    syncScoreDisplay(0);
    setScore(0);
    setTitle("NEON FLAP");
    birdRef.current.y = canvas.height / 2;
    birdRef.current.velocity = 0;
    pipesRef.current.items = [];
    framesRef.current = 0;
    pipeSpawnAccumulatorRef.current = 0;
    lastFrameTimeRef.current = 0;
  };

  const gameOver = () => {
    if (gameStateRef.current !== "PLAYING") return;
    gameStateRef.current = "GAMEOVER";
    setGameState("GAMEOVER");
    setScore(scoreRef.current);
    setTitle("SYSTEM FAIL");
    setStartBtnText("REDO");
    setBtnShouldBlink(true);
  };

  const getFrameScale = (dt) => {
    const capped = Math.min(dt, 3 / TARGET_FPS);
    return capped * TARGET_FPS;
  };

  const update = (frameScale) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const bird = birdRef.current;
    bird.velocity += bird.gravity * frameScale;
    bird.y += bird.velocity * frameScale;

    if (bird.y + bird.height >= canvas.height - 10) {
      bird.y = canvas.height - 10 - bird.height;
      gameOver();
    }
    if (bird.y <= 0) {
      bird.y = 0;
      bird.velocity = 0;
    }

    const pipes = pipesRef.current;
    pipeSpawnAccumulatorRef.current += frameScale;
    const spawnInterval = PIPE_SPAWN_FRAMES;
    while (pipeSpawnAccumulatorRef.current >= spawnInterval) {
      pipeSpawnAccumulatorRef.current -= spawnInterval;
      const minTop = 50 * (canvas.height / BASE_HEIGHT);
      const maxTop = canvas.height - pipes.gap - minTop;
      const topPosition = Math.random() * (maxTop - minTop) + minTop;

      pipes.items.push({
        x: canvas.width,
        top: topPosition,
        passed: false,
      });
    }

    for (let i = 0; i < pipes.items.length; i++) {
      const p = pipes.items[i];
      p.x -= pipes.dx * frameScale;

      const birdPadding = 4 * (canvas.height / BASE_HEIGHT);
      if (
        bird.x + bird.width - birdPadding > p.x &&
        bird.x + birdPadding < p.x + pipes.width
      ) {
        if (
          bird.y + birdPadding < p.top ||
          bird.y + bird.height - birdPadding > p.top + pipes.gap
        ) {
          gameOver();
        }
      }

      if (p.x + pipes.width < bird.x && !p.passed) {
        syncScoreDisplay(scoreRef.current + 1);
        p.passed = true;
      }

      if (p.x + pipes.width < -20) {
        pipes.items.splice(i, 1);
        i--;
      }
    }
  };

  const draw = (ctx) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#0a001a");
    gradient.addColorStop(1, "#000000");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = `rgba(100, 0, 100, ${Math.sin(framesRef.current / 10) * 0.2 + 0.3})`;
    ctx.lineWidth = 1;
    const gridSpacing = 50;
    const speedOffset = (framesRef.current * pipesRef.current.dx) % gridSpacing;

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

    const pipes = pipesRef.current;
    const glow = useGlowRef.current;
    pipes.items.forEach(p => {
      if (glow) {
        ctx.shadowBlur = 20;
        ctx.shadowColor = "#00f2ff";
      }
      ctx.strokeStyle = "#00f2ff";
      ctx.lineWidth = 4;

      ctx.strokeRect(p.x, -10, pipes.width, p.top + 10);
      ctx.strokeRect(p.x - 5, p.top - 25, pipes.width + 10, 25);

      const bottomY = p.top + pipes.gap;
      ctx.strokeRect(p.x, bottomY, pipes.width, canvas.height - bottomY + 10);
      ctx.strokeRect(p.x - 5, bottomY, pipes.width + 10, 25);

      ctx.shadowBlur = 0;
    });

    if (glow) {
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#ff0055";
    }
    ctx.strokeStyle = "#ff0055";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 5);
    ctx.lineTo(canvas.width, canvas.height - 5);
    ctx.stroke();
    ctx.shadowBlur = 0;

    const bird = birdRef.current;
    if (glow) {
      ctx.shadowBlur = 15;
      ctx.shadowColor = "#ff00ff";
    }
    ctx.fillStyle = "#fff";
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
    ctx.strokeStyle = "#ff00ff";
    ctx.lineWidth = 3;
    ctx.strokeRect(bird.x, bird.y, bird.width, bird.height);
    ctx.fillStyle = "#000";
    ctx.fillRect(bird.x + bird.width - 12, bird.y + 8, 6, 6);
    ctx.beginPath();
    ctx.moveTo(bird.x + 5, bird.y + bird.height / 2);
    ctx.lineTo(bird.x + 15, bird.y + bird.height / 2);
    ctx.stroke();
    ctx.shadowBlur = 0;
  };

  const loop = (timestamp) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      animationIdRef.current = requestAnimationFrame(loop);
      return;
    }

    if (!lastFrameTimeRef.current) {
      lastFrameTimeRef.current = timestamp;
    }
    const dt = (timestamp - lastFrameTimeRef.current) / 1000;
    lastFrameTimeRef.current = timestamp;
    const frameScale = getFrameScale(dt);

    const ctx = canvas.getContext('2d');

    if (gameStateRef.current === "PLAYING") {
      update(frameScale);
    }
    draw(ctx);

    framesRef.current++;
    animationIdRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    animationIdRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationIdRef.current);
  }, []);

  const handleInput = (e) => {
    if (e.type === "keydown" && e.code !== "Space") return;
    if (e.type === "touchstart") {
      e.preventDefault();
      lastTouchTimeRef.current = performance.now();
    }
    if (e.type === "mousedown" && performance.now() - lastTouchTimeRef.current < 500) {
      return;
    }

    if (gameStateRef.current === "PLAYING") {
      birdRef.current.velocity = birdRef.current.jump;
    } else if (gameStateRef.current === "START" || gameStateRef.current === "GAMEOVER") {
      startGame();
    }
  };

  useEffect(() => {
    const touchOptions = { passive: false };
    window.addEventListener('mousedown', handleInput);
    window.addEventListener('touchstart', handleInput, touchOptions);
    window.addEventListener('keydown', handleInput);
    return () => {
      window.removeEventListener('mousedown', handleInput);
      window.removeEventListener('touchstart', handleInput);
      window.removeEventListener('keydown', handleInput);
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.gameContainer}>
        <canvas ref={canvasRef} className={styles.canvas}></canvas>
        <div className={styles.ui}>
          <p ref={scoreDisplayRef} className={styles.scoreDisplay}>{score}</p>
          {(gameState === "START" || gameState === "GAMEOVER") && (
            <div className={styles.menu}>
              <h1 className={styles.title}>{title}</h1>
              <div
                className={btnShouldBlink ? styles.blinkText : styles.startBtn}
                onClick={startGame}
                style={{ pointerEvents: 'auto', cursor: 'pointer' }}
              >
                {startBtnText}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
