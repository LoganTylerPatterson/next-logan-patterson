'use client'
import { useState, useEffect, useRef } from "react";
import styles from "./flappy.module.css";

export default function Flappy() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState('START'); // START, PLAYING, GAMEOVER
  const [title, setTitle] = useState('NEON FLAP');
  const [startBtnText, setStartBtnText] = useState('START');
  const [btnShouldBlink, setBtnShouldBlink] = useState(true);
  
  const framesRef = useRef(0);
  const animationIdRef = useRef(null);
  const birdRef = useRef({
    x: 50,
    y: 200,
    width: 32,
    height: 32,
    velocity: 0,
    gravity: 0.25,
    jump: -5,
  });
  
  const pipesRef = useRef({
    items: [],
    width: 70,
    gap: 160,
    dx: 2.5,
  });

  const handleResize = () => {
    if (canvasRef.current) {
      const container = canvasRef.current.parentElement;
      canvasRef.current.width = container.clientWidth;
      canvasRef.current.height = container.clientHeight;
      birdRef.current.x = canvasRef.current.width * 0.2;
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const startGame = () => {
    setGameState("PLAYING");
    setScore(0);
    setTitle("NEON FLAP");
    birdRef.current.y = canvasRef.current.height / 2;
    birdRef.current.velocity = 0;
    pipesRef.current.items = [];
    framesRef.current = 0;
  };

  const gameOver = () => {
    setGameState("GAMEOVER");
    setTitle("SYSTEM FAIL");
    setStartBtnText("REDO");
    setBtnShouldBlink(true);
  };

  const update = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Bird update
    const bird = birdRef.current;
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.height >= canvas.height - 10) {
      bird.y = canvas.height - 10 - bird.height;
      gameOver();
    }
    if (bird.y <= 0) {
      bird.y = 0;
      bird.velocity = 0;
    }

    // Pipes update
    const pipes = pipesRef.current;
    if (framesRef.current % 100 === 0) {
      let minTop = 50;
      let maxTop = canvas.height - pipes.gap - 50;
      let topPosition = Math.random() * (maxTop - minTop) + minTop;

      pipes.items.push({
        x: canvas.width,
        top: topPosition,
        passed: false,
      });
    }

    for (let i = 0; i < pipes.items.length; i++) {
      let p = pipes.items[i];
      p.x -= pipes.dx;

      // Collision Detection
      let birdPadding = 4;
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
        setScore(prev => prev + 1);
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

    // Background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#0a001a");
    gradient.addColorStop(1, "#000000");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines
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

    // Pipes
    const pipes = pipesRef.current;
    pipes.items.forEach(p => {
      ctx.shadowBlur = 20;
      ctx.shadowColor = "#00f2ff";
      ctx.strokeStyle = "#00f2ff";
      ctx.lineWidth = 4;

      // Top pipe
      ctx.strokeRect(p.x, -10, pipes.width, p.top + 10);
      ctx.strokeRect(p.x - 5, p.top - 25, pipes.width + 10, 25);

      // Bottom pipe
      const bottomY = p.top + pipes.gap;
      ctx.strokeRect(p.x, bottomY, pipes.width, canvas.height - bottomY + 10);
      ctx.strokeRect(p.x - 5, bottomY, pipes.width + 10, 25);
      
      ctx.shadowBlur = 0;
    });

    // Ground line
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#ff0055";
    ctx.strokeStyle = "#ff0055";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 5);
    ctx.lineTo(canvas.width, canvas.height - 5);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Bird
    const bird = birdRef.current;
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#ff00ff";
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

  const loop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    if (gameState === "PLAYING") {
      update();
    }
    draw(ctx);
    
    framesRef.current++;
    animationIdRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    animationIdRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationIdRef.current);
  }, [gameState]);

  const handleInput = (e) => {
    if (e.type === "keydown" && e.code !== "Space") return;
    
    if (gameState === "PLAYING") {
      birdRef.current.velocity = birdRef.current.jump;
    } else if (gameState === "START" || gameState === "GAMEOVER") {
      startGame();
    }
  };

  useEffect(() => {
    window.addEventListener('mousedown', handleInput);
    window.addEventListener('touchstart', handleInput);
    window.addEventListener('keydown', handleInput);
    return () => {
      window.removeEventListener('mousedown', handleInput);
      window.removeEventListener('touchstart', handleInput);
      window.removeEventListener('keydown', handleInput);
    };
  }, [gameState]);

  return (
    <div className={styles.container}>
      <div className={styles.gameContainer}>
        <canvas ref={canvasRef} className={styles.canvas}></canvas>
        <div className={styles.ui}>
          <p className={styles.scoreDisplay}>{score}</p>
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
